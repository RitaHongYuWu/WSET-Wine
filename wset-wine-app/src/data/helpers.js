// Maps text levels to numeric 0–3 scale for bars/charts
export function levelToNum(level) {
  if (!level) return null;
  const map = {
    // Generic
    Low: 1, 'Low–Medium': 1.5, Medium: 2, 'Medium–High': 2.5, High: 3,
    // Body
    Light: 1, 'Light-Medium': 1.5, 'Light-Full': [1, 3], 'Medium-Full': 2.5, Full: 3,
    // Climate
    Cool: 1, 'Cool–Moderate': [1, 2], Moderate: 2, 'Moderate–Warm': [2, 3],
    Warm: 3, 'Cool–Warm': [1, 3],
    // Shorthands sometimes in data
    H: 3, M: 2, L: 1,
  };
  return map[level] ?? null;
}

// Returns a single representative number (midpoint if range)
export function levelMid(level) {
  const v = levelToNum(level);
  if (Array.isArray(v)) return (v[0] + v[1]) / 2;
  return v;
}

// Returns [start, end] in 0–1 space for a 3-segment bar
// Segment 1 = Low (0–⅓), Segment 2 = Medium (⅓–⅔), Segment 3 = High (⅔–1)
export function levelFrac(level) {
  if (!level) return null;
  const map = {
    // Acidity / Tannin
    'Low':          [0,   1/3],
    'Low–Medium':   [0,   2/3],
    'Low-Medium':   [0,   2/3],
    'Medium':       [1/3, 2/3],
    'Medium–High':  [1/3, 1  ],
    'Medium-High':  [1/3, 1  ],
    'High':         [2/3, 1  ],
    // Body (Light = Low, Full = High)
    'Light':        [0,   1/3],
    'Light-Medium': [0,   2/3],
    'Light–Medium': [0,   2/3],
    'Light-Full':   [0,   1  ],
    'Light–Full':   [0,   1  ],
    'Medium-Full':  [1/3, 1  ],
    'Medium–Full':  [1/3, 1  ],
    'Full':         [2/3, 1  ],
    // Climate (Cool = Low, Moderate = Med, Warm = High)
    'Cool':           [0,   1/3],
    'Cool–Moderate':  [0,   2/3],
    'Cool-Moderate':  [0,   2/3],
    'Moderate':       [1/3, 2/3],
    'Moderate–Warm':  [1/3, 1  ],
    'Moderate-Warm':  [1/3, 1  ],
    'Warm':           [2/3, 1  ],
    'Cool–Warm':      [0,   1  ],
    'Cool-Warm':      [0,   1  ],
  };
  return map[level] ?? null;
}

export function climateLabel(grape) {
  return grape.climate?.label || '';
}

// Sort helpers
export const SORT_OPTIONS = [
  { value: 'name', label: 'Name A–Z' },
  { value: 'color', label: 'Color' },
  { value: 'climate', label: 'Climate (cool → warm)' },
  { value: 'acidity', label: 'Acidity' },
  { value: 'tannin', label: 'Tannin' },
  { value: 'body', label: 'Body' },
  { value: 'age', label: 'Age Potential' },
];

export function sortGrapes(grapes, sortBy) {
  return [...grapes].sort((a, b) => {
    switch (sortBy) {
      case 'name': return a.name.localeCompare(b.name);
      case 'color': return a.color.localeCompare(b.color);
      case 'climate': return (levelMid(a.climate?.label) || 0) - (levelMid(b.climate?.label) || 0);
      case 'acidity': return (levelMid(b.acidity) || 0) - (levelMid(a.acidity) || 0);
      case 'tannin': return (levelMid(b.tannin) || 0) - (levelMid(a.tannin) || 0);
      case 'body': return (levelMid(b.body) || 0) - (levelMid(a.body) || 0);
      case 'age': return (b.canAge ? 1 : 0) - (a.canAge ? 1 : 0);
      default: return 0;
    }
  });
}

export function filterGrapes(grapes, filters, search) {
  return grapes.filter((g) => {
    if (filters.color !== 'All' && !g.color.includes(filters.color)) return false;
    if (filters.oak !== 'All') {
      const oak = (g.oak || '').toLowerCase();
      if (filters.oak === 'Yes' && !oak.includes('yes') && !oak.includes('both')) return false;
      if (filters.oak === 'No' && (oak.includes('yes') || oak.includes('both'))) return false;
    }
    if (filters.age === 'Yes' && !g.canAge) return false;
    if (filters.botrytis === 'Yes' && !g.botrytis) return false;
    if (filters.sparkling === 'Yes' && !g.sparkling) return false;
    if (search) {
      const q = search.toLowerCase();
      if (
        !g.name.toLowerCase().includes(q) &&
        !(g.nameCN || '').includes(q) &&
        !g.locations.some((l) => l.country.toLowerCase().includes(q))
      )
        return false;
    }
    return true;
  });
}

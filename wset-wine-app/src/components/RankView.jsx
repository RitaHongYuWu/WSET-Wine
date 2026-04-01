import { levelMid, levelFrac } from '../data/helpers';

const RANK_ATTRS = [
  { key: 'acidity',       label: 'Acidity',  color: 'linear-gradient(90deg,#1d6fa4,#38bdf8)' },
  { key: 'tannin',        label: 'Tannin',   color: 'linear-gradient(90deg,#6b21a8,#a855f7)' },
  { key: 'climate.label', label: 'Climate',  color: 'linear-gradient(90deg,#166534,#16a34a,#ca8a04)' },
];

function getVal(grape, key) {
  if (key === 'climate.label') return grape.climate?.label;
  return grape[key];
}

export default function RankView({ grapes, rankBy, setRankBy, onSelectGrape }) {
  const attr = RANK_ATTRS.find((a) => a.key === rankBy) || RANK_ATTRS[0];

  const ranked = [...grapes]
    .map((g) => ({ grape: g, val: getVal(g, rankBy), mid: levelMid(getVal(g, rankBy)) || 0 }))
    .sort((a, b) => b.mid - a.mid);

  return (
    <div className="rank-view">
      <div className="rank-controls">
        <span className="rank-label">Rank by</span>
        {RANK_ATTRS.map((a) => (
          <button
            key={a.key}
            className={`rank-tab ${rankBy === a.key ? 'active' : ''}`}
            onClick={() => setRankBy(a.key)}
          >
            {a.label}
          </button>
        ))}
      </div>

      <table className="rank-table">
        <thead>
          <tr>
            <th className="col-rank">#</th>
            <th className="col-color"></th>
            <th className="col-name">Grape</th>
            <th className="col-bar">{attr.label}</th>
            <th className="col-level">Level</th>
          </tr>
        </thead>
        <tbody>
          {ranked.map(({ grape, val }, i) => {
            const colorClass = grape.color.includes('Red') ? 'red' : grape.color.includes('Rosé') ? 'rose' : 'white';
            const frac = levelFrac(val);
            const isRange = Array.isArray(frac);
            const left = isRange ? frac[0] * 100 : 0;
            const width = isRange ? (frac[1] - frac[0]) * 100 : (frac || 0) * 100;

            return (
              <tr key={grape.id} className="rank-tr" onClick={() => onSelectGrape(grape)}>
                <td className="col-rank">{i + 1}</td>
                <td className="col-color">
                  <span className={`rank-dot dot-${colorClass}`} />
                </td>
                <td className="col-name">
                  <span className="rank-grape-name">{grape.name}</span>
                  {grape.nameCN && <span className="rank-grape-cn">{grape.nameCN}</span>}
                </td>
                <td className="col-bar">
                  <div className="rank-bar-track">
                    <div
                      className="rank-bar-fill"
                      style={{ left: `${left}%`, width: `${width}%`, background: attr.color }}
                    />
                  </div>
                </td>
                <td className="col-level">{val || '–'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

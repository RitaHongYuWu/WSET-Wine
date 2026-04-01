import { useState, lazy, Suspense } from 'react';
import { levelFrac } from '../data/helpers';

const MiniMap = lazy(() => import('./MiniMap'));

const BAR_COLORS = {
  'bar-acidity': 'linear-gradient(90deg, #1d6fa4, #38bdf8)',
  'bar-tannin':  'linear-gradient(90deg, #6b21a8, #a855f7)',
  'bar-body':    'linear-gradient(90deg, #c2410c, #fb923c)',
  'bar-climate': 'linear-gradient(90deg, #166534, #16a34a, #ca8a04)',
};

// Strip data-entry artefacts like "A: Burgundy(AOC)" → "Burgundy"
function cleanLocName(s) {
  if (!s) return '';
  return s
    .replace(/^[A-Z]: /, '')           // remove "A: " / "B: " prefix
    .replace(/\s*\([^)]*\)\s*$/, '')   // remove trailing "(content)"
    .replace(/\s*\([^)]*$/, '')        // remove unclosed "("
    .replace(/\)$/, '')                // remove trailing lone ")"
    .trim();
}

function CharBar({ label, level, colorClass }) {
  const frac = levelFrac(level);
  if (frac === null) return null;

  const [start, end] = Array.isArray(frac) ? frac : [0, frac];
  const left  = start * 100;
  const width = (end - start) * 100;

  return (
    <div className="char-bar">
      <span className="char-label">{label}</span>
      <div className="char-track">
        <div
          className="char-fill"
          style={{ left: `${left}%`, width: `${width}%`, background: BAR_COLORS[colorClass] }}
        />
      </div>
      <span className="char-value">{level}</span>
    </div>
  );
}

function FlavorRow({ label, flavors, colorClass }) {
  if (!flavors || flavors.length === 0) return null;
  return (
    <div className="flavor-row">
      <span className={`flavor-stage ${colorClass}`}>{label}</span>
      <div className="flavor-tags">
        {flavors.map((f, i) => (
          <span key={i} className={`flavor-tag ${colorClass}`}>{f}</span>
        ))}
      </div>
    </div>
  );
}

// One location block: Country → Regions → Subregions
function LocationBlock({ loc }) {
  if (!loc.country) return null;

  const regions = (loc.regions || [])
    .map(cleanLocName)
    .filter((r) => r && r !== ')');

  const subs = (loc.subregions || [])
    .map(cleanLocName)
    .filter((s) => s && s !== ')' && s.length > 2);

  return (
    <div className="loc-block">
      <span className="loc-country">{loc.country}</span>

      {regions.length > 0 && (
        <div className="loc-regions">
          {regions.map((r, i) => (
            <span key={i} className="loc-region-tag">{r}</span>
          ))}
        </div>
      )}

      {subs.length > 0 && (
        <div className="loc-subs">
          <span className="loc-sub-arrow">└</span>
          {subs.map((s, i) => (
            <span key={i} className="loc-sub-tag">{s}</span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function GrapeCard({ grape, isComparing, onToggleCompare, defaultExpanded = false }) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const colorClass = grape.color.includes('Red') ? 'red' : grape.color.includes('Rosé') ? 'rose' : 'white';

  const allFlavors = [
    ...grape.flavors.unripe,
    ...grape.flavors.ripe,
    ...grape.flavors.extraRipe,
  ];

  return (
    <div className={`grape-card ${colorClass} ${isComparing ? 'comparing' : ''}`}>
      {/* Header */}
      <div className="card-header">
        <div className="grape-title">
          <h3 className="grape-name">{grape.name}</h3>
          {grape.nameCN && <span className="grape-cn">{grape.nameCN}</span>}
        </div>
        <div className="card-actions">
          <button
            className={`compare-btn ${isComparing ? 'active' : ''}`}
            onClick={() => onToggleCompare(grape)}
            title="Compare"
          >
            {isComparing ? '✓' : '+'}
          </button>
        </div>
      </div>

      {/* Badges */}
      <div className="badges">
        <span className={`badge badge-color ${colorClass}`}>{grape.color}</span>
        {grape.climate?.label && <span className="badge badge-climate">{grape.climate.label}</span>}
        {grape.canAge && <span className="badge badge-age">Ages Well</span>}
        {grape.oak && grape.oak !== 'No' && grape.oak !== 'no' && (
          <span className="badge badge-oak">Oak: {grape.oak}</span>
        )}
        {grape.botrytis && <span className="badge badge-special">Botrytis</span>}
        {grape.sparkling && <span className="badge badge-special">Sparkling</span>}
      </div>

      {/* Characteristic Bars */}
      <div className="char-bars">
        <div className="char-scale">
          <div className="char-scale-labels">
            <span>Low</span><span>Med</span><span>High</span>
          </div>
        </div>
        {grape.acidity && <CharBar label="Acidity" level={grape.acidity} colorClass="bar-acidity" />}
        {grape.tannin  && <CharBar label="Tannin"  level={grape.tannin}  colorClass="bar-tannin"  />}
        {grape.body    && <CharBar label="Body"     level={grape.body}    colorClass="bar-body"    />}
        {grape.climate?.label && (
          <CharBar label="Climate" level={grape.climate.label} colorClass="bar-climate" />
        )}
      </div>

      {/* Flavors */}
      <div className="flavors-section">
        {!expanded ? (
          <div className="flavor-preview">
            {allFlavors.slice(0, 5).map((f, i) => (
              <span key={i} className="flavor-dot">{f}</span>
            ))}
          </div>
        ) : (
          <div className="flavor-full">
            <FlavorRow label="Unripe"     flavors={grape.flavors.unripe}    colorClass="unripe"     />
            <FlavorRow label="Ripe"       flavors={grape.flavors.ripe}      colorClass="ripe"       />
            <FlavorRow label="Extra Ripe" flavors={grape.flavors.extraRipe} colorClass="extra-ripe" />
          </div>
        )}
      </div>

      {/* Collapsed location summary — country + first region chip */}
      {!expanded && grape.locations.length > 0 && (
        <div className="regions-mini">
          {grape.locations.slice(0, 3).map((loc, i) => {
            const firstRegion = loc.regions?.[0] ? cleanLocName(loc.regions[0]) : null;
            return (
              <span key={i} className="region-chip">
                {loc.country}{firstRegion && ` · ${firstRegion}`}
              </span>
            );
          })}
        </div>
      )}

      {/* Expanded details */}
      {expanded && (
        <div className="card-details">
          {grape.sweetness && (
            <div className="detail-row">
              <span className="detail-key">Sweetness</span>
              <span className="detail-val">{grape.sweetness}</span>
            </div>
          )}
          {grape.blendGrape && (
            <div className="detail-row">
              <span className="detail-key">Blended with</span>
              <span className="detail-val">{grape.blendGrape}</span>
            </div>
          )}
          {grape.ageNotes && (
            <div className="detail-row">
              <span className="detail-key">Aged Aromas</span>
              <span className="detail-val">{grape.ageNotes}</span>
            </div>
          )}
          {grape.notes && (
            <div className="grape-notes">{grape.notes}</div>
          )}

          {/* Key Regions — full hierarchy */}
          {grape.locations.length > 0 && (
            <>
              <div className="loc-section-label">Key Regions</div>
              <Suspense fallback={<div className="mini-map-loading">Loading map…</div>}>
                <MiniMap countries={grape.locations.map((l) => l.country)} />
              </Suspense>
              <div className="locations-full">
                {grape.locations.map((loc, i) => (
                  <LocationBlock key={i} loc={loc} />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <button className="expand-btn" onClick={() => setExpanded((e) => !e)}>
        {expanded ? 'Show less ▲' : 'Show more ▼'}
      </button>
    </div>
  );
}

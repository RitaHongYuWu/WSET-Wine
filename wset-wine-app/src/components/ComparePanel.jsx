import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Legend,
} from 'recharts';
import { levelMid } from '../data/helpers';

const COLORS = ['#c41e3a', '#3b82f6', '#f59e0b', '#22c55e'];

function toRadarVal(level) {
  return Math.round((levelMid(level) || 0) * 33.3);
}

export default function ComparePanel({ grapes, onRemove, onClose }) {
  if (grapes.length === 0) return null;

  const radarData = [
    { trait: 'Acidity', ...Object.fromEntries(grapes.map((g) => [g.name, toRadarVal(g.acidity)])) },
    { trait: 'Tannin',  ...Object.fromEntries(grapes.map((g) => [g.name, toRadarVal(g.tannin)])) },
    { trait: 'Body',    ...Object.fromEntries(grapes.map((g) => [g.name, toRadarVal(g.body)])) },
    { trait: 'Climate', ...Object.fromEntries(grapes.map((g) => [g.name, toRadarVal(g.climate?.label)])) },
    { trait: 'Age',     ...Object.fromEntries(grapes.map((g) => [g.name, g.canAge ? 100 : 20])) },
  ];

  return (
    <div className="compare-panel">
      <div className="compare-header">
        <h2>Compare</h2>
        <button className="close-btn" onClick={onClose}>✕ Close</button>
      </div>

      {/* Radar Chart */}
      <div className="radar-wrap">
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="rgba(0,0,0,0.08)" />
            <PolarAngleAxis dataKey="trait" tick={{ fill: '#7a1525', fontSize: 13 }} />
            {grapes.map((g, i) => (
              <Radar
                key={g.id}
                name={g.name}
                dataKey={g.name}
                stroke={COLORS[i % COLORS.length]}
                fill={COLORS[i % COLORS.length]}
                fillOpacity={0.15}
                strokeWidth={2}
              />
            ))}
            <Legend wrapperStyle={{ color: '#1a0a0e' }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Side-by-side table */}
      <div className="compare-table">
        <div className="compare-col compare-col-label">
          <div className="ct-head"> </div>
          {['Color', 'Climate', 'Acidity', 'Tannin', 'Body', 'Sweetness', 'Oak', 'Ages', 'Botrytis', 'Sparkling', 'Blend'].map((k) => (
            <div className="ct-row ct-label" key={k}>{k}</div>
          ))}
          <div className="ct-row ct-label flavors-label">Flavors</div>
          <div className="ct-row ct-label">Key Regions</div>
        </div>
        {grapes.map((g, i) => (
          <div key={g.id} className="compare-col" style={{ '--col-color': COLORS[i % COLORS.length] }}>
            <div className="ct-head">
              <strong>{g.name}</strong>
              {g.nameCN && <span className="grape-cn">{g.nameCN}</span>}
              <button className="remove-btn" onClick={() => onRemove(g.id)}>✕</button>
            </div>
            {[
              g.color,
              g.climate?.label || '–',
              g.acidity || '–',
              g.tannin || '–',
              g.body || '–',
              g.sweetness || '–',
              g.oak || '–',
              g.canAge ? 'Yes' : 'No',
              g.botrytis ? 'Yes' : '–',
              g.sparkling ? 'Yes' : '–',
              g.blend || '–',
            ].map((val, j) => (
              <div className="ct-row" key={j}>{val}</div>
            ))}
            <div className="ct-row flavors-cell">
              {[...g.flavors.unripe, ...g.flavors.ripe, ...g.flavors.extraRipe].slice(0, 6).map((f, k) => (
                <span key={k} className="flavor-dot">{f}</span>
              ))}
            </div>
            <div className="ct-row regions-cell">
              {g.locations.slice(0, 3).map((l, k) => (
                <span key={k} className="region-chip">{l.country}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

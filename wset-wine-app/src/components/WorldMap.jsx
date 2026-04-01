import { useState } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup, Marker } from 'react-simple-maps';
import { COUNTRY_GRAPES, WINE_COUNTRIES, geoToData } from '../data/countryMap';
import { COUNTRY_ZOOM, REGION_COORDS } from '../data/regionCoords';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

export default function WorldMap({ onCountryClick, selectedCountry, onRegionClick, selectedRegion }) {
  const [hovered, setHovered] = useState(null);
  const [tooltip, setTooltip] = useState(null);

  const zoomConfig = selectedCountry ? (COUNTRY_ZOOM[selectedCountry] || null) : null;
  const mapCenter = zoomConfig ? zoomConfig.center : [0, 20];
  const mapZoom   = zoomConfig ? zoomConfig.zoom   : 1;

  const regionCoords = selectedCountry ? (REGION_COORDS[selectedCountry] || {}) : {};
  const regionNames  = Object.keys(regionCoords);

  return (
    <div className="world-map-wrap">
      {/* Cursor tooltip — only shown on world view */}
      {tooltip && !selectedCountry && (
        <div
          className="map-tooltip"
          style={{ left: tooltip.x + 14, top: tooltip.y - 10 }}
        >
          <div className="tooltip-country">{tooltip.country}</div>
          <div className="tooltip-grapes">
            {(COUNTRY_GRAPES[tooltip.country] || []).map((g) => (
              <span
                key={g.id}
                className={`tooltip-grape ${g.color.includes('Red') ? 'tip-red' : 'tip-white'}`}
              >
                {g.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Back button shown when zoomed into a country */}
      {selectedCountry && (
        <button className="map-zoom-back" onClick={() => onCountryClick(null)}>
          ← World View
        </button>
      )}

      <ComposableMap projection="geoNaturalEarth1" style={{ width: '100%', height: 'auto' }}>
        {/* key forces remount on country change so zoom/center reset cleanly */}
        <ZoomableGroup
          key={selectedCountry || 'world'}
          center={mapCenter}
          zoom={mapZoom}
          minZoom={1}
          maxZoom={12}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const dataName  = geoToData(geo.properties.name);
                const isWine    = WINE_COUNTRIES.has(dataName);
                const isHovered = hovered === dataName;
                const isSelected = selectedCountry === dataName;

                let fill = '#e8e1d9';
                if (isSelected)                      fill = '#7a1525';
                else if (isHovered && !selectedCountry) fill = '#c41e3a';
                else if (isWine)                     fill = '#c8909a';

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={fill}
                    stroke="#ffffff"
                    strokeWidth={0.5}
                    style={{
                      outline: 'none',
                      cursor: isWine && !selectedCountry ? 'pointer' : 'default',
                      transition: 'fill 0.15s',
                    }}
                    onMouseMove={(e) => {
                      if (isWine && !selectedCountry) {
                        setHovered(dataName);
                        setTooltip({ x: e.clientX, y: e.clientY, country: dataName });
                      }
                    }}
                    onMouseLeave={() => {
                      setHovered(null);
                      setTooltip(null);
                    }}
                    onClick={() => {
                      if (isWine && !selectedCountry) onCountryClick(dataName);
                      else if (isSelected) onCountryClick(null);
                    }}
                  />
                );
              })
            }
          </Geographies>

          {/* Region markers — visible when a country is zoomed in */}
          {regionNames.map((regionName) => {
            const coords   = regionCoords[regionName];
            const isActive = selectedRegion === regionName;

            // Scale inversely to mapZoom so markers stay a consistent pixel size
            const r            = 5  / mapZoom;
            const fs           = 11 / mapZoom;
            const labelOffset  = -(9 / mapZoom);
            const sw           = 1.5 / mapZoom;
            const strokeText   = `${3 / mapZoom}px`;

            return (
              <Marker
                key={regionName}
                coordinates={coords}
                onClick={() => onRegionClick && onRegionClick(isActive ? null : regionName)}
              >
                {/* Outer ring for active state */}
                {isActive && (
                  <circle
                    r={r * 2}
                    fill="rgba(122,21,37,0.15)"
                    stroke="rgba(122,21,37,0.4)"
                    strokeWidth={sw}
                  />
                )}
                <circle
                  r={r}
                  fill={isActive ? '#7a1525' : 'rgba(200,144,154,0.9)'}
                  stroke={isActive ? '#fff' : '#7a1525'}
                  strokeWidth={sw}
                  style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                />
                <text
                  textAnchor="middle"
                  y={labelOffset}
                  style={{
                    fontSize: `${fs}px`,
                    fill: isActive ? '#7a1525' : '#4a1020',
                    fontWeight: isActive ? '700' : '500',
                    pointerEvents: 'none',
                    paintOrder: 'stroke',
                    stroke: 'rgba(255,255,255,0.9)',
                    strokeWidth: strokeText,
                    strokeLinejoin: 'round',
                  }}
                >
                  {regionName}
                </text>
              </Marker>
            );
          })}
        </ZoomableGroup>
      </ComposableMap>

      <div className="map-legend">
        <span className="legend-item"><span className="legend-dot" style={{ background: '#c8909a' }} />Wine region</span>
        <span className="legend-item"><span className="legend-dot" style={{ background: '#7a1525' }} />Selected</span>
        <span className="legend-item"><span className="legend-dot" style={{ background: '#e8e1d9' }} />No data</span>
        {selectedCountry && regionNames.length > 0 && (
          <span className="legend-item">
            <span className="legend-dot" style={{ background: '#c8909a', border: '1.5px solid #7a1525' }} />
            Click region marker
          </span>
        )}
      </div>
    </div>
  );
}

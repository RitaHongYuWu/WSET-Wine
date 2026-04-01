import { memo } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { geoToData } from '../data/countryMap';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

const MiniMap = memo(function MiniMap({ countries }) {
  const countrySet = new Set(countries);

  return (
    <div className="mini-map-wrap">
      <ComposableMap
        projection="geoNaturalEarth1"
        width={400}
        height={220}
        style={{ width: '100%', height: 'auto' }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const name = geoToData(geo.properties.name);
              const isActive = countrySet.has(name);
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={isActive ? '#c41e3a' : '#ece6e0'}
                  stroke="#ffffff"
                  strokeWidth={0.4}
                  style={{ outline: 'none' }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
      <div className="mini-map-countries">
        {countries.map((c, i) => (
          <span key={i} className="mini-country-chip">{c}</span>
        ))}
      </div>
    </div>
  );
});

export default MiniMap;

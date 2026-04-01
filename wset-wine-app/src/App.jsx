import { useState, useEffect } from 'react';
import grapeData from './data/grapes.json';
import { COUNTRY_GRAPES } from './data/countryMap';
import { sortGrapes, filterGrapes } from './data/helpers';
import FilterBar from './components/FilterBar';
import GrapeCard from './components/GrapeCard';
import RankView from './components/RankView';
import WorldMap from './components/WorldMap';
import ComparePanel from './components/ComparePanel';
import StudyNotes from './components/StudyNotes';
import './App.css';

const DEFAULT_FILTERS = { color: 'All', oak: 'All', age: 'All', botrytis: 'All', sparkling: 'All' };

// Clean a raw region/subregion string from the data
function cleanName(s) {
  return s
    .replace(/^[A-Z]: /, '')            // remove "A: " / "B: " prefix
    .replace(/\s*\([^)]*\)\s*$/, '')    // remove trailing "(content)"
    .replace(/\s*\([^)]*$/, '')         // remove unclosed "(...
    .replace(/\)$/, '')                 // remove trailing lone ")"
    .trim();
}

// Build { regionName: { grapes: [], subregions: [] } } for a given country
function buildRegionData(country) {
  if (!country) return {};
  const result = {};

  grapeData.forEach((grape) => {
    const loc = grape.locations.find((l) => l.country === country);
    if (!loc || !loc.regions) return;

    const regions    = loc.regions.map(cleanName).filter((r) => r && r !== ')');
    const subregions = (loc.subregions || []).map(cleanName).filter((s) => s && s !== ')' && s.length > 2);

    regions.forEach((region) => {
      if (!result[region]) result[region] = { grapes: [], subregions: [] };
      if (!result[region].grapes.find((g) => g.id === grape.id))
        result[region].grapes.push(grape);
      subregions.forEach((sub) => {
        if (!result[region].subregions.includes(sub))
          result[region].subregions.push(sub);
      });
    });
  });

  return result;
}

export default function App() {
  const [filters, setFilters]         = useState(DEFAULT_FILTERS);
  const [sort, setSort]               = useState('color');
  const [search, setSearch]           = useState('');
  const [compareList, setCompareList] = useState([]);
  const [showCompare, setShowCompare] = useState(false);
  const [showNotes, setShowNotes]     = useState(false);
  const [viewMode, setViewMode]       = useState('cards');
  const [rankBy, setRankBy]           = useState('acidity');
  const [modalGrape, setModalGrape]   = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedRegion, setSelectedRegion]   = useState(null);

  // Reset region selection whenever the country changes
  useEffect(() => {
    setSelectedRegion(null);
  }, [selectedCountry]);

  const filtered = filterGrapes(grapeData, filters, search);
  const sorted   = sortGrapes(filtered, sort);

  function toggleCompare(grape) {
    setCompareList((list) => {
      if (list.find((g) => g.id === grape.id)) return list.filter((g) => g.id !== grape.id);
      if (list.length >= 4) return list;
      return [...list, grape];
    });
  }

  function removeFromCompare(id) {
    setCompareList((list) => list.filter((g) => g.id !== id));
  }

  const countryGrapes = selectedCountry ? (COUNTRY_GRAPES[selectedCountry] || []) : [];
  const regionData    = buildRegionData(selectedCountry);
  const regionKeys    = Object.keys(regionData);

  return (
    <div className="app">
      {/* Grape detail modal */}
      {modalGrape && (
        <div className="modal-overlay" onClick={() => setModalGrape(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setModalGrape(null)}>✕ Close</button>
            <GrapeCard
              grape={modalGrape}
              isComparing={!!compareList.find((g) => g.id === modalGrape.id)}
              onToggleCompare={toggleCompare}
              defaultExpanded
            />
          </div>
        </div>
      )}

      {/* Header */}
      <header className="app-header">
        <div className="header-left">
          <div className="header-logo">🍷</div>
          <div>
            <h1 className="header-title">WSET Grape Guide</h1>
            <p className="header-sub">31 grapes · Visual Study Reference</p>
          </div>
        </div>
        <div className="header-actions">
          <div className="view-toggle">
            <button className={`view-btn ${viewMode === 'cards' ? 'active' : ''}`} onClick={() => setViewMode('cards')}>▦ Cards</button>
            <button className={`view-btn ${viewMode === 'rank'  ? 'active' : ''}`} onClick={() => setViewMode('rank')}>≡ Rank</button>
            <button className={`view-btn ${viewMode === 'map'   ? 'active' : ''}`} onClick={() => setViewMode('map')}>🗺 Map</button>
          </div>
          {compareList.length > 0 && (
            <button className="header-btn compare-trigger" onClick={() => setShowCompare((s) => !s)}>
              Compare ({compareList.length}) {showCompare ? '▲' : '▼'}
            </button>
          )}
          <button className="header-btn notes-trigger" onClick={() => setShowNotes((s) => !s)}>
            📝 Notes {showNotes ? '▲' : '▼'}
          </button>
        </div>
      </header>

      {showCompare && compareList.length > 0 && (
        <ComparePanel grapes={compareList} onRemove={removeFromCompare} onClose={() => setShowCompare(false)} />
      )}
      {showNotes && <StudyNotes />}

      {/* Filter bar — hidden in map view */}
      {viewMode !== 'map' && (
        <FilterBar
          filters={filters} setFilters={setFilters}
          sort={sort} setSort={setSort}
          search={search} setSearch={setSearch}
          total={grapeData.length} shown={sorted.length}
          hideSort={viewMode === 'rank'}
        />
      )}

      {/* Compare strip */}
      {compareList.length > 0 && viewMode !== 'map' && (
        <div className="compare-strip">
          <span className="strip-label">Comparing:</span>
          {compareList.map((g) => (
            <span key={g.id} className="strip-grape">
              {g.name}
              <button onClick={() => removeFromCompare(g.id)}>✕</button>
            </span>
          ))}
          <button className="strip-view" onClick={() => setShowCompare(true)}>View Chart →</button>
        </div>
      )}

      {/* ── Cards view ── */}
      {viewMode === 'cards' && (
        <main className="grape-grid">
          {sorted.map((grape) => (
            <GrapeCard
              key={grape.id}
              grape={grape}
              isComparing={!!compareList.find((g) => g.id === grape.id)}
              onToggleCompare={toggleCompare}
            />
          ))}
          {sorted.length === 0 && <div className="empty-state">No grapes match your filters.</div>}
        </main>
      )}

      {/* ── Rank view ── */}
      {viewMode === 'rank' && (
        <RankView
          grapes={filtered}
          rankBy={rankBy}
          setRankBy={setRankBy}
          onSelectGrape={setModalGrape}
        />
      )}

      {/* ── Map view ── */}
      {viewMode === 'map' && (
        <div className="map-view">
          <div className="map-main">
            <WorldMap
              selectedCountry={selectedCountry}
              onCountryClick={setSelectedCountry}
              selectedRegion={selectedRegion}
              onRegionClick={setSelectedRegion}
            />
          </div>

          {/* Side panel */}
          <div className={`map-panel ${selectedCountry ? 'open' : ''}`}>
            {selectedCountry ? (
              <>
                <div className="map-panel-header">
                  <div>
                    <h3 className="map-panel-country">{selectedCountry}</h3>
                    <p className="map-panel-sub">
                      {regionKeys.length} region{regionKeys.length !== 1 ? 's' : ''} · {countryGrapes.length} grape{countryGrapes.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <button
                    className="map-panel-close"
                    onClick={() => { setSelectedCountry(null); setSelectedRegion(null); }}
                  >✕</button>
                </div>

                <div className="map-panel-regions">
                  {regionKeys.length > 0 ? regionKeys.map((region) => {
                    const data     = regionData[region];
                    const isActive = selectedRegion === region;
                    return (
                      <div
                        key={region}
                        className={`region-card ${isActive ? 'active' : ''}`}
                        onClick={() => setSelectedRegion(isActive ? null : region)}
                      >
                        <div className="region-card-header">
                          <span className="region-card-name">{region}</span>
                          <span className="region-card-count">
                            {data.grapes.length} grape{data.grapes.length !== 1 ? 's' : ''}
                          </span>
                        </div>

                        {/* Subregion / appellation chips */}
                        {data.subregions.length > 0 && (
                          <div className="region-subregions">
                            {data.subregions.map((sub) => (
                              <span key={sub} className="region-sub-chip">{sub}</span>
                            ))}
                          </div>
                        )}

                        {/* Grape buttons */}
                        <div className="region-grapes">
                          {data.grapes.map((grape) => {
                            const colorClass = grape.color.includes('Red') ? 'red'
                              : grape.color.includes('Rosé') ? 'rose' : 'white';
                            return (
                              <button
                                key={grape.id}
                                className={`region-grape-btn region-grape-${colorClass}`}
                                onClick={(e) => { e.stopPropagation(); setModalGrape(grape); }}
                              >
                                <span className={`rank-dot dot-${colorClass}`} />
                                {grape.name}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }) : (
                    /* Fallback: flat grape list if no region data available */
                    countryGrapes.map((grape) => {
                      const colorClass = grape.color.includes('Red') ? 'red'
                        : grape.color.includes('Rosé') ? 'rose' : 'white';
                      return (
                        <button
                          key={grape.id}
                          className={`map-grape-row map-grape-${colorClass}`}
                          onClick={() => setModalGrape(grape)}
                        >
                          <span className={`rank-dot dot-${colorClass}`} style={{ flexShrink: 0 }} />
                          <div className="map-grape-names">
                            <span className="map-grape-name">{grape.name}</span>
                            {grape.nameCN && <span className="map-grape-cn">{grape.nameCN}</span>}
                          </div>
                          <span className="map-grape-arrow">→</span>
                        </button>
                      );
                    })
                  )}
                </div>

                <p className="map-panel-hint">
                  {regionKeys.length > 0
                    ? 'Click a region card or map marker to highlight · Click grape to view details'
                    : 'Click a grape to view its card'}
                </p>
              </>
            ) : (
              <div className="map-panel-empty">
                <span className="map-panel-empty-icon">🗺</span>
                <p>Hover over highlighted countries to see grapes grown there.</p>
                <p>Click a country to zoom in and explore its regions.</p>
              </div>
            )}
          </div>
        </div>
      )}

      <footer className="app-footer">
        WSET Study Tool · {grapeData.length} grapes · Data from structured dataset
      </footer>
    </div>
  );
}

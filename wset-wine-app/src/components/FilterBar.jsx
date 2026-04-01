import { SORT_OPTIONS } from '../data/helpers';

export default function FilterBar({ filters, setFilters, sort, setSort, search, setSearch, total, shown, hideSort }) {
  function update(key, val) {
    setFilters((f) => ({ ...f, [key]: val }));
  }

  return (
    <div className="filter-bar">
      <div className="filter-row">
        <input
          className="search-input"
          type="text"
          placeholder="Search grape or country…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="filter-group">
          <label>Color</label>
          {['All', 'White', 'Red', 'Rosé'].map((v) => (
            <button
              key={v}
              className={`chip ${filters.color === v ? 'active' : ''} chip-${v.toLowerCase()}`}
              onClick={() => update('color', v)}
            >
              {v}
            </button>
          ))}
        </div>
        <div className="filter-group">
          <label>Oak</label>
          {['All', 'Yes', 'No'].map((v) => (
            <button key={v} className={`chip ${filters.oak === v ? 'active' : ''}`} onClick={() => update('oak', v)}>
              {v}
            </button>
          ))}
        </div>
        <div className="filter-group">
          <label>Age</label>
          {['All', 'Yes'].map((v) => (
            <button key={v} className={`chip ${filters.age === v ? 'active' : ''}`} onClick={() => update('age', v)}>
              {v === 'All' ? 'All' : 'Ages Well'}
            </button>
          ))}
        </div>
        <div className="filter-group">
          <label>Special</label>
          <button
            className={`chip ${filters.botrytis === 'Yes' ? 'active chip-special' : ''}`}
            onClick={() => update('botrytis', filters.botrytis === 'Yes' ? 'All' : 'Yes')}
          >
            Botrytis
          </button>
          <button
            className={`chip ${filters.sparkling === 'Yes' ? 'active chip-special' : ''}`}
            onClick={() => update('sparkling', filters.sparkling === 'Yes' ? 'All' : 'Yes')}
          >
            Sparkling
          </button>
        </div>
        {!hideSort && (
          <div className="filter-group">
            <label>Sort by</label>
            <select className="sort-select" value={sort} onChange={(e) => setSort(e.target.value)}>
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        )}
      </div>
      <div className="filter-count">
        Showing {shown} of {total} grapes
      </div>
    </div>
  );
}

import grapeData from './grapes.json';

// Topojson uses "United States of America"; our data uses "USA"
export const GEO_NAME_TO_DATA = {
  'United States of America': 'USA',
};

export function geoToData(geoName) {
  return GEO_NAME_TO_DATA[geoName] || geoName;
}

// Build country → grapes lookup
export const COUNTRY_GRAPES = {};
grapeData.forEach((grape) => {
  grape.locations.forEach(({ country }) => {
    if (!COUNTRY_GRAPES[country]) COUNTRY_GRAPES[country] = [];
    if (!COUNTRY_GRAPES[country].find((g) => g.id === grape.id)) {
      COUNTRY_GRAPES[country].push(grape);
    }
  });
});

export const WINE_COUNTRIES = new Set(Object.keys(COUNTRY_GRAPES));

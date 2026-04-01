// Country zoom configs: center [longitude, latitude] and zoom level
export const COUNTRY_ZOOM = {
  Italy:          { center: [12.5,  42.5],  zoom: 5 },
  France:         { center: [2.5,   46.5],  zoom: 5 },
  Germany:        { center: [10.5,  51.2],  zoom: 5.5 },
  Spain:          { center: [-3.7,  40.4],  zoom: 5 },
  Australia:      { center: [135.0, -27.0], zoom: 2.8 },
  USA:            { center: [-98.0, 39.0],  zoom: 3 },
  Argentina:      { center: [-65.0, -34.0], zoom: 4 },
  Chile:          { center: [-71.0, -37.0], zoom: 4 },
  'South Africa': { center: [25.0,  -29.5], zoom: 4 },
  'New Zealand':  { center: [172.5, -41.5], zoom: 5 },
  Hungary:        { center: [19.5,  47.2],  zoom: 7 },
};

// Approximate geographic center [longitude, latitude] for each wine region
export const REGION_COORDS = {
  Italy: {
    'Piedmont':      [7.9,   44.7],
    'Veneto':        [12.0,  45.5],
    'Delle Venezie': [12.3,  46.0],
    'Tuscany':       [11.2,  43.5],
    'Marche':        [13.3,  43.5],
    'Campania':      [14.9,  40.9],
    'Abruzzo':       [14.0,  42.3],
    'Puglia':        [16.2,  40.8],
  },
  France: {
    'Alsace':         [7.45,  48.35],
    'Loire Valley':   [0.7,   47.4],
    'Bordeaux':       [-0.6,  44.8],
    'Burgundy':       [4.85,  47.05],
    'Languedoc':      [3.5,   43.5],
    'Beaujolais':     [4.55,  46.2],
    'Southern Rhône': [4.85,  44.0],
    'North Rhône':    [4.85,  45.2],
  },
  Germany: {
    'Mosel':    [7.0,  50.15],
    'Rheingau': [8.05, 50.0],
    'Pfalz':    [8.1,  49.45],
  },
  Spain: {
    'Galicia':          [-8.5,  42.8],
    'Navarra':          [-1.65, 42.7],
    'Rioja':            [-2.5,  42.4],
    'Ribera del Duero': [-3.7,  41.6],
    'Catalunya':        [1.5,   41.5],
    'Priorat':          [0.85,  41.2],
  },
  Australia: {
    'Eden Valley':    [139.1, -34.6],
    'Clare Valley':   [138.6, -33.8],
    'Hunter Valley':  [151.2, -32.7],
    'Barossa Valley': [138.9, -34.5],
    'South Australia':[135.5, -30.5],
    'McLaren Vale':   [138.5, -35.2],
    'Coonawarra':     [140.8, -37.3],
    'Margaret River': [115.1, -33.9],
    'Yarra Valley':   [145.5, -37.7],
  },
  USA: {
    'California':  [-119.4, 36.8],
    'Oregon':      [-120.5, 44.0],
    'Napa Valley': [-122.3, 38.5],
  },
  Argentina: {
    'Mendoza': [-68.8, -32.9],
  },
  Chile: {
    'Central Valley': [-71.2, -34.5],
  },
  'South Africa': {
    'Western Cape': [18.9, -33.9],
  },
  'New Zealand': {
    'Marlborough':   [173.9, -41.5],
    'Central Otago': [169.3, -45.0],
    "Hawke's Bay":   [176.8, -39.6],
    'Martinborough': [175.5, -41.2],
  },
  Hungary: {
    'Tokaj': [21.4, 48.1],
  },
};

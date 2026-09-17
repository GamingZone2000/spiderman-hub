// ---------- Elokuvien katsomistiedot ----------
// status: 'streaming' = suoratoistossa, 'theaters' = teatterissa, 'upcoming' = ei vielä julkaistu
// watch: teksti alueittain (nordics, europe, northAmerica, latinAmerica, asiaPacific, middleEastAfrica, other)

const sonyClassic = {
  nordics: 'Usually on Disney+ or SkyShowtime. Rent on Apple TV, Google Play or Viaplay.',
  europe: 'Usually on Disney+ or Netflix (varies by country). Rent on Amazon Prime Video or Apple TV.',
  northAmerica: 'Disney+ in the US. In Canada usually Netflix or Disney+. Rent on Amazon Prime Video or Apple TV.',
  latinAmerica: 'Usually on Netflix or Disney+. Rent on Apple TV or Google Play.',
  asiaPacific: 'Usually on Netflix or Disney+. Rent on Apple TV or Google Play.',
  middleEastAfrica: 'Usually on OSN+ or Netflix. Rent on Apple TV or Google Play.',
  other: 'Rent or buy on Apple TV or Google Play.'
};

const mcu = {
  nordics: 'Disney+. Rent on Apple TV or Google Play.',
  europe: 'Disney+ in most countries. Rent on Amazon Prime Video or Apple TV.',
  northAmerica: 'Disney+. Rent on Amazon Prime Video or Apple TV.',
  latinAmerica: 'Disney+. Rent on Apple TV or Google Play.',
  asiaPacific: 'Disney+ (Disney+ Hotstar in some countries). Rent on Apple TV or Google Play.',
  middleEastAfrica: 'Disney+ or OSN+. Rent on Apple TV or Google Play.',
  other: 'Rent or buy on Apple TV or Google Play.'
};

const spiderVerse = {
  nordics: 'Usually on Netflix or SkyShowtime. Rent on Apple TV or Google Play.',
  europe: 'Usually on Netflix or Disney+ (varies by country). Rent on Amazon Prime Video or Apple TV.',
  northAmerica: 'Netflix or Disney+ in the US. In Canada usually Netflix or Crave. Rent on Amazon Prime Video or Apple TV.',
  latinAmerica: 'Usually on Netflix. Rent on Apple TV or Google Play.',
  asiaPacific: 'Usually on Netflix. Rent on Apple TV or Google Play.',
  middleEastAfrica: 'Usually on Netflix or OSN+. Rent on Apple TV or Google Play.',
  other: 'Rent or buy on Apple TV or Google Play.'
};

const movies = {
  'spider-man-2002':               { status: 'streaming', watch: sonyClassic },
  'spider-man-2004':               { status: 'streaming', watch: sonyClassic },
  'spider-man-2007':               { status: 'streaming', watch: sonyClassic },
  'amazing-spider-man-2012':       { status: 'streaming', watch: sonyClassic },
  'amazing-spider-man-2014':       { status: 'streaming', watch: sonyClassic },
  'homecoming-2017':               { status: 'streaming', watch: mcu },
  'far-from-home-2019':            { status: 'streaming', watch: mcu },
  'no-way-home-2021':              { status: 'streaming', watch: mcu },
  'brand-new-day-2026':            { status: 'theaters', watch: mcu },
  'into-the-spider-verse-2018':    { status: 'streaming', watch: spiderVerse },
  'across-the-spider-verse-2023':  { status: 'streaming', watch: spiderVerse },
  'beyond-the-spider-verse-2027':  { status: 'upcoming', watch: spiderVerse, release: '2027' }
};

// ---------- Maat alueittain ----------
const regions = {
  nordics: ['FI', 'SE', 'NO', 'DK', 'IS'],
  europe: ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'EE', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU',
           'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'CH', 'GB', 'UA', 'RS', 'BA', 'ME', 'MK', 'AL',
           'TR', 'MD', 'BY', 'GE', 'AM', 'AZ', 'LI', 'MC', 'AD', 'SM'],
  northAmerica: ['US', 'CA'],
  latinAmerica: ['MX', 'BR', 'AR', 'CL', 'CO', 'PE', 'VE', 'EC', 'UY', 'PY', 'BO', 'CR', 'PA', 'GT', 'HN',
                 'SV', 'NI', 'DO', 'CU', 'PR', 'JM', 'TT', 'BS', 'BB', 'BZ', 'GY', 'SR', 'HT'],
  asiaPacific: ['JP', 'KR', 'CN', 'TW', 'HK', 'MO', 'SG', 'MY', 'TH', 'VN', 'PH', 'ID', 'IN', 'PK', 'BD',
                'LK', 'NP', 'AU', 'NZ', 'KH', 'LA', 'MM', 'MN', 'BN', 'FJ', 'PG', 'KZ', 'UZ', 'KG', 'TJ', 'TM'],
  middleEastAfrica: ['AE', 'SA', 'QA', 'KW', 'BH', 'OM', 'IL', 'JO', 'LB', 'IQ', 'IR', 'EG', 'ZA', 'NG', 'KE',
                     'MA', 'DZ', 'TN', 'LY', 'GH', 'ET', 'TZ', 'UG', 'SN', 'CI', 'CM', 'ZW', 'ZM', 'MZ', 'AO',
                     'NA', 'BW', 'RW', 'MU', 'SD']
};

function regionOf(countryCode) {
  for (const name in regions) {
    if (regions[name].includes(countryCode)) return name;
  }
  return 'other';
}

// JustWatch käyttää omia maakoodeja (esim. GB = uk)
const justWatchCodes = {
  GB: 'uk'
};

function justWatchLink(countryCode, title) {
  const code = justWatchCodes[countryCode] || countryCode.toLowerCase();
  return 'https://www.justwatch.com/' + code + '/search?q=' + encodeURIComponent(title);
}

// ---------- Sijainti ja tulos ----------
const locateBtn = document.getElementById('locate');
const result = document.getElementById('watch-result');
const movieId = document.body.dataset.movie;
const movie = movies[movieId];
const title = document.querySelector('header h1').textContent;

locateBtn.addEventListener('click', () => {
  result.textContent = 'Locating...';
  navigator.geolocation.getCurrentPosition(showPosition, showError);
});

function showPosition(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  const url = 'https://api.bigdatacloud.net/data/reverse-geocode-client?latitude='
    + lat + '&longitude=' + lon + '&localityLanguage=en';

  fetch(url)
    .then(response => response.json())
    .then(data => showWatchInfo(data.countryCode, data.countryName))
    .catch(() => {
      result.textContent = 'Could not find your country. Try again later.';
    });
}

function showWatchInfo(countryCode, countryName) {
  const link = '<a href="' + justWatchLink(countryCode, title) + '" target="_blank">'
    + 'Check live availability in ' + countryName + ' on JustWatch</a>';

  if (movie.status === 'theaters') {
    result.innerHTML = '🎬 <strong>' + title + '</strong> is in theaters now in ' + countryName
      + '. Check your local cinema listings.<br>' + link;
    return;
  }

  if (movie.status === 'upcoming') {
    result.innerHTML = '⏳ <strong>' + title + '</strong> is not released yet. Coming in '
      + movie.release + '.';
    return;
  }

  const region = regionOf(countryCode);
  result.innerHTML = '📺 In <strong>' + countryName + '</strong>: ' + movie.watch[region]
    + '<br>' + link;
}

function showError() {
  result.textContent = 'Location not allowed. Cannot show your region.';
}

// Import price data from JSON file 
import pricesData from './data/prices.json' assert { type: 'json' };
import './style.css';

let prices = {};        // Store the latest price info for each currency
let currencies = [];    //Dtore the sorted list of all available currency

// Define a mapping for currencies
const iconMap = {
  'BNEO': 'bNEO',
  'AMPLUNA': 'ampLUNA',
  'AXLUSDC': 'axlUSDC',
  'STATOM': 'stATOM',
  'STLUNA': 'stLUNA',
  'RATOM': 'rATOM',
  'STEVMOS': 'stEVMOS',
  'WSTETH': 'wstETH',
  'YIELDUSD': 'YieldUSD',
  'RSWTH': 'rSWTH',
};

function init() {
  // Reduce the imported pricesData to keep only the most recent entry for each currency
  const latestPrices = {};
  pricesData.forEach(item => {
    const upper = item.currency.toUpperCase();               // Convert to uppercase
    if (!latestPrices[upper] || new Date(item.date) > new Date(latestPrices[upper].date)) {
      latestPrices[upper] = {
        price: item.price,
        date: item.date,
        original: item.currency
      };
    }
  });

  // Assign the processed data to global variables
  prices = latestPrices;
  currencies = Object.keys(prices).sort();                   // Sorted array of currency symbols

  // Populate the dropdown menus with currency options
  populateSelects();

  // Set default selections
  setDefaultSelections();

  // Preload all token icons into browser cache for instant switching later
  preloadIcons();        

  // Set the initial icons based on default selections
  updateIcons();

  //initial conversion calculation (will be empty initially)
  updateCalculation();
}

// Fill both "from" and "to" currency <select> elements with options
function populateSelects() {
  const fromSelect = document.getElementById('from-currency');
  const toSelect = document.getElementById('to-currency');

  fromSelect.innerHTML = '';
  toSelect.innerHTML = '';

  // Add an <option> for every currency
  currencies.forEach(curr => {
    const optionFrom = document.createElement('option');
    optionFrom.value = curr;
    optionFrom.textContent = `${curr}`;

    // Clone the same option for the "to" dropdown to avoid re-creating
    const optionTo = optionFrom.cloneNode(true);

    fromSelect.appendChild(optionFrom);
    toSelect.appendChild(optionTo);
  });
}

// Set sensible default values for the dropdowns
function setDefaultSelections() {
  const fromSelect = document.getElementById('from-currency');
  const toSelect = document.getElementById('to-currency');

  // Prefer USD as default
  if (currencies.includes('USD')) fromSelect.value = 'USD';
  // Prefer ETH as default
  if (currencies.includes('ETH')) toSelect.value = 'ETH';
}

// Update the displayed token icons whenever currencies change
function updateIcons() {
  const fromCurr = document.getElementById('from-currency').value;
  const toCurr = document.getElementById('to-currency').value;

  // Resolve the correct icon filename (use mapping if available, otherwise use currency code itself)
  const getSymbol = (curr) => iconMap[curr] || curr;

  // Base URL for the token icon repository
  const base = 'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/';

  const fromImg = document.getElementById('from-icon');
  const toImg = document.getElementById('to-icon');

  // Set the icon sources
  fromImg.src = base + getSymbol(fromCurr) + '.svg';
  toImg.src = base + getSymbol(toCurr) + '.svg';

  // Fallback
  const fallback = '/vite.svg';
  fromImg.onerror = () => { fromImg.src = fallback; };
  toImg.onerror = () => { toImg.src = fallback; };
}

// Preload and cache all possible token icons so switching feels smooth
function preloadIcons() {
  const base = 'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/';
  const mappedSymbols = Object.values(iconMap);
  const defaultSymbols = currencies.filter(curr => !(curr in iconMap));
  const allSymbols = [...new Set([...mappedSymbols, ...defaultSymbols])];

  // Create hidden Image objects to trigger browser download and caching
  allSymbols.forEach(symbol => {
    const img = new Image();
    img.src = base + symbol + '.svg';
  });
}

// Perform the currency conversion and update output fields
function updateCalculation() {
  const fromAmount = parseFloat(document.getElementById('from-amount').value) || 0;
  const fromCurr = document.getElementById('from-currency').value;
  const toCurr = document.getElementById('to-currency').value;

  // Basic validation for to see if at least two different currencies is select
  if (!fromCurr || !toCurr || fromCurr === toCurr) {
    document.getElementById('to-amount').value = '';
    document.getElementById('rate-info').textContent = 'Please select two different currency type';
    return;
  }

  // Calculate exchange rate based on stored USD prices
  const rate = prices[toCurr].price / prices[fromCurr].price;
  const toAmount = fromAmount * rate;

  // Display converted amount
  document.getElementById('to-amount').value = toAmount.toFixed(3).replace(/\.?0+$/, '');

  // Show the current exchange rate
  document.getElementById('rate-info').textContent = `1 ${fromCurr} = ${rate.toFixed(3)} ${toCurr}`;
}

// Event listeners for user interaction

// When user changes the "from" currency
document.getElementById('from-currency').addEventListener('change', () => {
  updateIcons();
  updateCalculation();
});

// When user changes the "to" currency
document.getElementById('to-currency').addEventListener('change', () => {
  updateIcons();
  updateCalculation();
});

// Real-time update as user types the amount
document.getElementById('from-amount').addEventListener('input', updateCalculation);

// Swap button – switches the two currencies
document.getElementById('swap-btn').addEventListener('click', () => {
  const from = document.getElementById('from-currency');
  const to = document.getElementById('to-currency');
  // Swap the selected values
  [from.value, to.value] = [to.value, from.value];
  updateIcons();
  updateCalculation();
});

init();
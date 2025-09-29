// Utility Functions and Helpers
const $ = (sel, parent = document) => parent.querySelector(sel);
const $$ = (sel, parent = document) => Array.from(parent.querySelectorAll(sel));

const money = (n) => {
  if (typeof n !== 'number') {
    n = parseFloat(n) || 0;
  }
  return new Intl.NumberFormat('ar-DZ', { 
    style: 'currency', 
    currency: 'DZD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(n).replace('DZD', 'da').replace('د.ج.', 'da');
};

const debounce = (fn, ms = 250) => { 
  let t; 
  return (...args) => { 
    clearTimeout(t); 
    t = setTimeout(() => fn(...args), ms); 
  } 
};

const toast = (msg, type = 'default') => { 
  const t = $('#toast'); 
  t.textContent = msg; 
  t.className = 'toast show'; // Reset classes
  if (type !== 'default') {
    t.classList.add(type); 
  }
  setTimeout(() => t.classList.remove('show'), 2500); 
};

// Enhanced formatCurrency alias for consistency - only if not already defined
if (typeof formatCurrency === 'undefined') {
  const formatCurrency = money;
}

// Enhanced formatNumber function - only if not already defined
if (typeof formatNumber === 'undefined') {
  const formatNumber = (n) => {
    if (typeof n !== 'number') {
      n = parseFloat(n) || 0;
    }
    return new Intl.NumberFormat().format(n);
  };
}

// Generate placeholder image as data URL (gradient card with hue)
function imageFor(hue, title) {
  const svg = encodeURIComponent(`
    <svg xmlns='http://www.w3.org/2000/svg' width='800' height='550'>
      <defs>
        <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
          <stop offset='0' stop-color='hsl(${hue},70%,60%)'/>
          <stop offset='1' stop-color='hsl(${(hue+60)%360},70%,50%)'/>
        </linearGradient>
      </defs>
      <rect width='100%' height='100%' fill='url(#g)'/>
      <g fill='rgba(0,0,0,.24)'>
        <circle cx='120' cy='100' r='56'/>
        <rect x='240' y='70' width='440' height='60' rx='16'/>
        <rect x='240' y='160' width='340' height='40' rx='12'/>
      </g>
      <text x='40' y='510' font-size='42' font-weight='700' font-family='system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial' fill='rgba(255,255,255,.92)'>${title}</text>
    </svg>`);
  return `data:image/svg+xml;charset=utf-8,${svg}`;
}

// Helper functions for category handling
function getCategoryName(category) {
  if (typeof category === 'string') return category;
  return category?.name || 'Unknown';
}

function getCategoryId(category) {
  if (typeof category === 'string') return category;
  return category?._id || category?.name || category;
}

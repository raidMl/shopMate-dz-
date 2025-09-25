/**
 * Complete list of Algerian Wilayas (Provinces)
 * Official administrative divisions of Algeria
 */

const ALGERIA_WILAYAS = [
  { code: "01", name: "Adrar", nameAr: "أدرار", nameFr: "Adrar" },
  { code: "02", name: "Chlef", nameAr: "الشلف", nameFr: "Chlef" },
  { code: "03", name: "Laghouat", nameAr: "الأغواط", nameFr: "Laghouat" },
  { code: "04", name: "Oum El Bouaghi", nameAr: "أم البواقي", nameFr: "Oum El Bouaghi" },
  { code: "05", name: "Batna", nameAr: "باتنة", nameFr: "Batna" },
  { code: "06", name: "Béjaïa", nameAr: "بجاية", nameFr: "Béjaïa" },
  { code: "07", name: "Biskra", nameAr: "بسكرة", nameFr: "Biskra" },
  { code: "08", name: "Béchar", nameAr: "بشار", nameFr: "Béchar" },
  { code: "09", name: "Blida", nameAr: "البليدة", nameFr: "Blida" },
  { code: "10", name: "Bouira", nameAr: "البويرة", nameFr: "Bouira" },
  { code: "11", name: "Tamanrasset", nameAr: "تمنراست", nameFr: "Tamanrasset" },
  { code: "12", name: "Tébessa", nameAr: "تبسة", nameFr: "Tébessa" },
  { code: "13", name: "Tlemcen", nameAr: "تلمسان", nameFr: "Tlemcen" },
  { code: "14", name: "Tiaret", nameAr: "تيارت", nameFr: "Tiaret" },
  { code: "15", name: "Tizi Ouzou", nameAr: "تيزي وزو", nameFr: "Tizi Ouzou" },
  { code: "16", name: "Alger", nameAr: "الجزائر", nameFr: "Alger" },
  { code: "17", name: "Djelfa", nameAr: "الجلفة", nameFr: "Djelfa" },
  { code: "18", name: "Jijel", nameAr: "جيجل", nameFr: "Jijel" },
  { code: "19", name: "Sétif", nameAr: "سطيف", nameFr: "Sétif" },
  { code: "20", name: "Saïda", nameAr: "سعيدة", nameFr: "Saïda" },
  { code: "21", name: "Skikda", nameAr: "سكيكدة", nameFr: "Skikda" },
  { code: "22", name: "Sidi Bel Abbès", nameAr: "سيدي بلعباس", nameFr: "Sidi Bel Abbès" },
  { code: "23", name: "Annaba", nameAr: "عنابة", nameFr: "Annaba" },
  { code: "24", name: "Guelma", nameAr: "قالمة", nameFr: "Guelma" },
  { code: "25", name: "Constantine", nameAr: "قسنطينة", nameFr: "Constantine" },
  { code: "26", name: "Médéa", nameAr: "المدية", nameFr: "Médéa" },
  { code: "27", name: "Mostaganem", nameAr: "مستغانم", nameFr: "Mostaganem" },
  { code: "28", name: "M'Sila", nameAr: "المسيلة", nameFr: "M'Sila" },
  { code: "29", name: "Mascara", nameAr: "معسكر", nameFr: "Mascara" },
  { code: "30", name: "Ouargla", nameAr: "ورقلة", nameFr: "Ouargla" },
  { code: "31", name: "Oran", nameAr: "وهران", nameFr: "Oran" },
  { code: "32", name: "El Bayadh", nameAr: "البيض", nameFr: "El Bayadh" },
  { code: "33", name: "Illizi", nameAr: "إليزي", nameFr: "Illizi" },
  { code: "34", name: "Bordj Bou Arréridj", nameAr: "برج بوعريريج", nameFr: "Bordj Bou Arréridj" },
  { code: "35", name: "Boumerdès", nameAr: "بومرداس", nameFr: "Boumerdès" },
  { code: "36", name: "El Tarf", nameAr: "الطارف", nameFr: "El Tarf" },
  { code: "37", name: "Tindouf", nameAr: "تندوف", nameFr: "Tindouf" },
  { code: "38", name: "Tissemsilt", nameAr: "تيسمسيلت", nameFr: "Tissemsilt" },
  { code: "39", name: "El Oued", nameAr: "الوادي", nameFr: "El Oued" },
  { code: "40", name: "Khenchela", nameAr: "خنشلة", nameFr: "Khenchela" },
  { code: "41", name: "Souk Ahras", nameAr: "سوق أهراس", nameFr: "Souk Ahras" },
  { code: "42", name: "Tipaza", nameAr: "تيبازة", nameFr: "Tipaza" },
  { code: "43", name: "Mila", nameAr: "ميلة", nameFr: "Mila" },
  { code: "44", name: "Aïn Defla", nameAr: "عين الدفلى", nameFr: "Aïn Defla" },
  { code: "45", name: "Naâma", nameAr: "النعامة", nameFr: "Naâma" },
  { code: "46", name: "Aïn Témouchent", nameAr: "عين تموشنت", nameFr: "Aïn Témouchent" },
  { code: "47", name: "Ghardaïa", nameAr: "غرداية", nameFr: "Ghardaïa" },
  { code: "48", name: "Relizane", nameAr: "غليزان", nameFr: "Relizane" },
  { code: "49", name: "Timimoun", nameAr: "تيميمون", nameFr: "Timimoun" },
  { code: "50", name: "Bordj Badji Mokhtar", nameAr: "برج باجي مختار", nameFr: "Bordj Badji Mokhtar" },
  { code: "51", name: "Ouled Djellal", nameAr: "أولاد جلال", nameFr: "Ouled Djellal" },
  { code: "52", name: "Béni Abbès", nameAr: "بني عباس", nameFr: "Béni Abbès" },
  { code: "53", name: "In Salah", nameAr: "عين صالح", nameFr: "In Salah" },
  { code: "54", name: "In Guezzam", nameAr: "عين قزام", nameFr: "In Guezzam" },
  { code: "55", name: "Touggourt", nameAr: "تقرت", nameFr: "Touggourt" },
  { code: "56", name: "Djanet", nameAr: "جانت", nameFr: "Djanet" },
  { code: "57", name: "El M'Ghair", nameAr: "المغير", nameFr: "El M'Ghair" },
  { code: "58", name: "El Meniaa", nameAr: "المنيعة", nameFr: "El Meniaa" }
];

/**
 * Get wilaya display name based on current language
 * @param {Object} wilaya - Wilaya object
 * @param {string} language - Current language (en, ar, fr)
 * @returns {string} Formatted wilaya name
 */
function getWilayaDisplayName(wilaya, language = 'en') {
  let name;
  switch (language) {
    case 'ar':
      name = wilaya.nameAr;
      break;
    case 'fr':
      name = wilaya.nameFr;
      break;
    default:
      name = wilaya.name;
  }
  return `${wilaya.code} - ${name}`;
}

/**
 * Populate wilaya select element with all Algerian wilayas
 * @param {HTMLSelectElement} selectElement - The select element to populate
 * @param {string} language - Current language
 */
function populateWilayaSelect(selectElement, language = 'en') {
  if (!selectElement) return;
  
  // Clear existing options except the first (placeholder)
  const firstOption = selectElement.querySelector('option[disabled]');
  selectElement.innerHTML = '';
  
  // Re-add placeholder option
  if (firstOption) {
    selectElement.appendChild(firstOption);
  }
  
  // Add all wilayas
  ALGERIA_WILAYAS.forEach(wilaya => {
    const option = document.createElement('option');
    option.value = wilaya.code;
    option.textContent = getWilayaDisplayName(wilaya, language);
    selectElement.appendChild(option);
  });
}

/**
 * Get wilaya by code
 * @param {string} code - Wilaya code
 * @returns {Object|null} Wilaya object or null if not found
 */
function getWilayaByCode(code) {
  return ALGERIA_WILAYAS.find(wilaya => wilaya.code === code) || null;
}

/**
 * Get wilaya by name (any language)
 * @param {string} name - Wilaya name
 * @returns {Object|null} Wilaya object or null if not found
 */
function getWilayaByName(name) {
  if (!name) return null;
  
  const searchName = name.toLowerCase().trim();
  return ALGERIA_WILAYAS.find(wilaya => 
    wilaya.name.toLowerCase() === searchName ||
    wilaya.nameAr === name ||
    wilaya.nameFr.toLowerCase() === searchName
  ) || null;
}

/**
 * Calculate delivery price based on wilaya
 * @param {string} wilayaCodeOrName - Wilaya code or name
 * @returns {number} Delivery price in DA
 */
function calculateWilayaDeliveryPrice(wilayaCodeOrName) {
  if (!wilayaCodeOrName) return 500; // Default price
  
  // Get wilaya object
  let wilaya = getWilayaByCode(wilayaCodeOrName) || getWilayaByName(wilayaCodeOrName);
  
  // If not found by code/name, try partial match
  if (!wilaya) {
    const searchTerm = wilayaCodeOrName.toLowerCase();
    wilaya = ALGERIA_WILAYAS.find(w => 
      w.name.toLowerCase().includes(searchTerm) ||
      w.nameFr.toLowerCase().includes(searchTerm) ||
      w.nameAr.includes(wilayaCodeOrName)
    );
  }
  
  if (!wilaya) return 500; // Default if not found
  
  // Southern/remote wilayas (800 DA)
  const southernWilayaCodes = [
    "01", // Adrar
    "08", // Béchar  
    "11", // Tamanrasset
    "30", // Ouargla
    "32", // El Bayadh
    "33", // Illizi
    "37", // Tindouf
    "39", // El Oued
    "45", // Naâma
    "47", // Ghardaïa
    "49", // Timimoun
    "50", // Bordj Badji Mokhtar
    "52", // Béni Abbès
    "53", // In Salah
    "54", // In Guezzam
    "56", // Djanet
    "58"  // El Meniaa
  ];
  
  // Check if wilaya is in southern list (higher price)
  const isRemoteWilaya = southernWilayaCodes.includes(wilaya.code);
  
  return isRemoteWilaya ? 800 : 500;
}

/**
 * Get wilaya name for display (handles both code and name input)
 * @param {string} wilayaCodeOrName - Wilaya code or name
 * @param {string} language - Display language
 * @returns {string} Wilaya display name
 */
function getWilayaDisplayNameFromInput(wilayaCodeOrName, language = 'en') {
  if (!wilayaCodeOrName) return '';
  
  // First try to get by code
  let wilaya = getWilayaByCode(wilayaCodeOrName);
  
  // If not found, try by name
  if (!wilaya) {
    wilaya = getWilayaByName(wilayaCodeOrName);
  }
  
  // If still not found, return the input as is
  if (!wilaya) {
    return wilayaCodeOrName;
  }
  
  // Return name based on language
  switch (language) {
    case 'ar':
      return wilaya.nameAr;
    case 'fr':
      return wilaya.nameFr;
    default:
      return wilaya.name;
  }
}

/**
 * Get delivery pricing category for a wilaya
 * @param {string} wilayaCodeOrName - Wilaya code or name
 * @returns {Object} Pricing information
 */
function getWilayaDeliveryInfo(wilayaCodeOrName) {
  const price = calculateWilayaDeliveryPrice(wilayaCodeOrName);
  const isRemote = price === 800;
  
  return {
    price: price,
    category: isRemote ? 'remote' : 'standard',
    isRemote: isRemote,
    description: isRemote ? 'Remote/Southern Wilaya' : 'Standard Delivery'
  };
}

/**
 * Get all wilayas grouped by delivery price
 * @returns {Object} Wilayas grouped by delivery zones
 */
function getWilayasByDeliveryZone() {
  const standard = [];
  const remote = [];
  
  ALGERIA_WILAYAS.forEach(wilaya => {
    const deliveryPrice = calculateWilayaDeliveryPrice(wilaya.code);
    if (deliveryPrice === 800) {
      remote.push(wilaya);
    } else {
      standard.push(wilaya);
    }
  });
  
  return {
    standard: {
      price: 500,
      wilayas: standard,
      count: standard.length
    },
    remote: {
      price: 800,
      wilayas: remote,
      count: remote.length
    }
  };
}

/**
 * Check if a wilaya is in the remote delivery zone
 * @param {string} wilayaCodeOrName - Wilaya code or name
 * @returns {boolean} True if remote delivery zone
 */
function isRemoteWilaya(wilayaCodeOrName) {
  return calculateWilayaDeliveryPrice(wilayaCodeOrName) === 800;
}

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.ALGERIA_WILAYAS = ALGERIA_WILAYAS;
  window.populateWilayaSelect = populateWilayaSelect;
  window.getWilayaDisplayName = getWilayaDisplayName;
  window.getWilayaByCode = getWilayaByCode;
  window.getWilayaByName = getWilayaByName;
  window.calculateWilayaDeliveryPrice = calculateWilayaDeliveryPrice;
  window.getWilayaDisplayNameFromInput = getWilayaDisplayNameFromInput;
  window.getWilayaDeliveryInfo = getWilayaDeliveryInfo;
  window.getWilayasByDeliveryZone = getWilayasByDeliveryZone;
  window.isRemoteWilaya = isRemoteWilaya;
}

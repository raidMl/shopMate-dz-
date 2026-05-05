/**
 * Algerian Wilayas (Provinces) Reference Data
 * Format: { code: "01", name_ar: "Arabic Name", name_fr: "French Name" }
 */

const WILAYAS_DATA = [
  { code: "01", name_ar: "الجزائر البيضاء", name_fr: "Alger" },
  { code: "02", name_ar: "الشلف", name_fr: "Chlef" },
  { code: "03", name_ar: "الأغواط", name_fr: "Laghouat" },
  { code: "04", name_ar: "أم البواقي", name_fr: "Oum El Bouaghi" },
  { code: "05", name_ar: "باتنة", name_fr: "Batna" },
  { code: "06", name_ar: "بجاية", name_fr: "Béjaïa" },
  { code: "07", name_ar: "بسكرة", name_fr: "Biskra" },
  { code: "08", name_ar: "بشار", name_fr: "Béchar" },
  { code: "09", name_ar: "البليدة", name_fr: "Blida" },
  { code: "10", name_ar: "البويرة", name_fr: "Bouira" },
  { code: "11", name_ar: "تمنراست", name_fr: "Tamanrasset" },
  { code: "12", name_ar: "تبسة", name_fr: "Tébessa" },
  { code: "13", name_ar: "تلمسان", name_fr: "Tlemcen" },
  { code: "14", name_ar: "تيارت", name_fr: "Tiaret" },
  { code: "15", name_ar: "تيزي وزو", name_fr: "Tizi Ouzou" },
  { code: "16", name_ar: "الجزائر", name_fr: "Alger" },
  { code: "17", name_ar: "الجلفة", name_fr: "Djelfa" },
  { code: "18", name_ar: "جيجل", name_fr: "Jijel" },
  { code: "19", name_ar: "سطيف", name_fr: "Sétif" },
  { code: "20", name_ar: "السعيدة", name_fr: "Saïda" },
  { code: "21", name_ar: "سكيكدة", name_fr: "Skikda" },
  { code: "22", name_ar: "سيدي بلعباس", name_fr: "Sidi Bel Abbès" },
  { code: "23", name_ar: "عنابة", name_fr: "Annaba" },
  { code: "24", name_ar: "قالمة", name_fr: "Guelma" },
  { code: "25", name_ar: "قسنطينة", name_fr: "Constantine" },
  { code: "26", name_ar: "المدية", name_fr: "Médéa" },
  { code: "27", name_ar: "مستغانم", name_fr: "Mostaganem" },
  { code: "28", name_ar: "المسيلة", name_fr: "M'Sila" },
  { code: "29", name_ar: "معسكر", name_fr: "Mascara" },
  { code: "30", name_ar: "ورقلة", name_fr: "Ouargla" },
  { code: "31", name_ar: "وهران", name_fr: "Oran" },
  { code: "32", name_ar: "البيض", name_fr: "El Bayadh" },
  { code: "33", name_ar: "إليزي", name_fr: "Illizi" },
  { code: "34", name_ar: "برج بوعريريج", name_fr: "Bordj Bou Arreridj" },
  { code: "35", name_ar: "بومرداس", name_fr: "Boumerdès" },
  { code: "36", name_ar: "الطارف", name_fr: "El Tarf" },
  { code: "37", name_ar: "تندوف", name_fr: "Tindouf" },
  { code: "38", name_ar: "تسيمسيلت", name_fr: "Tissemsilt" },
  { code: "39", name_ar: "الوادي (واد سوف)", name_fr: "Oued Souf" },
  { code: "40", name_ar: "خنشلة", name_fr: "Khenchela" },
  { code: "41", name_ar: "سوق أهراس", name_fr: "Souk Ahras" },
  { code: "42", name_ar: "تيبازة", name_fr: "Tipaza" },
  { code: "43", name_ar: "ميلة", name_fr: "Mila" },
  { code: "44", name_ar: "عين الدفلى", name_fr: "Aïn Defla" },
  { code: "45", name_ar: "النعامة", name_fr: "Naâma" },
  { code: "46", name_ar: "عين تموشنت", name_fr: "Aïn Témouchent" },
  { code: "47", name_ar: "غرادية", name_fr: "Ghardaia" },
  { code: "48", name_ar: "غليزان", name_fr: "Gueliz" },
  { code: "49", name_ar: "تيميمون", name_fr: "Timimoun" },
  { code: "50", name_ar: "برج باجي مختار", name_fr: "Bordj Baji Mokhtar" },
  { code: "51", name_ar: "أولاد جلال", name_fr: "Ouled Djellal" },
  { code: "52", name_ar: "بني عباس", name_fr: "Beni Abbes" },
  { code: "53", name_ar: "عين صالح", name_fr: "Ain Salah" },
  { code: "54", name_ar: "عين قزام", name_fr: "Ain Guzam" },
  { code: "55", name_ar: "توقرت", name_fr: "Touggurt" },
  { code: "56", name_ar: "جانت", name_fr: "Djanet" },
  { code: "57", name_ar: "المغير", name_fr: "El Meghaier" },
  { code: "58", name_ar: "المنيعة", name_fr: "El Menia" }
];

/**
 * Get wilaya name in Arabic or French
 * @param {string} code - Wilaya code (e.g., "01")
 * @param {string} language - "ar" for Arabic, "fr" for French
 * @returns {string} Wilaya name or undefined
 */
const getWilayaName = (code, language = "ar") => {
  const wilaya = WILAYAS_DATA.find(w => w.code === code);
  if (!wilaya) return undefined;
  return language === "fr" ? wilaya.name_fr : wilaya.name_ar;
};

/**
 * Get full wilaya object by code
 * @param {string} code - Wilaya code (e.g., "01")
 * @returns {object} Wilaya object with code, name_ar, name_fr
 */
const getWilaya = (code) => {
  return WILAYAS_DATA.find(w => w.code === code);
};

/**
 * Get all wilayas
 * @returns {array} Array of all wilayas
 */
const getAllWilayas = () => {
  return WILAYAS_DATA;
};

/**
 * Get wilaya codes only
 * @returns {array} Array of wilaya codes ["01", "02", ...]
 */
const getWilayaCodes = () => {
  return WILAYAS_DATA.map(w => w.code);
};

module.exports = {
  WILAYAS_DATA,
  getWilayaName,
  getWilaya,
  getAllWilayas,
  getWilayaCodes
};

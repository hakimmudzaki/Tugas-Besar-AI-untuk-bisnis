import foodData from '../data/foodData.json';

/**
 * Search food by name (case-insensitive, fuzzy matching)
 */
export const searchFoodByName = (foodName) => {
  if (!foodName) return null;

  // Exact match
  let food = foodData.find(
    (f) => f['Nama Makanan'].toLowerCase() === foodName.toLowerCase()
  );

  // Fuzzy match if exact match not found
  if (!food) {
    food = foodData.find((f) =>
      f['Nama Makanan'].toLowerCase().includes(foodName.toLowerCase())
    );
  }

  // If still not found, try reverse
  if (!food) {
    food = foodData.find((f) =>
      foodName.toLowerCase().includes(f['Nama Makanan'].toLowerCase())
    );
  }

  return food || null;
};

/**
 * Get all unique values for a specific field
 */
export const getUniqueFieldValues = (fieldName) => {
  const values = foodData
    .map((food) => food[fieldName])
    .filter((value) => value && value !== '-');

  return [...new Set(values)];
};

/**
 * Filter foods by multiple criteria
 */
export const filterFoodsByCriteria = (criteria) => {
  return foodData.filter((food) => {
    for (const [key, value] of Object.entries(criteria)) {
      if (value && food[key] !== value) {
        return false;
      }
    }
    return true;
  });
};

/**
 * Get spice level color
 */
export const getSpiceLevelColor = (level) => {
  const levelNum = parseInt(level);
  if (levelNum <= 1) return '#2d6b42'; // Green - mild
  if (levelNum === 2) return '#D4AF37'; // Gold - moderate
  if (levelNum === 3) return '#FF9500'; // Orange - medium
  if (levelNum === 4) return '#FF6B35'; // Red-Orange - hot
  return '#FF0000'; // Red - very hot
};

/**
 * Get all food suggestions
 */
export const getAllFoods = () => {
  return foodData;
};

/**
 * Get food details with all fields
 */
export const getFoodDetails = (foodName) => {
  const food = searchFoodByName(foodName);
  if (!food) return null;

  return {
    nama: food['Nama Makanan'],
    daerahAsal: food['Daerah asal'],
    deskripsi: food['Deskripsi Singkat'],
    kalori: food['Estimasi Kalori & Makronutrisi'],
    alergen: food['Alergen'],
    spiciness: food['Spiciness Level (1-5)'],
    bahanUtama: food['Bahan Utama & Rempah'],
    caraMembuat: food['Cara membuat'],
    filosofi: food['Filosofi & Sejarah (Fun Fact)'],
    caraMakan: food['Cara Makan Tradisional (Local Etiquette)'],
  };
};

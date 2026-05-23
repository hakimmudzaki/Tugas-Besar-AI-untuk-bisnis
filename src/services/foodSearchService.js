import foodDataId from '../data/foodData.json';
import foodDataEn from '../data/FoodDataEnglish.json';

const FIELD_MAP = {
  id: {
    name: 'Nama Makanan',
    origin: 'Daerah asal',
    description: 'Deskripsi Singkat',
    nutrition: 'Estimasi Kalori & Makronutrisi',
    allergens: 'Alergen',
    spiciness: 'Spiciness Level (1-5)',
    ingredients: 'Bahan Utama & Rempah',
    howToMake: 'Cara membuat',
    philosophy: 'Filosofi & Sejarah (Fun Fact)',
    etiquette: 'Cara Makan Tradisional (Local Etiquette)',
  },
  en: {
    name: 'Food Name',
    origin: 'Origin',
    description: 'Short Description',
    nutrition: 'Nutrition Info',
    allergens: 'Allergens',
    spiciness: 'Spiciness (1-5)',
    ingredients: 'Main Ingredients',
    howToMake: 'How to Make',
    philosophy: 'Philosophy & History',
    etiquette: 'Local Etiquette',
  },
};

const LANGUAGE_DATA = {
  id: foodDataId,
  en: foodDataEn,
};

function normalize(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getDataset(language = 'id') {
  return LANGUAGE_DATA[language] || LANGUAGE_DATA.id;
}

function getNameField(language = 'id') {
  return FIELD_MAP[language]?.name || FIELD_MAP.id.name;
}

function getField(record, language, fieldName) {
  const key = FIELD_MAP[language]?.[fieldName];
  return record?.[key];
}

function buildAliasMap() {
  const aliasMap = new Map();
  const length = Math.min(foodDataId.length, foodDataEn.length);

  for (let index = 0; index < length; index += 1) {
    const indonesianName = foodDataId[index]?.[FIELD_MAP.id.name];
    const englishName = foodDataEn[index]?.[FIELD_MAP.en.name];

    if (indonesianName && englishName) {
      aliasMap.set(normalize(indonesianName), englishName);
      aliasMap.set(normalize(englishName), indonesianName);
    }
  }

  return aliasMap;
}

const aliasMap = buildAliasMap();

function findFoodInDataset(dataset, language, foodName) {
  const nameField = getNameField(language);
  const target = normalize(foodName);

  let food = dataset.find((item) => normalize(item?.[nameField]) === target);
  if (food) return food;

  food = dataset.find((item) => normalize(item?.[nameField]).includes(target));
  if (food) return food;

  food = dataset.find((item) => target.includes(normalize(item?.[nameField])));
  if (food) return food;

  return null;
}

function resolveFoodRecord(foodName, language = 'id') {
  if (!foodName) return null;

  const primaryDataset = getDataset(language);
  const primaryMatch = findFoodInDataset(primaryDataset, language, foodName);
  if (primaryMatch) return primaryMatch;

  const translatedName = aliasMap.get(normalize(foodName));
  if (translatedName) {
    const translatedMatch = findFoodInDataset(primaryDataset, language, translatedName);
    if (translatedMatch) return translatedMatch;
  }

  const alternateLanguage = language === 'en' ? 'id' : 'en';
  const alternateDataset = getDataset(alternateLanguage);
  const alternateMatch = findFoodInDataset(alternateDataset, alternateLanguage, foodName);
  if (alternateMatch) {
    const alternateName = alternateMatch[getNameField(alternateLanguage)];
    const mappedName = aliasMap.get(normalize(alternateName));
    if (mappedName) {
      const mappedMatch = findFoodInDataset(primaryDataset, language, mappedName);
      if (mappedMatch) return mappedMatch;
    }
  }

  return null;
}

export const searchFoodByName = (foodName, language = 'id') => {
  return resolveFoodRecord(foodName, language);
};

export const getUniqueFieldValues = (fieldName, language = 'id') => {
  const dataset = getDataset(language);
  const values = dataset
    .map((food) => food[fieldName])
    .filter((value) => value && value !== '-');

  return [...new Set(values)];
};

export const filterFoodsByCriteria = (criteria, language = 'id') => {
  const dataset = getDataset(language);
  return dataset.filter((food) => {
    for (const [key, value] of Object.entries(criteria)) {
      if (value && food[key] !== value) {
        return false;
      }
    }
    return true;
  });
};

export const getSpiceLevelColor = (level) => {
  const levelNum = parseInt(level, 10);
  if (levelNum <= 1) return '#2d6b42';
  if (levelNum === 2) return '#D4AF37';
  if (levelNum === 3) return '#FF9500';
  if (levelNum === 4) return '#FF6B35';
  return '#FF0000';
};

export const getAllFoods = (language = 'id') => {
  return getDataset(language);
};

export const getFoodDetails = (foodName, language = 'id') => {
  const food = resolveFoodRecord(foodName, language);
  if (!food) return null;

  return {
    nama: food[FIELD_MAP[language].name],
    daerahAsal: food[FIELD_MAP[language].origin],
    deskripsi: food[FIELD_MAP[language].description],
    kalori: food[FIELD_MAP[language].nutrition],
    alergen: food[FIELD_MAP[language].allergens],
    spiciness: food[FIELD_MAP[language].spiciness],
    bahanUtama: food[FIELD_MAP[language].ingredients],
    caraMembuat: food[FIELD_MAP[language].howToMake],
    filosofi: food[FIELD_MAP[language].philosophy],
    caraMakan: food[FIELD_MAP[language].etiquette],
  };
};

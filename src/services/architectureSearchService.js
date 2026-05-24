import architectureDataId from '../data/rumah_tradisional_indo.json';
import architectureDataEn from '../data/rumah_tradisional_eng.json';

const FIELD_MAP = {
  id: {
    label: 'Label',
    houseName: 'Nama Rumah Adat',
    tribe: 'Suku / Etnis',
    description: 'Deskripsi Singkat',
    physical: 'Spesifikasi Fisik',
    taboos: 'Material Terlarang / Pantangan Adat',
    sacredness: 'Tingkat Kesakralan (1-5)',
    materials: 'Material & Teknik Konstruksi',
    process: 'Proses & Ritual Pembangunan',
    philosophy: 'Filosofi & Sejarah (Fun Fact)',
    etiquette: 'Tata Krama & Aturan Masuk / Tinggal',
  },
  en: {
    label: 'Label',
    houseName: 'Name of Traditional House',
    tribe: 'Tribe / Ethnic Group',
    description: 'Short Description',
    physical: 'Physical Specifications',
    taboos: 'Forbidden Materials / Sacred Taboos',
    sacredness: 'Sacredness Level (1-5)',
    materials: 'Materials & Construction Techniques',
    process: 'Building Process & Rituals',
    philosophy: 'Philosophy & History (Fun Fact)',
    etiquette: 'Etiquette & Rules for Entering / Living',
  },
};

const LANGUAGE_DATA = {
  id: architectureDataId,
  en: architectureDataEn,
};

function toRecordList(dataset) {
  if (Array.isArray(dataset)) {
    return dataset;
  }

  if (!dataset || typeof dataset !== 'object') {
    return [];
  }

  const values = Object.values(dataset);

  if (values.every((value) => value && typeof value === 'object' && !Array.isArray(value))) {
    return values;
  }

  return [dataset];
}

function normalize(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getDataset(language = 'id') {
  return toRecordList(LANGUAGE_DATA[language] || LANGUAGE_DATA.id);
}

function getNameField(language = 'id') {
  return FIELD_MAP[language]?.houseName || FIELD_MAP.id.houseName;
}

function getField(record, language, fieldName) {
  const key = FIELD_MAP[language]?.[fieldName];
  return record?.[key];
}

function buildAliasMap() {
  const aliasMap = new Map();
  const idRecords = toRecordList(architectureDataId);
  const enRecords = toRecordList(architectureDataEn);
  const length = Math.min(idRecords.length, enRecords.length);

  for (let index = 0; index < length; index += 1) {
    const idRecord = idRecords[index];
    const enRecord = enRecords[index];
    const idLabel = idRecord?.[FIELD_MAP.id.label];
    const enLabel = enRecord?.[FIELD_MAP.en.label];
    const idName = idRecord?.[FIELD_MAP.id.houseName];
    const enName = enRecord?.[FIELD_MAP.en.houseName];

    if (idLabel && enLabel) {
      aliasMap.set(normalize(idLabel), enLabel);
      aliasMap.set(normalize(enLabel), idLabel);
    }

    if (idName && enName) {
      aliasMap.set(normalize(idName), enName);
      aliasMap.set(normalize(enName), idName);
    }
  }

  return aliasMap;
}

const aliasMap = buildAliasMap();

function findHouseInDataset(dataset, language, houseName) {
  const records = toRecordList(dataset);
  const nameField = getNameField(language);
  const target = normalize(houseName);

  let record = records.find((item) => normalize(item?.[FIELD_MAP[language].label]) === target);
  if (record) return record;

  record = records.find((item) => normalize(item?.[nameField]) === target);
  if (record) return record;

  record = records.find((item) => normalize(item?.[FIELD_MAP[language].tribe]) === target);
  if (record) return record;

  record = records.find((item) => normalize(item?.[FIELD_MAP[language].label]).includes(target));
  if (record) return record;

  record = records.find((item) => normalize(item?.[nameField]).includes(target));
  if (record) return record;

  record = records.find((item) => target.includes(normalize(item?.[nameField])));
  if (record) return record;

  return null;
}

function resolveHouseRecord(houseName, language = 'id') {
  if (!houseName) return null;

  const primaryDataset = getDataset(language);
  const primaryMatch = findHouseInDataset(primaryDataset, language, houseName);
  if (primaryMatch) return primaryMatch;

  const translatedName = aliasMap.get(normalize(houseName));
  if (translatedName) {
    const translatedMatch = findHouseInDataset(primaryDataset, language, translatedName);
    if (translatedMatch) return translatedMatch;
  }

  const alternateLanguage = language === 'en' ? 'id' : 'en';
  const alternateDataset = getDataset(alternateLanguage);
  const alternateMatch = findHouseInDataset(alternateDataset, alternateLanguage, houseName);
  if (alternateMatch) {
    const alternateName = alternateMatch[getNameField(alternateLanguage)];
    const mappedName = aliasMap.get(normalize(alternateName));
    if (mappedName) {
      const mappedMatch = findHouseInDataset(primaryDataset, language, mappedName);
      if (mappedMatch) return mappedMatch;
    }
  }

  return null;
}

export const getAllHouses = (language = 'id') => {
  return getDataset(language);
};

export const getHouseDetails = (houseName, language = 'id') => {
  const house = resolveHouseRecord(houseName, language);
  if (!house) return null;

  return {
    label: getField(house, language, 'label'),
    nama: getField(house, language, 'houseName'),
    suku: getField(house, language, 'tribe'),
    deskripsi: getField(house, language, 'description'),
    spesifikasi: getField(house, language, 'physical'),
    pantangan: getField(house, language, 'taboos'),
    kesakralan: getField(house, language, 'sacredness'),
    material: getField(house, language, 'materials'),
    proses: getField(house, language, 'process'),
    filosofi: getField(house, language, 'philosophy'),
    tataKrama: getField(house, language, 'etiquette'),
  };
};
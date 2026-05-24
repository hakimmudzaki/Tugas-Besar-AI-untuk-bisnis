import React, { createContext, useContext, useMemo, useState } from 'react';

export const TEXTS = {
  id: {
    common: {
      back: '← Kembali',
      comingSoon: 'Segera Hadir',
      getStarted: 'Mulai Sekarang',
      startExploring: 'Mulai Menjelajah',
      learnMore: 'Pelajari Selengkapnya',
      learnMoreArrow: 'Pelajari Selengkapnya →',
      tryAgain: 'Coba Lagi',
      activateCamera: 'Aktifkan Kamera',
      analyze: 'Menganalisis...',
      cameraPreparing: 'Menyiapkan kamera...',
      cameraReady: 'Menyiapkan Kamera...',
      send: 'Kirim',
      typing: 'Sedang mengetik...',
      loading: 'Memuat...',
      english: 'EN',
      indonesian: 'IDN',
    },
    landing: {
      heroSubtitle: 'Panduan di dalam genggamanmu!',
      heroDescription: 'Pindai dan jelajahi budaya Indonesia dengan mudah',
      readyTitle: 'Siap Menjelajah?',
      readyDescription: 'Bergabunglah dengan ribuan orang yang menemukan kekayaan budaya Indonesia',
      footerText: 'Pindai dan Jelajahi Budaya Indonesia',
      introButton: 'Mulai',
      subtitle: 'Panduan di dalam genggamanmu!',
      description: 'Pindai dan jelajahi budaya Indonesia dengan mudah',
    },
    home: {
      title: 'AKSANUSA',
      subtitle: 'Pilih kategori yang ingin dijelajahi',
      architecture: {
        title: 'Arsitektur',
        description: 'Jelajahi rumah adat Indonesia',
      },
      chatbot: {
        title: 'Chatbot',
        description: 'Tanya jawab tentang budaya',
      },
      food: {
        title: 'Makanan',
        description: 'Pelajari makanan tradisional',
      },
      aboutTitle: 'Tentang AKSANUSA',
      aboutText:
        'Aplikasi ini dirancang untuk membantu Anda menjelajahi kekayaan budaya Indonesia. Dari arsitektur tradisional hingga kuliner, semuanya ada di sini!',
    },
    architecture: {
      headerTitle: 'Arsitektur Tradisional',
      title: 'Rumah Adat Indonesia',
      description:
        'Rumah adat Indonesia merupakan warisan budaya yang kaya dan beragam. Setiap daerah memiliki arsitektur unik yang mencerminkan nilai-nilai budaya, iklim, dan bahan baku lokal yang tersedia.',
      sectionTitle: 'Karakteristik Utama',
      bullet1: 'Desain yang disesuaikan dengan iklim tropis',
      bullet2: 'Menggunakan bahan-bahan alami lokal',
      bullet3: 'Penuh dengan ornamen dan makna filosofi',
      ctaText: 'Jelajahi lebih banyak tentang arsitektur tradisional',
      ctaButton: 'Pelajari Selengkapnya →',
      headerBack: 'Kembali',
      defaultTitle: 'Jelajah Arsitektur',
      instruction: 'Posisikan rumah adat di tengah frame untuk hasil identifikasi yang lebih akurat',
      descriptionLabel: 'Deskripsi',
      permissionTitle: 'Akses kamera belum aktif',
      permissionText:
        'Aktifkan izin kamera untuk melihat preview langsung dan mengambil foto rumah adat.',
      permissionButton: 'Aktifkan Kamera',
      loading: 'Menyiapkan kamera...',
      analyzing: 'Menganalisis...',
      capture: 'Ambil Foto',
      tryAgain: 'Coba Lagi',
      tipsTitle: 'Tips',
      tip1: 'Pastikan pencahayaan cukup',
      tip2: 'Ambil foto dari depan bangunan',
      tip3: 'Hindari bayangan yang terlalu gelap',
      tip4: 'Foto hanya satu rumah adat dengan jelas',
      foundInfoTitle: 'Informasi Rumah Adat',
      confidencePrefix: 'Kepercayaan',
      infoNotFound: 'Rumah adat tidak ditemukan dalam database',
      infoNotFoundDesc:
        'Model berhasil mendeteksi gambar, tetapi data detail rumah adat belum tersedia di database.',
      errorAnalyzePrefix: 'Gagal menganalisis: ',
      cameraNotReady: 'Kamera masih menyiapkan preview, coba lagi sebentar.',
      cameraWait: 'Kamera belum siap, coba beberapa saat lagi.',
      cameraPermissionNeed: 'Aktifkan akses kamera untuk menampilkan preview dan mengambil foto rumah adat.',
      details: {
        label: 'Label',
        tribe: 'Suku / Etnis',
        description: 'Deskripsi Singkat',
        physical: 'Spesifikasi Fisik',
        taboos: 'Material Terlarang / Pantangan Adat',
        sacredness: 'Tingkat Kesakralan',
        materials: 'Material & Teknik Konstruksi',
        process: 'Proses & Ritual Pembangunan',
        philosophy: 'Filosofi & Sejarah',
        etiquette: 'Tata Krama & Aturan Masuk / Tinggal',
        noData: 'Data belum tersedia',
      },
    },
    chatbot: {
      title: 'Chatbot AKSANUSA',
      initialMessage: 'Halo! Saya adalah chatbot AKSANUSA. Tanyakan apa saja tentang masakan Nusantara dan arsitektur Nusantara!',
      placeholder: 'Ketik pertanyaan Anda...',
      send: 'Kirim',
      typing: 'Sedang mengetik...',
      fallbackError: 'Maaf, terjadi kesalahan saat menghubungi layanan AI.',
      guidance:
        'Saya hanya akan menjawab pertanyaan tentang masakan Nusantara dan arsitektur Nusantara.',
    },
    food: {
      headerBack: 'Kembali',
      defaultTitle: 'Kenali Makananmu',
      instruction: 'Posisikan makanan di tengah frame untuk hasil identifikasi yang lebih akurat',
      descriptionLabel: 'Deskripsi',
      permissionTitle: 'Akses kamera belum aktif',
      permissionText:
        'Aktifkan izin kamera untuk melihat preview langsung dan mengambil foto makanan.',
      permissionButton: 'Aktifkan Kamera',
      loading: 'Menyiapkan kamera...',
      analyzing: 'Menganalisis...',
      capture: 'Ambil Foto',
      tryAgain: 'Coba Lagi',
      tipsTitle: 'Tips',
      tip1: 'Pastikan pencahayaan cukup',
      tip2: 'Ambil foto dari depan makanan',
      tip3: 'Hindari bayangan yang terlalu gelap',
      tip4: 'Foto hanya makanan tanpa piring lain',
      foundInfoTitle: 'Informasi Makanan',
      confidencePrefix: 'Kepercayaan',
      infoNotFound: 'Makanan tidak ditemukan dalam database',
      infoNotFoundDesc:
        'Model berhasil mendeteksi gambar, tetapi data detail makanan belum tersedia di database.',
      errorAnalyzePrefix: 'Gagal menganalisis: ',
      cameraNotReady: 'Kamera masih menyiapkan preview, coba lagi sebentar.',
      cameraWait: 'Kamera belum siap, coba beberapa saat lagi.',
      cameraPermissionNeed: 'Aktifkan akses kamera untuk menampilkan preview dan mengambil foto.',
      details: {
        origin: 'Daerah Asal',
        spice: 'Tingkat Pedas',
        ingredients: 'Bahan Utama & Rempah',
        howToMake: 'Cara Membuat',
        nutrition: 'Estimasi Kalori & Nutrisi',
        allergens: 'Alergen',
        philosophy: 'Filosofi & Sejarah',
        etiquette: 'Cara Makan Tradisional',
        noAllergen: 'Tidak ada alergen utama',
      },
    },
  },
  en: {
    common: {
      back: '← Back',
      comingSoon: 'Coming Soon',
      getStarted: 'Get Started',
      startExploring: 'Start Exploring',
      learnMore: 'Learn More',
      learnMoreArrow: 'Learn More →',
      tryAgain: 'Try Again',
      activateCamera: 'Activate Camera',
      analyze: 'Analyzing...',
      cameraPreparing: 'Preparing camera...',
      cameraReady: 'Preparing Camera...',
      send: 'Send',
      typing: 'Typing...',
      loading: 'Loading...',
      english: 'EN',
      indonesian: 'IDN',
    },
    landing: {
      heroSubtitle: 'The guide in your pocket!',
      heroDescription: 'Scan and explore Indonesian culture with ease',
      readyTitle: 'Ready to Explore?',
      readyDescription: 'Join thousands discovering Indonesia’s cultural treasures',
      footerText: 'Scan and Explore Indonesian Culture',
      introButton: 'Start',
      subtitle: 'The guide in your pocket!',
      description: 'Scan and explore Indonesian culture with ease',
    },
    home: {
      title: 'AKSANUSA',
      subtitle: 'Choose a category to explore',
      architecture: {
        title: 'Architecture',
        description: 'Explore Indonesian traditional houses',
      },
      chatbot: {
        title: 'Chatbot',
        description: 'Ask about Indonesian culture',
      },
      food: {
        title: 'Food',
        description: 'Learn traditional Indonesian dishes',
      },
      aboutTitle: 'About AKSANUSA',
      aboutText:
        'This app is designed to help you explore Indonesia’s rich culture. From traditional architecture to culinary heritage, it is all here!',
    },
    architecture: {
      headerTitle: 'Traditional Architecture',
      title: 'Indonesian Traditional Houses',
      description:
        'Indonesian traditional houses are rich and diverse cultural heritage. Each region has a unique architecture reflecting cultural values, climate, and local materials.',
      sectionTitle: 'Key Characteristics',
      bullet1: 'Design adapted to tropical climate',
      bullet2: 'Uses local natural materials',
      bullet3: 'Filled with ornaments and philosophical meaning',
      ctaText: 'Explore more about traditional architecture',
      ctaButton: 'Learn More →',
      headerBack: 'Back',
      defaultTitle: 'Explore Architecture',
      instruction: 'Place the traditional house in the center of the frame for more accurate identification',
      descriptionLabel: 'Description',
      permissionTitle: 'Camera access is not enabled',
      permissionText:
        'Enable camera permission to preview live and take photos of traditional houses.',
      permissionButton: 'Enable Camera',
      loading: 'Preparing camera...',
      analyzing: 'Analyzing...',
      capture: 'Capture Photo',
      tryAgain: 'Try Again',
      tipsTitle: 'Tips',
      tip1: 'Make sure the lighting is sufficient',
      tip2: 'Take the photo from the front of the building',
      tip3: 'Avoid very dark shadows',
      tip4: 'Take a clear photo of a single traditional house',
      foundInfoTitle: 'Traditional House Information',
      confidencePrefix: 'Confidence',
      infoNotFound: 'Traditional house not found in database',
      infoNotFoundDesc:
        'The model detected the image, but the traditional house detail data is not yet available in the database.',
      errorAnalyzePrefix: 'Failed to analyze: ',
      cameraNotReady: 'The camera is still preparing the preview, please try again in a moment.',
      cameraWait: 'The camera is not ready yet, please wait a little longer.',
      cameraPermissionNeed: 'Enable camera access to show the preview and capture traditional house photos.',
      details: {
        label: 'Label',
        tribe: 'Tribe / Ethnic Group',
        description: 'Short Description',
        physical: 'Physical Specifications',
        taboos: 'Forbidden Materials / Sacred Taboos',
        sacredness: 'Sacredness Level',
        materials: 'Materials & Construction Techniques',
        process: 'Building Process & Rituals',
        philosophy: 'Philosophy & History',
        etiquette: 'Etiquette & Rules for Entering / Living',
        noData: 'No data available',
      },
    },
    chatbot: {
      title: 'AKSANUSA Chatbot',
      initialMessage: 'Hello! I am the AKSANUSA chatbot. Ask me anything about Nusantara cuisine and Nusantara architecture!',
      placeholder: 'Type your question...',
      send: 'Send',
      typing: 'Typing...',
      fallbackError: 'Sorry, an error occurred while contacting the AI service.',
      guidance: 'I will only answer questions about Nusantara cuisine and Nusantara architecture.',
    },
    food: {
      headerBack: 'Back',
      defaultTitle: 'Discover Your Food',
      instruction: 'Place the food in the center of the frame for more accurate identification',
      descriptionLabel: 'Description',
      permissionTitle: 'Camera access is not enabled',
      permissionText: 'Enable camera permission to preview live and take food photos.',
      permissionButton: 'Enable Camera',
      loading: 'Preparing camera...',
      analyzing: 'Analyzing...',
      capture: 'Capture Photo',
      tryAgain: 'Try Again',
      tipsTitle: 'Tips',
      tip1: 'Make sure the lighting is sufficient',
      tip2: 'Take the photo from the front of the food',
      tip3: 'Avoid very dark shadows',
      tip4: 'Take a photo of the food only, without other plates',
      foundInfoTitle: 'Food Information',
      confidencePrefix: 'Confidence',
      infoNotFound: 'Food not found in database',
      infoNotFoundDesc:
        'The model detected the image, but the food detail data is not yet available in the database.',
      errorAnalyzePrefix: 'Failed to analyze: ',
      cameraNotReady: 'The camera is still preparing the preview, please try again in a moment.',
      cameraWait: 'The camera is not ready yet, please wait a little longer.',
      cameraPermissionNeed: 'Enable camera access to show the preview and capture food photos.',
      details: {
        origin: 'Origin',
        spice: 'Spice Level',
        ingredients: 'Main Ingredients & Spices',
        howToMake: 'How to Make',
        nutrition: 'Calories & Nutrition',
        allergens: 'Allergens',
        philosophy: 'Philosophy & History',
        etiquette: 'Traditional Eating Style',
        noAllergen: 'No major allergens',
      },
    },
  },
};

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('id');

  const value = useMemo(() => {
    const currentTexts = TEXTS[language] || TEXTS.id;

    const t = (path) => {
      const segments = String(path).split('.');
      let current = currentTexts;
      for (const segment of segments) {
        if (!current || typeof current !== 'object') return path;
        current = current[segment];
      }
      return current ?? path;
    };

    return {
      language,
      setLanguage,
      toggleLanguage: () => setLanguage((prev) => (prev === 'id' ? 'en' : 'id')),
      isEnglish: language === 'en',
      isIndonesian: language === 'id',
      t,
      texts: currentTexts,
    };
  }, [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used inside LanguageProvider');
  }
  return context;
}

export function getLanguageText(language) {
  return TEXTS[language] || TEXTS.id;
}

const baseConfig = require('./app.json');

const geminiApiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';

module.exports = {
  expo: {
    ...baseConfig.expo,
    extra: {
      ...(baseConfig.expo.extra || {}),
      geminiApiKey,
    },
  },
};
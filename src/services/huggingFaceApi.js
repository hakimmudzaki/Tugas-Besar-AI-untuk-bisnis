const HF_API_URL = 'https://api-inference.huggingface.co/models/hakimgans/indonesia_food_model';
const HF_API_KEY = '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';

export const queryHuggingFaceModel = async (imageUri) => {
  try {
    const imageResponse = await fetch(imageUri);
    const imageBlob = await imageResponse.blob();

    // Send to Hugging Face API
    const result = await fetch(HF_API_URL, {
      headers: {
        Authorization: `Bearer ${HF_API_KEY}`,
        'Content-Type': 'application/octet-stream',
      },
      method: 'POST',
      body: imageBlob,
    });

    const data = await result.json();

    if (!result.ok) {
      throw new Error(data?.error || 'Hugging Face API returned an error');
    }

    if (data?.error === 'Model hakimgans/indonesia_food_model is currently loading') {
      throw new Error('Model masih loading, coba beberapa detik lagi.');
    }

    // Parse response - typically returns array of predictions
    if (Array.isArray(data) && data.length > 0) {
      // Get the top prediction (highest confidence)
      const topPrediction = data[0];
      return {
        foodName: topPrediction.label || 'Unknown',
        confidence: topPrediction.score || 0,
        predictions: data,
      };
    }

    return null;
  } catch (error) {
    console.error('Error querying Hugging Face API:', error);
    throw error;
  }
};

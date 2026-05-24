const FOOD_GRADIO_API_URL = 'https://hakimgans-indonesia-food-model.hf.space';
const ARCHITECTURE_GRADIO_API_URL = 'https://hakimgans-indonesia-architecture-model.hf.space';

async function uploadAndPredict({ baseUrl, imageUri, predictEndpoint, lowConfidenceMessage }) {
  try {
    const formData = new FormData();

    formData.append('files', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'image.jpg',
    });

    const uploadRes = await fetch(`${baseUrl}/gradio_api/upload`, {
      method: 'POST',
      body: formData,
    });

    console.log('UPLOAD STATUS:', uploadRes.status);

    const uploadData = await uploadRes.json();
    console.log('UPLOAD DATA:', uploadData);

    const uploadedPath = uploadData?.[0];
    if (!uploadedPath) {
      throw new Error('Upload gambar gagal');
    }

    const predictRes = await fetch(`${baseUrl}/gradio_api/call/${predictEndpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: [
          {
            path: uploadedPath,
          },
        ],
      }),
    });

    console.log('PREDICT STATUS:', predictRes.status);

    const predictData = await predictRes.json();
    console.log('PREDICT DATA:', predictData);

    const eventId = predictData?.event_id;
    if (!eventId) {
      throw new Error('Prediksi gagal dimulai');
    }

    const resultRes = await fetch(`${baseUrl}/gradio_api/call/${predictEndpoint}/${eventId}`);
    const resultText = await resultRes.text();
    console.log('RAW RESULT:', resultText);

    const lines = resultText.split('\n');
    let finalResult = null;

    for (const line of lines) {
      if (line.startsWith('data:')) {
        const jsonStr = line.replace('data:', '').trim();

        try {
          finalResult = JSON.parse(jsonStr);
        } catch (error) {}
      }
    }

    if (!finalResult) {
      throw new Error('Prediksi gagal diparse');
    }

    let predictedLabel = 'Unknown';
    let confidence = 0;

    if (Array.isArray(finalResult)) {
      if (finalResult.length > 0 && typeof finalResult[0] === 'object' && finalResult[0] !== null) {
        predictedLabel = finalResult[0].label || predictedLabel;
        confidence = Number(finalResult[0]?.confidences?.[0]?.confidence || 0);
      } else {
        predictedLabel = finalResult[0] || predictedLabel;
        confidence = Number(finalResult[1] || 0);
      }
    } else if (typeof finalResult === 'object') {
      predictedLabel = finalResult.label || predictedLabel;
      confidence = Number(finalResult.confidence || finalResult.score || 0);
    }

    if (confidence < 0.5) {
      throw new Error(lowConfidenceMessage);
    }

    return {
      foodName: predictedLabel,
      confidence,
      raw: finalResult,
    };
  } catch (error) {
    console.error('Error querying Gradio API:', error);
    throw error;
  }
}

export const queryHuggingFaceModel = async (imageUri) => {
  return uploadAndPredict({
    baseUrl: FOOD_GRADIO_API_URL,
    imageUri,
    predictEndpoint: 'predict_food',
    lowConfidenceMessage:
      'Confidence prediksi di bawah 50%. Foto kemungkinan kurang tepat atau objek makanan tidak terlihat jelas, silakan ulangi pengambilan foto.',
  });
};

export const queryArchitectureHuggingFaceModel = async (imageUri) => {
  return uploadAndPredict({
    baseUrl: ARCHITECTURE_GRADIO_API_URL,
    imageUri,
    predictEndpoint: 'predict_food',
    lowConfidenceMessage:
      'Confidence prediksi di bawah 50%. Foto kemungkinan kurang tepat atau objek rumah adat tidak terlihat jelas, silakan ulangi pengambilan foto.',
  });
};
const GRADIO_API_URL =
  'https://hakimgans-indonesia-food-model.hf.space';

export const queryHuggingFaceModel = async (imageUri) => {
  try {
    // Ambil image blob
    const imageResponse = await fetch(imageUri);
    const imageBlob = await imageResponse.blob();

    // Upload file ke gradio
    const formData = new FormData();

    formData.append('files', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'image.jpg',
    });

    // 1. Upload file
    const uploadRes = await fetch(
      `${GRADIO_API_URL}/gradio_api/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    console.log('UPLOAD STATUS:', uploadRes.status);

    const uploadData = await uploadRes.json();

    console.log('UPLOAD DATA:', uploadData);

    const uploadedPath = uploadData[0];

    // 2. Predict
    const predictRes = await fetch(
      `${GRADIO_API_URL}/gradio_api/call/predict_food`,
      {
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
      }
    );

    console.log('PREDICT STATUS:', predictRes.status);

    const predictData = await predictRes.json();

    console.log('PREDICT DATA:', predictData);

    const eventId = predictData.event_id;

    // 3. Ambil hasil
    const resultRes = await fetch(
      `${GRADIO_API_URL}/gradio_api/call/predict_food/${eventId}`
    );

    const resultText = await resultRes.text();

    console.log('RAW RESULT:', resultText);

    // Parse SSE
    const lines = resultText.split('\n');

    let finalResult = null;

    for (const line of lines) {
      if (line.startsWith('data:')) {
        const jsonStr = line.replace('data:', '').trim();

        try {
          finalResult = JSON.parse(jsonStr);
        } catch (e) {}
      }
    }

    if (!finalResult) {
      throw new Error('Prediksi gagal diparse');
    }

    const confidence = Number(finalResult[1] || 0);

    if (confidence < 0.5) {
      throw new Error(
        'Confidence prediksi di bawah 50%. Foto kemungkinan kurang tepat atau objek makanan tidak terlihat jelas, silakan ulangi pengambilan foto.'
      );
    }

    return {
      foodName: finalResult[0] || 'Unknown',
      confidence,
      raw: finalResult,
    };
  } catch (error) {
    console.error('Error querying Gradio API:', error);
    throw error;
  }
};
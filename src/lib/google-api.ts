import { GoogleGenAI } from '@google/genai';

export const makeRequestToGoogleAI = async (imageBase64: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const contents = [
    {
      inlineData: {
        mimeType: 'image/jpeg',
        data: imageBase64,
      },
    },
    { text: 'Return only number this image' },
  ];

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: contents,
  });
  return response.text;
};

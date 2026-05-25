import axios from 'axios';

const openrouter = axios.create({
  baseURL: 'https://openrouter.ai/api/v1',
  headers: {
    'Authorization': `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

export const getAIResponse = async (prompt) => {
  if (!import.meta.env.VITE_OPENROUTER_API_KEY) {
    console.warn('OpenRouter API key not configured.');
    return null;
  }

  try {
    const response = await openrouter.post('/chat/completions', {
      model: 'openai/gpt-3.5-turbo', // Or any other model
      messages: [{ role: 'user', content: prompt }],
    });
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error fetching from OpenRouter:', error);
    return null;
  }
};

export const getMoodPlaylist = async (mood) => {
  const prompt = `Generate a playlist of 10 songs for a "${mood}" mood. Provide the response as a JSON array of objects, where each object has "title" and "artist" properties.`;
  const response = await getAIResponse(prompt);
  if (response) {
    try {
      return JSON.parse(response);
    } catch (error) {
      console.error('Error parsing AI response:', error);
      return null;
    }
  }
  return null;
};

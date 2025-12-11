import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions();

export const getAIResponse = async (prompt: string, language: string): Promise<string> => {
  try {
    const getAIResponse = httpsCallable(functions, 'getAIResponse');
    const result = await getAIResponse({ prompt, language });
    const { text } = result.data as { text: string };
    return text;
  } catch (error) {
    console.error('Firebase Functions Error:', error);
    return 'Service temporarily unavailable.';
  }
};

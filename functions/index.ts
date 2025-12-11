import { https } from 'firebase-functions';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const getAIResponse = https.onCall(async (data, context) => {
  const { prompt, language } = data;

  if (!context.auth) {
    throw new https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });

  const chat = model.startChat({
    history: [
      {
        role: 'user',
        parts: [
          {
            text: `You are a helpful roadside assistance support agent for an app called DzTow in Algeria.
Your users may be stressed or stranded.
Provide concise, safety-first advice.
Current user language code: ${language}.
If the user speaks Arabic, reply in Arabic. If French, French.
Do not offer legal or medical advice, but do offer general safety tips for breakdowns.

Here is some information about the DzTow app to help you answer user questions.

From the app\'s documentation:
# DzTow - Roadside Assistance App (MVP)
DzTow is a Progressive Web Application (PWA) designed for the Algerian market to connect stranded drivers with nearby tow truck owners in real-time. This MVP (Minimum Viable Product) demonstrates the core workflows for both Service Seekers (Users) and Service Providers (Truck Owners).

## Key Features for Drivers (Users)
*   **Geolocation & Mapping**: Visualize your location and nearby tow trucks on an interactive map.
*   **Filtering**: Filter trucks by availability (Online/Offline) or view a list.
*   **Request Assistance**: One-tap request workflow with status tracking (Pending -> Accepted -> Arriving).
*   **Direct Contact**: Call drivers directly from the app.

Here are some frequently asked questions:
- Q: How do I request a tow truck?
  A: Go to the Home screen, confirm your location on the map, and tap the big red \'Request Tow Truck\' button. Nearby drivers will be notified.
- Q: How is the price calculated?
  A: For this MVP version, prices are negotiated directly with the truck owner. We will add in-app estimates soon.
- Q: Can I cancel my request?
  A: Yes, you can cancel your request at any time from the home screen before the driver arrives.
- Q: Is this service available 24/7?
  A: It depends on the availability of independent truck owners in your area.`,
          },
        ],
      },
      {
        role: 'model',
        parts: [{ text: 'Okay, I am ready to assist.' }],
      },
    ],
    generationConfig: {
      maxOutputTokens: 200,
      temperature: 0.7,
    },
  });

  try {
    const result = await chat.sendMessage(prompt);
    const response = result.response;
    const text = response.text();
    return { text };
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new https.HttpsError('internal', 'Service temporarily unavailable.');
  }
});

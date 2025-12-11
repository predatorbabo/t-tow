# Architecture & Technical Decisions

This document outlines the architectural choices made during the development of the DzTow MVP.

## 1. Core Architecture

### **Client-Side SPA**
The application is a Single Page Application (SPA) built with **React 19**.
*   **Decision**: We chose a client-side architecture for the MVP to ensure rapid prototyping and a modern, responsive user experience.
*   **Routing**: We use `react-router-dom` to handle client-side routing, allowing for seamless navigation between different views without full page reloads.

### **Vite Build Setup**
*   **Decision**: We utilize **Vite** as our build tool. It offers a fast development experience with Hot Module Replacement (HMR) and optimized production builds.
*   **Benefit**: This provides a modern, efficient development workflow and ensures the application is bundled and optimized for performance in production.

## 2. Key Components

### **Map Visualization (`MapVisualizer.tsx`)**
*   **Challenge**: Integrating heavy mapping libraries (Google Maps SDK, Leaflet) in a dependency-restricted environment.
*   **Solution**: We implemented a **custom tile renderer**.
    *   It uses **OpenStreetMap** (OSM) standard tiles.
    *   It implements **Web Mercator Projection** math manually to convert Latitude/Longitude to screen pixels.
    *   **Layering**: Supports switching between 'Normal' (OSM) and 'Roads' (CartoDB Light) layers.
    *   **Performance**: Uses CSS transforms for panning/zooming to ensure 60fps performance on mobile devices.

### **State Management**
*   **Global State**: `ThemeContext` handles app-wide visual preferences (Colors, Dark/Light mode concepts).
*   **Local State**: Features like Auth, Requests, and Chat rely on React `useState` and `useRef`.
*   **Data Persistence**: For the MVP, data is mocked in memory (`MOCK_OWNERS`). In a production app, this would be replaced by API calls to a backend (e.g., Firebase/Supabase).

### **Real-time Simulation**
*   **Chat**: The `OwnerChatPage` simulates a WebSocket connection using `setInterval` and `useEffect`. It creates a realistic feeling of incoming messages, typing indicators, and message delays.
*   **Requests**: The request lifecycle (Pending -> Accepted) is simulated using timeouts to mimic the network latency and driver response time.

## 3. Backend Services

With the progression from a local-only simulation, the application has integrated Firebase services to lay the foundation for a robust backend.

### **Firebase Integration**
*   **Firebase Firestore**: Integrated as the primary NoSQL database. Security rules (`firestore.rules`) are in place, following best practices to control access. These rules allow authenticated users to manage their own data (e.g., in a `users` collection) and permit public read access for shared content like FAQs, while restricting write access to authenticated users.
*   **Firebase Storage**: Integrated for storing user-generated content and other media assets. Security rules (`storage.rules`) are configured to allow authenticated users to upload and manage their own files (e.g., profile pictures) and to define controlled access for other content.
*   **Firebase Authentication**: The Firebase Authentication SDKs are integrated into the application. This sets the stage for implementing full user authentication flows, including features like SMS verification, to secure user access and personalize experiences.
*   **Firebase Cloud Functions**: A Firebase Cloud Function (`getAIResponse`) has been created to act as a secure proxy between the client and the Gemini API. This prevents the API key from being exposed on the client-side.

### **AI Integration**
*   **Google Gemini**: The application uses the Gemini API to provide an AI-powered assistant. The `getAIResponse` Cloud Function communicates with the Gemini API to get responses to user prompts.

## 4. Design System

### **Tailwind CSS**
*   **Usage**: Utility-first CSS allows for rapid UI development.
*   **Theming**: We use dynamic class construction (e.g., `bg-${primaryColor}-600`) to allow users to change the app's primary color at runtime.
*   **RTL Support**: The app dynamically applies the `.rtl` class to the container based on the selected language (Arabic), leveraging CSS logical properties or specific layout inversions.

## 5. Testing
*   **Framework**: We use **Jest** with **ts-jest** to test our components and utility functions.
*   **Configuration**: Jest is configured in `jest.config.js` to work with our TypeScript setup and module aliases.
*   **Environment**: We use `jsdom` to simulate a browser environment for our tests.
*   **Status**: Testing is currently **in progress**. While the framework is set up, a comprehensive suite of unit and integration tests is still under development.

## 6. What Works vs. Limitations

### **Works ✅**
*   Full Auth flow (UI/UX).
*   Map rendering, panning, zooming, and marker clustering logic.
*   Chat interface with rich features (location sharing, status).
*   AI-powered assistant.
*   Multilingual switching.
*   Responsive mobile layout.

### **Limitations (MVP) ⚠️**
*   **Data Persistence**: refreshing the page resets the state (User, Chat history).
*   **Real GPS**: The app simulates location sharing; it does not yet track the device's real-time GPS continuously in the background.
*   **Backend**: There is no database; interactions are local-only simulations.

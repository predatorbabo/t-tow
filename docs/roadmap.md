# Product Roadmap

## Phase 1: MVP (Completed) ✅
- [x] **Authentication**: Role selection, Phone input, Mock OTP verification.
- [x] **Mapping**: Custom map implementation with OSM tiles, User/Truck markers.
- [x] **Truck Discovery**: List view and Map view with filtering (Online/Offline).
- [x] **Request Flow**: Create request, Simulate driver acceptance.
- [x] **Owner Tools**: Dashboard for availability, Profile editing, Advanced Chat.
- [x] **Localization**: EN, FR, AR support with RTL.
- [x] **AI-Powered Assistance**: Get instant, helpful advice from a Gemini-powered AI assistant.

## Phase 2: Backend Integration (In Progress) 🚧
- [ ] **Database**: Migrate `MOCK_OWNERS` to a real database (Firebase Firestore or Supabase).
- [x] **Real Auth**: Integrate Firebase Auth for real SMS verification. (Firebase Auth SDKs integrated and security rules in place)
- [ ] **State Persistence**: Use Redux or Zustand to persist state across reloads.
- [ ] **API Layer**: Connect `handleRequest` and `handleSend` (Chat) to real API endpoints.
- [x] **Firebase Setup**: Configure and initialize all necessary Firebase services (Auth, Firestore, etc.).
- [x] **Gemini Integration**: A Firebase Cloud Function (`getAIResponse`) has been created to act as a secure proxy between the client and the Gemini API.
- [ ] **FAQs**: Plan to store FAQs in Firestore.

## Phase 3: Testing (In Progress) 🚧
- [ ] **Unit & Integration Tests**: Write and pass tests for all major components.
- [ ] **Test Script**: Add a `test` script to `package.json`.
- [ ] **Sample Tests**: Create initial test files for key components to establish a testing pattern.

## Phase 4: Advanced Geospatial Features 🌍
- [ ] **Live Tracking**: Implement WebSocket (Socket.io) to stream real driver location to the user map.
- [ ] **Routing**: Integrate a routing engine (OSRM or Google Directions API) to draw the path between User and Truck on the map.
- [ ] **Geofencing**: Alert owners only when a request is within their specific `serviceArea`.

## Phase 5: Commerce & Trust 💳
- [ ] **Payments**: Integration with local Algerian payment gateways (CIB/Edahabia) or cash-on-delivery tracking.
- [ ] **Ratings & Reviews**: Allow users to rate drivers after a service.
- [ ] **Verification**: Backend admin panel to verify uploaded driver documents (License, Insurance).

## Phase 6: Platform Expansion 📱
- [ ] **Native App**: Wrap the PWA using Capacitor or rewrite in React Native for Play Store deployment.
- [ ] **Offline Support**: Enhance Service Workers to allow full offline access to history and contacts.
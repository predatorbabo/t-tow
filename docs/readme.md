# DzTow - Roadside Assistance App (MVP)

**DzTow** is a Progressive Web Application (PWA) designed for the Algerian market to connect stranded drivers with nearby tow truck owners in real-time. This MVP (Minimum Viable Product) demonstrates the core workflows for both Service Seekers (Users) and Service Providers (Truck Owners).

## 🌟 Key Features

### For Drivers (Users)
*   **AI-Powered Assistance**: Get instant, helpful advice from a Gemini-powered AI assistant.
*   **Geolocation & Mapping**: Visualize your location and nearby tow trucks on an interactive map.
*   **Filtering**: Filter trucks by availability (Online/Offline) or view a list.
*   **Request Assistance**: One-tap request workflow with status tracking (Pending -> Accepted -> Arriving).
*   **Direct Contact**: Call drivers directly from the app.

### For Truck Owners
*   **Dashboard**: Manage availability status (Online/Offline) and edit truck details (Brand, Plate, Service Area).
*   **Owner Chat**: A state-of-the-art chat interface to coordinate with other fleet owners or colleagues, featuring typing indicators, read receipts, and location sharing.
*   **Request Management**: Receive simulated notifications for new tow jobs.

### General Features
*   **Frequently Asked Questions (FAQs)**: Access a dedicated section for common queries.
*   **Multilingual Support**: Full support for English, French, and Arabic (including RTL layout).
*   **Theming**: Customizable app themes (Primary colors, Font styles).
*   **Authentication**: Simulated Phone/OTP verification flow.

## 🚀 Getting Started

This project is built using React and TypeScript.

### Prerequisites
*   [Node.js](https://nodejs.org/) (v20.19.0 or higher)
*   [npm](https://www.npmjs.com/)

### Running the App
1.  **Clone the repository**
2.  **Install dependencies**: `npm install`
3.  **Run the development server**: `npm run dev`
4.  **Open the app** in your browser at the address provided by the development server.

### Login Credentials (Mock)
*   **User Role**: Phone: `0550...` (Any), OTP: `1234`
*   **Owner Role**: Phone: `0550...` (Any), OTP: `1234`

## 🛠 Tech Stack
*   **Frontend**: React 19, TypeScript
*   **Backend**: Firebase (Cloud Functions, Firestore, Storage, Authentication)
*   **AI**: Google Gemini
*   **Styling**: Tailwind CSS
*   **Icons**: Lucide React
*   **Routing**: React Router DOM
*   **Maps**: Custom implementation using OpenStreetMap Tiles
*   **Testing**: Jest, ts-jest

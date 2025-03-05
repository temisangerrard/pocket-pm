# Pocket PM

Your pocket product manager. Create PRDs, generate backlogs, and prioritize features with AI assistance.

## Features

- ✨ AI-powered PRD generation
- 📊 Intelligent backlog management
- 🎯 Feature prioritization with RICE scoring
- 📱 Mobile-responsive design

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase account

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/pocket-pm.git
   cd pocket-pm
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up Firebase configuration
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password and Google providers)
   - Create a web app in your Firebase project
   - Copy the Firebase configuration

4. Create a `.env` file in the root directory with the following variables:
   ```
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   VITE_FIREBASE_APP_ID=your-app-id
   ```

5. Start the development server
   ```bash
   npm run dev
   ```

## Authentication

The application uses Firebase Authentication for user management. The following authentication methods are supported:

- Email/Password authentication
- Google authentication

## Project Structure

- `client/`: Frontend React application
  - `src/`: Source code
    - `components/`: Reusable UI components
    - `hooks/`: Custom React hooks
    - `lib/`: Utility functions and configurations
    - `pages/`: Application pages
- `server/`: Backend Express server
  - `utils/`: Server utility functions
  - `routes.ts`: API routes
  - `auth.ts`: Authentication logic
  - `storage.ts`: Data storage logic

## Environment Variables

The application uses the following environment variables:

| Variable | Description |
|----------|-------------|
| `VITE_FIREBASE_API_KEY` | Firebase API Key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain |
| `VITE_FIREBASE_PROJECT_ID` | Firebase Project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket |
| `VITE_FIREBASE_APP_ID` | Firebase App ID |

## License

This project is licensed under the MIT License - see the LICENSE file for details. 
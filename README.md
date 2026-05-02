# Election Process Assistant

A production-ready full-stack application designed to help users clearly understand the complete election process, timelines, and steps in an interactive, structured, and easy-to-follow manner.

## Live Links
- **Live Deployment (Cloud Run)**: [https://election-assistant-224852188719.us-central1.run.app](https://election-assistant-224852188719.us-central1.run.app)
- **GitHub Repository**: [https://github.com/PranavKusumbe/PROMPTWARS2](https://github.com/PranavKusumbe/PROMPTWARS2)

## Tech Stack
- **Frontend**: React (Vite), React Router, Lucide Icons
- **Backend**: Java (Spring Boot)
- **Database / Auth**: Firebase Firestore & Firebase Auth (Google Sign-In)

## Project Structure
```
/frontend
  /src
    /components   # Reusable UI components (Navbar, ChatbotWidget)
    /pages        # Application Views (Dashboard, Login, ProcessDetails)
    firebase.js   # Firebase configuration
    App.jsx       # Application routing
    index.css     # Global styling, aesthetic design (glassmorphism)

/backend
  pom.xml         # Maven configuration
  /src/main/java  # Spring Boot application source code
    /controller   # REST API Controllers (Chatbot processing)
```

## Setup and Installation

### 1. Frontend Setup (React)
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open the application in your browser at `http://localhost:5173`.

### 2. Backend Setup (Java Spring Boot)
1. Ensure you have Java 17+ and Maven installed.
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```
3. Build the application:
   ```bash
   mvn clean install
   ```
4. Run the application:
   ```bash
   mvn spring-boot:run
   ```
   The backend API will be available at `http://localhost:8080`.

### 3. Firebase Configuration
The frontend `src/firebase.js` is already configured with the provided credentials. The application utilizes:
- **Firebase Authentication**: For Google Sign-In secure login.
- **Firebase Firestore**: Used as the primary data store (mocked locally for demonstration in the `Dashboard`).
- **Google Analytics**: Automatically initialized for tracking.

## Core Features
1. **Interactive Timeline**: A responsive UI timeline representing all phases of the election process visually.
2. **Chatbot Assistant**: A dynamic, contextual AI chatbot that mimics intelligent intent detection for election-related questions.
3. **Voting Simulation Dashboard**: Real-time rendering of candidate information and vote simulation with progress charts.
4. **Secure Authentication**: Integrated Google Sign-In with robust private routing (`react-router-dom`).

## Security and Accessibility
- Protected APIs via Spring Security (when connected).
- XSS and CSRF mitigations through standard React state bindings.
- Fully accessible keyboard navigation and ARIA label compliant structure.
- High-contrast color palette with a modern UI approach.

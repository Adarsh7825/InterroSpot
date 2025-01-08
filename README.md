# Interospot - On-Demand Interview Platform

**Interospot** is an on-demand interview platform designed to streamline technical interview processes for companies hiring for software engineering roles. By utilizing Interospot, companies can leverage external engineers to interview candidates and provide insightful evaluations, all without expending internal resources on interview bandwidth. Our platform enables rapid interview scheduling, a collaborative coding environment, and comprehensive interview recording, making the process efficient and secure.

## Key Features
- **Rapid Scheduling:** Schedule interviews within 38 minutes of request, even for large candidate pools.
- **Secure Candidate Verification:** Ensures candidate and interviewer security with pre-interview photo verification.
- **Collaborative Coding & Whiteboard:** Real-time coding editor and whiteboard to facilitate technical assessments.
- **Customizable Question Sets:** Questions are auto-selected based on the job position and skill requirements, with additional options for custom questions.
- **End-to-End Documentation:** Video recordings and structured feedback generated in a downloadable PDF for review by recruiters.

---

## Table of Contents
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Features Overview](#features-overview)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

---

## Project Structure
```
Interospot
│
├── client                  # Frontend built with React
│   ├── src
│   │   ├── components      # Reusable UI components
│   │   ├── pages           # Page components (e.g., RecruiterForm, RoomPage)
│   │   ├── store           # Redux store for state management
│   │   └── styles          # CSS and styling files
│   └── public              # Static assets
│
└── server                  # Backend server built with Node.js and Express
    ├── config              # Configuration files (e.g., database)
    ├── controllers         # Route controllers
    ├── models              # Database models (e.g., Interview, User)
    ├── routes              # API routes
    └── utils               # Utility functions and middleware
```

## Tech Stack
### Client
- **React** for the user interface
- **Redux** for state management
- **Tailwind CSS** for styling
- **Socket.IO** for real-time communication
- **WebRTC** for video calls

### Server
- **Node.js** and **Express** for the backend API
- **MongoDB** for the database
- **Socket.IO** for real-time communication
- **Multer** for handling file uploads
- **Mongoose** for MongoDB object modeling

---

## Getting Started
### Prerequisites
- Node.js and npm installed
- MongoDB database (local or remote)

### Installation
1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/interospot.git
   cd interospot
   ```

2. **Install dependencies**
   ```bash
   # In the root directory, install server dependencies
   npm install

   # Navigate to client directory and install dependencies
   cd client
   npm install
   ```

3. **Set up environment variables**

   Create `.env` files in both the root and client directories with necessary environment variables like MongoDB URI, JWT secret, and API keys as needed.

4. **Start the application**
   ```bash
   # In the root directory, start the server
   npm run dev

   # In the client directory, start the client
   cd client
   npm start
   ```

5. **Access the application**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000`

---

## Features Overview
1. **Recruiter Dashboard**
   - Request interviews for multiple candidates.
   - Upload candidate data via CSV or manually.
   - Schedule interviews based on job position, category, and required skills.
   - Automated email notifications to candidates and interviewers.

2. **Interview Room**
   - Real-time coding editor with language support and input/output console.
   - Whiteboard for architecture and flow diagramming.
   - Integrated video call for live interaction.
   - Security features to prevent external monitor usage or tab switching.

3. **Automated Feedback and Documentation**
   - Real-time question generation based on job category.
   - Rating and feedback collection from the interviewer.
   - PDF generation with interview details, ratings, and final recommendations.

---

## Screenshots
https://github.com/Adarsh7825/InterroSpot/assets/109406757/59d9a966-95bf-4c70-88ed-8bc4e4b28e93



---

## Contributing
We welcome contributions from the community! If you find a bug or have a feature request, please open an issue or create a pull request. Be sure to follow our contribution guidelines and code of conduct.

---

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Interospot** simplifies technical hiring, ensuring candidates are assessed effectively while saving engineering resources. Get started with Interospot to enhance your hiring process with speed and reliability.

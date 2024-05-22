# ICU2 Foundation

## Overview
The ICU2 foundation app is a comprehensive web application designed to help the ICU2 Foundation manage medical testing Boot Camps. The system allows Super Admins to have complete control over the setup and management of Boot Camps, which can be associated with specific schools and include various personnel such as project coordinators, medical professionals, and volunteers. The platform aims to provide real-time insights and detailed reports, facilitating efficient management and analysis of Boot Camp activities.

## Technologies Used

### Frontend
- **Framework:** Next.js
- **Unit Testing:** Jest

### Backend
- **Language:** TypeScript
- **Framework:** Node.js with Express
- **Database:** MongoDB
- **Unit Testing:** Jest

## Project Structure

### Directory Layout
The project repository is structured to include both the frontend and backend codebases.

```
icu2-project/
├── frontend/
│   ├── pages/
│   ├── components/
│   ├── styles/
│   ├── public/
│   ├── tests/
│   ├── package.json
├── backend/
│   ├── src/
│   │   ├── common/
│   │   ├── config/
│   │   ├── utils/
│   │   ├── middleware/
│   │   ├── auth/
│   |   |   └── __test__/
│   │   |   ├── auth.controller.ts
│   │   |   ├── auth.route.ts
│   │   |   ├── auth.service.ts
│   │   |   ├── auth.validation.ts
│   │   ├── user/
│   |   |   └── __test__/
│   |   |   └── interface/
│   │   |   ├── user.controller.ts
│   │   |   ├── user.route.ts
│   │   |   ├── user.service.ts
│   │   |   ├── user.model.ts
│   │   ├── school/
│   |   |   └── __test__/
│   |   |   └── interface/
│   │   |   ├── school.controller.ts
│   │   |   ├── school.route.ts
│   │   |   ├── school.service.ts
│   │   |   ├── school.model.ts
│   ├── route.ts
│   ├── server.ts
│   ├── package.json
├── .gitignore
├── package.json
└── README.md
```

### Frontend (Next.js)
The frontend of the ICU2 project is built using Next.js, a React-based framework for building server-side rendered (SSR) and statically generated applications.

#### Key Directories
- `/frontend/pages`: Contains the Next.js pages.
- `/frontend/components`: Reusable React components.
- `/frontend/styles`: CSS and SCSS files for styling.
- `/frontend/public`: Static assets such as images and fonts.
- `/frontend/tests`: Unit tests for the frontend components.

#### Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/Chapter247IND/icu2-foundation.git
   ```
2. Navigate to the frontend directory:
   ```bash
   cd icu2-foundation/frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Run unit tests:
   ```bash
   npm test
   ```

### Backend (Node.js + TypeScript + Express)
The backend is developed using Node.js with Express, written in TypeScript for improved type safety and maintainability. MongoDB is used as the database to store application data.


#### Setup
1. Clone the repository (if not done already):
   ```bash
   git clone https://github.com/Chapter247IND/icu2-foundation.git
   ```
2. Navigate to the backend directory:
   ```bash
   cd icu2-foundation/backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up environment variables:
   Create a `.env` file in the `backend` directory and add the following variables:
   ```env
   MONGODB_URI=your-mongodb-connection-string
   PORT=your-port
   ```
5. Run the development server:
   ```bash
   npm run dev
   ```
6. Run unit tests:
   ```bash
   npm test
   ```

## Features
- **Super Admin Control:** Manage users, define tests, and create Boot Camps.
- **Boot Camp Management:** Link Boot Camps to specific schools and assign personnel.



## License
This project is licensed under the MIT License. See the LICENSE file for more details.

## Contact
For any inquiries or support, please contact the project maintainers.

---

This README file provides an overview of the ICU2 project, detailing the technology stack, project structure, setup instructions, and key features. This should help developers quickly understand and start working on the project.

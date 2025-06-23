# ICU2 Foundation

## Overview
The system allows Super Admins to have complete control over the setup and management of Boot Camps, which can be associated with specific schools and include various personnel such as project coordinators, medical professionals, and volunteers. The platform aims to provide real-time insights and detailed reports, facilitating efficient management and analysis of Boot Camp activities.

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
project/
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
The frontend of the project is built using Next.js, a React-based framework for building server-side rendered (SSR) and statically generated applications.

#### Key Directories
- `/frontend/pages`: Contains the Next.js pages.
- `/frontend/components`: Reusable React components.
- `/frontend/styles`: CSS and SCSS files for styling.
- `/frontend/public`: Static assets such as images and fonts.
- `/frontend/tests`: Unit tests for the frontend components.

#### Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/yogendra137/School-Mgmt-Learning.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Run unit tests:
   ```bash
   npm test
   ```

### Backend (Node.js + TypeScript + Express)
The backend is developed using Node.js with Express, written in TypeScript for improved type safety and maintainability. MongoDB is used as the database to store application data.

# Leave Management Website

A leave management full-stack application utilising MERN (MongoDB, Express, React and Node.js) for managing leave request creation and approval. The application includes role-based access for employees, managers and administrators, utilising React and Tailwind for an intuitive UI.

This program was created for QUT IFFQ636's Assignment 1.

### Live Example:
http://52.62.173.70/

(Hosted on AWS EC2)

---

# Features

### Account Management
- Secure signup and login features
- Role-based access control (Employee, Manager, Admin)
- Profile management

### Leave Management
- **Employees**: Submit, view, and manage leave requests
- **Managers**: Approve or Reject leave requests from employees, view all leave in system
- **Admins**: Full management of users and leave requests

### User Management
- Admin panel to view/edit/delete all users
- Ability to edit/delete all leave requests

### Other Features
- Select leave type, dates and reasons
- Prevent requesting conflicting leave dates
- Add review comments when approving/rejecting
- Filter requests by current status

---

## Tech Stack

### Backend
- Node.js
- Express
- MongoDB
- JWT

### Frontend
- React
- Axios
- Tailwind

### Testing
- Mocha
- Chai
- Sinon

---

## Setup

### Prerequisites

Ensure you have the following installed:

- npm
- Git
- VS Code
- Node.js

---

## Installation and Setup

### 1. Clone Repository
```bash
git https://github.com/adamhaouam/leaveManager.git
cd leaveManager
```

### 2. Install Dependencies
```bash
npm run install-all
npm audit fix
```

### 3. Environment Setup

1. Create a '.env' file in the '/backend' folder with the following:
```env
MONGO_URI=<CONNECTION_STRING>
JWT_SECRET=<JWT_KEY>
PORT=5001
```
2. Go to MongoDB Website and create account
3. Create a cluster
4. Whitelist IP address in database access
4. Got clusters -> Connect -> Drivers and replace ```<CONNECTION_STRING>``` with provided string
5. Run the following in your terminal and copy response as ```<JWT_KEY>```:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
6. Update axiosConfig.jsx to 
```jsx
baseURL: "http://localhost:5001", // local
```

### 4. Run Application

Development mode can be run by inputting the following in terminal:
```bash
npm run dev
```

Production mode can be run by inputting the following in terminal:
```bash
npm start
```

Tests can be run by inputting the following in terminal:
```bash
cd backend
npm test
```
---

## Other

### Project Links

- **JIRA Board:** https://adamhaouam.atlassian.net/jira/software/projects/SCRUM/boards/34?atlOrigin=eyJpIjoiOGM4ZGI3YWRjYzZlNDE4ZWJkMjMzNDUzMDllZGI5M2EiLCJwIjoiaiJ9
- **Figma Design:** https://www.figma.com/design/dwNQ3oDz1EFA6wKfrjabPN/Leave-Management?node-id=0-1&t=nqGMG2WNcZ8FRcLl-1
- **Public URL (EC2):** http://52.62.173.70/

### Example Credentials

- Administrator Account:
    - Email: test@email.com
    - Password: qutexample

- Employee Account:
    - Email: employee@email.com
    - Password: qutexample

---

**Last Updated**: May 2026

# User Security Dashboard

A simple Go + React application that displays user password/ access status with MFA filtering and color-coded rows.

---

## 📁 Repository Structure

├── backend/
│ ├── go.mod
│ └── main.go
├── frontend/
│ ├── package.json
│ ├── src/
│ │ └── UsersTable.jsx
│ └── public/
│ └── index.html
└── README.md


---

### Setup Instructions

### Prerequisites

- **Go** ≥1.18  
- **Node.js** ≥18 (and npm or yarn)  

### Clone & Install

```bash
git clone git@github.com:<your-username>/strato_task.git
cd strato_task
```
### Backend
```bash
cd backend
go mod tidy
```

### Frontend
```bash
cd frontend
npm install      
```
### Running Locally
## Frontend
```bash
npm start 
```
## Backend
```bash
go run main.go
```




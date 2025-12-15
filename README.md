# Sweet Shop Management System

A full-stack Sweet Shop Management System where:

- Users can register, log in, browse sweets, and purchase.
- Admins can manage the inventory via an admin panel.
- Developed using **React**, **Node.js**, **Express**, and **MongoDB**.
- Built using **Test-Driven Development (TDD)** with **Jest** for both backend testing.

---

## Tech Stack

### Frontend:
- React
- React Router DOM
- Tailwind CSS
- Axios
- Tailwind CSS

### Backend:
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT (Authentication)
- Bcrypt (Password hashing)
- Jest + Supertest (for TDD)

---

## Folder Structure

### Backend
```
server/
├── src/
│ ├── config/ 
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── middlewares/
│ ├── tests/
│ ├── app.js
| └── server.js
├── .env
└── package.json
```
### Frontend
```
client/
├── public/
├── src/
│ ├── assets/
│ ├── components/
│ ├── pages/
│ ├── tests/
| ├── context/
| ├── routes/
| ├── services/
| ├── utils/
│ ├── index.css
│ └── App.jsx
├── .env
└── package.json
```


---

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/kartikdhumal/SSMS-TDD-Incubyte.git
cd SSMS-TDD-Incubyte
```
## Backend setup
```bash
cd server
npm install
npm run start
```
## Environment Variable

```bash
PORT=5000
MONGO_URL=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
```

## Test
``` bash
npm test
```

### Frontend Setup

```
cd client
npm install
npm run dev
```

## Environment Variable

```bash
VITE_API_URL=http://localhost:5000/api
```

## Run Frontend Tests

```
npm test

```


# Features

 **Authentication & Access**
 * User and Admin login/registration secured with JWT.
 * Protected Routes enforced with Role-based Access Control.

 **Customer Page** (`Home.jsx`)
 * View sweets.
 * **Advanced Filtering:** Filter sweets dynamically by Name, Category, and Min/Max Price.
 * **Detailed View:** Clickable cards open a Product Details Modal for closer inspection.
 * **Quantity Control:** Users can select the exact quantity for purchase using +/- buttons.
 * **Direct Purchase:** Transaction logic integrated using the `/purchase` API endpoint.
 
**Admin Management** (`AdminDashboard.jsx`)
 * **Full CRUD:** Complete functionality to Add, Edit, and Delete sweets.
 * **Inventory Control:** Dedicated Restock functionality for managing stock levels.
 * **Management Filters:** Uses the same dynamic filters for efficient inventory searches.


# Test-Driven Development (TDD)
The backend strictly follows a TDD workflow:

* Write failing test cases
* Implement minimal logic to pass tests
* Refactor and harden implementation
All critical flows (auth, inventory, purchase, admin actions) are covered using Jest + Supertest.

# AI Assistance
AI tools (ChatGPT, Gemini) were used as development assistants for:

* Clarifying concepts
* Structuring components and APIs
* Debugging issues
* Supporting the TDD workflow


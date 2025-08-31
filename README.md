# Cropnet 🍏🌽

**Cropnet** is a full-stack marketplace platform that connects **farmers** directly with **customers** to buy and sell fresh vegetables and fruits.  
Built using the **MERN stack (MongoDB, Express, React, Node.js)** with **TypeScript**, Cropnet provides an efficient, transparent, and modern way to trade agricultural products.

---

## 🚀 Features

- 👩‍🌾 **Farmer Module**
  - Farmers can list products (vegetables/fruits)
  - Manage offers and discounts via **Farmer Offer APIs**
  - Track sales and performance with dashboards

- 🛒 **Customer Module**
  - Browse and search fresh produce
  - Add products to cart and place orders
  - Secure checkout process

- 🛠️ **Admin/Dashboard Module**
  - Manage users (farmers & customers)
  - View transactions, orders, and activity through **Dashboard APIs**
  - Oversee marketplace performance

- 🔐 **Authentication & Authorization**
  - Secure login/signup with role-based access
  - JWT-based authentication

- 📊 **API-First Design**
  - RESTful APIs for offers, orders, products, and analytics
  - Easy integration with future services

---

## 🏗️ Tech Stack

**Frontend**:  
- React + TypeScript  
- ShadCN UI / TailwindCSS (if used)  
- Axios for API requests  
- React Router for navigation  

**Backend**:  
- Node.js + Express + TypeScript  
- MongoDB with Mongoose ORM  
- Farmer Offer APIs & Dashboard APIs  
- JWT for authentication  

**Others**:  
- CORS, dotenv, bcrypt, etc.  

---

## 📂 Project Structure

cropnet/
├── corpnet/ # Backend (Node.js + Express + TS)
│ ├── src/
│ ├── models/
│ ├── routes/
│ ├── controllers/
│ └── ...
│
└── corpnet-frontend/ # Frontend (React + TS)
├── src/
├── components/
├── pages/
└── ...

yaml
Copy code

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js >= 18.x
- MongoDB (local or Atlas)
- npm or yarn

### 1️⃣ Clone the Repository



git clone https://github.com/Umair-Azeem/Cropnet.git
cd Cropnet
2️⃣ Setup Backend (corpnet)


cd corpnet
npm install
Create a .env file in corpnet/ with:

ini
Copy code
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_secret_key
PORT=5000
Run backend:


npm run dev
3️⃣ Setup Frontend (corpnet-frontend)



cd ../corpnet-frontend/corpnet-frontend
npm install
Run frontend:

bash
Copy code
npm run dev
Frontend will be available at http://localhost:5173 (default Vite dev server).

🔑 API Highlights

🔑 Authentication

POST /api/auth/register → Register user

POST /api/auth/login → Login

🥦 Products

GET /api/products → Get all products

POST /api/products → Create product (Farmers only)

PUT /api/products/:id → Update product

DELETE /api/products/:id → Delete product

📦 Orders

GET /api/orders → Get orders

POST /api/orders → Place order

PUT /api/orders/:id → Update order status

👤 Users

GET /api/users → Admin: get all users

GET /api/users/profile → Get logged-in profile

💬 Chat

POST /api/chat → AI chatbot support



Farmer Offer APIs
POST /api/farmer/offer → Create an offer

GET /api/farmer/offers → Fetch all offers

PUT /api/farmer/offer/:id → Update offer

DELETE /api/farmer/offer/:id → Delete offer

Dashboard APIs
GET /api/dashboard/stats → Fetch order & sales statistics

GET /api/dashboard/users → User insights (farmers/customers)

GET /api/dashboard/orders → Order details

🧑‍💻 Contributing
Contributions are welcome! 🎉

Fork the repo

Create a new branch (feature/your-feature)

Commit your changes

Push and create a PR

📜 License
This project is licensed under the MIT License.

👨‍👩‍👧‍👦 Authors
Umair Azeem

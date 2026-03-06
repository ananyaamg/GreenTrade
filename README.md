# 🌿 GreenTrade — Sustainable Item Exchange Platform

> **"Trade Green. Live Clean. Build Community."**

GreenTrade is a full-stack MERN web application that promotes sustainable living by enabling hyperlocal item exchange. Users can list household items for **Giveaway**, **Lending**, or **Trade** within their local ZIP code community — reducing waste, saving money, and tracking real environmental impact.

---

## 🌐 Live Demo

| Service | URL |
|--------|-----|
| 🖥️ Frontend | [green-trade-plum.vercel.app](https://green-trade-plum.vercel.app) |
| 🔧 Backend API | [greentrade-api.onrender.com](https://greentrade-api.onrender.com) |

---

## 📸 Screenshots

> Add screenshots of your app here
> Homepage / Dashboard / Admin Panel / Impact Page

---

## ✨ Features

### 👤 User Features
- Register and login with JWT authentication
- List items as **Giveaway**, **Lend**, or **Trade**
- Browse items from the same ZIP code area
- Upload item images via Cloudinary
- Contact sellers via Email or WhatsApp
- Earn **Green Points** for every item gifted
- Track personal **CO₂ savings** on Impact page
- View local **Leaderboard** and badges
- Reset password securely
- Delete account with all associated data
- Manage profile settings

### 🛡️ Admin Features
- Approve or reject item listings
- Delete users and their data
- View platform statistics
- Control ZIP code visibility
- Access admin dashboard at `/admin`

### 🌱 Sustainability Features
- CO₂ savings estimated per item category
- Trees equivalent and driving km avoided calculated
- Green Points gamification system
- Badge progression system:
  - 🌱 Green Starter (10+ points)
  - ⚔️ Eco Warrior (50+ points)
  - 🦸 Local Hero (100+ points)

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| React (Vite) | UI framework |
| Tailwind CSS | Styling |
| Axios | API requests |
| React Router | Navigation |
| Context API | Global state management |

### Backend
| Technology | Purpose |
|-----------|---------|
| Node.js | Runtime environment |
| Express.js | Web framework |
| MongoDB Atlas | Cloud database |
| Mongoose | ODM for MongoDB |
| JWT | Authentication |
| Bcrypt | Password hashing |
| Multer | File upload handling |
| Cloudinary | Image cloud storage |
| Crypto | Secure token generation |

### Deployment
| Service | Purpose |
|--------|---------|
| Vercel | Frontend hosting |
| Render | Backend hosting |
| MongoDB Atlas | Database hosting |
| Cloudinary | Image storage |

---

## 🗂️ Project Structure

GreenTrade/
├── server/                   # Backend
│   ├── config/
│   │   └── db.js             # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── itemController.js
│   │   ├── adminController.js
│   │   ├── passwordController.js
│   │   └── leaderboardController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── adminMiddleware.js
│   │   └── uploadMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   └── Item.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── itemRoutes.js
│   │   ├── adminRoutes.js
│   │   └── leaderboardRoutes.js
│   ├── .env.example
│   └── server.js
│
└── client/                   # Frontend
    ├── src/
    │   ├── api/
    │   │   └── axios.js
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── ItemCard.jsx
    │   │   ├── ProtectedRoute.jsx
    │   │   ├── CarbonCounter.jsx
    │   │   └── AdminZipCodeManager.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── HomePage.jsx
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   ├── DashboardPage.jsx
    │   │   ├── CreateItemPage.jsx
    │   │   ├── EditItemPage.jsx
    │   │   ├── ItemDetailPage.jsx
    │   │   ├── MyItemsPage.jsx
    │   │   ├── LeaderboardPage.jsx
    │   │   ├── ImpactPage.jsx
    │   │   ├── AdminPage.jsx
    │   │   ├── ProfilePage.jsx
    │   │   ├── ForgotPasswordPage.jsx
    │   │   └── ResetPasswordPage.jsx
    │   ├── App.jsx
    │   └── main.jsx
    └── .env.example


---

## 🚀 Getting Started (Local Setup)

### Prerequisites
```bash
node --version   # v18 or higher
npm --version
git --version
```

### 1. Clone the Repository
```bash
git clone https://github.com/ananyaamg/GreenTrade.git
cd GreenTrade
```

### 2. Setup Backend
```bash
cd server
npm install
```

Create `.env` file in `/server`:
```env
PORT=5001
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Setup Frontend
```bash
cd ../client
npm install
```

Create `.env` file in `/client`:
```env
VITE_API_URL=http://localhost:5001
```

### 4. Run the Application

Terminal 1 — Backend:
```bash
cd server
npm run dev
```

Terminal 2 — Frontend:
```bash
cd client
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 5. Make Yourself Admin

Create `makeAdmin.js` in `/server`:
```js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const User = require('./models/User');
  const user = await User.findOneAndUpdate(
    { email: 'your_email@example.com' },
    { isAdmin: true },
    { new: true }
  );
  console.log('Admin set:', user?.name);
  mongoose.disconnect();
});
```
```bash
node makeAdmin.js
```

---

## 🔐 Environment Variables

### Backend (`server/.env`)
| Variable | Description |
|---------|-------------|
| `PORT` | Server port (5001 local, 10000 on Render) |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for JWT tokens |
| `NODE_ENV` | development or production |
| `CLIENT_URL` | Frontend URL for CORS |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

### Frontend (`client/.env`)
| Variable | Description |
|---------|-------------|
| `VITE_API_URL` | Backend API URL |

---

## 📡 API Endpoints

### Auth Routes
```
POST   /api/auth/register          Register new user
POST   /api/auth/login             Login user
GET    /api/auth/profile           Get user profile (protected)
POST   /api/auth/forgot-password   Request password reset
POST   /api/auth/reset-password/:token  Reset password
DELETE /api/auth/delete-account    Delete account (protected)
```

### Item Routes
```
GET    /api/items                  Get all items (filtered by ZIP)
POST   /api/items                  Create new item (protected)
GET    /api/items/my-items         Get user's own items (protected)
GET    /api/items/:id              Get single item (protected)
PUT    /api/items/:id              Update item (protected)
DELETE /api/items/:id              Delete item (protected)
GET    /api/items/public           Public items for homepage
```

### Admin Routes
```
GET    /api/admin/stats            Platform statistics
GET    /api/admin/users            All users
DELETE /api/admin/users/:id        Delete user
GET    /api/admin/items            All items including pending
PUT    /api/admin/items/:id/approve   Approve item
DELETE /api/admin/items/:id/reject    Reject item
GET    /api/admin/zipcodes         Get admin ZIP codes
PUT    /api/admin/zipcodes         Update admin ZIP codes
```

### Leaderboard Routes
```
GET    /api/leaderboard            Local leaderboard
GET    /api/leaderboard/my-impact  Personal impact stats
```

---

## 🌍 How CO₂ is Calculated
```
Category      CO₂ Saved (kg)
──────────────────────────────
Electronics        15
Furniture          20
Tools               5
Sports              4
Clothing            3
Books               2
Other               3
```

When an item is marked **Gifted**:
- Owner receives **+20 Green Points**
- CO₂ value added to **totalCO2Saved**
- Impact page shows **trees equivalent** and **driving km avoided**

---

## 🚀 Deployment Guide

### Backend → Render
```
Root Directory:  server
Build Command:   npm install
Start Command:   node server.js
```

### Frontend → Vercel
```
Root Directory:  client
Framework:       Vite
Build Command:   npm run build
Output Dir:      dist
```

---

## 🤝 Contributing

Pull requests are welcome!
```bash
# Fork the repo
# Create your feature branch
git checkout -b feature/AmazingFeature

# Commit your changes
git commit -m 'Add AmazingFeature'

# Push to branch
git push origin feature/AmazingFeature

# Open a Pull Request
```

---

## 👩‍💻 Developer

**Ananya M G**
- GitHub: [@ananyaamg](https://github.com/ananyaamg)

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgements

- [MongoDB Atlas](https://www.mongodb.com/atlas) — Cloud database
- [Cloudinary](https://cloudinary.com) — Image storage
- [Render](https://render.com) — Backend hosting
- [Vercel](https://vercel.com) — Frontend hosting
- [Tailwind CSS](https://tailwindcss.com) — Styling

---

<div align="center">
  Made with 💚 for a sustainable future
  
  🌿 **GreenTrade** — Trade Green. Live Clean. Build Community.
</div>

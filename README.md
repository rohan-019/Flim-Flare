# 🎬 Flim-Flare

> A modern, responsive full-stack MERN (MongoDB, Express, React, Node.js) project for movie recommendation and ticket booking experience.

---

## ✨ Overview

**Flim-Flare** is a feature-rich movie recommendation and ticket booking web application with:

* Authentication using **JWT** and **Nodemailer** for password reset.
* **Role-based access control** to distinguish between admin and user routes.
* Integration with **TMDB API** to fetch real-time movie data.
* **Gemini API** powered AI movie recommendations via both text and voice input.
* Seat selection and **Stripe**-based test payment for ticket booking.

---

## 📊 Architecture Diagram

```text
              +-------------+          +-------------+
              |   Frontend  |  <-----> |   Backend   |
              |  (React.js) |          | (Express.js)|
              +-------------+          +-------------+
                     |                        |
     +---------------+                        +------------------+
     |                                                        |
+------------+                                   +------------------------+
|   Stripe   |                                   |     MongoDB Atlas      |
+------------+                                   +------------------------+
     |
     |                            +--------------------------+
     +--------------------------> |   TMDB + Gemini APIs     |
                                  +--------------------------+
```

---

## 🚀 Features

### 👤 Authentication

* Signup and Login using JWT.
* Secure Password hashing (Bcrypt).
* Password reset via **Nodemailer** email link.

### 🚧 Role-Based Access Control

* **Admin Routes**:

  * View Dashboard data (bookings, users, revenue)
  * Add new shows
  * View all bookings and shows

* **User Routes**:

  * Browse currently playing movies from TMDB
  * Add/remove from favorites
  * Receive AI recommendations (text & voice)
  * Book tickets with seat selection
  * Make payment using **Stripe (test mode)**

### 🧐 AI-Powered Recommendations

* Integration with **Gemini API** (Google)
* Input movie preferences via text or microphone
* Dynamic response of suggested movies

### 🎟️ Ticket Booking & Payment

* Select show date and time
* Choose preferred seats
* Test payments using **Stripe test environment**

---

## 🪥 Tech Stack

| Layer      | Tech Stack                 |
| ---------- | -------------------------- |
| Frontend   | React + Vite, Tailwind CSS |
| Backend    | Express.js, Node.js        |
| Database   | MongoDB (Mongoose)         |
| Auth       | JWT, Nodemailer            |
| AI         | Gemini API                 |
| Payment    | Stripe (test mode)         |
| Movie Data | TMDB API                   |

---

## 🏙️ Pages & UI Flow Diagram

```text
+-------------------+
|   Home Page       |
+-------------------+
         |
         v
+-------------------+
| Browse Movies     |<--------------------+
+-------------------+                     |
         |                               |
         v                               |
+-------------------+     +--------------------------+
|   Movie Details   |<--->| Add to Favorites / Book  |
+-------------------+     +--------------------------+
         |
         v
+-------------------+
| Seat Selection    |
+-------------------+
         |
         v
+-------------------+
| Stripe Payment    |
+-------------------+
         |
         v
+-------------------+
| Booking Confirmed |
+-------------------+
```

---

## 📚 File Structure

```bash
FlimFlare/
├── backend/
│   ├── controllers/        # API controllers
│   ├── models/             # Mongoose schemas
│   ├── routes/             # Express routes
│   ├── services/           # Email, AI, Payment logic
│   ├── middlewares/        # Auth & RBAC logic
│   ├── server.js           # Main server entry point
│   └── .env              # Backend env variables
│
├── frontend/
│   ├── src/
│   │   ├── assets/         # Images, icons
│   │   ├── components/     # React components
│   │   ├── pages/          # Route pages
│   │   ├── context/        # Global state
│   │   └── App.css        # Styling
│   ├── public/             # Static files
│   ├── .env                # Frontend env
│   └── vite.config.js    # Vite config
│
├── package.json
└── README.md             # Documentation
```

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/Flim-Flare.git
cd Flim-Flare
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create `.env`:

```env
MONGODB_URI=mongodb+srv://testuser:testpassword@cluster0.mongodb.net/testdb
JWT_SECRET=my_super_secret_jwt_key_12345
NODE_ENV=development

SMTP_USER=testmail@gmail.com
SMTP_PASS=abcd_efgh_ijkl_mnop
SENDER_EMAIL=testmail@gmail.com

GEMINI_API_KEY=AIzaSyDummyGeminiApiKey123456
STRIPE_SECRET_KEY=sk_test_dummyStripeSecretKey123456

PORT=3000
```

Run:

```bash
npm run dev
```

### 3. Setup Frontend

```bash
cd ../frontend
npm install
```

Create `.env`:

```env
VITE_BACKEND_URL=http://localhost:5000
VITE_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p/w500
VITE_CURRENCY=₹
```

Run:

```bash
npm run dev
```

---

## 📷 Screenshots

1. **Login Page: User can register, login and reset password.**

   ![](./screenshots/login.png)

2. **Home Page: User can check new releases and  watch trailers.**

   ![](./screenshots/home.png)

3. **Movies Page: User can browse different movies here.**

   ![](./screenshots/allMovies.png)
4. **Movie Details Page: User can see details of a particular movie including dates of release in theatre.**

   ![](./screenshots/movieDetails.png)
5. **Seat Layout:User can see seats available for a particular show and book accordingly.**

   ![](./screenshots/seatLayout.png)
6. **Bookings: User can see their bookings here.**

   ![](./screenshots/bookings.png)
7. **Search: User can get Recommendation from AI based on the genres or actor names they select. Both manual input or voice interaction**

   ![](./screenshots/aiSearch.png)

---

## 💳 Stripe Test Card

Use the following test card to simulate payments:

```text
Card Number: 4242 4242 4242 4242
Expiry Date: Any future date
CVC: Any 3 digits
ZIP: Any 5-digit number
```

---

## 🚫 Admin Access Protection

* All `/admin/*` routes are protected by JWT + role middleware
* Unauthorized users are redirected or blocked

---

## 💼 License

This project is licensed under the [MIT License](LICENSE).

---

## 🙌 Acknowledgements

* [TMDB API](https://www.themoviedb.org/)
* [Stripe](https://stripe.com/docs/testing)
* [Gemini AI](https://ai.google.dev/)
* [Vite](https://vitejs.dev/)
* [MERN Stack](https://www.mongodb.com/mern-stack)

---

**Made with ❤️ by [Rohan kumar](https://github.com/rohan-019)**

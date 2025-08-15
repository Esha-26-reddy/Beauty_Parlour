
#  Beauty Parlour Website

A full-stack web application for a modern beauty parlour, offering services, gallery, appointment booking, secure user authentication, payment via Razorpay, and admin order tracking.

---

##  Screenshots
![Uploading ss1.png…]()


---

##  Tech Stack

###  Frontend
- React.js
- React Router
- Context API (Auth & Cart)
- CSS

###  Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Nodemailer
- Flask

### Payment Integration
- Razorpay

---

##  Features

- User Registration & Login
- Password Reset via Email OTP
- Browse Services with Descriptions
- Razorpay Payment Integration (Single & Cart-based)
- Downloadable PDF Invoice After Payment
- Email Confirmation Post Booking
- Fully Responsive UI
- Image Gallery
- Order History
- ChatBot integration

---

##  Getting Started

###  Clone the Repo

```bash
git clone https://github.com/Esha-26-reddy/Beauty_Parlour.git
cd Beauty_Parlour
````

###  Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:

```env
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_gmail_email
EMAIL_PASS=your_gmail_app_password
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

Start the backend:

```bash
npm start
```

###  Setup Frontend

```bash
cd ../
npm install
npm start
```

---

##  Project Structure

```
├── backend/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── ...
├── src/
│   ├── components/
│   ├── context/
│   ├── data/
│   └── App.js
├── public/
└── package.json
```

---

##  Future Improvements

* Admin Dashboard for Service Management
* Customer Feedback & Rating
* Deployment to Vercel/Render for frontend and backend

---

##  Author

**Esha Vangala**
 [GitHub Profile](https://github.com/Esha-26-reddy)

---

##  License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


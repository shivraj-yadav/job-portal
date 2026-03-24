# JobHunt – Full-Stack Job Portal Platform

A full-stack Job Portal built using the MERN stack (MongoDB, Express, React, Node.js). It enables students to discover job opportunities and recruiters to efficiently manage hiring through a streamlined and intuitive platform.
## 🚀 Key Features

### 👨‍🎓 For Candidates
- Smart job search with filters (role, location, salary)
- Clean and responsive UI for seamless browsing
- Detailed job view with quick apply option
- Automated email notifications on application status

### 🧑‍💼 For Recruiters
- Easy company and job posting management
- Applicant tracking dashboard with candidate details
- Accept/reject candidates with secure status control

---

## 🛠️ Technology Stack

**Frontend:**
- **React.js** (via Vite)
- **TailwindCSS** for rapid, responsive, and beautiful styling
- **Shadcn/UI & Lucide-React** for premium accessible components and icons
- **Redux Toolkit** for centralized state management
- **React Router** for protected routing

**Backend:**
- **Node.js & Express.js**
- **MongoDB & Mongoose** for database modeling
- **JSON Web Tokens (JWT) & bcryptjs** for secure authentication
- **Nodemailer** for outbound SMTP email automation
- **Cloudinary / Multer** for parsing and storing resumes and company logos

---

## ⚙️ Local Setup & Installation

### Prerequisites
Make sure you have installed:
- [Node.js](https://nodejs.org/en/) (v16+)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas URI)

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd "Job Portal"
```

### 2. Backend Setup
Navigate to the backend directory, install packages, and set up your environment variables.
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` folder with the following keys:
```env
PORT=8000
MONGODB_URI=mongodb://127.0.0.1:27017/jobPortalDB
SECRET_KEY=your_super_secret_jwt_key
CLOUD_NAME=your_cloudinary_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret

# Email SMTP Credentials (for sending candidate acceptance emails)
EMAIL="your_email@gmail.com"
EMAIL_PASSWORD="your_app_password"
```

Start the backend development server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal, navigate to the frontend directory, install packages, and configure the base API URL.
```bash
cd frontend
npm install
```
Create a `.env` file in the `frontend` folder:
```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

Start the Vite development server:
```bash
npm run dev
```

### 4. View the App
Open your browser and navigate to exactly: **`http://localhost:5173`**

---

## 📂 Project Structure (Overview)
```text
📦 Job Portal
 ┣ 📂 backend
 ┃ ┣ 📂 controllers     # Core API logic (jobs, users, applications, companies)
 ┃ ┣ 📂 middlewares     # Authentication and role-authorization guards
 ┃ ┣ 📂 models          # Mongoose Schemas definitions
 ┃ ┣ 📂 routes          # Express API route bindings
 ┃ ┗ 📂 utils           # Helpers like sendEmail.js and Cloudinary 
 ┃
 ┗ 📂 frontend
   ┣ 📂 src
   ┃ ┣ 📂 components    # Reusable React components (Admin, Layouts, UI, Hooks)
   ┃ ┣ 📂 redux         # State management slices (authSlice, jobSlice, etc.)
   ┃ ┗ 📂 utils         # Constants and API endpoints mapping
```

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📝 License
This project is open source and available under the [MIT License](LICENSE).

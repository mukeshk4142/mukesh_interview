# Mukesh Kumar Portfolio & Recruitment Control Center

A high-performance, modern personal portfolio and admin dashboard system built for Python Developers.

## 🚀 Tech Stack
- **Frontend**: React 19, Vite, Tailwind CSS 4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Backend/Auth**: Firebase (Authentication & Firestore)
- **Routing**: React Router DOM

## 📁 Project Structure
- `src/components/Portfolio.tsx`: Main landing page (Public).
- `src/components/Login.tsx`: Secure login interface.
- `src/components/AdminDashboard.tsx`: Private overview and analytics.
- `src/components/ManageHR.tsx`: Recruiter database and interview tracker.
- `src/components/Inbox.tsx`: Message management system.
- `src/firebase.ts`: Firebase configuration and initialization.

## 🔑 Configuration (Firebase)
To deploy this for yourself, you must update the `firebaseConfig` object in `src/firebase.ts` with your credentials from the [Firebase Console](https://console.firebase.google.com/).

### Steps:
1. Create a Firebase project.
2. Enable **Authentication** (Email/Password).
3. Enable **Cloud Firestore** database.
4. Add a Web App to your project and copy the config.

## 🛠️ Features
- **Dynamic Interviews**: Auto-sorts by This Week/Next Week.
- **HR Tracker**: Full CRUD for recruitment pipeline.
- **Message Inbox**: Real-time notifications for portfolio inquiries.
- **Resume Vault**: Admin upload and public download.
- **12h Format**: All timings standardized to AM/PM.

## 💻 Deployment
1. Update `src/firebase.ts` with your config.
2. Run `npm run build`.
3. Upload the `dist` folder to your hosting (Vercel, Netlify, Firebase Hosting, etc.).

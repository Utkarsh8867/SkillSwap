# SkillSwap - A Skill Exchange Platform UI 🚀

![Status](https://img.shields.io/badge/status-UI_Complete-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-14-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-cyan)

Welcome to the frontend of SkillSwap! This is a modern, attractive, and fully functional UI designed to simulate a real-world platform where users can offer their skills in exchange for skills they need. The entire interface is built with mock data, making it ready for a backend team to integrate APIs with minimal effort.


---

## 🎯 Core Goal

The primary objective of this project was to deliver a **fully working UI** that *looks and behaves* like the real application. All data is served from local mock files (`/src/data/mockData.js`), allowing the backend team to simply replace these data sources with live API calls.

## ✨ Features

-   **🎨 Stunning & Modern Design:** A visually appealing interface with smooth animations and a professional color palette.
-   **📱 Fully Responsive:** The UI looks and works great on all devices, from mobile phones to desktops.
-   **🚀 Animated Splash Screen:** A loading animation to provide a professional user experience on startup.
-   **🏠 Home / Feed Page:**
    -   Displays "Skill Swap" posts from a local mock JSON file.
    -   Each post clearly shows what skills are being **offered** and what is being **sought**.
    -   Interactive cards with hover effects.
-   **👤 User Profile / My Account Page:**
    -   Displays mock user details (DP, bio, and top skills).
    -   Lists all posts created by that specific user.
-   **🔐 Login & Signup Pages (UI Only):**
    -   Beautifully designed forms for user registration and login.
    -   Ready for authentication logic to be integrated.
-   **➕ Create Post Modal:**
    -   An interactive modal form to create a new "Skill Swap" post.
    -   New posts are added to a temporary local state (`React.Context`), so the UI updates instantly, simulating a real-time experience.
-   **🧩 Clean & Reusable Components:** The code is structured into small, reusable components (like `Button`, `Modal`, `PostCard`), making it easy to maintain and scale.

---

## 🛠️ Tech Stack & Libraries

-   **Framework:** [Next.js](https://nextjs.org/) (with App Router)
-   **Styling:** [TailwindCSS](https://tailwindcss.com/)
-   **State Management:** React Context API
-   **Animations:** [GSAP](https://greensock.com/gsap/) (Used for initial card animations)
-   **Icons:** [React Icons](https://react-icons.github.io/react-icons/)
-   **Notifications:** [React Hot Toast](https://react-hot-toast.com/)

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

You need to have Node.js (version 18.x or later) and npm installed on your machine.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/skillswap-frontend.git
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd skillswap-frontend
    ```
3.  **Install NPM packages:**
    ```bash
    npm install
    ```
4.  **Run the development server:**
    ```bash
    npm run dev
    ```
5.  **Open your browser:**
    Navigate to [http://localhost:3000](http://localhost:3000) to see the application in action.

---

## 📁 Folder Structure

The project follows a clean and intuitive folder structure:

```/src
├── /app                # Next.js App Router (all pages)
│   ├── /login
│   ├── /profile
│   └── page.js         # Home Page
│
├── /components         # Reusable React components
│   ├── /ui             # Basic UI elements (Button, Modal, etc.)
│   ├── CreatePostModal.jsx
│   ├── Footer.jsx
│   ├── Header.jsx
│   ├── PostCard.jsx
│   └── Sidebar.jsx
│
├── /context            # Global state management (React Context)
│   └── AppProvider.js
│
└── /data               # Mock data files
    └── mockData.js
```

---

## 🌟 Next Steps & Future Scope

This UI is the perfect foundation for a full-stack application. The next steps would be:

-   [ ] **Backend Integration:** Replace mock data fetches with actual API calls.
-   [ ] **Real Authentication:** Implement JWT or NextAuth for user login and signup.
-   [ ] **Database Connection:** Connect to a database like MongoDB or PostgreSQL to store user and post data.
-   [ ] **Real-time Chat:** Add a messaging feature for users to propose swaps and communicate.
-   [ ] **Advanced Filtering:** Enhance the sidebar with functionality to filter posts by specific skills.

---

Made with ❤️ for collaboration and learning.
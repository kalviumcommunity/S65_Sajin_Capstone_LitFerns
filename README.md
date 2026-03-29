# LitFerns

<div align="center">

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white&style=flat-square)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-22-339933?logo=node.js&logoColor=white&style=flat-square)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white&style=flat-square)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-8-13AA52?logo=mongodb&logoColor=white&style=flat-square)](https://www.mongodb.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?logo=tailwindcss&logoColor=white&style=flat-square)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

**A modern peer-to-peer book-swapping platform for book enthusiasts**

[Live Demo](#-deployment) • [Setup Guide](#-quick-start) • [Documentation](#-documentation) • [Report Bug](../../issues)

</div>

---

## About LitFerns

LitFerns is a full-stack web application that connects book lovers to exchange books with each other. Instead of buying new books, users can post the books they own and swap them with books they want to read. The platform provides an intuitive interface for book discovery, swap management, and community feedback.

**Built with:** React, Express, MongoDB, and Tailwind CSS

**Project Duration:** 50 days (Capstone Project)

---

## Features

### Core Functionality
- **Book Listings** - Add, edit, and manage your book collection with cover images
- **Search & Filter** - Discover books by genre, author, condition, and more
- **Swap Requests** - Send and receive book swap requests with detailed tracking
- **Real-time Communication** - Connect with other book lovers
- **Swap Dashboard** - Track swap history and current exchanges
- **Ratings & Reviews** - Get feedback from swap partners

### User Experience
- **Secure Authentication** - JWT-based auth + password encryption
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Modern UI** - Dark-themed interface with smooth animations
- **Wishlist** - Save books you want to find
- **User Profiles** - Build reputation through successful swaps

---

## Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React 19** | UI library with hooks and functional components |
| **Vite 7** | Lightning-fast build tool and dev server |
| **Tailwind CSS 4** | Utility-first CSS framework |
| **React Router v7** | Client-side routing |
| **Axios** | HTTP client for API requests |
| **UploadThing** | Secure file upload service |
| **Lucide React** | Beautiful icon library |

### Backend
| Technology | Purpose |
|-----------|---------|
| **Node.js** | JavaScript runtime |
| **Express.js 5** | Web application framework |
| **MongoDB 8** | NoSQL database |
| **Mongoose** | MongoDB object modeling |
| **JWT** | Token-based authentication |
| **bcryptjs** | Password hashing |
| **Multer** | File upload handling |

### DevOps & Deployment
- **Git & GitHub** - Version control
- **Render** - Backend hosting
- **Vercel** - Frontend hosting
- **MongoDB Atlas** - Cloud database
- **UploadThing CDN** - File storage

---

## Quick Start

### Prerequisites
- Node.js (v18+)
- npm or yarn
- MongoDB (local or MongoDB Atlas account)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kalviumcommunity/S65_Sajin_Capstone_LitFerns.git
   cd LitFerns
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   cp .env.development.example .env.development
   # Edit .env.development with your credentials
   npm run dev
   ```
   Server runs on `http://localhost:5000`

3. **Setup Frontend (New Terminal)**
   ```bash
   cd client
   npm install
   npm run dev
   ```
   Client runs on `http://localhost:5173`

### Environment Variables

**Server** - Create `server/.env.development`:
```env
MONGO_URI=mongodb://localhost:27017/litferns
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your_secret_here
UPLOADTHING_TOKEN=your_token_here
```

**Client** - Create .env.development:
```env
VITE_API_URL=http://localhost:5000
VITE_UPLOAD_API_URL=http://localhost:5000
```

See ENV_SETUP_GUIDE.md for complete configuration details.

---

## Project Structure

```
LitFerns/
├── client/                  # React Frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React Context (Auth)
│   │   ├── utils/          # Helper functions & API calls
│   │   ├── App.jsx
│   │   └── index.css       # Global styles
│   ├── public/
│   └── package.json
│
├── server/                  # Express Backend
│   ├── controllers/        # Business logic
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API endpoints
│   ├── middleware/        # Auth, CORS, error handling
│   ├── config/            # Database config
│   ├── utils/             # Helper functions
│   ├── server.js
│   └── package.json
│
├── docs/                   # Documentation
├── ENV_SETUP_GUIDE.md     # Environment setup
└── README.md
```

---

## API Endpoints

### Authentication
- `POST /api/users/register` - Create new account
- `POST /api/users/login` - User login
- `POST /api/users/logout` - User logout

### Books
- `GET /api/books` - Get all books (with filters)
- `GET /api/books/:id` - Get book details
- `POST /api/books` - Create book listing
- `PUT /api/books/:id` - Update book
- `DELETE /api/books/:id` - Delete book

### Swaps
- `GET /api/swaps` - Get user's swaps
- `POST /api/swaps` - Create swap request
- `PUT /api/swaps/:id` - Update swap status
- `DELETE /api/swaps/:id` - Cancel swap

### Uploads
- `POST /api/uploadthing` - Upload files

---

## Deployment

### Backend (Render)
1. Push to GitHub
2. Connect Render to GitHub repository
3. Set environment variables in Render dashboard
4. Deploy

**Live:** https://s65-sajin-capstone-litferns.onrender.com

### Frontend (Vercel)
1. Import project to Vercel
2. Set `VITE_API_URL` environment variable
3. Auto-deploy on git push

---

## Getting Help

- **Documentation:** See ENV_SETUP_GUIDE.md and SECURITY_INCIDENT.md
- **Issues:** Create an issue on GitHub
- **Pull Requests:** Contributions welcome!

---

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## Security

- JWT-based authentication with secure token management
- Password encryption with bcryptjs
- CORS protection
- Environment-based configuration
- Input validation and error handling

See SECURITY_INCIDENT.md for security best practices.

---


<div align="center">

**[⬆ Back to Top](#litferns)**

Made with ❤️ by Sajin Saji George

</div>
```

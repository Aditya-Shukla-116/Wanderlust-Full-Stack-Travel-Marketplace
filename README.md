# Wanderlust — Full-Stack Travel Marketplace

A full-stack accommodation marketplace inspired by platforms like Airbnb. Users can explore available properties, view listing details and locations, create their own listings, upload property images, and share reviews and ratings. The application also includes user authentication, authorization, and listing management.

## Live Demo

- **Live:** https://wanderlust-full-stack-travel-marketplace-dzj0.onrender.com
- **GitHub Repository:** https://github.com/Aditya-Shukla-116/Wanderlust-Full-Stack-Travel-Marketplace.git

## Features

- **User Authentication** — Signup, login, logout, and session management using Passport.js.
- **Listing Management** — Create, view, edit, and delete accommodation listings.
- **Image Uploads** — Upload and manage listing images using Cloudinary.
- **Reviews & Ratings** — Users can add and delete reviews for listings.
- **Interactive Maps** — Display listing locations on an interactive map.
- **Category Filtering** — Browse listings by different accommodation categories.
- **Authorization** — Server-side authorization ensures users can only modify their own listings.
- **Validation & Error Handling** — Joi-based validation and centralized Express error handling.
- **Responsive UI** — Responsive interface built with Bootstrap.
- **Privacy & Terms** — Includes dedicated Privacy Policy and Terms pages.

## Tech Stack

### Frontend

- HTML5
- CSS3
- JavaScript
- EJS
- Bootstrap 5

### Backend

- Node.js
- Express.js

### Database

- MongoDB Atlas
- Mongoose

### Authentication & Services

- Passport.js
- Express Session
- Connect-Mongo
- Cloudinary
- Multer

## Architecture

The application follows the **Model-View-Controller (MVC)** architecture to separate application logic, database operations, and presentation.

```text
User
 │
 ▼
Routes
 │
 ▼
Controllers
 │
 ├── Models ──► MongoDB Atlas
 │
 └── Views ──► EJS Templates
```

## Key Implementations

### Authentication & Authorization

Implemented session-based authentication using **Passport.js** and MongoDB-backed sessions. Authorization middleware ensures that users can only modify or delete listings they own.

### Image Management

Integrated **Multer** with **Cloudinary** to handle listing image uploads and cloud storage.

### Database Relationships

Used Mongoose references to establish relationships between users, listings, and reviews.

```text
User
 ├── Listings
 └── Reviews

Listing
 └── Reviews
```

### Validation & Error Handling

Implemented:

- Joi schema validation
- Custom Express error classes
- Async error handling
- Centralized error-handling middleware
- Server-side authorization checks

## Project Structure

```text
Wanderlust/
│
├── controllers/        # Application logic
├── models/             # Mongoose schemas
├── routes/             # Express routes
├── views/              # EJS templates
│   └── legals/         # Privacy & Terms pages
├── public/             # CSS and client-side JavaScript
├── utils/              # Utility functions
├── middleware.js       # Authentication & authorization middleware
├── app.js              # Application entry point
├── cloudConfig.js      # Cloudinary configuration
├── schema.js           # Joi validation schemas
├── package.json
└── .gitignore
```

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Aditya-Shukla-116/Wanderlust-Full-Stack-Travel-Marketplace.git
cd Wanderlust-Full-Stack-Travel-Marketplace
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
MONGO_URL=your_mongodb_atlas_connection_string
SECRET=your_session_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_KEY=your_cloudinary_key
CLOUDINARY_SECRET=your_cloudinary_secret
```

### 4. Start the application

```bash
node app.js
```

## Project Purpose

Wanderlust was developed as a full-stack web development project to demonstrate practical experience with:

- RESTful CRUD operations
- MVC architecture
- User authentication and authorization
- MongoDB database relationships
- Cloud image storage
- Server-side validation
- Error handling
- Responsive web development

## Author

**Aditya Shukla**

IT Engineering Student | Full-Stack Web Developer

- **GitHub:** https://github.com/Aditya-Shukla-116
- **LinkedIn:** https://linkedin.com/in/aditya-shukla116
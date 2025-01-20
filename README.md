# Rahalaa
Rahalaa is a mobile application inspired by TripAdvisor, designed to help users discover, review, and share their experiences about travel destinations, hotels, restaurants, and attractions. Built with Node.js, Express, and MongoDB, this platform provides a seamless experience for travelers to explore and contribute to a community-driven travel guide

## Features 
User Authentication: Sign up, log in, and manage user profiles.

Destination Reviews: Browse and write reviews for travel destinations, hotels, and restaurants.

Search and Filter: Search for destinations and filter results by ratings, location, or category.

Rating System: Rate destinations, hotels, and restaurants on a scale of 1 to 5.

Image Upload: Upload photos for destinations, hotels, and restaurants.

Admin Panel: Manage users, destinations, and reviews (admin-only access).

Responsive Design: Optimized for both desktop and mobile devices.

## Technologies Used
Backend: Node.js, Express

Database: MongoDB (with Mongoose for schema modeling)

Authentication: JSON Web Tokens (JWT)

Image Storage: Cloudinary or Multer for local storage

Frontend: Android

API Testing: Postman 

Version Control: Git and GitHub

## Installation 
### 1-Install Dependencies:
npm install 

### 2-Set Up Environment Variables:
#### Create a .env file in the root directory and add the following variables:

PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

### 3-Run the Application:
npm start

## Usage
### User Registration and Login:
Create an account or log in to access all features.

### Browse Destinations: 
Explore destinations, hotels, and restaurants.

### Write Reviews:
Share your experiences by writing reviews and uploading photos.

### Rate Places:
Rate destinations, hotels, and restaurants on a scale of 1 to 5.

### Admin Access: 
Admins can manage users, destinations, and reviews through the admin panel.




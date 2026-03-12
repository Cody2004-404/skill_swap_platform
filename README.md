# Skill Swap Platform

A full-stack web application that allows users to exchange skills with each other instead of paying money. Users can teach what they know and learn what they want from others.

## Features

- **User Authentication**: Register and login with secure password hashing
- **Skill Management**: Add skills you can teach and skills you want to learn
- **Smart Matching**: Automatic matching based on complementary skills
- **Modern UI**: Clean, responsive design with gradient backgrounds
- **JWT Security**: Token-based authentication for secure API access

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB Atlas** - Database
- **Mongoose** - MongoDB object modeling
- **bcryptjs** - Password hashing
- **JWT** - Authentication tokens
- **CORS** - Cross-origin resource sharing

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with gradients and animations
- **Vanilla JavaScript** - No framework dependencies
- **Fetch API** - HTTP requests to backend

## Project Structure

```
skill-swap-platform/
├── backend/
│   ├── models/
│   │   └── User.js              # User model with skills
│   ├── routes/
│   │   ├── auth.js              # Login/Register routes
│   │   ├── users.js             # User profile & skills
│   │   └── matches.js           # Skill matching logic
│   ├── .env                     # Environment variables
│   ├── package.json             # Dependencies
│   └── server.js                # Express server setup
├── frontend/
│   ├── index.html               # Login page
│   ├── register.html            # Registration page
│   ├── addskills.html           # Add skills form
│   ├── dashboard.html           # View matches
│   ├── style.css                # Complete styling
│   └── script.js                # All JavaScript functionality
└── README.md                    # This file
```

## Setup Instructions

### Prerequisites
- Node.js (version 14 or higher)
- MongoDB Atlas account
- Git (optional)

### 1. Clone/Download the Project
```bash
# If using git
git clone <repository-url>
cd skill-swap-platform

# Or download and extract the ZIP file
```

### 2. Backend Setup

1. **Install dependencies**
```bash
cd backend
npm install
```

2. **Configure MongoDB Atlas**
   - Create a free MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
   - Create a new cluster
   - Get your connection string
   - Create a database user with read/write permissions

3. **Set up environment variables**
   - Open `.env` file in the backend folder
   - Replace the placeholder values:
   ```
   MONGODB_URI=Your Mongodb atlas URI
   JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_random
   PORT=5000
   ```

4. **Start the backend server**
```bash
npm start
# or for development with auto-restart
npm run dev
```

The backend should now be running on `http://localhost:5000`

### 3. Frontend Setup

1. **Open the frontend files**
   - The frontend consists of static HTML, CSS, and JavaScript files
   - No installation required - just open them in a browser

2. **Serve the frontend (optional)**
   You can use any static file server, for example:
```bash
# Using Node.js http-server (install globally first)
npm install -g http-server
cd frontend
http-server -p 3000
```

Or simply open `frontend/index.html` directly in your browser.

### 4. Test the Application

1. **Register a new user**
   - Go to `frontend/index.html`
   - Click "Register here"
   - Fill out the registration form
   - You'll be redirected to add skills

2. **Add skills**
   - Enter skills you can teach
   - Enter skills you want to learn
   - Click "Save Skills"

3. **View matches**
   - You'll be taken to the dashboard
   - The system will show compatible users
   - Each match shows what they teach and want to learn

4. **Test with multiple users**
   - Open a new browser or incognito window
   - Register another user with complementary skills
   - Both users should see each other as matches

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user

### Users
- `POST /users/skills` - Add/update user skills (requires auth)
- `GET /users/profile` - Get user profile (requires auth)

### Matches
- `GET /match/:userId` - Get skill matches for user (requires auth)

## Database Schema

### User Model
```javascript
{
  name: String,
  email: String,
  password: String, // Hashed with bcrypt
  skillsTeach: [String],
  skillsLearn: [String],
  timestamps: true
}
```

## Matching Algorithm

The system matches users when:
- User A teaches skills that User B wants to learn
- AND User B teaches skills that User A wants to learn

Matches are scored and sorted by the number of complementary skills.

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Input validation and sanitization
- CORS protection
- Environment variable configuration

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check your MongoDB Atlas connection string
   - Ensure your IP is whitelisted in Atlas
   - Verify database user permissions

2. **CORS Errors**
   - Ensure backend is running on port 5000
   - Check that frontend is making requests to the correct URL

3. **JWT Token Issues**
   - Clear browser localStorage if getting auth errors
   - Check that JWT_SECRET is set in .env file

4. **No Matches Found**
   - Ensure users have complementary skills
   - Check that both users have added skills
   - Verify skill names match exactly (case-sensitive)

### Development Tips

- Use browser developer tools to check network requests
- Check backend console for error messages
- Use MongoDB Atlas Compass to view database data
- Test API endpoints with Postman or curl

## Future Enhancements

- Real-time chat between matched users
- Skill categories and tags
- User ratings and reviews
- Skill exchange scheduling
- Notification system
- Mobile app version

## License

This project is open source and available under the MIT License.

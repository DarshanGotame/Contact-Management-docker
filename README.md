# Contact Management System

A full-stack contact management application built with **Next.js**, **Node.js**, **TypeScript**, and **MySQL**, featuring Docker containerization for easy deployment.

check this link ->  Frontend: http://64.227.134.48:4000/
                    Backend:  http://64.227.134.48:8000/

If this doesnot work then check out this fullstack contact management project.

**Darshan Gotame**
- GitHub: [@DarshanGotame](https://github.com/DarshanGotame)
- Repository: [Contact-Management](https://github.com/DarshanGotame/Contact-Management)

## 🚀 Features

### 📱 User Management
- **User Registration & Login** with email verification
- **Password Reset** functionality
- **JWT-based Authentication** with refresh tokens
- **Profile Management** with image upload
- **Role-based Access Control** (User/Admin)

### 👥 Contact Management
- **Add, Edit, Delete Contacts** with full CRUD operations
- **Contact Image Upload** and management
- **Contact Categories** for better organization
- **Star/Favorite Contacts** functionality
- **Search and Filter** contacts
- **Pagination** for large contact lists

### 🔐 Admin Dashboard
- **User Management** - View, edit, and manage all users
- **Contact Overview** - Monitor all contacts across the system
- **Category Management** - Create and manage contact categories
- **Dashboard Statistics** - Get insights into system usage
- **Role Management** - Assign and manage user roles

### 📊 Additional Features
- **Responsive Design** - Works on desktop and mobile
- **Real-time Updates** - Dynamic UI updates
- **File Upload** - Profile pictures and contact images
- **Email Notifications** - For verification and password reset
- **Data Validation** - Comprehensive input validation
- **Error Handling** - Graceful error management

## 🛠️ Tech Stack

### Frontend
- **Next.js 15.3.4** - React framework for production
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **React Hooks** - Modern React state management
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **TypeScript** - Type-safe server-side development
- **Sequelize ORM** - Database object-relational mapping
- **MySQL 8.0** - Relational database
- **JWT** - JSON Web Tokens for authentication
- **Multer** - File upload handling
- **Nodemailer** - Email sending functionality

### DevOps & Deployment
- **Docker** - Containerization platform
- **Docker Compose** - Multi-container orchestration
- **MySQL Container** - Dockerized database
- **Production Ready** - Optimized builds and configurations

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v18 or higher)
- **Docker** and **Docker Compose**
- **Git**

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/DarshanGotame/Contact-Management-docker.git
cd Contact-Management-docker
```

### 2. Environment Configuration
The project comes with pre-configured environment files:
- `.env.docker` - For Docker development
- `backend/.env.docker` - Backend-specific Docker configuration

### 3. Run with Docker (Recommended)
```bash
# Start all services
docker-compose --env-file .env.docker up

# Or run in background
docker-compose --env-file .env.docker up -d
```

### 4. Access the Application
- **Frontend**: http://localhost:4000
- **Backend API**: http://localhost:8000
- **MySQL Database**: localhost:3306

## 🔧 Development Setup

### Local Development (without Docker)

#### Backend Setup
```bash
cd backend
npm install
npm run build
npm start
```

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Environment Variables

#### Backend (.env)
```bash
# Application
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:4000
APP_PORT=8000

# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=contact
DB_PORT=3306
DB_DIALECT=mysql

# JWT
JWT_SECRET=your-secret-key

# Email (Optional)
GMAIL_USER=your_email@gmail.com
GMAIL_APP_PASSWORD=your_app_password
```

#### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 🐳 Docker Configuration

### Services
- **MySQL Database** - Port 3306
- **Backend API** - Port 8000
- **Frontend App** - Port 4000 (mapped from internal 3000)

### Docker Commands
```bash
# Build and start all services
docker-compose --env-file .env.docker up --build

# Stop all services
docker-compose --env-file .env.docker down

# View logs
docker-compose logs -f

# View specific service logs
docker logs contact-frontend
docker logs contact-backend
docker logs contact-mysql
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh-token` - Refresh JWT token
- `POST /api/auth/verify` - Email verification
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset

### Contact Endpoints
- `GET /api/contacts` - Get all contacts (paginated)
- `POST /api/contacts` - Create new contact
- `GET /api/contacts/:id` - Get specific contact
- `PUT /api/contacts/:id` - Update contact
- `DELETE /api/contacts/:id` - Delete contact
- `POST /api/contacts/:id/image` - Upload contact image
- `POST /api/contacts/:id/star` - Toggle star status

### User Endpoints
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/profile/image` - Upload profile image

### Category Endpoints
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create new category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Admin Endpoints
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user

## 🗄️ Database Schema

### Users Table
- `id` - Primary key
- `firstName` - User's first name
- `lastName` - User's last name
- `email` - User's email (unique)
- `password` - Hashed password
- `profileImage` - Profile image path
- `isVerified` - Email verification status
- `roleId` - Foreign key to roles table

### Contacts Table
- `id` - Primary key
- `firstName` - Contact's first name
- `lastName` - Contact's last name
- `email` - Contact's email
- `phone` - Contact's phone number
- `address` - Contact's address
- `image` - Contact image path
- `isStarred` - Favorite status
- `userId` - Foreign key to users table
- `categoryId` - Foreign key to categories table

### Categories Table
- `id` - Primary key
- `name` - Category name
- `description` - Category description
- `userId` - Foreign key to users table

## 🔒 Security Features

- **Password Hashing** - bcrypt for secure password storage
- **JWT Authentication** - Secure token-based authentication
- **CORS Configuration** - Cross-origin resource sharing setup
- **Input Validation** - Comprehensive request validation
- **File Upload Security** - Safe file handling with type checking
- **SQL Injection Prevention** - Sequelize ORM protection

## 🌐 Deployment

### Production Deployment
The application is production-ready and can be deployed using:

1. **Docker Compose** (Recommended)
2. **Individual Docker Containers**
3. **Traditional VPS/Cloud Servers**
4. **Container Orchestration** (Kubernetes, Docker Swarm)

### Environment-Specific Configurations
- Development: `.env.local`, `.env.development`
- Production: `.env.docker`, `.env.production`

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm run test
```

### Frontend Testing
```bash
cd frontend
npm run test
```

## 📁 Project Structure

```
Contact-Management/
├── backend/                 # Backend Node.js application
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── middlewares/     # Custom middleware
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── utils/           # Utility functions
│   │   ├── validators/      # Input validation
│   │   └── server.ts        # Main server file
│   ├── Dockerfile           # Backend Docker configuration
│   └── package.json         # Backend dependencies
├── frontend/                # Frontend Next.js application
│   ├── src/
│   │   ├── app/             # Next.js app directory
│   │   ├── components/      # React components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API service functions
│   │   ├── types/           # TypeScript type definitions
│   │   └── utils/           # Utility functions
│   ├── Dockerfile           # Frontend Docker configuration
│   └── package.json         # Frontend dependencies
├── docker-compose.yml       # Multi-container configuration
├── .env.docker             # Docker environment variables
└── README.md               # Project documentation
```

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Darshan Gotame**
- GitHub: [@DarshanGotame](https://github.com/DarshanGotame)
- Repository: [Contact-Management-docker](https://github.com/DarshanGotame/Contact-Management-docker)

## 🙏 Acknowledgments

- **Next.js Team** for the amazing React framework
- **Express.js** for the robust backend framework
- **MySQL** for the reliable database system
- **Docker** for simplifying deployment and development
- **TypeScript** for type-safe development

## 📞 Support

If you encounter any issues or have questions:

1. **Check** the [Issues](https://github.com/DarshanGotame/Contact-Management-docker/issues) section
2. **Create** a new issue if your problem isn't already reported
3. **Provide** detailed information about your environment and the issue

---

⭐ **Star this repository** if you find it helpful!

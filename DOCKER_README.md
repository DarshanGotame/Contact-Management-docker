# Docker Setup for Contact Management System

This project includes Docker configuration for easy deployment and development.

## Prerequisites

- Docker
- Docker Compose

## Environment Files

### `.env.docker` (Root level)
Contains all environment variables for Docker Compose setup including:
- Backend configuration
- Frontend configuration  
- Database configuration
- Port mappings

### `backend/.env.docker`
Backend-specific environment variables for container runtime.

### `frontend/.env.docker`
Frontend-specific environment variables for Next.js build.

## Quick Start

1. **Clone the repository and navigate to the project root**

2. **Configure environment variables**
   - Update `.env.docker` with your actual values
   - Update email credentials (`GMAIL_USER`, `GMAIL_APP_PASSWORD`)
   - Change JWT secret to a secure random string
   - Update database passwords

3. **Build and run with Docker Compose**
   ```bash
   # Build and start all services
   docker-compose --env-file .env.docker up --build

   # Run in detached mode
   docker-compose --env-file .env.docker up -d --build

   # Stop all services
   docker-compose down

   # Stop and remove volumes
   docker-compose down -v
   ```

## Service URLs

- **Frontend**: http://localhost:4000
- **Backend API**: http://localhost:8000
- **MySQL Database**: localhost:3306

## Port Mappings

- Frontend: `4000:3000` (Host:Container)
- Backend: `8000:8000` (Host:Container)
- MySQL: `3306:3306` (Host:Container)

## Individual Docker Commands

If you prefer to run containers individually:

### Backend
```bash
cd backend
docker build -t contact-backend .
docker run -p 8000:8000 --env-file .env.docker contact-backend
```

### Frontend
```bash
cd frontend
docker build -t contact-frontend .
docker run -p 4000:3000 --env-file .env.docker contact-frontend
```

### MySQL
```bash
docker run -d \
  --name contact-mysql \
  -e MYSQL_ROOT_PASSWORD=rootpassword123 \
  -e MYSQL_DATABASE=contact \
  -p 3306:3306 \
  mysql:8.0
```

## Database Setup

The MySQL container will automatically create the database specified in the environment variables. Make sure to:

1. Run database migrations after the backend starts
2. Seed initial data if needed
3. Configure proper database connections

## Troubleshooting

1. **Port conflicts**: Make sure ports 3306, 4000, and 8000 are not in use
2. **Database connection**: Ensure MySQL container is fully started before backend
3. **Environment variables**: Check that all required variables are set in `.env.docker`
4. **Volumes**: Use `docker-compose down -v` to reset database if needed

## Development vs Production

For production deployment:
1. Use proper domain names instead of localhost
2. Use secure passwords and JWT secrets
3. Configure proper SSL certificates
4. Set up proper logging and monitoring
5. Use Docker secrets for sensitive data

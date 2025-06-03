# Secure Programming Application

This project demonstrates various security programming concepts and best practices. It's structured to cover different aspects of secure programming across multiple weeks of study.

## Security Features by Week

### Week 1: Introduction to Secure Programming

- Basic project setup with security in mind
- Environment configuration and secure defaults
- Project structure following security best practices

### Week 2: Data Validation and Database Security

- Input validation using DTOs (Data Transfer Objects)
- Secure database configuration
- Prevention of SQL injection through ORM usage
- Data sanitization and validation middleware

### Week 3: HTTP Security and Headers

- Comprehensive security headers using Helmet
- Cross-Origin Resource Sharing (CORS) configuration
- Content Security Policy (CSP) implementation
- XSS prevention through input sanitization
- Protection against clickjacking and other common web vulnerabilities

### Week 4: Password Security and Monitoring

- Secure password hashing with bcrypt
- Custom salt implementation for additional security
- Password strength validation
- Request logging and monitoring
- Health check endpoints for system monitoring

### Week 5: Authentication and Authorization

- Choice of authentication methods:
  - JWT-based authentication
  - Session-based authentication (alternative)
- Rate limiting for abuse prevention
- Login attempt throttling
- User management security
- Session security (when using session-based auth)

### Week 6: API Security and Documentation

- Secure API documentation with Swagger
- API endpoint protection
- Input validation and sanitization
- Secure file upload handling
- File type validation and size limits

### Week 7: Error Handling and Resource Management

- Secure error handling
- Graceful shutdown procedures
- Resource cleanup
- Secure logging practices
- Error message sanitization

### Week 8: File Security

- Secure file upload handling
- File type validation
- Size limits enforcement
- Secure file naming
- Directory traversal prevention

### Week 10-11: Advanced Authentication

- JWT implementation
- Token-based authentication
- Secure session management
- Token validation and expiration

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Redis (for session storage if using session-based auth)
- MySQL Database (configured in .env file)

### Database Setup

Before running the application, you need to set up a MySQL database using Docker. Run the following command:

```bash
docker run -d --name my-mysql \
  -e MYSQL_ROOT_PASSWORD=<your_root_password> \
  -e MYSQL_DATABASE=<your_database_name> \
  -e MYSQL_USER=<your_database_user> \
  -e MYSQL_PASSWORD=<your_database_password> \
  -p 3306:3306 mysql:8
```

Replace the placeholders with your desired values:

- `<your_root_password>`: Root password for MySQL
- `<your_database_name>`: Name of your database
- `<your_database_user>`: Username for database access
- `<your_database_password>`: Password for the database user

Make sure to use these same values in your `.env` file configuration.

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with necessary configurations
4. Choose your authentication method (JWT or Session-based)

### Configuration

Create a `.env` file with the following variables:

```
PORT=3000
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret
REDIS_URL=your_redis_url
ALLOWED_ORIGINS=http://localhost:3000
```

### Running the Application

```bash
# Development
npm run dev

# Production
npm start
```

## Security Best Practices Implemented

1. **Input Validation**

   - All user inputs are validated using DTOs
   - Sanitization of user inputs to prevent XSS
   - File upload validation and restrictions

2. **Authentication**

   - Secure password hashing with bcrypt
   - JWT or Session-based authentication options
   - Rate limiting for login attempts
   - Session security measures

3. **Data Protection**

   - Secure database configuration
   - ORM usage to prevent SQL injection
   - Data sanitization
   - Secure file handling

4. **HTTP Security**

   - Security headers configuration
   - CORS policy implementation
   - Content Security Policy
   - Protection against common web vulnerabilities

5. **Monitoring and Logging**
   - Request logging
   - Error tracking
   - Health monitoring
   - Secure logging practices

## Choosing Authentication Method

This project supports two authentication methods:

### JWT-based Authentication

- Stateless authentication
- Suitable for distributed systems
- Better for mobile applications
- Requires token management

### Session-based Authentication

- Stateful authentication
- Better for traditional web applications
- Built-in session management
- Requires Redis for session storage

To switch between methods, follow the comments in the code and update the configuration accordingly.

## Contributing

When contributing to this project, please ensure:

1. All security measures are maintained
2. New features include appropriate security considerations
3. Tests are added for security-related changes
4. Documentation is updated accordingly


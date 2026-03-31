# E-Commerce Application

A full-stack e-commerce web application built with **Spring Boot** (backend) and **React + Vite** (frontend), featuring user authentication, product management, shopping cart, order processing, and an admin dashboard.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Database Setup](#database-setup)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Default Credentials](#default-credentials)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Spring Boot 3.x, Java 17, Spring Security, Spring Data JPA |
| **Frontend** | React 19, Vite, Axios, Tailwind CSS, React Router DOM |
| **Database** | MySQL 8+ |
| **Authentication** | JWT (JSON Web Tokens) |
| **Build Tools** | Maven (backend), npm/Vite (frontend) |

---

## Project Structure

```
ecommerce/
├── backend/
│   └── project/                  # Spring Boot application
│       ├── pom.xml
│       └── src/main/java/com/demo/project/
│           ├── controller/       # REST API controllers
│           ├── service/          # Business logic
│           ├── repository/       # Spring Data JPA repositories
│           ├── entity/           # JPA entity classes
│           ├── dto/              # Data Transfer Objects
│           ├── config/           # Security configuration
│           ├── security/         # JWT filter & utilities
│           └── exception/        # Custom exception handling
├── frontend/
│   └── hack2/                    # React + Vite application
│       ├── src/
│       │   ├── pages/            # Route page components
│       │   ├── components/       # Reusable UI components
│       │   ├── services/         # Axios API service layer
│       │   ├── context/          # React Context providers
│       │   └── routes/           # App route configuration
│       ├── .env                  # Frontend environment variables
│       └── package.json
└── documents/
    └── schema.sql                # Database schema and sample data
```

---

## Features

### Customer Features
- **User Registration & Login** — JWT-based authentication
- **Browse Products** — View all products, filter by category, search
- **Product Details** — Full product information page
- **Shopping Cart** — Add, update quantity, remove items
- **Checkout** — Enter shipping address and place orders
- **Order History** — View past orders and cancel pending ones
- **Profile** — View account details

### Admin Features
- **Admin Dashboard** — Overview of products, categories, and orders
- **Manage Products** — Create, edit, delete products
- **Manage Categories** — Create, edit, delete categories
- **Manage Orders** — View all orders and update order status

---

## Prerequisites

- **Java 17+**
- **Maven 3.8+** (or use the included `./mvnw` wrapper)
- **Node.js 18+** and **npm**
- **MySQL 8+**

---

## Database Setup

1. Start MySQL and create the database:

```sql
CREATE DATABASE ecommerce;
```

2. Run the schema and seed data:

```bash
mysql -u root -p ecommerce < documents/schema.sql
```

This creates all tables and loads sample data including:
- 4 categories (Electronics, Food, Clothes, Footwear)
- 32 sample products
- 1 sample user (`john@example.com` / `password123`)

---

## Backend Setup

1. Navigate to the backend directory:

```bash
cd backend/project
```

2. Update database credentials in `src/main/resources/application.properties` if needed:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/ecommerce
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
```

3. Build the application:

```bash
./mvnw clean package -DskipTests
```

4. Run the application:

```bash
./mvnw spring-boot:run
```

The backend starts on **http://localhost:8080**.

---

## Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend/hack2
```

2. Install dependencies:

```bash
npm install
```

3. Ensure the `.env` file has the correct API URL:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

4. Start the development server:

```bash
npm run dev
```

The frontend starts on **http://localhost:5173**.

---

## API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register a new user |
| POST | `/api/auth/login` | No | Login and receive JWT token |
| POST | `/api/auth/create-admin` | No | Create an admin user |
| GET | `/api/auth/profile` | Yes | Get current user profile |

### Products (`/api/products`)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/api/products` | No | — | Get all products |
| GET | `/api/products/{id}` | No | — | Get product by ID |
| GET | `/api/products/category/{categoryId}` | No | — | Get products by category |
| POST | `/api/products` | Yes | ADMIN | Create a product |
| PUT | `/api/products/{id}` | Yes | ADMIN | Update a product |
| DELETE | `/api/products/{id}` | Yes | ADMIN | Delete a product |

### Categories (`/api/categories`)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/api/categories` | No | — | Get all categories |
| POST | `/api/categories` | Yes | ADMIN | Create a category |
| PUT | `/api/categories/{id}` | Yes | ADMIN | Update a category |
| DELETE | `/api/categories/{id}` | Yes | ADMIN | Delete a category |

### Cart (`/api/cart`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/cart` | Yes | Get user's cart |
| POST | `/api/cart/add` | Yes | Add item to cart |
| PUT | `/api/cart/update/{itemId}` | Yes | Update item quantity |
| DELETE | `/api/cart/remove/{itemId}` | Yes | Remove item from cart |
| DELETE | `/api/cart/clear` | Yes | Clear the cart |

### Orders (`/api/orders`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/orders/checkout` | Yes | Place an order |
| GET | `/api/orders` | Yes | Get user's orders |
| GET | `/api/orders/{orderId}` | Yes | Get order details |
| PUT | `/api/orders/{orderId}/cancel` | Yes | Cancel an order |

### Admin Orders (`/api/admin/orders`)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/api/admin/orders` | Yes | ADMIN | Get all orders |
| PUT | `/api/admin/orders/{orderId}/status` | Yes | ADMIN | Update order status |

### Test (`/api/test`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/test/db-status` | No | Check database connectivity |

---

## Environment Variables

### Backend (`application.properties`)

| Property | Default | Description |
|----------|---------|-------------|
| `spring.datasource.url` | `jdbc:mysql://localhost:3306/ecommerce` | MySQL connection URL |
| `spring.datasource.username` | `root` | Database username |
| `spring.datasource.password` | *(see application.properties)* | Database password — **change in production** |
| `server.port` | `8080` | Backend server port |
| `jwt.secret` | *(see file)* | JWT signing secret — **change in production** |
| `jwt.expiration` | `86400000` | JWT expiry in ms (24 hours) |

### Frontend (`.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | `http://localhost:8080/api` | Backend API base URL |

---

## Running the Application

Start both servers in separate terminals:

**Terminal 1 — Backend:**
```bash
cd backend/project
./mvnw spring-boot:run
```

**Terminal 2 — Frontend:**
```bash
cd frontend/hack2
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## Default Credentials

| Role | Email | Password |
|------|-------|----------|
| User | `john@example.com` | `password123` |
| Admin | *(create via `/api/auth/create-admin`)* | *(set during creation)* |

To create an admin account, send a POST request to `/api/auth/create-admin`:

```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "admin123"
}
```

---

## Application Routes

| Path | Access | Page |
|------|--------|------|
| `/` | Public | Home — product listing |
| `/login` | Public | Login |
| `/register` | Public | Register |
| `/products/:id` | Public | Product details |
| `/cart` | User | Shopping cart |
| `/checkout` | User | Checkout & payment |
| `/orders` | User | Order history |
| `/profile` | User | User profile |
| `/admin` | Admin | Admin dashboard |
| `/admin/products` | Admin | Manage products |
| `/admin/categories` | Admin | Manage categories |
| `/admin/orders` | Admin | Manage orders |

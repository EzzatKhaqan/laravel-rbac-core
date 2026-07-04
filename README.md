# Laravel RBAC Core

A production-ready Laravel core template featuring secure authentication and robust Role-Based Access Control (RBAC) with dynamic user permissions. This repository serves as a scalable boilerplate to kickstart projects requiring strict user permissions and secure dashboards.

## Key Features
* **User Authentication:** Built-in secure login, logout, and session management.
* **Role-Based Access Control (RBAC):** Assign roles to users and permissions to roles.
* **Granular Permissions:** Protect specific dashboard routes, controller methods, and UI elements.
* **Extensible Architecture:** Designed as a clean core system to easily build your custom features on top.

---

## Installation Guide

Follow these steps to set up and run the application locally.

### 1. Clone the Repository
```bash
git clone https://github.com/EzzatKhaqan/laravel-rbac-core.git
cd laravel-rbac-core
```

### 2. Install Dependencies
```bash
composer install
npm install
```

### 3. Environment Configuration
Copy the example environment file and generate your application key:
```bash
cp .env.example .env
VITE_API_URL=http://localhost:8000/api/
VITE_TOKEN_KEY="rbac_token"
VITE_USER_KEY="rbac_user"
VITE_AUTHENTICATED_KEY="isAuthenticated"
php artisan key:generate
```

### 4. Configure Database
Open your `.env` file and update it with your local database credentials:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=your_database_user
DB_PASSWORD=your_database_password

VITE_API_URL=http://localhost:8000/api/
VITE_TOKEN_KEY="rbac_token"
VITE_USER_KEY="rbac_user"
VITE_AUTHENTICATED_KEY="isAuthenticated"
```

### 5. Run Migrations and Seed Default Data
Create the database tables and populate the system with the default administrator account:
```bash
php artisan migrate --seed
```

### 6. Start the Local Server
```bash
php artisan serve
npm run dev
```
Visit `http://127.0.0.1:8000` in your browser to access the application.

---

## Default Admin Credentials

Once the database seeder has run successfully, log in to the dashboard using these credentials:

* **Email:** `admin@ezzat.com`
* **Password:** `password`

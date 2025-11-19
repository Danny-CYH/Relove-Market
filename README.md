````markdown
# Relove Market - E-Preloved Exchange Store Using Software as a Service Model 🛍️

<div align="center">

![Malaysia Preloved Marketplace](https://img.shields.io/badge/Malaysia-Preloved%20Exchange-green)
![SaaS Platform](https://img.shields.io/badge/Model-Software%20as%20a%20Service-blue)
![Laravel React](https://img.shields.io/badge/Stack-Laravel%20%2B%20React%20Vite-orange)

_A modern SaaS platform for Malaysian preloved goods exchange_

[Features](#-key-features) • [Installation](#-installation) • [Tech Stack](#-tech-stack) • [API Documentation](#-api-documentation)

</div>

![Platform Overview](./project%20resource/home_page.png)

## 📋 Table of Contents

-   [Overview](#-overview)
-   [Key Features](#-key-features)
-   [Tech Stack](#-tech-stack)
-   [Architecture](#-architecture)
-   [Installation](#-installation)
-   [Configuration](#-configuration)
-   [API Documentation](#-api-documentation)
-   [Deployment](#-deployment)
-   [Contributing](#-contributing)
-   [License](#-license)

## 🚀 Overview

Relove Market is a comprehensive Software as a Service (SaaS) platform designed specifically for the Malaysian market, enabling individuals to buy and sell preloved items securely. Our platform combines modern technology with user-friendly features to create the ultimate second-hand shopping experience.

### 🌟 Key Highlights

-   **🇲🇾 Malaysian Focus**: Tailored for local users and market needs
-   **🤝 Community Driven**: Everyone can become an approved seller
-   **💸 Revenue Model**: 8% commission on successful transactions
-   **🤖 AI Powered**: Visual search and intelligent recommendations
-   **⚡ Real-time Updates**: Live dashboard and instant notifications
-   **📱 PWA Ready**: Progressive Web App for mobile experience

## ✨ Key Features

### 🛍️ Core Marketplace Features

-   **Multi-vendor Marketplace** with admin approval system
-   **Advanced Product Listings** with real-time management
-   **Secure Payment Processing** via Stripe integration
-   **Commission Management** (8% platform fee)
-   **Order & Escrow Management**

### 🤖 AI-Powered Enhancements

```python
# AI Visual Search & Recommendation System
- Image-based product search
- Product recommendations
```
````

### 💬 Communication System

-   **Real-time Chat** between buyers and sellers
-   **Pusher-powered notifications**
-   **Order progress updates**
-   **Review and rating system**

### 📊 Seller Dashboard

-   **Real-time Earnings Tracking** (5-minute refresh)
-   **Order Management System**
-   **Product Inventory Management**
-   **Sales Analytics & Reports**

### 👑 Admin Features

-   **Admin Dashboard**
-   **Seller Approval Workflow**
-   **Transaction Management**
-   **Product Moderation**
-   **User Management**

## 🛠️ Tech Stack

### Backend

-   **Laravel 11+** - PHP Framework (MVC Architecture)
-   **Supabase** - Primary Database
-   **Python** - AI/ML Services
-   **Stripe** - Payment Processing

### Frontend

-   **React 18** - UI Library
-   **Vite** - Build Tool & Dev Server
-   **TailwindCSS** - Utility-first CSS Framework
-   **SweetAlert2** - Beautiful Alerts & Modals
-   **PWA** - Progressive Web App Features

### Real-time & Services

-   **Pusher** - Real-time WebSocket communications
-   **Supabase** - Additional database services

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend        │    │   External      │
│   (React+Vite)  │◄──►│   (Laravel)      │◄──►│   Services      │
│                 │    │                  │    │                 │
│ • PWA           │    │ • MVC Pattern    │    │ • Stripe        │
│ • TailwindCSS   │    │ • API Routes     │    │ • Pusher        │
│ • SweetAlert    │    │ • Authentication │    │ • Supabase      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                        │                        │
         │                        │                        │
         ▼                        ▼                        ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   AI Services    │    │   Real-time      │    │   Database      │
│   (Python)       │    │   Features       │    │   Layer         │
│                  │    │                  │    │                 │
│ • Visual Search  │    │ • Live Chat      │    │ • Supabase      │
│ • Recommendations│    │ • Notifications  │    │                 │
│ • Image Analysis │    │ • Order Updates  │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 📥 Installation

### Prerequisites

-   PHP 8.2+
-   Node.js 18+
-   MySQL 8.0+
-   Composer
-   Python 3.8+

### Backend Setup (Laravel)

```bash
# Clone the repository
git clone https://github.com/Danny-CYH/Relove-Market.git
cd Relove_Market

# Install PHP dependencies
composer install

# Environment configuration
cp .env.example .env
php artisan key:generate

# Configure database in .env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=relove_market
DB_USERNAME=your_username
DB_PASSWORD=your_password

# Run migrations and seeders
php artisan migrate --seed
php artisan passport:install

# Start the development server
php artisan serve
```

### Frontend Setup (React + Vite)

```bash
# Install dependencies
npm install

# Environment configuration
cp .env.example .env.local

# Start development server
npm run dev
```

### AI Services Setup (Python)

```bash
cd ml_service

# Install dependencies
.\venv\Scripts\python.exe -m pip install -r requirements.txt

# Start AI services
.\venv\Scripts\uvicorn.exe recommendation_service:app --host 127.0.0.1 --port 5000 --reload
```

## ⚙️ Configuration

### Environment Variables

#### Laravel (.env)

```env
APP_NAME="Relove Market"
APP_ENV=production
APP_DEBUG=false

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=relove_market
DB_USERNAME=username
DB_PASSWORD=password

STRIPE_KEY=your_stripe_secret_key
STRIPE_SECRET=your_stripe_secret

PUSHER_APP_ID=your_pusher_app_id
PUSHER_APP_KEY=your_pusher_app_key
PUSHER_APP_SECRET=your_pusher_app_secret

SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

## 📡 API Documentation

### Authentication Endpoints

```http
POST /api/register
POST /api/login
POST /api/logout
GET  /api/user
```

### Buyer Endpoints

```http
GET     /api/get-featured-products
GET     /api/orders-history
POST    /api/profile-update
GET     /api/check-address
POST    /api/orders/{orderId}/confirm-delivery
GET     /api/get-all-wishlist
GET     /api/get-wishlist/{product_id}
POST    /api/store-wishlist
POST    /api/update-wishlist-variant
DELETE  /api/remove-wishlist
POST    /api/seller-registration-process
POST    /api/make-reviews
```

### Seller Endpoints

```http
GET    /api/dashboard-data
GET    /api/featured-products
GET    /api/seller-manage-product/get-product
POST   /api/seller-manage-product/add-product
POST   /api/seller-manage-product/edit-product
POST   /api/seller-manage-product/delete-product
POST   /api/seller/toggle-listing
POST   /api/seller/toggle-product-featured
GET    /api/products/metrics
POST   /api/products/auto-update-status
GET    /api/get-list-order
PUT    /api/update-order/{orderId}/status
GET    /api/seller-earnings
POST   /api/generate-income-report
GET    /api/seller/profile
POST   /api/seller/profile/user/update
POST   /api/seller/profile/store/update
POST   /api/seller/profile/image
DELETE /api/seller/store/image
```

### Admin Endpoints

```http
GET     /api/admin/dashboard/stats
GET     /api/admin/dashboard/notifications
GET     /api/admin/products
GET     /api/admin/products/stats
POST    /api/admin/products/{product}/block
POST    /api/admin/products/{product}/unblock
POST    /api/admin/products/{product}/flag
POST    /api/admin/dashboard/stats
GET     /api/transactions
GET     /api/transactions/metrics
POST    /api/transactions/{orderId}/release-payment
PUT     /api/transactions/{orderId}/status
GET     /api/transactions/{orderId}/tracking
POST    /api/{orderId}/manual-release
GET     /api/stats
GET     /api/admin/user-management/list
POST    /api/admin/user-management/actions
GET     /api/admin/user-management/stats
```

## 🚀 Deployment

### Production Deployment Steps

1. **Backend Deployment**

```bash
# Optimize for production
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

2. **Frontend Deployment**

```bash
# Build for production
npm run build

# Deploy to your web server
```

3. **PWA Configuration**

```javascript
// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: "autoUpdate",
            workbox: {
                globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
            },
        }),
    ],
});
```

## 🎥 Media & Demo

### Project Video

[![Platform Demo Video](./project%20resource/home_page.png)](https://youtu.be/kQ_tLq3dBuU)

### Platform Screenshots

| Checkout                                       | Seller Dashboard                                               | Product Listing                                |
| ---------------------------------------------- | -------------------------------------------------------------- | ---------------------------------------------- |
| ![Checkout](./project%20resource/checkout.png) | ![Seller Dashboard](./project%20resource/seller_dashboard.png) | ![Products](./project%20resource/shopping.png) |

| AI Search                                            | Real-time Chat                         | Mobile PWA                              |
| ---------------------------------------------------- | -------------------------------------- | --------------------------------------- |
| ![AI Search](./project%20resource/visual_search.png) | ![Chat](./project%20resource/chat.png) | ![Mobile](./project%20resource/pwa.png) |

## 👥 Contributing

We welcome contributions from the community! Please read our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 📞 Support

For support and questions:

-   📧 Email: chengyangho14@gmail.com
-   🐛 Issues: [GitHub Issues](https://github.com/Danny-CYH/Relove-Market/issues)

## 🙏 Acknowledgments

-   Malaysian e-commerce community
-   Laravel & React open-source communities
-   Stripe for payment processing
-   Pusher for real-time features
-   All our beta testers and early adopters

---

<div align="center">

**Built with ❤️ for the Malaysian preloved community**

[![GitHub stars](https://img.shields.io/github/stars/Danny-CYH/Relove-Market?style=social)](https://github.com/Danny-CYH/Relove-Market)

</div>
```

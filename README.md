Sure! Here’s a complete, ready-to-use README for your inventory management system project. You can copy it as README.md in your repo:

⸻

Inventory Management System

A full-stack inventory management system built with NestJS + TypeORM (PostgreSQL) for the backend and React + Vite + TailwindCSS + Shadcn/UI for the frontend.

This system allows you to manage products, track stock levels, create purchase orders, and simulate sales or stock adjustments while ensuring warehouse capacity is respected.

⸻

Table of Contents
	1.	Features
	2.	Architecture
	3.	Backend Setup
	4.	Frontend Setup
	5.	Running the Application
	6.	Usage
	7.	Folder Structure
	8.	Contributing

⸻

Features
	•	Product management with stock tracking and reorder threshold
	•	Purchase order creation (manual and automatic when stock is low)
	•	Warehouse capacity management
	•	Adjust stock levels (+/-) to simulate sales or stock adjustments
	•	Responsive frontend using TailwindCSS + Shadcn/UI
	•	REST API with Swagger documentation

⸻

Architecture

Backend
	•	Framework: NestJS
	•	Database: PostgreSQL via TypeORM
	•	Architecture: Modular / Onion architecture
	•	modules/ → Encapsulates controllers, services, DTOs, and entities
	•	services/ → Business logic, including:
	•	Stock adjustment
	•	Automatic reorder logic
	•	Warehouse capacity validation
	•	Purchase order creation
	•	controllers/ → Handles REST API requests
	•	DTOs & Validation → Ensures request payload integrity
	•	Swagger decorators → Auto-generates API documentation

Backend API Examples:

Endpoint	Description
GET /products	List all products with stock levels
PATCH /products/:id/adjust	Adjust stock (+/-)
GET /purchase-orders	List all purchase orders
POST /purchase-orders	Create a new purchase order


⸻

Frontend
	•	Framework: React 18 + Vite
	•	Styling: TailwindCSS + Shadcn/UI
	•	State Management: React useState + API calls
	•	Components:
	•	Tabs → Switch between Products and Purchase Orders
	•	Cards → Display products/orders neatly
	•	Dialogs → Create purchase orders
	•	Inputs & Buttons → Adjust stock or submit orders
	•	API Integration: Axios for communication with backend

⸻

Backend Setup

Prerequisites
	•	Node.js >= 20
	•	Yarn package manager
	•	PostgreSQL

Installation

cd inventory-system-backend
yarn install

Environment

Create a .env file:

DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=yourpassword
DATABASE_NAME=inventory_db

Database Setup

# Create database
createdb inventory_db

# Run migrations (if any)
yarn typeorm migration:run

Run Backend

# Start development server
yarn start:dev

Swagger documentation will be available at: http://localhost:3000/api

⸻

Frontend Setup

Installation

cd inventory-system-frontend
yarn install

Environment

Create .env (optional if using default API URL):

VITE_API_URL=http://localhost:3000

Run Frontend

yarn dev

Application will open at: http://localhost:5173

⸻

Running the Application
	1.	Start the backend: yarn start:dev
	2.	Start the frontend: yarn dev
	3.	Open http://localhost:5173 in your browser
	4.	Use Products tab to view and adjust stock
	5.	Use Orders tab to view purchase orders
	6.	Use Create Purchase Order dialog to manually order products

⸻

Usage
	•	Adjust stock: Use the input field in the Products tab to increase or decrease stock.
	•	Automatic reorder: Products below their reorder threshold will trigger automatic purchase orders.
	•	Manual purchase order: Click Order on a product card to create an order manually.
	•	Stock updates: Completing a purchase order automatically updates stock levels.

⸻

Folder Structure

Backend (inventory-system-backend)

src/
├─ modules/
│  ├─ products/
│  │  ├─ products.controller.ts
│  │  ├─ products.service.ts
│  │  ├─ dto/
│  │  └─ entities/
│  ├─ purchase-orders/
│  └─ warehouses/
├─ main.ts
├─ app.module.ts

Frontend (inventory-system-frontend)

src/
├─ components/
│  ├─ ProductsTab.tsx
│  ├─ OrdersTab.tsx
├─ api/
│  └─ api.ts
├─ App.tsx
├─ main.tsx
├─ index.css


⸻

Contributing
	•	Clone the repository
	•	Install dependencies for backend and frontend
	•	Start both servers locally
	•	Make your changes and submit pull requests

⸻

This setup ensures:
	•	Clear separation of frontend and backend responsibilities
	•	Modular, scalable NestJS backend
	•	Modern, responsive React frontend with Tailwind + Shadcn/UI
	•	Easy testing, simulation of sales, and stock adjustments


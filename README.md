# Base Exchange - Financial Orders Management

A production-quality frontend application for managing financial trading orders, featuring a simulated matching engine, real-time status updates, and a robust data management architecture.

## 🚀 Project Overview

The **Order Management Module** is a core component of the BASE Exchange ecosystem. It allows traders to:

- **Visualize** trading orders in a highly interactive data grid.
- **Create** Buy and Sell orders for various instruments.
- **Monitor** real-time execution status and partial fills.
- **Analyze** status change history for every order.
- **Simulate** the behavior of a professional matching engine.

## 🏗️ Architecture

The project follows a clean, scalable architecture with a strict separation of concerns:

- **Core Layer (`src/core`)**: Contains the pure business logic (Matching Engine). This layer is independent of React and frameworks, ensuring it is highly testable and reusable.
- **Feature Layer (`src/features`)**: Organizes code by domain (Orders). Includes:
  - **Hooks**: TanStack Query implementations for server state.
  - **Services**: API interaction and orchestration logic.
  - **Components**: Feature-specific UI elements (Table, Form, Filters).
- **Domain Layer (`src/types`)**: Centralized TypeScript definitions for the entire system.
- **Infrastructure Layer (`src/lib`)**: Global configurations for Query Client, Mock API providers, and shared utilities.

## ⚙️ Order Matching Logic (The Engine)

The system implements a **Price-Time Priority (FIFO)** matching algorithm, simulating a professional exchange environment.

### Matching Rules:

1. **Side Compatibility**: Buy orders only match with Sell orders and vice-versa.
2. **Price Compatibility**:
   - A **Buy** order matches if its price is **≥** the best available Sell price.
   - A **Sell** order matches if its price is **≤** the best available Buy price.
3. **Execution Priority**:
   - **Price**: Orders with the best price (lowest Sell / highest Buy) are filled first.
   - **Time**: For orders at the same price point, the oldest order (FIFO) is prioritized.

### Execution Scenarios:

- **Exact Match**: Quantities are identical; both orders move to `Executed`.
- **Partial Match**: One order is larger than the other; the smaller is `Executed`, while the larger moves to `Partial` status with an updated `remainingQuantity`.
- **Multiple Matches**: A single large order can "sweep" multiple smaller orders in the book until it is fully filled or no more compatible prices exist.

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (Strict Mode)
- **State Management**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod
- **Date Handling**: Day.js
- **Styling**: Tailwind CSS
- **Mock API**: JSON Server
- **Testing**: Jest + React Testing Library

## 🚦 How to Run the Project

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Mock API Server

The application requires the mock backend to persist and match orders. It runs on port `3001`.

```bash
npm run mock-server
```

### 3. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🧪 How to Run Tests

The project maintains high testing standards (87%+ coverage) across logic and UI.

### Run All Tests

```bash
npm test
```

### Test Structure:

- **Unit Tests**: `engine.test.ts` (Matching logic scenarios).
- **Integration Tests**: `orderService.test.ts` (API orchestration).
- **Component Tests**: `OrderForm.test.tsx`, `OrderTable.test.tsx`, etc.
- **Hook Tests**: `useOrders.test.tsx` (TanStack Query states).

## 📂 Folder Structure

```
src
├── app/                  # Next.js Pages & Layouts
├── components/           # Generic UI Components
├── core/                 # Business Logic (Matching Engine)
├── features/             # Domain-specific modules (Orders)
│   └── orders/
│       ├── components/   # Feature Components
│       ├── hooks/        # Data Hooks
│       └── services/     # API Services
├── lib/                  # Infrastructure & Providers
└── types/                # Domain Types
```

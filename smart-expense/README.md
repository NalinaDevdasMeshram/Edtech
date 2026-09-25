# SmartSpend – Personal Expense Tracker

SmartSpend is a personal expense management application built with Next.js, React, TypeScript, MongoDB, and Tailwind CSS.
The application allows users to manage their income and expenses, monitor their spending, create budgets, and view financial insights from a dashboard.

## screenshot

![Smart Expense Dashboard](/Edtech/smart-expense/public/assest/image.png)

## Features

### Authentication

- User registration
- User login
- Logout functionality
- Authentication API
- Protected application flow

### Dashboard

- Current balance
- Total income
- Total expenses
- Savings rate
- Spending by category
- Recent transactions
- Quick actions

### Transactions

- Add transaction
- View transaction details
- Edit transaction
- Delete transaction
- Search transactions
- Filter by transaction type
- Filter by category
- Sort transactions
- Pagination

### Budgets

- Create monthly budgets
- Set spending limits by category
- Track budget usage
- Display spending progress
- Show remaining budget
- Delete budgets

## Tech Stack

### Frontend

- Next.js
- React.js
- TypeScript
- Tailwind CSS

### Backend

- Next.js Route Handlers
- REST APIs
- Node.js

### Database

- MongoDB
- Mongoose

### Development Tools

- VS Code
- Git
- GitHub
- Postman

## Project Structure

```text
smart-expense/
│
├── public/
│
├── src/
│   └── app/
│       │
│       ├── api/
│       │   ├── auth/
│       │   │   ├── login/
│       │   │   └── register/
│       │   │
│       │   ├── dashboard/
│       │   │   └── route.ts
│       │   │
│       │   └── transactions/
│       │       ├── route.ts
│       │       └── [id]/
│       │           └── route.ts
│       │
│       ├── dashboard/
│       │   └── page.tsx
│       │
│       ├── transactions/
│       │   ├── page.tsx
│       │   ├── new/
│       │   │   └── page.tsx
│       │   └── [id]/
│       │       ├── page.tsx
│       │       └── edit/
│       │           └── page.tsx
│       │
│       ├── budgets/
│       │   └── page.tsx
│       │
│       ├── login/
│       │   └── page.tsx
│       │
│       ├── register/
│       │   └── page.tsx
│       │
│       └── layout.tsx
│
├── .env.local
├── package.json
├── tsconfig.json
├── next.config.ts
└── README.md
```

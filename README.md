# TodoApp Frontend

This is the frontend application for the TodoApp system, a task management application that allows users to create and manage todo lists and tasks.

## Features

- User authentication (register, login, logout)
- Create, read, update, and delete todo lists
- Create, read, update, and delete tasks
- Set task priorities and due dates
- Set reminders for tasks
- Filter tasks by status

## Tech Stack

- React
- TypeScript
- Vite
- Material UI
- React Router
- Formik & Yup for form validation
- Axios for API requests
- date-fns for date handling

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

### Development

To start the development server:

```bash
npm run dev
```

### Build

To build the application for production:

```bash
npm run build
```

### Preview

To preview the production build:

```bash
npm run preview
```

## Project Structure

- `src/components/` - Reusable UI components
- `src/contexts/` - React contexts for state management
- `src/hooks/` - Custom React hooks
- `src/models/` - TypeScript interfaces and types
- `src/pages/` - Application pages/screens
- `src/services/` - API service functions
- `src/utils/` - Utility functions
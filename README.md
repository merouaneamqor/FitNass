# FitNass

A platform for discovering and booking gyms across Morocco.

## Overview

FitNass helps users find the perfect gym based on location, facilities, and user reviews. The platform allows gym owners to list their facilities and users to book sessions, leave reviews, and manage their fitness journey.

## Features

- 🔍 Search and filter gyms by location, facilities, and price range
- ⭐ Read and write gym reviews
- 📅 Book gym sessions
- 💪 Subscribe to gym memberships
- 👤 User profiles with favorite gyms, reviews, and booking history
- 🏢 Gym owner dashboard for managing listings
- 🛡️ Admin panel for platform management

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js
- **Database**: Prisma ORM
- **State Management**: React Hooks + Server Components
- **Icons**: React Icons (Feather)

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm (v9 or later)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/fit-nass.git
   cd fit-nass
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Update the variables as needed

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
fit-nass/
├── src/
│   ├── app/                # App router routes
│   │   ├── api/            # API routes
│   │   ├── admin/          # Admin dashboard
│   │   ├── auth/           # Authentication pages
│   │   ├── gyms/           # Gym listing pages
│   │   ├── owner/          # Gym owner dashboard
│   │   ├── profile/        # User profile pages
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Home page
│   ├── components/
│   │   ├── ui/             # Reusable UI components
│   │   └── [feature]/      # Feature-specific components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions and services
│   └── types/              # TypeScript type definitions
├── public/                 # Static files
├── prisma/                 # Database schema and migrations
└── ...
```

## Coding Conventions

### Component Structure

- **Server Components** (default): Used for data fetching and rendering static content
- **Client Components**: Add `'use client';` directive at the top of the file for interactive components
- **File Naming**: PascalCase for component files (e.g., `ProfileHeader.tsx`)

### Styling

We use Tailwind CSS for styling with the following conventions:

- Use the utility classes directly in components
- Follow the project color scheme (primary: indigo-600, secondary: neutral-700)
- Use the spacing scale consistently
- Group related classes for better readability

Example button styles:
```jsx
// Primary button
<button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-all">
  Click Me
</button>

// Secondary button
<button className="border border-indigo-600 text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-lg font-medium transition-all">
  Cancel
</button>
```

### TypeScript

- Use interfaces for object shapes
- Use type for unions and complex types
- Ensure proper typing for all props and state
- Use type-only imports where possible

```typescript
// Example component with props
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
  disabled?: boolean;
}

export default function Button({ 
  children, 
  variant = 'primary',
  onClick,
  disabled = false
}: ButtonProps) {
  // Component implementation
}
```

## Authentication & Authorization

FitNass uses NextAuth.js for authentication with the following user roles:

- **User**: Standard user with access to gym listings, booking, and profile management
- **Owner**: Gym owners with access to gym management features
- **Admin**: Platform administrators with access to the admin dashboard

Auth-protected routes use middleware to validate session and permissions.

## Development Workflow

1. Create a new branch for each feature or bug fix
2. Follow the coding conventions in the `cursor.config.json` file
3. Write meaningful commit messages
4. Submit a pull request for review

## API Routes

FitNass uses API routes for server-side operations:

- `/api/auth/*`: Authentication endpoints
- `/api/gyms/*`: Gym-related operations
- `/api/bookings/*`: Booking management
- `/api/reviews/*`: Review operations
- `/api/users/*`: User profile management

## Deployment

The application can be deployed to Vercel or any other Next.js compatible hosting service.

```bash
npm run build
npm start
```

## Contributing

Contributions are welcome! Please follow the coding conventions and submit a pull request with your changes.

## License

[MIT](LICENSE)

## Database and Authentication Architecture

### Database Access Layer

The application uses Prisma ORM for database access, with a unified approach to connection management and error handling.

#### Key Files:

- **`src/lib/db.ts`** - Central database access layer with:
  - Singleton Prisma client to prevent connection pool exhaustion
  - `prismaExec` helper function for consistent error handling
  - Type-safe database operations

#### Usage Pattern:

```typescript
import { prisma, prismaExec } from '@/lib/db';

// Example of using prismaExec for safe database operations
const users = await prismaExec(
  () => prisma.user.findMany({
    where: { status: 'ACTIVE' },
    select: { id: true, name: true, email: true }
  }),
  'Error fetching active users'
);
```

### Authentication System

Authentication is handled using NextAuth.js with JWT strategy.

#### Key Files:

- **`src/lib/auth.ts`** - Authentication configuration with:
  - Credentials provider for email/password login
  - JWT-based session management
  - Role-based authorization
  - bcrypt for password hashing

#### Authentication Flow:

1. User submits credentials via login form
2. Credentials are validated against database using bcrypt
3. JWT token is generated with user info and role
4. Token is stored in cookies for session management
5. Role-based access controls are enforced using session data

### User Profile System

The application includes a comprehensive user profile system for managing user data.

#### Key Files:

- **`src/lib/profile.ts`** - User profile management with:
  - Functions to fetch, update, and manage user profiles
  - Methods for handling user-gym relationships (favorites, reviews, etc.)
  - Data transformation between database models and frontend DTOs

#### Key Functions:

- `getUserProfile(id)` - Get a user's profile by ID
- `getUserProfileByEmail(email)` - Get a user's profile by email
- `updateUserProfile(id, data)` - Update a user's profile
- `addFavoriteGym(userId, gymId)` - Add a gym to a user's favorites
- `removeFavoriteGym(userId, gymId)` - Remove a gym from a user's favorites

## Admin Dashboard

The admin dashboard provides management interfaces for:

- **User Management** - Add, edit, and manage user accounts
- **Gym Management** - Manage gym listings, verifications, and details
- **Promotions** - Manage special offers and promotions
- **System Settings** - Configure application settings

### Gym Management

Admin users can manage gyms through a dedicated interface at `/admin/gyms` with features including:

- Listing gyms with filtering and search
- Adding new gyms with detailed information
- Editing existing gym details
- Managing verification status
- Viewing gym analytics

## Development

### Requirements

- Node.js >= 18.0.0
- npm >= 9.0.0

### Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables (copy `.env.example` to `.env.local`)
4. Set up the database:
   ```
   npx prisma migrate dev
   ```
5. Start the development server:
   ```
   npm run dev
   ```

### Database Commands

- Create migration: `npx prisma migrate dev --name <migration_name>`
- Apply migrations: `npx prisma migrate deploy`
- Generate client: `npx prisma generate`
- Reset database: `npx prisma migrate reset`
- Seed database: `npx prisma db seed`

## Architecture Patterns

- **Server Components** - For data fetching and rendering
- **Client Components** - For interactive elements (marked with 'use client')
- **Singleton Pattern** - For database connections
- **Repository Pattern** - For data access abstraction
- **DTO Pattern** - For data transformation between layers

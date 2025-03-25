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

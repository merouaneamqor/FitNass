# FitNass - Gym Discovery Platform

FitNass is a web application that helps users discover gyms and fitness centers, with the ability to search, filter, and review them. The platform includes features like user reviews, gym promotions, and personalized recommendations.

## Features

- **Gym Directory**: Browse and search for gyms with detailed information
- **User Profiles**: Create accounts to manage reviews and preferences
- **Search and Filters**: Find gyms by location, activities, and ratings
- **Reviews and Ratings**: Leave and read reviews for gyms
- **Promotions and Offers**: View special deals and discounts
- **Admin Panel**: Manage listings, users, and content
- **Gym Owner Dashboard**: For gym owners to manage their listings

## Technology Stack

- **Frontend**: Next.js with React
- **Backend**: Next.js API routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **Containerization**: Docker for PostgreSQL

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/fit-nass.git
   cd fit-nass
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/fitnass?schema=public"
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   GOOGLE_MAPS_API_KEY="your-google-maps-api-key"
   ```

4. Set up the database:
   ```
   # For Unix/Linux/macOS:
   npm run db:setup
   
   # For Windows:
   cd scripts
   .\setup-db.bat
   ```

### Running the Application

1. Start the development server:
   ```
   npm run dev
   ```

2. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Demo Accounts

The application is seeded with the following demo accounts:

- **Admin**
  - Email: admin@fitnass.com
  - Password: admin123

- **Gym Owner**
  - Email: owner1@fitnass.com
  - Password: owner123

- **Regular User**
  - Email: user1@example.com
  - Password: user123

## Project Structure

```
fit-nass/
├── prisma/              # Database schema and migrations
├── public/              # Static assets
├── scripts/             # Setup and utility scripts
├── src/
│   ├── app/             # Next.js App Router
│   │   ├── api/         # API routes
│   │   ├── admin/       # Admin panel
│   │   ├── auth/        # Authentication pages
│   │   ├── dashboard/   # Gym owner dashboard
│   │   ├── gyms/        # Gym listing and details
│   │   └── ...
│   ├── components/      # React components
│   ├── lib/             # Utility functions
│   └── types/           # TypeScript type definitions
├── .env                 # Environment variables
├── docker-compose.yml   # Docker configuration
└── ...
```

## License

[MIT License](LICENSE)

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [NextAuth.js](https://next-auth.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Docker](https://www.docker.com/)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

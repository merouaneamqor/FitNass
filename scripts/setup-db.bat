@echo off
echo Starting Docker Compose services...
docker-compose up -d

echo Waiting for PostgreSQL to start...
timeout /t 5 /nobreak

echo Running Prisma migrations...
npx prisma migrate dev --name init

echo Seeding the database...
npx prisma db seed

echo Database setup complete!
echo PostgreSQL is available at: postgresql://postgres:postgres@localhost:5432/fitnass 
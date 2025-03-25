#!/bin/bash

# Ensure script stops on first error
set -e

echo "Starting Docker Compose services..."
docker-compose up -d

echo "Waiting for PostgreSQL to start..."
sleep 5

echo "Running Prisma migrations..."
npx prisma migrate dev --name init

echo "Seeding the database..."
npx prisma db seed

echo "Database setup complete!"
echo "PostgreSQL is available at: postgresql://postgres:postgres@localhost:5432/fitnass" 
const { execSync } = require('child_process');
const path = require('path');

function runCommand(command) {
  try {
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Command failed: ${command}`);
    console.error(error);
    process.exit(1);
  }
}

console.log('Starting Docker Compose services...');
runCommand('docker-compose up -d');

console.log('Waiting for PostgreSQL to start...');
setTimeout(() => {
  console.log('Running Prisma migrations...');
  runCommand('npx prisma migrate dev --name init');

  console.log('Seeding the database...');
  runCommand('npx prisma db seed');

  console.log('Database setup complete!');
  console.log('PostgreSQL is available at: postgresql://postgres:postgres@localhost:5432/fitnass');
}, 5000); // Wait 5 seconds for PostgreSQL to start 
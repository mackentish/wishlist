# Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Authentication

This project leverage NextAuth with Google as the authentication provider.
The app is authorized by Google in the Google Cloud Console. The client ID and secret are stored as `.env` variables.

## Database Migrations

This project uses prisma to manage the database. To run migrations, run the following command after making updates to the schema
in `prisma/schema.prisma`:

```bash
npx prisma migrate dev --name <migration-name>
```

## Deploy Database Changes

To deploy the changes to the database, update the `.env` file to point to PROD or whatever database you are deploying to and run the following command:

```bash
npx prisma migrate deploy
```

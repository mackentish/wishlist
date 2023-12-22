## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Authentication

This project leverage NextAuth with Google as the authentication provider.
TODO: Add production url to "Authorized redirect URIs" in Google Developer Console:
`https://{YOUR_DOMAIN}/api/auth/callback/google`

## Database Migrations

This project uses prisma to manage the database. To run migrations, run the following command after making updates to the schema
in `prisma/schema.prisma`:

```bash
npx prisma migrate dev --name <migration-name>
```

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

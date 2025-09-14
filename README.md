# EPUB Fixer - Professional EPUB Processing Service

This is a Next.js web application that provides a professional UI for processing EPUB files. The service offers two main features:

1. **EPUB 2 to EPUB 3 Conversion**: Automatically upgrades legacy EPUB 2 files to the modern EPUB 3 standard
2. **Accessibility & Validation**: Runs EPUB files through EPUBCheck and ACE accessibility checking, fixes issues, and generates detailed reports

## Features

- Marketing homepage with professional copy to attract users
- User authentication (email/password signup/signin)
- File upload functionality (EPUB files, max 10MB, max 5 files)
- Processing status tracking
- Download of processed files and detailed reports
- Admin dashboard for managing users and EPUB files
- Responsive design using Tailwind CSS
- Command-line interface for listing fixable errors

## Getting Started

First, install the dependencies:

```bash
npm install
```

Set up the environment variables by copying `.env.example` to `.env` and filling in the required values:

```bash
cp .env.example .env
```

Run the database migrations:

```bash
npx prisma migrate dev
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3456](http://localhost:3456) with your browser to see the result.

## Project Structure

- `src/app/` - Next.js app router pages
- `src/components/` - Reusable React components
- `src/lib/` - Utility functions and authentication setup
- `prisma/` - Prisma schema and migrations

## Authentication

The application supports email and password signup/signin.

The user with the email specified in `ADMIN_EMAIL` environment variable will have admin privileges and access to the admin dashboard.

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs) - React framework
- [NextAuth.js Documentation](https://next-auth.js.org/) - Authentication for Next.js
- [Prisma Documentation](https://www.prisma.io/docs/) - Database toolkit
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - Utility-first CSS framework

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Command Line Interface

This project includes a command-line interface that can list the EPUBCheck and DAISY/ACE errors that the epub-fix tool can automatically fix:

```bash
# List EPUBCheck errors that can be fixed
node epub-fixer-cli.js --list-epubcheck-fixes

# List DAISY/ACE errors that can be fixed
node epub-fixer-cli.js --list-ace-fixes

# Show help
node epub-fixer-cli.js --help
```

The CLI provides detailed information about the types of issues that can be automatically resolved during the EPUB processing workflow.

# EPUB Fixer UI - Development and Production Documentation

## 1. Starting the Development Server

To start the development server, run:

```bash
npx next dev -p 3457
```

This will start the Next.js development server on port 3457. You can access the application at [http://localhost:3457](http://localhost:3457).

The development server features hot reloading, so changes to the code will be reflected immediately in the browser without needing to restart the server.

## 2. Building and Starting the Production Server

To build the application for production, run:

```bash
npm run build
```

This command creates an optimized production build in the `.next` directory.

To start the production server, you have two options:

Option 1 - Using Next.js server:
```bash
npm run start
```

Option 2 - Using the custom Express server:
```bash
node server.js
```

Both will start the server on port 3456. The custom Express server ([server.js](file:///Users/crdjm/Dev/epub-fixer-ui/server.js)) is designed to serve the static files generated during the build process.

## 3. Accessing Development Database Content

The application uses SQLite for development with a local database file. The database file is located at:

```
prisma/dev.db
```

To access and inspect the development database content, you can use the Prisma Studio:

```bash
npx prisma studio
```

This will start a web interface on [http://localhost:5555](http://localhost:5555) where you can view and manage the database records.

Alternatively, you can use any SQLite browser tool to directly open the [prisma/dev.db](file:///Users/crdjm/Dev/epub-fixer-ui/prisma/dev.db) file.

## 4. Accessing Production Database Content

For production deployments, the database configuration would depend on the deployment environment. Based on the current configuration, the application uses SQLite, so the production database would be a file similar to the development one.

In a production environment, you would typically:

1. Ensure the database file is in the correct location as specified by the `DATABASE_URL` environment variable
2. Use a database management tool compatible with your database provider to access the content
3. For SQLite, you could use Prisma Studio as in development:
   ```bash
   npx prisma studio
   ```

Note that in a real production deployment, you might want to use a more robust database solution like PostgreSQL.

## 5. Uploaded Development EPUBs and Reports Location

In the development environment, uploaded EPUBs and generated reports are stored in two directories:

- **Uploaded files**: `uploads/` directory in the project root
- **Processed files and reports**: `processed/` directory in the project root

The file structure follows this pattern:
```
uploads/
  ├── [fileId]-[originalFileName].epub
  └── [fileId]-[epub3FileName].epub (if converted from EPUB2)

processed/
  └── [fileId]/
      ├── fixed-[fileName].epub
      ├── report-[fileName].html
      └── report-[fileName]_image_review.html
```

## 6. Uploaded Production EPUBs and Reports Location

In a production environment, the file storage locations would be the same as in development:

- **Uploaded files**: `uploads/` directory in the project root
- **Processed files and reports**: `processed/` directory in the project root

However, in a real production deployment, you would typically:

1. Use a dedicated file storage service (like AWS S3, Google Cloud Storage, etc.) instead of the local filesystem
2. Configure environment variables to specify the storage paths
3. Implement proper backup and redundancy for the stored files

## 7. Database Migration and Maintenance Commands

The application uses Prisma for database management. Here are the key commands for database migration and maintenance:

### Creating and Applying Migrations

When you make changes to the Prisma schema ([prisma/schema.prisma](file:///Users/crdjm/Dev/epub-fixer-ui/prisma/schema.prisma)), you need to create and apply migrations:

```bash
# Create and apply a new migration
npx prisma migrate dev --name migration_name

# Apply pending migrations in development
npx prisma migrate dev

# Apply pending migrations in production
npx prisma migrate deploy
```

### Database Inspection and Management

```bash
# View the current database schema
npx prisma studio

# Generate Prisma client (done automatically in most cases)
npx prisma generate

# Validate the Prisma schema
npx prisma validate

# Format the Prisma schema file
npx prisma format
```

### Resetting the Development Database

If you need to reset your development database:

```bash
# Reset the database (removes all data)
npx prisma migrate reset
```

This command will:
1. Drop the database
2. Apply all migrations
3. Optionally run seed scripts if configured
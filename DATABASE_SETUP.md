# ZenSpace Database Setup Guide

You now have Prisma configured for your app! Choose one of the database options below to get started.

## 🚀 Quick Start (Recommended: Supabase)

### Step 1: Create a Supabase Project
1. Go to https://supabase.com and sign up (free)
2. Create a new project
3. Go to **Settings → Database** and copy your connection details

### Step 2: Configure Environment Variables
Create a `.env` file in the root of your project:

```env
# From Supabase Settings → Database
DATABASE_URL="postgresql://postgres.[PROJECT_ID]:[PASSWORD]@aws-[REGION].pooler.supabase.com:6543/postgres?schema=public"
DIRECT_URL="postgresql://postgres.[PROJECT_ID]:[PASSWORD]@aws-[REGION].sql.supabase.com:5432/postgres"
```

**Where to find these:**
- Go to your Supabase project
- Click **Settings** → **Database**
- Look for "Connection string" (PostgreSQL)
- Use the **"Connection pooling"** URL for `DATABASE_URL`
- Use the **"Direct connection"** URL for `DIRECT_URL`
- Replace `[PASSWORD]` with your database password

### Step 3: Create Database Tables
Run the migration to create all tables:

```bash
npx prisma migrate dev --name init
```

This will:
1. Create all tables defined in `prisma/schema.prisma`
2. Generate Prisma Client
3. Prompt for a migration name (use "init")

### Step 4: Test the Connection
```bash
npx prisma studio
```

This opens Prisma Studio (visual database explorer) at `http://localhost:5555`

---

## Alternative: Prisma Postgres

### Step 1: Create a Prisma Postgres Database
```bash
npx create-db
```

This creates a managed PostgreSQL database (free tier available).

### Step 2: Use the Connection String
Prisma Postgres will provide a connection string. Add it to `.env`:

```env
DATABASE_URL="prisma+postgres://..."
```

### Step 3: Run Migration
```bash
npx prisma migrate dev --name init
```

---

## Alternative: Local PostgreSQL

### Step 1: Install PostgreSQL
- **Windows:** Download from https://www.postgresql.org/download/windows/
- **Mac:** `brew install postgresql`
- **Linux:** `sudo apt-get install postgresql`

### Step 2: Create Database
```bash
createdb zenspace
```

### Step 3: Configure .env
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/zenspace"
DIRECT_URL="postgresql://postgres:password@localhost:5432/zenspace"
```

### Step 4: Run Migration
```bash
npx prisma migrate dev --name init
```

---

## Database Schema Overview

Your database includes the following tables:

### Users
- `id`, `email` (unique), `name`, `password` (hashed), `avatar`, `role`
- Relations: Workspaces (owner), Projects (lead), Tasks (assignee), Comments

### Workspaces
- `id`, `name`, `ownerId`
- Contains projects and team members

### Projects
- `id`, `name`, `description`, `status`, `priority`, `progress`, `startDate`, `endDate`
- Relations: Users (lead + members), Tasks, Files, Comments

### Tasks
- `id`, `title`, `description`, `status`, `type`, `priority`, `dueDate`
- Relations: Project, Assignee, Files, Comments

### FileAssets
- `id`, `name`, `size`, `type`, `url`
- Relations: Project, Task, Uploader

### Comments
- `id`, `content`
- Relations: User, Project/Task (optional)

---

## Using the API

The API is now ready to use with Prisma! The API layer automatically:
- Hashes passwords with bcrypt
- Validates user authentication
- Performs all queries through Prisma Client

### Authentication Flow
```typescript
// Login
const { user, token } = await authAPI.login('user@example.com', 'password')

// Signup
const { user, token } = await authAPI.signup('John', 'john@example.com', 'password')

// Fetch projects
const projects = await projectAPI.getProjects(workspaceId)

// Create task
const task = await taskAPI.createTask({
  title: 'New Task',
  projectId: 'p123',
  assigneeId: 'u123'
})
```

---

## Common Tasks

### Reset Database
⚠️ **WARNING:** This deletes all data!
```bash
npx prisma migrate reset
```

### View Database
```bash
npx prisma studio
```

### Generate Prisma Client
```bash
npx prisma generate
```

### Inspect Database
```bash
npx prisma db execute
```

---

## Troubleshooting

### Error: "Can't reach database server"
- Check your DATABASE_URL in `.env`
- Verify database is running (for local PostgreSQL)
- Test connection: `psql <your-connection-string>`

### Error: "relation does not exist"
- Run migrations: `npx prisma migrate dev`
- Check schema: `cat prisma/schema.prisma`

### Error: "password authentication failed"
- Verify credentials in `.env`
- Reset password in Supabase/PostgreSQL console

### Prisma Client not found
- Run: `npx prisma generate`

---

## Next Steps

1. ✅ Set up database
2. ✅ Run migrations
3. 🔄 Test login/signup in your app
4. 🔄 Deploy to production (more details needed)

---

## Resources

- **Prisma Docs:** https://www.prisma.io/docs/
- **Supabase Docs:** https://supabase.com/docs
- **PostgreSQL Docs:** https://www.postgresql.org/docs/
- **Prisma Studio:** Visual database manager

---

## Need Help?

If you get stuck:
1. Check the error message carefully
2. Review your `.env` file
3. Verify database connection with `psql`
4. Check Prisma logs: `npx prisma --debug`

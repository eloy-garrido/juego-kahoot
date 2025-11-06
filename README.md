# Kahoot! Clone - Database Setup

This document provides instructions on how to set up the database for the Kahoot! clone project using the provided SQL scripts.

## Prerequisites

- A Supabase project.
- Access to the Supabase SQL Editor.

## Instructions

To set up the database, you need to run the SQL scripts in the `sql/` directory in the following order:

1.  **`schema.sql`**: This script creates the database schema, including all the necessary tables and their relationships.
2.  **`rls.sql`**: This script enables Row Level Security (RLS) and applies the security policies to the tables.

### Step-by-step Guide

1.  **Navigate to the Supabase SQL Editor**: In your Supabase project dashboard, go to the "SQL Editor" section.
2.  **Run `schema.sql`**:
    -   Open the `sql/schema.sql` file and copy its entire content.
    -   Paste the content into the Supabase SQL Editor.
    -   Click the "RUN" button to execute the query. This will create all the necessary tables.
3.  **Run `rls.sql`**:
    -   Open the `sql/rls.sql` file and copy its entire content.
    -   Paste the content into the SQL Editor.
    -   Execute the query. This will enable Row Level Security (RLS) and apply the security policies to your tables.

**Important**: It is crucial to run the scripts in the specified order (`schema.sql`, then `rls.sql`) to avoid any errors.

### Seeding the Database

The `seed.sql` file has been removed as it was not reliable. To seed the database with test data, you should:

1.  **Create an admin user**: Sign up a new user via Supabase Auth and then manually edit the `profiles` table to set the `role` to `admin`.
2.  **Create a quiz**: As the admin user, create a quiz, questions, and options.

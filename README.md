# SGA Tooling API

This is the API for the SGA Tooling project

## Get Started

Clone the project, add environment variables (listed below) in `.env`.

```env
MYSQL DB
DB_HOST=
DB_NAME=
DB_USER=
DB_PASS=

JWT
JWT_SECRET=
```

Then do `yarn` and `vercel dev` to get the project running locally. 

## Tech Stack

API built using Vercel's Serverless Functions and Typescript.

## Features

- Authenticates users, and provides jwt on auth
- Covers all relevant routes for the SGA Tooling project
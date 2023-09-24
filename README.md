# Ideal Image Calendar

## Overview

Ideal Image Calendar is a modern, feature-rich calendar application built on the Bun runtime. It's designed to provide an intuitive and interactive experience for managing events, tasks, and schedules. The app is built using Next.js and leverages a variety of cutting-edge libraries to deliver a seamless user experience.

## Version

Current version: 0.1.0

## Features

- Event management with various calendar views (Day Grid, Time Grid, List, etc.)
- Interactive UI with drag-and-drop capabilities
- Integration with Prisma for database operations
- Authentication using Next-Auth
- Real-time data fetching and state management with React Query and Jotai
- Server-side logic with tRPC
- Customizable UI with Tailwind CSS
- Code quality ensured by ESLint and Prettier

## Installation

After cloning the repository, run the following commands to set up the project:

```bash
# Install dependencies
bun install

# Push Prisma schema to your database

bun db:push

# Generate Prisma client
bun postinstall

# Start the development server
bun dev
```

## Scripts

- `build`: Build the Next.js application
- `db:push`: Push the database schema using Prisma
- `dev`: Start the development server
- `postinstall`: Generate Prisma client after installation
- `lint`: Lint the codebase using ESLint
- `start`: Start the production server

## Dependencies

- Next.js
- Prisma
- FullCalendar
- React Query
- tRPC
- Jotai
- Nodemailer
- React Spring
- Zod
- And many more...

## Dev Dependencies

- TypeScript
- ESLint
- Prettier
- Tailwind CSS
- ts-node
- And more...

## Runtime

This app uses the [Bun runtime](https://bun.sh/).

## Contributing

Feel free to open issues and pull requests to improve the application.

## License

This project is set to private. Please refer to the team's guidelines for usage and contributions.

For more details, please refer to the `package.json` file in the repository.

# VocabInk Backend

**Turn new vocabulary into meaningful professional content.**

VocabInk is a personal vocabulary builder and AI-powered writing assistant for developers and professionals who want to strengthen their English and share their learning on LinkedIn. It connects vocabulary practice with practical writing, helping users apply new words in content shaped by their professional interests and experience.

This repository contains the backend API that powers VocabInk: vocabulary management, personalized onboarding, authentication, and AI-assisted post generation with Google Gemini. Users can build a personal dictionary, select a writing template, and create LinkedIn post drafts that incorporate the vocabulary they are learning.

Frontend application: [VocabInk Frontend](https://github.com/kevinmoraTec/VocabInk-Frontend-Repository).

## Demo

https://github.com/user-attachments/assets/d9d2f008-d460-4a34-b0df-a38e3b7deb14


## Contents

- [Demo](#demo)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Validation](#validation)
- [Contributing](#contributing)
- [Uploading to GitHub](#uploading-to-github)
- [License](#license)

## Features

- **Personal vocabulary management:** Create, organize, update, and review words and phrases in a personal dictionary.
- **AI-assisted writing:** Generate LinkedIn post drafts with Google Gemini using selected vocabulary, professional context, and English proficiency level.
- **Reusable writing templates:** Structure posts around formats such as lessons learned and technical tips.
- **Personalized onboarding:** Capture each user’s role, English level, and interests to inform content generation.
- **Account authentication:** Support Google sign-in and LinkedIn account integration through Passport.js, with JWT-based authentication.
- **User feedback:** Collect bug reports and feature requests to support product improvements.

## Tech Stack

- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Sequelize](https://sequelize.org/)
- **AI**: [Google GenAI SDK](https://ai.google.dev/) (Gemini)
- **Validation**: [Joi](https://joi.dev/)
- **Security**: Helmet, CORS, Cookie-Parser

## Prerequisites

To run the API locally, you will need:

- **Node.js 22.13+** (`nvm use` selects the project’s Node version)
- **npm** (Node Package Manager)
- **PostgreSQL** installed and running locally
- A **Google Cloud Project** with OAuth credentials enabled
- A **Google AI Studio** API Key (for Gemini)
- A **LinkedIn developer application** with OAuth credentials

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/kevinmoraTec/VocabInk-API-Repository.git
   cd VocabInk-API-Repository
   ```

2. **Install dependencies:**
   ```bash
   npm ci
   ```

## Environment Variables

Copy the committed example and fill in your credentials:

```bash
cp .env.example .env
```

Use `DATABASE_URL` for the PostgreSQL connection. Both Google and LinkedIn
OAuth credentials are required because both strategies initialize at startup.
Register the exact callback URLs from `.env.example` in each provider’s console.
`GOOGLE_API_KEY` enables Gemini post generation. Set `JWT_SECRET` to a long,
random value using the command in the example file.

The frontend defaults to `http://localhost:8080`. If using another origin,
update the CORS whitelist in `index.js` as well as `FRONTEND_URL`.
Never commit `.env` or real credentials; `.env.example` contains placeholders only.

## Database Setup

This project uses **Sequelize** for database management.

1. **Create the database** (if using PostgreSQL CLI):
   ```bash
   createdb lingoloop_db
   ```

2. **Run migrations** to create the database tables:
   ```bash
   npm run migrations:run
   ```

3. **Run seeders** to populate writing templates and vocabulary categories:
   ```bash
   npm run seed:run
   ```

To revert migrations if needed:

- Undo last migration: `npm run migrations:undo`
- Revert all: `npm run migrations:revert`

## Running the Application

### Development Mode

Runs the server with `--watch` mode (auto-reload on changes):
```bash
npm run dev
```

### Production Mode

```bash
npm start
```

The server listens on `http://localhost:3000` by default. API routes use the `/v1` prefix. Set `PORT` in `.env` to change the listening port.

## Project Structure

```text
.
├── .github/workflows/  # GitHub Actions validation
├── config/            # Environment configuration
├── scripts/           # Development checks
├── src/
│   ├── db/            # Models, migrations, seeders, and database configuration
│   ├── libs/          # Sequelize initialization
│   ├── middlewares/   # Authentication, validation, and error handling
│   ├── routes/        # API endpoints
│   ├── schemas/       # Request validation schemas
│   ├── services/      # Business logic and external integrations
│   └── utils/         # Passport configuration and OAuth strategies
├── .env.example       # Environment variable template
├── index.js           # Express application entry point
└── package.json       # Dependencies and npm scripts
```

## Validation

```bash
npm run check
```

This checks JavaScript syntax without connecting to PostgreSQL or OAuth providers.
GitHub Actions runs the same check on pushes and pull requests. There is no
application test suite yet; database migrations and OAuth/AI flows require
configured services and must be verified separately.

## Contributing

Contributions are welcome. For substantial changes, open an issue first to discuss the proposed approach.

1. Fork the repository and create a branch for your change.
2. Follow the existing route, service, schema, and model structure.
3. Run `npm run check` and verify any affected flows with the required services configured.
4. Open a pull request describing the change and how you verified it.

## Uploading to GitHub

Create an empty GitHub repository, then run from this folder:

```bash
git add .
git diff --cached --stat
git commit -m "Initial commit"
git remote add origin https://github.com/kevinmoraTec/VocabInk-API-Repository.git
git push -u origin main
```

Local secrets and `node_modules/`
are excluded by `.gitignore`.

## License

This project is licensed under the [MIT License](LICENSE).

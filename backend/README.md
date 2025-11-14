# NoteBox - Backend API

Backend API for NoteBox, a lightweight application for creating quick notes with search and tag categorization.

## Technology Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MS SQL Server
- **Architecture**: REST API

## Project Structure

```
src/
├── api/                    # API controllers (feature implementations go here)
│   └── v1/
│       ├── external/       # Public endpoints
│       └── internal/       # Authenticated endpoints
├── routes/                 # Route definitions
│   └── v1/
│       ├── externalRoutes.ts
│       ├── internalRoutes.ts
│       └── index.ts
├── middleware/             # Express middleware
│   ├── error.ts
│   ├── notFound.ts
│   └── index.ts
├── services/               # Business logic (feature services go here)
├── utils/                  # Utility functions
│   ├── response.ts
│   └── index.ts
├── config/                 # Configuration
│   └── index.ts
└── server.ts              # Application entry point
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MS SQL Server
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Configure environment variables in `.env`

### Development

Run the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:3000`

### Build

Build for production:
```bash
npm run build
```

### Production

Start production server:
```bash
npm start
```

## API Endpoints

### Health Check
- `GET /health` - API health status

### API Version 1
- Base URL: `/api/v1`
- External (public): `/api/v1/external/*`
- Internal (authenticated): `/api/v1/internal/*`

## Environment Variables

See `.env.example` for all available configuration options.

## Development Guidelines

- All feature implementations go in `src/api/v1/internal/` or `src/api/v1/external/`
- Business logic belongs in `src/services/`
- Follow TypeScript strict mode
- Use path aliases with `@/` prefix
- Maintain consistent error handling
- Document all public APIs

## License

ISC

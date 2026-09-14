# Phase 1 — Foundation

- Clean up create-next-app output
- TypeScript strict mode
- ESLint
- Tailwind
- shadcn/ui
- Environment configuration
- Basic layout
- Mobile navigation
- PWA manifest

# Phase 2 — Persistence

- PostgreSQL
- Prisma
- Initial schema
- Migrations
- Seed/development data
- Database helper

# Phase 3 — Authentication

- Entra ID
- Session handling
- requireUser()
- Authorisation foundation
- Protected routes

# Phase 4 — Core application

Implement your known requirements feature-by-feature.

Each feature should ideally contain:

```
features/
└── deliveries/
    ├── actions.ts
    ├── queries.ts
    ├── validation.ts
    ├── types.ts
    └── components/
```

# Phase 5 — Documents/media

- Docket generation
- Signatures
- Photos
- Object storage
- File access/security

# Phase 6 — PWA

- Service worker
- Caching
- Install experience
- Offline detection
- Network failure UX

# Phase 7 — Testing

- Unit tests
- Critical Playwright workflows
- Mobile viewport testing
- PWA testing

# Phase 8 — Deployment

- Production PostgreSQL
- Environment variables/secrets
- HTTPS
- Authentication configuration
- Storage
- Logging
- Backups
- CI/CD

# COFIS IMMOBILIER

COFIS IMMOBILIER is a property and rental management platform designed for the Cameroonian market.

## Project status

The repository is being initialized. Application development will take place on the `development` branch. The `main` branch is reserved for reviewed, stable releases.

## Planned technology

- Next.js
- TypeScript
- PostgreSQL with Supabase
- Supabase Auth and private Storage

## Core business scope

Owners, properties, units, tenants, leases, rent schedules, payments, arrears, expenses, owner remittances, users and roles, settings, and reports.

## Important development safeguards

- Do not apply database migrations to a shared or production environment without explicit approval.
- Do not create or connect a Supabase project without explicit approval.
- Keep financial operations auditable and use integer minor currency units (FCFA/XAF) rather than floating-point values.
- Validate unresolved business rules before implementing them as definitive behavior.

## Getting started

The application scaffold and setup instructions will be added on the `development` branch.

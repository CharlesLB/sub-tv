export const E2E_USERNAME = process.env.E2E_USERNAME ?? 'Operador E2E'
export const E2E_PASSWORD = process.env.E2E_PASSWORD ?? 'senha-e2e-local'
export const LOCAL_DATABASE_URL = 'postgres://postgres:postgres@localhost:5432/postgres'
export const DATABASE_URL = process.env.DATABASE_URL ?? LOCAL_DATABASE_URL

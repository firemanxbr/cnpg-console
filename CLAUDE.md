# CNPG Console — Project Context for Claude

## Overview
CNPG Console is an open-source (MIT) web management UI for CloudNativePG PostgreSQL clusters on Kubernetes.

## Tech Stack
- **Frontend**: Svelte 5 + SvelteKit + Tailwind CSS (in `frontend/`)
- **CLI**: Go 1.25+ with Cobra (in `cmd/cnpg-console/`, `internal/`, `pkg/`)
- **Deployment**: Helm chart (in `helm/cnpg-console/`)
- **Auth**: Dex OIDC (configured via `values.yaml`)
- **Container**: Multi-arch Docker (amd64/arm64)
- **CI/CD**: GitHub Actions (`.github/workflows/`)

## Architecture
The console is **stateless** — all data lives in the Kubernetes cluster. The Svelte frontend talks directly to the Kubernetes API server via an in-cluster proxy, authenticated through Dex OIDC tokens.

## CNPG CRD Resources
The project manages these CloudNativePG custom resources (API group `postgresql.cnpg.io/v1`):
- `Cluster` — PostgreSQL cluster (primary + replicas)
- `Backup` / `ScheduledBackup` — Physical backups
- `Pooler` — PgBouncer connection pooling
- `Database` — Declarative database management
- `Publication` / `Subscription` — Logical replication

## Key Directories
```
cmd/cnpg-console/       # Go CLI entrypoint
internal/checks/        # Pre-flight cluster checks
internal/helm/          # Helm install/uninstall logic
pkg/version/            # Version info (injected at build)
frontend/src/lib/api/   # Kubernetes API client (TypeScript)
frontend/src/lib/types/ # CNPG type definitions
frontend/src/routes/    # SvelteKit pages
helm/cnpg-console/      # Helm chart + values.yaml
deploy/kind/            # Local dev cluster config
```

## Development Commands
```bash
make kind-up          # Create local kind cluster + install CNPG operator
make cli              # Build Go CLI
make frontend         # Build Svelte frontend
make docker           # Build container image
make dev              # Full local dev setup
make kind-down        # Tear down local cluster
```

## Code Style
- Go: standard `gofmt`, `go vet`, `golangci-lint`
- TypeScript/Svelte: ESLint, `svelte-check`
- Commits: Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`)
- PRs required — no direct pushes to `main`

## Color Palette (CNPG brand)
- Navy: `#1b3a5c` (primary)
- Teal: `#17b9a0` (accent/CTA)
- Dark: `#0f2440` (sidebar)
- Font: IBM Plex Sans / IBM Plex Mono

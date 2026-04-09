<p align="center">
  <img src="docs/assets/cnpg-console-logo.svg" alt="CNPG Console" width="360">
</p>

<h1 align="center">CNPG Console</h1>

<p align="center">
  <strong>A web-based management console for <a href="https://cloudnative-pg.io">CloudNativePG</a> clusters on Kubernetes</strong>
</p>

<p align="center">
  <a href="https://github.com/firemanxbr/cnpg-console/actions/workflows/release.yaml"><img src="https://github.com/firemanxbr/cnpg-console/actions/workflows/release.yaml/badge.svg" alt="Release"></a>
  <a href="https://github.com/firemanxbr/cnpg-console/actions/workflows/ci.yaml"><img src="https://github.com/firemanxbr/cnpg-console/actions/workflows/ci.yaml/badge.svg" alt="CI"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-732DD9" alt="License: MIT"></a>
  <a href="https://github.com/firemanxbr/cnpg-console/releases"><img src="https://img.shields.io/github/v/release/firemanxbr/cnpg-console?color=732DD9" alt="Release"></a>
</p>

---

## What is CNPG Console?

CNPG Console is a **stateless web UI** that provides a complete visual management experience for [CloudNativePG](https://cloudnative-pg.io) — the Kubernetes operator for PostgreSQL. It enables database administrators and platform engineers to **create, inspect, edit, and delete** all CNPG resources without writing YAML by hand.

The frontend communicates **directly with the Kubernetes API** — no backend server or database is required. All state lives in your cluster.

### Key Features

| Area | Capabilities |
|---|---|
| **Clusters** | Create, list, inspect, edit, scale, delete CNPG Cluster resources. View instance status, replication lag, pod health, PostgreSQL configuration. Trigger switchover/failover. |
| **Backups & Recovery** | On-demand and scheduled backups. Browse backup history, inspect WAL archiving status. Volume snapshot and Barman Object Store support. |
| **Databases & Roles** | Declarative database management via CNPG Database CRD. Create, inspect, and delete databases with encoding, locale, and template options. |
| **Connection Pooling** | Create and manage PgBouncer Pooler resources. Configure pool mode, instances, pause/resume. |
| **Logical Replication** | Manage Publications and Subscriptions for cross-cluster logical replication. |
| **Monitoring** | Live view of cluster health, Kubernetes events, pod status, and container logs. |
| **Image Catalogs** | Browse and manage ImageCatalog and ClusterImageCatalog resources. |
| **Multi-namespace** | Operates across all namespaces the authenticated user has access to. |
| **Authentication** | Integrated with [Dex](https://dexidp.io/) — configure any OIDC, LDAP, GitHub, Google, or SAML provider via `values.yaml`. |

---

## Architecture

```
┌─────────────────────────────────┐
│         Browser (SvelteKit)     │
│   Stateless SPA  ─ no backend  │
└──────────┬──────────────────────┘
           │  HTTPS (Bearer token)
           ▼
┌─────────────────────────────────┐
│     Kubernetes API Server       │
│  ┌───────────┐  ┌────────────┐  │
│  │ CNPG CRDs │  │ Core APIs  │  │
│  └───────────┘  └────────────┘  │
└─────────────────────────────────┘
           ▲
           │  OIDC tokens
┌──────────┴──────────────────────┐
│          Dex IdP                │
│  (GitHub, Google, LDAP, SAML…) │
└─────────────────────────────────┘
```

- **Frontend**: SvelteKit 5 app served via Nginx. All API calls go directly to the Kubernetes API using the user's bearer token through an in-cluster proxy.
- **Authentication**: Dex issues OIDC tokens. Configure your preferred identity providers in the Helm `values.yaml`.
- **Backup Storage**: Object storage access (S3, GCS, Azure) is configured via an existing StorageClass referenced in `values.yaml`.

---

## Installation

### Option 1 — Helm Chart (recommended)

```bash
helm repo add cnpg-console https://firemanxbr.github.io/cnpg-console
helm repo update

helm install cnpg-console cnpg-console/cnpg-console \
  --namespace cnpg-console \
  --create-namespace \
  -f my-values.yaml
```

Container images are published for **linux/amd64** and **linux/arm64** to `ghcr.io/firemanxbr/cnpg-console`.

### Option 2 — CLI Installer

The `cnpg-console` CLI (written in Go) validates your cluster, checks prerequisites, and installs the Helm chart for you:

```bash
# Download from releases
curl -LO https://github.com/firemanxbr/cnpg-console/releases/latest/download/cnpg-console-$(uname -s | tr '[:upper:]' '[:lower:]')-$(uname -m | sed 's/x86_64/amd64/')
chmod +x cnpg-console-*
sudo mv cnpg-console-* /usr/local/bin/cnpg-console

# Preflight checks
cnpg-console check

# Install (runs preflight checks + Helm install)
cnpg-console install --values my-values.yaml

# Uninstall
cnpg-console uninstall
```

The CLI performs these checks before installing:
1. Kubernetes cluster is reachable (current `kubectl` context).
2. CloudNativePG operator CRDs (`postgresql.cnpg.io/v1`) are present.
3. Required RBAC permissions are in place.

---

## Configuration

All configuration is done through `values.yaml`. Key sections:

```yaml
# Authentication via Dex
dex:
  enabled: true
  connectors:
    - type: github
      id: github
      name: GitHub
      config:
        clientID: $GITHUB_CLIENT_ID
        clientSecret: $GITHUB_CLIENT_SECRET
        redirectURI: https://cnpg-console.example.com/callback

# Object storage for backups/WAL
objectStorage:
  storageClass: "ceph-bucket"
  endpoint: "https://s3.example.com"
  bucket: "cnpg-backups"

# Ingress
ingress:
  enabled: true
  hosts:
    - host: cnpg-console.example.com
      paths:
        - path: /
          pathType: Prefix
  tls:
    - secretName: cnpg-console-tls
      hosts:
        - cnpg-console.example.com
```

See [`helm/cnpg-console/values.yaml`](helm/cnpg-console/values.yaml) for the full reference.

---

## Development

### Prerequisites

| Tool | Version |
|---|---|
| [Docker](https://docs.docker.com/get-docker/) | >= 24 |
| [Kind](https://kind.sigs.k8s.io/) | >= 0.20 |
| [kubectl](https://kubernetes.io/docs/tasks/tools/) | >= 1.28 |
| [Helm](https://helm.sh/docs/intro/install/) | >= 3.12 |
| [Node.js](https://nodejs.org/) | >= 20 LTS |
| [Go](https://go.dev/dl/) | >= 1.22 |

### 1. Create a Local Kind Cluster

```bash
make kind-create        # creates cluster + installs CNPG operator
```

This uses the Kind configuration at [`deploy/kind/kind-config.yaml`](deploy/kind/kind-config.yaml) which creates a 3-node cluster (1 control-plane + 2 workers) with port mappings for HTTP/HTTPS.

### 2. Run the Frontend in Dev Mode

```bash
cd frontend
npm install
npm run dev             # http://localhost:5173
```

The Vite dev server proxies `/api` requests to the Kubernetes API server automatically.

### 3. Build and Test the CLI

```bash
make cli-build          # output: bin/cnpg-console
make cli-test           # run Go tests with race detection

# Run preflight checks
./bin/cnpg-console check

# Install into the Kind cluster
./bin/cnpg-console install --namespace cnpg-console
```

### 4. Build Container Images

```bash
make docker-build       # builds frontend + CLI images
make kind-load          # loads images into Kind cluster
make helm-install       # installs Helm chart into cluster
```

### 5. Tear Down

```bash
make kind-delete
```

---

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

**Branch protection is enforced** — all changes must go through a Pull Request. Direct pushes to `main` are blocked.

### Quick Start for Contributors

```bash
git clone https://github.com/firemanxbr/cnpg-console.git
cd cnpg-console
make kind-create                      # spin up a dev cluster
cd frontend && npm install && npm run dev   # start hacking on the UI
```

### Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add cluster detail view with instance topology
fix: correct namespace selector not updating on login
docs: update development setup instructions
chore: bump SvelteKit to 2.8.0
```

---

## Project Structure

```
cnpg-console/
├── cmd/cnpg-console/           # Go CLI entrypoint (Cobra)
├── internal/                   # Go internal packages
│   ├── cli/                    # CLI command implementations (install, check, uninstall)
│   ├── checks/                 # Preflight cluster validation
│   └── helm/                   # Helm install/uninstall logic
├── pkg/version/                # Version info (injected at build time)
├── frontend/                   # SvelteKit 5 application
│   └── src/
│       ├── lib/
│       │   ├── api/            # Kubernetes API client (TypeScript)
│       │   ├── components/     # Reusable Svelte components
│       │   ├── stores/         # Svelte reactive stores (auth, namespace)
│       │   └── types/          # CNPG TypeScript type definitions
│       └── routes/             # SvelteKit file-based routing
│           ├── clusters/       # Cluster list + detail views
│           ├── backups/        # Backup & scheduled backup management
│           ├── poolers/        # PgBouncer pooler management
│           ├── databases/      # Declarative database management
│           ├── replication/    # Publication & subscription management
│           ├── monitoring/     # Cluster health, events, pod logs
│           ├── settings/       # Storage class viewer
│           └── login/          # Dex OIDC authentication
├── helm/cnpg-console/          # Helm chart
│   ├── templates/              # K8s manifests (deployment, rbac, dex, ingress)
│   └── values.yaml             # Default configuration
├── deploy/kind/                # Kind cluster config for local dev
├── hack/                       # Build utilities (nginx.conf)
├── docs/                       # Documentation & images
├── .github/                    # CI/CD workflows, issue templates, CODEOWNERS
├── Makefile                    # Build, test, dev commands
├── Dockerfile                  # Multi-stage build (frontend + Nginx)
├── Dockerfile.cli              # CLI binary build
├── CONTRIBUTING.md             # Contributor guide
└── LICENSE                     # MIT License
```

---

## Roadmap

- [x] Project scaffolding, Helm chart & CI/CD
- [x] Cluster list with status cards
- [x] Cluster detail view (instances, config, storage, events)
- [x] Backup management (on-demand + scheduled, create/delete)
- [x] Database declarative management (CRUD)
- [x] PgBouncer Pooler management (CRUD, pause/resume)
- [x] Logical replication (Publications & Subscriptions)
- [x] Monitoring dashboard (health overview, events, pod logs)
- [x] Dex OIDC authentication integration
- [x] CLI preflight checks & installer
- [ ] Recovery wizard (full + PITR)
- [ ] Image Catalog management UI
- [ ] Replica cluster topology visualization
- [ ] Hibernation management
- [ ] Grafana dashboard integration
- [ ] E2E test suite

---

## License

This project is licensed under the [MIT License](LICENSE).

---

<p align="center">
  Built with care for the <a href="https://cloudnative-pg.io">CloudNativePG</a> community
</p>

# Contributing to CNPG Console

Thank you for your interest in contributing! This project is in its early stages and every contribution counts.

## Code of Conduct

Be respectful, inclusive, and constructive. We follow the [Contributor Covenant](https://www.contributor-covenant.org/).

## How to Contribute

### Reporting Bugs

Open a [GitHub Issue](https://github.com/firemanxbr/cnpg-console/issues/new?template=bug_report.md) with:
- Steps to reproduce
- Expected vs actual behavior
- Environment details (K8s version, CNPG version, browser)

### Suggesting Features

Open a [Feature Request](https://github.com/firemanxbr/cnpg-console/issues/new?template=feature_request.md) describing:
- The problem you want to solve
- Your proposed solution
- Any alternatives you considered

### Pull Requests

1. Fork the repo and create a branch from `main`.
2. Set up your local dev environment (see below).
3. Make your changes with clear, descriptive commits.
4. Add or update tests as appropriate.
5. Ensure `make lint` and `make test` pass.
6. Open a PR against `main`.

**All PRs require review before merging.** Direct pushes to `main` are not allowed.

## Development Setup

### Prerequisites

- Docker ≥ 24
- Kind ≥ 0.20
- kubectl ≥ 1.28
- Helm ≥ 3.12
- Node.js ≥ 20 LTS
- Go >= 1.25

### Quick Start

```bash
# Clone
git clone https://github.com/firemanxbr/cnpg-console.git
cd cnpg-console

# Create local cluster with CNPG
make kind-create

# Start frontend dev server
cd frontend
npm install
npm run dev

# In another terminal — build CLI
make cli-build
make cli-test
```

### Running Tests

```bash
make test           # all tests
make test-frontend  # Svelte tests only
make test-cli       # Go tests only
make lint           # linting (ESLint + golangci-lint)
```

### Building Container Images

```bash
make docker-build   # build all images
make kind-load      # load images into Kind cluster
```

### Tear Down

```bash
make kind-delete
```

## Style Guide

- **Frontend**: Follow Svelte/SvelteKit conventions. Use TypeScript. Run `npm run check` before committing.
- **Go**: Follow standard Go conventions. Run `golangci-lint run` before committing.
- **Commits**: Use [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, `chore:`).

## Release Process

Releases are automated via GitHub Actions. When a tag `vX.Y.Z` is pushed:
1. Container images are built for `linux/amd64` and `linux/arm64`.
2. CLI binaries are compiled for all platforms.
3. Helm chart is packaged and published to GitHub Pages.
4. A GitHub Release is created with all artifacts.

## Questions?

Open a [Discussion](https://github.com/firemanxbr/cnpg-console/discussions) or reach out via Issues.

.PHONY: all cli-build cli-test docker-build docker-push kind-create kind-delete kind-up kind-down destroy test test-frontend test-cli test-e2e lint help

REGISTRY ?= ghcr.io/firemanxbr
IMAGE_NAME ?= cnpg-console
VERSION ?= $(shell git describe --tags --always --dirty 2>/dev/null || echo "dev")
KIND_CLUSTER ?= cnpg-console-dev
PLATFORMS ?= linux/amd64,linux/arm64

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

all: cli-build docker-build ## Build everything

# --- CLI ---
cli-build: ## Build the Go CLI
	@echo "Building CLI..."
	CGO_ENABLED=0 go build -ldflags="-s -w -X main.version=$(VERSION)" -o bin/cnpg-console ./cmd/cnpg-console

cli-test: ## Run Go tests
	go test ./... -v -race

# --- Frontend ---
frontend-install: ## Install frontend dependencies
	cd frontend && npm ci

frontend-dev: ## Run frontend dev server
	cd frontend && npm run dev

frontend-build: ## Build frontend for production
	cd frontend && npm run build

frontend-check: ## Type-check frontend
	cd frontend && npm run check

# --- Docker ---
docker-build: ## Build container images
	docker build -t $(REGISTRY)/$(IMAGE_NAME):$(VERSION) .
	docker build -t $(REGISTRY)/$(IMAGE_NAME)-cli:$(VERSION) -f Dockerfile.cli .

docker-build-multiarch: ## Build multi-arch images
	docker buildx build --platform $(PLATFORMS) -t $(REGISTRY)/$(IMAGE_NAME):$(VERSION) --push .
	docker buildx build --platform $(PLATFORMS) -t $(REGISTRY)/$(IMAGE_NAME)-cli:$(VERSION) -f Dockerfile.cli --push .

docker-push: ## Push images
	docker push $(REGISTRY)/$(IMAGE_NAME):$(VERSION)
	docker push $(REGISTRY)/$(IMAGE_NAME)-cli:$(VERSION)

# --- Kind ---
kind-create: ## Create Kind cluster with CNPG + S3Mock + sample cluster
	@echo "==> Creating Kind cluster..."
	kind create cluster --name $(KIND_CLUSTER) --config deploy/kind/kind-config.yaml
	@echo "==> Installing CNPG operator..."
	kubectl apply --server-side -f https://raw.githubusercontent.com/cloudnative-pg/cloudnative-pg/release-1.25/releases/cnpg-1.25.1.yaml
	@echo "==> Waiting for CNPG operator..."
	kubectl wait --for=condition=Available --timeout=120s deployment/cnpg-controller-manager -n cnpg-system
	@echo "==> Deploying S3Mock (Apache 2.0 S3-compatible storage)..."
	kubectl apply -f deploy/kind/s3mock.yaml
	kubectl wait --for=condition=Available --timeout=60s deployment/s3mock -n s3mock
	@echo "==> Creating sample PostgreSQL cluster with backup config..."
	kubectl apply -f deploy/kind/sample-cluster.yaml
	@echo "==> Waiting for sample cluster to be ready (this may take a few minutes)..."
	@kubectl wait --for=condition=Ready --timeout=300s cluster/sample-pg -n default 2>/dev/null || echo "    Cluster still starting — resources applied, they will reconcile when ready."
	@echo ""
	@echo "Kind cluster ready with demo resources!"
	@echo "  Cluster:   sample-pg (3 instances)"
	@echo "  Pooler:    sample-pg-pooler (PgBouncer)"
	@echo "  Databases: analytics, reporting"
	@echo "  Backup:    sample-pg-daily (scheduled), sample-pg-backup-initial"
	@echo ""
	@echo "Run 'make dev' to start developing."

kind-delete: ## Delete Kind cluster
	kind delete cluster --name $(KIND_CLUSTER)

destroy: kind-delete ## Destroy the dev Kind cluster (alias for kind-delete)

kind-load: docker-build ## Load images into Kind
	kind load docker-image $(REGISTRY)/$(IMAGE_NAME):$(VERSION) --name $(KIND_CLUSTER)

kind-up: kind-create ## Alias: create cluster + full dev setup

kind-down: kind-delete ## Alias: tear down cluster

# --- Development ---
dev: ## Start full dev environment (kubectl proxy + frontend)
	@echo "Starting kubectl proxy on port 8001..."
	@kubectl proxy --port=8001 &
	@echo "Starting frontend dev server..."
	cd frontend && npm install && npm run dev

# --- Test & Lint ---
test: test-cli test-frontend ## Run all tests

test-frontend: ## Run frontend unit tests
	cd frontend && npm run test

test-cli: cli-test ## Alias for cli-test

test-e2e: ## Run Playwright E2E tests (requires running dev server + kubectl proxy)
	cd frontend && npx playwright test

test-e2e-ui: ## Run Playwright E2E tests with UI
	cd frontend && npx playwright test --ui

lint: ## Lint all code
	cd frontend && npm run lint
	golangci-lint run ./...

# --- Helm ---
helm-template: ## Render Helm templates locally
	helm template cnpg-console helm/cnpg-console

helm-install: ## Install chart into current cluster
	helm upgrade --install cnpg-console helm/cnpg-console \
		--namespace cnpg-console --create-namespace

helm-package: ## Package Helm chart
	helm package helm/cnpg-console -d dist/

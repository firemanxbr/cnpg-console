# Stage 1: Build SvelteKit app
FROM node:20-alpine AS builder
WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:1.27-alpine
RUN addgroup -g 101 -S nginx || true && \
    adduser -S -D -H -u 101 -h /var/cache/nginx -s /sbin/nologin -G nginx nginx || true
COPY --from=builder /app/build /usr/share/nginx/html
COPY hack/nginx.conf /etc/nginx/nginx.conf
EXPOSE 8080
HEALTHCHECK --interval=10s --timeout=3s CMD wget -qO- http://localhost:8080/healthz || exit 1
USER 101
CMD ["nginx", "-g", "daemon off;"]

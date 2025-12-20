# Kubernetes Deployment for QuickSpin Frontend

This directory contains the Kubernetes manifests for deploying the QuickSpin Frontend (Next.js Dashboard).

## Deployment Structure

- **Namespace**: `quickspin-frontend`
- **Deployment**: `quickspin-frontend` (2 replicas)
- **Service**: `quickspin-frontend` (ClusterIP, Port 3000)
- **Ingress**: Traefik IngressRoute handling `app.quickspin.cloud`
- **TLS**: Managed by cert-manager (Let's Encrypt)

## Prerequisites

1.  **Docker Image**: The image `ghcr.io/quickspin-saas/quick-spin-frontend:latest` must be built and pushed to the registry.
2.  **Kubernetes Cluster**: Access to the k3s cluster.
3.  **Secrets**: The `ghcr-secret` must exist in the `quickspin` namespace (it will be copied automatically by the deployment script).

## Configuration

The application uses the following configuration:
- **ConfigMap** (`configmap.yaml`): Non-sensitive environment variables (`NEXT_PUBLIC_API_URL`, `NEXTAUTH_URL`).
- **Secret** (`secrets.yaml`): Sensitive environment variables (`NEXTAUTH_SECRET`, OAuth credentials).

**IMPORTANT**: Before deploying to production, verify the values in `k8s/secrets.yaml`.

## How to Deploy

Run the deployment script:

```bash
./scripts/deploy.sh
```

Or manually apply the manifests:

1.  Create namespace:
    ```bash
    kubectl apply -f k8s/namespace.yaml
    ```
2.  Copy the image pull secret:
    ```bash
    kubectl get secret ghcr-secret -n quickspin -o yaml | \
    sed 's/namespace: quickspin/namespace: quickspin-frontend/' | \
    kubectl apply -f -
    ```
3.  Apply configuration:
    ```bash
    kubectl apply -f k8s/configmap.yaml
    kubectl apply -f k8s/secrets.yaml
    ```
4.  Apply the rest of the manifests:
    ```bash
    kubectl apply -f k8s/deployment.yaml
    kubectl apply -f k8s/service.yaml
    kubectl apply -f k8s/ingress-route.yaml
    kubectl apply -f k8s/certificate.yaml
    ```

## CI/CD

The GitHub Actions workflows in `.github/workflows` handle automated building and deployment.

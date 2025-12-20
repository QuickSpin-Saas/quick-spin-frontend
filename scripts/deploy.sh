#!/bin/bash
set -e

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
K8S_DIR="$SCRIPT_DIR/../k8s"

echo "Deploying QuickSpin Frontend to Kubernetes..."

# Apply Namespace
echo "Applying Namespace..."
kubectl apply -f "$K8S_DIR/namespace.yaml"

# Copy ghcr-secret from quickspin namespace if it doesn't exist in quickspin-frontend
if ! kubectl get secret ghcr-secret -n quickspin-frontend > /dev/null 2>&1; then
    echo "Copying ghcr-secret from quickspin namespace..."
    # Check if source secret exists
    if kubectl get secret ghcr-secret -n quickspin > /dev/null 2>&1; then
        kubectl get secret ghcr-secret -n quickspin -o yaml | \
        sed 's/namespace: quickspin/namespace: quickspin-frontend/' | \
        sed '/resourceVersion:/d' | \
        sed '/uid:/d' | \
        sed '/creationTimestamp:/d' | \
        kubectl apply -f -
        echo "Secret copied successfully."
    else
        echo "Error: ghcr-secret not found in quickspin namespace. Please create it manually."
        exit 1
    fi
else
    echo "ghcr-secret already exists in quickspin-frontend namespace."
fi

# Apply ConfigMap and Secret (do not fail if secret already exists, user might have edited it)
echo "Applying ConfigMap and Secrets..."
kubectl apply -f "$K8S_DIR/configmap.yaml"
kubectl apply -f "$K8S_DIR/secrets.yaml"

# Apply other manifests
echo "Applying Kubernetes manifests..."
kubectl apply -f "$K8S_DIR/deployment.yaml"
kubectl apply -f "$K8S_DIR/service.yaml"
kubectl apply -f "$K8S_DIR/ingress-route.yaml"
kubectl apply -f "$K8S_DIR/certificate.yaml"

echo "Deployment applied successfully!"
echo "Check status with: kubectl get all -n quickspin-frontend"

#!/usr/bin/env bash
# ==============================================================================
# CivicResolve - Google Cloud Run Deployment Script
# Configures request-based billing, scale-to-zero, strict max instances, and healthchecks
# ==============================================================================

set -e

PROJECT_ID=${1:-$(gcloud config get-value project)}
REGION=${2:-"asia-south1"} # Mumbai (closest to Coimbatore)
SERVICE_NAME="civicresolve-backend"
IMAGE_TAG="gcr.io/${PROJECT_ID}/${SERVICE_NAME}:latest"

echo "Deploying CivicResolve Backend to Google Cloud Run..."
echo "Project ID: ${PROJECT_ID}"
echo "Region: ${REGION}"

# 1. Build container image using Cloud Build (no local Docker required)
echo "[1/3] Building container image via Google Cloud Build..."
gcloud builds submit --tag "${IMAGE_TAG}" -f backend/Dockerfile .

# 2. Deploy to Cloud Run with Cost Guardrails
echo "[2/3] Deploying to Cloud Run with scale-to-zero and max 3 instances..."
gcloud run deploy "${SERVICE_NAME}" \
  --image "${IMAGE_TAG}" \
  --platform managed \
  --region "${REGION}" \
  --allow-unauthenticated \
  --port 8080 \
  --min-instances 0 \
  --max-instances 3 \
  --cpu 1 \
  --memory 512Mi \
  --concurrency 80 \
  --timeout 60s \
  --set-env-vars ENVIRONMENT=production,CITY_FOCUS=Coimbatore,GEMINI_MODEL=gemini-2.5-flash \
  --set-env-vars CORS_ORIGINS="https://civicresolver.vercel.app,https://civicresolve.vercel.app"

# 3. Retrieve public URL and run healthcheck
SERVICE_URL=$(gcloud run services describe "${SERVICE_NAME}" --platform managed --region "${REGION}" --format 'value(status.url)')
echo "[3/3] Deployment complete! Service live at: ${SERVICE_URL}"
echo "Running health check probe on ${SERVICE_URL}/health..."
curl -s "${SERVICE_URL}/health" | jq . || curl -s "${SERVICE_URL}/health"

# Production Dockerfile for CivicResolve Backend (FastAPI on Google Cloud Run)
FROM python:3.11-slim

# Set environment variables for performance and logging
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8080 \
    PYTHONPATH=/app

WORKDIR /app

# Install minimal curl for health check
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies without cache
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy application source
COPY backend/ ./backend/
COPY database/ ./database/

# Run as non-root user for Cloud Run security best practices
RUN addgroup --system appgroup && adduser --system --group appuser
USER appuser

# Cloud Run dynamic PORT binding
EXPOSE 8080

# Launch Uvicorn with Cloud Run PORT variable, single worker for request concurrency, and proxy headers
CMD ["sh", "-c", "exec uvicorn backend.app.main:app --host 0.0.0.0 --port ${PORT:-8080} --proxy-headers"]

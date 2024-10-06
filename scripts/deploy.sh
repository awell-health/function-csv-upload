#!/bin/bash

# Check if the correct number of arguments is provided
if [ $# -ne 1 ]; then
  echo "Usage: $0 <path_to_env_file>"
  exit 1
fi

# Get the .env file from the argument
ENV_FILE=$1

# Load environment variables from the specified .env file
if [ -f "$ENV_FILE" ]; then
  source "$ENV_FILE"
else
  echo ".env file not found at: $ENV_FILE"
  exit 1
fi

# Set the project based on the filename
FILENAME=$(basename "$ENV_FILE")

# Determine the PROJECT_ID based on the filename
if [[ "$FILENAME" == *"sandbox.env" ]]; then
  PROJECT_ID="awell-sandbox"
elif [[ "$FILENAME" == *"us.env" ]]; then
  PROJECT_ID="awell-production-us"
elif [[ "$FILENAME" == *"eu.env" ]]; then
  PROJECT_ID="awell-production"
else
  echo "Cannot determine the PROJECT_ID from the filename. Expected 'sandbox', 'us', or 'eu' in the filename."
  exit 1
fi

# Build the application
echo "Building the application..."
yarn run build

# Set the gcloud project
echo "Setting GCP project to: $PROJECT_ID"
gcloud config set project $PROJECT_ID

# Deploy the cloud function
echo "Deploying the Cloud Function..."
gcloud functions deploy $CLOUD_FUNCTION_NAME \
  --gen2 \
  --trigger-bucket=$STORAGE_BUCKET_NAME \
  --trigger-location=us-central1 \
  --runtime=nodejs20 \
  --region us-central1 \
  --timeout 540 \
  --entry-point=$CLOUD_EVENT_NAME \
  --source=. \
  --set-env-vars=$(grep -v '^GOOGLE_APPLICATION_CREDENTIALS=' "$ENV_FILE" | tr '\n' ',')

if [ $? -ne 0 ]; then
  echo "Failed to deploy the Cloud Function."
  exit 1
fi

echo "Cloud Function deployed successfully."
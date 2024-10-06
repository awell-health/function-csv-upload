#!/bin/bash

# Check if the correct number of arguments is provided
if [ $# -ne 1 ]; then
  echo "Usage: $0 <path_to_env_file>"
  exit 1
fi

# Get the .env file from the argument
ENV_FILE=$1
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

# Load environment variables from the provided .env file
if [ -f "$ENV_FILE" ]; then
  export $(grep -v '^#' "$ENV_FILE" | xargs)
else
  echo ".env file not found at: $ENV_FILE"
  exit 1
fi

# Check if the required environment variables are set
if [ -z "$STORAGE_BUCKET_NAME" ]; then
  echo "STORAGE_BUCKET_NAME must be set in the .env file"
  exit 1
fi

# Create the bucket
echo "Creating bucket: $STORAGE_BUCKET_NAME in project: $PROJECT_ID at location: us-central1"
gcloud storage buckets create gs://$STORAGE_BUCKET_NAME --project $PROJECT_ID --location us-central1

if [ $? -ne 0 ]; then
  echo "Failed to create bucket: $STORAGE_BUCKET_NAME"
  exit 1
fi

echo "Bucket $STORAGE_BUCKET_NAME created successfully in project $PROJECT_ID."
#!/bin/bash

# Check if the correct number of arguments is provided
if [ $# -ne 2 ]; then
  echo "Usage: $0 <path_to_env_file> <email>"
  exit 1
fi

# Get the .env file from the argument
ENV_FILE=$1
EMAIL=$2
FILENAME=$(basename "$ENV_FILE")

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

gsutil iam ch user:$2:roles/storage.objectViewer gs://$STORAGE_BUCKET_NAME
gsutil iam ch user:$2:roles/storage.objectCreator gs://$STORAGE_BUCKET_NAME
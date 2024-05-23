source $1

PROJECT_NAME="awell-sandbox"
if [[ -z "$STORAGE_BUCKET_NAME" ]]; then
  echo "STORAGE_BUCKET_NAME is not set... are you sure you referenced an env file? use `sh create-storage.sh .my-env-file`, using .env.example as your guide"
  exit 1
fi

if [[ ! -z "$2" ]]; then
  echo "using project name, $2"
  PROJECT_NAME=$2
fi

gcloud config set project $2
gcloud storage buckets create gs://$STORAGE_BUCKET_NAME --location=us --public-access-prevention


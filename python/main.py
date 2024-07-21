from glob import glob
from google.cloud import storage
from dotenv import load_dotenv
import os
import json
from base64 import b64decode
load_dotenv()

BUCKET_NAME = os.environ.get("STORAGE_BUCKET_NAME")
FILE_DIRECTORY = os.environ.get("FILE_DIRECTORY")
GOOGLE_APPLICATION_CREDENTIALS = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS")
PATHWAY_DEFINITION_ID = os.environ.get('PATHWAY_DEFINITION_ID')

def get_creds_from_b64(b64_creds: str):
    from google.oauth2 import service_account
    creds = json.loads(b64decode(b64_creds).decode("utf-8"))
    return service_account.Credentials.from_service_account_info(creds)

storage_client = storage.Client(credentials=get_creds_from_b64(GOOGLE_APPLICATION_CREDENTIALS))

def upload_files(pathway_definition_id: str):
    file_names = glob(f"{FILE_DIRECTORY}/*")
    for fn in file_names:
        blob = storage_client.bucket(BUCKET_NAME).blob(f"{pathway_definition_id}/{os.path.basename(fn)}")
        blob.upload_from_filename(fn)
        print(f"File {fn} uploaded to {BUCKET_NAME}")

if __name__ == "__main__":
    upload_files(f"{PATHWAY_DEFINITION_ID}")
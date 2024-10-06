# Function - CSV Upload

Read files from a cloud storage bucket and use them to enroll a list of patients into a care flow, depending on the "folder" the file is uploaded.

![Using the CSV upload script](./csv-upload-script.gif "Using the CSV upload script")

## Using this repository - NodeJS

1. yarn install
2. copy `.env.example` to `.env.{sandbox | us | eu}.local`
3. fill in the environment variables
4. run `yarn run build && yarn deploy <envfile>`, where `<env>` is the environment you wish to deploy.

_Note: this function can only be deployed by someone with appropriate IAM permissions. Non-awell staff are welcome to use this repository to deploy to their own GCP project._

### Using gcloud cli

Make sure you have the `gcloud` cli installed and you're authenticated with an account that's allowed to deploy cloud functions.

## Provisioning buckets and users

There are a couple of scripts that can be used to create buckets and provision users.

```bash
$ sh ./scripts/create-bucket.sh <my_environment_file>
$ sh ./scripts/provision-user.sh <my_environment_file> <email_address>
```

## Uploading csv files

Currently, you can either:

1. upload a CSV directly into a storage bucket using the google cloud console, or
2. use the `yarn run upload` script to select a csv file and a care flow.

### Using the storage bucket

Be sure you upload to the appropriate "folder" (the folder name should be the pathway definition ID), so the function knows which care flow to enroll your patients.

### Using the `yarn run upload` script

Use the `-e`/`--env-file` option (e.g. `yarn run upload -e .my.local.env` ) to specify a specific environment file.

See [this page](https://awellhealth.atlassian.net/l/cp/zg0T60h7) for more instructions.

## Using this repository - Python

1. `python3.12 -m venv ./python/venv`
2. Make sure you have an .env file (similar to above) with base64 encoded service account credentials to upload to a cloud storage bucket
3. add files to a folder (e.g. `./python/test-files`)
4. run the following script:

```bash
$ FILE_DIRECTORY="./python/test-files" PATHWAY_DEFINITION_ID="<your pathway definition id>" python ./python/main.py
```

# Function - CSV Upload

Read files from a cloud storage bucket and use them to enroll a list of patients into a care flow, depending on the "folder" the file is uploaded.

![Using the CSV upload script](./csv-upload-script.gif "Using the CSV upload script")

## Using this repository

1. yarn install
2. copy `.env.example` to `.env`
3. fill in the environment variables
4. run `yarn run build && yarn run deploy:<env>`, where `<env>` is the environment you wish to deploy.

_Note: this function can only be deployed by someone with appropriate IAM permissions. Non-awell staff are welcome to use this repository to deploy to their own GCP project._

### Using gcloud cli

Make sure you have the `gcloud` cli installed and you're authenticated with an account that's allowed to deploy cloud functions.

## Uploading csv files

Currently, you can either:

1. upload a CSV directly into a storage bucket using the google cloud console, or
2. use the `yarn run upload` script to select a csv file and a care flow.

Be sure you upload to the appropriate "folder" (the folder name should be the pathway definition ID), so the function knows which care flow to enroll your patients.

See [this page](https://awellhealth.atlassian.net/l/cp/zg0T60h7) for more instructions.

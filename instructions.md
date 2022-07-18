## Prerequisites
- node v14 or above
- npm
- amplify cli
- an AWS profile with sufficient permissions

## Setup
- Create a serverless mysql-compatible RDS database on AWS Aurora
- Create a s3 bucket name to store uploaded images
- Checkout this repository
- Initilize amplify: `amplify init`, select the corresponding aws profile
- Set the environment variables for Backend based on the Setup step above
- From AWS Amplify console, update Amplify project with the frontend environment variables as shown in the `.env.example` file
- `amplify pull` to pull the latest backend
- `amplify push` to push the latest update to AWS
- Go to the correct Cognito User Pool on AWS console, configure to add custom attribute `custom:org_id` for users, make sure that the field is readable and writable

## To add a new vendor
- Insert a vendor into `Vendor` table, take note of the id 
- From AWS Cognito console, add a new user with email and phone number
- Set the value of `custom:org_id` for the new user to be of vendor id above


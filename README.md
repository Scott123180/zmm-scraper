# ZMM Scraper Program
Scrapes https://zmm.org/all-programs/ for new, waitlisted, or removed programs and emails subscribers when something changes. Data is persisted in S3 so each run can compare against previous program listings.

## How it works
- `src/scraper-client.mjs` pulls the program listing page and each program detail page.
- `src/data-processor.mjs` compares scraped programs to the saved list (`programData.json`) and categorizes new, waitlisted, and expired programs.
- `src/email-client.mjs` builds an HTML/text summary and sends it to every address in `emails.json` via Amazon SES.
- `src/S3StorageClient.mjs` reads and writes `programData.json` and `emails.json` in S3. After an update, the new data set is saved back to S3.

## Requirements
- Node.js 20+
- AWS account with permissions for S3 (read/write to your bucket) and SES (SendEmail in `us-east-1`).
- `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and optionally `AWS_REGION`/`AWS_PROFILE` exported in your shell or provided by your Lambda role.

## One-time setup
1) **Create an S3 bucket** to hold state. Bucket names are globally unique. The bucket name is hard-coded in `src/S3StorageClient.mjs` as `zmm-scraper`; change it to your bucket name if needed.  
2) **Seed the state files** in that bucket:
   - `programData.json` with `[]`
   - `emails.json` with `["you@example.com"]` (add as many addresses as you like)
3) **Configure SES sender**: Update the `sender` value in `src/email-client.mjs` to an address verified in SES (region `us-east-1` by default).

## Local development
- Install dependencies: `npm install`
- Run tests: `npm test`
- Run the lambda handler locally against live AWS services: `node local_testing/local_invoker.mjs` (requires the seeded S3 files and SES permissions).

## Build and deploy
1) Build and package: `npm run build`  
   This runs tests, bundles the Lambda entrypoint to `dist/index.mjs`, and zips it as `zmm.zip`.
2) Create an AWS Lambda function (Node.js 20) and upload `zmm.zip`.
3) Set the handler to `index.handler` and ensure the execution role can read/write your S3 bucket and send via SES.
4) Add an EventBridge rule to trigger the Lambda on your desired schedule (once per day is typical).

## Sample email
![zmm_scraper_sample](https://github.com/Scott123180/zmm-scraper/assets/9338669/c85dc670-44a4-4f93-a28f-1d170504ff20)

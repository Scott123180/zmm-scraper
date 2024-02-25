# ZMM Scraper Program
This tool scrapes the internet for updates to workshops / activities on zmm.org. Given that lots of these, especially sesshins, fill up 6 months in advance, this tool will allow you to receive email notifications as soon as new programs become available.

It is also helpful as you don't have to constantly look back for new program offerings, you just have to receive an email.

# Sample Result
![zmm_scraper_sample](https://github.com/Scott123180/zmm-scraper/assets/9338669/c85dc670-44a4-4f93-a28f-1d170504ff20)

# How to run

## 1. Create a lamda function
See https://docs.aws.amazon.com/lambda/latest/dg/lambda-nodejs.html

Once this is created, you can add an eventbridge trigger to execute this function. You may put it at whatever cadence you like. Once a day is usually fine and allows for a reduced number of emails and less load on the site.

## 2. Create an S3 Bucket
This bucket will hold the emails you have saved (`emails.json`) as well as the historical program information (`data.json`).

You will need to create this bucket, then update the bucket name in the program (bucket names are globally unique).

After this, create the `emails.json` and `data.json`. The values for these files should be `[<input_your_email_address@yourdomain.com>]` and `[]` respectively. This is so that the program has somewhere to start off.

## 3. Build the project locally

1. Run `npm i` to install dependencies.
2. Run `npm build` to run the tests, webpack, and create the upload file `zmm.zip`.

## 4. Upload your project to AWS Lambda
1. Upload `zmm.zip` to your lamda function.
2. Invoke your lamda function via the test button on AWS and ensure everything is running correctly.

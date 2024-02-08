# ZMM Scraper
This tool scrapes the internet for updates to workshops / activities on zmm.org. Given that lots of these, especially sesshins, fill up 6 months in advance, this tool will allow you to receive email notifications as soon as new programs become available.

It is also helpful as you don't have to constantly look back for new program offerings, you just have to receive an email.

## How to run

If it's the first time running, you'll need an empty array for the seed information in your S3 bucket. `[]`

1. Run `npm i` to install dependencies.
2. Execute the `local_testing/local_invoker.mjs` file.

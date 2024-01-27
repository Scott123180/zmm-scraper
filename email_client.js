// Import required AWS SDK clients and commands for Node.js
const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");

// Create SES service object
const sesClient = new SESClient({ region: "us-west-2" });

const sendEmail = async (subject, body) => {
    const sender = "Sender Name <sender@example.com>";
    const recipient = "recipient@example.com";

    // The email body for recipients with non-HTML email clients
    const bodyText = body;
    
    // The HTML body of the email
    const bodyHTML = `<html>
        <head></head>
        <body>
          <h1>${subject}</h1>
          <p>${body}</p>
        </body>
        </html>`;

    // Set the parameters
    const params = {
        Destination: {
            ToAddresses: [
                recipient,
            ],
        },
        Message: {
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: bodyHTML,
                },
                Text: {
                    Charset: "UTF-8",
                    Data: bodyText,
                },
            },
            Subject: {
                Charset: 'UTF-8',
                Data: subject,
            },
        },
        Source: sender,
    };

    try {
        const data = await sesClient.send(new SendEmailCommand(params));
        console.log("Email sent! Message ID:", data.MessageId);
    } catch (err) {
        console.error(err, err.stack);
    }
};

// Use the function
sendEmail("Subject of the email", "Body of the email");


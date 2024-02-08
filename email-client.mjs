// Import required AWS SDK clients and commands for Node.js
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const MS_IN_A_DAY = 86_400_000;

// Create SES service object
const sesClient = new SESClient({ region: "us-east-1" });

const sender = "ZMM Scraper <zmm-scraper@scotthansen.io>";

export function composeAndSendEmail(recipient, newPrograms, waitlistedPrograms, expiredPrograms) {

    const bodyHTML = generateBodyHTML(newPrograms, waitlistedPrograms, expiredPrograms);
    const body = generateBodyNonHTML(newPrograms, waitlistedPrograms, expiredPrograms);
    console.log("");
    console.log("");
    console.log("");
    console.log(bodyHTML);

    sendEmail(recipient, bodyHTML, body);
}

const sendEmail = async (recipient, bodyHTML, body) => {

    // The email body for recipients with non-HTML email clients
    const bodyText = body;

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
                Data: "ZMM Programs Have Been Updated",
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

const generateBodyHTML = (newPrograms, waitlistedPrograms, expiredPrograms) => {
    return `<html>
        <head>
       
        <style>
            h1 {text-align: center;}
            footer {text-align: center;}
        </style>
        </head>
        <body>
        <h1>Updates to ZMM Programs Have Been Found</h1>
            ${generateNewProgramContent(newPrograms)}
            ${generateWaitlistedProgramContent(waitlistedPrograms)}
            ${generateExpiredProgramContent(expiredPrograms)}
        </body>
        <footer>Message created by <a href="https://github.com/Scott123180/zmm-scraper" target="_blank" rel="noreferrer">ZMM Scraper</footer>
        </html>`;
}
const generateBodyNonHTML = (newPrograms, waitlistedPrograms, expiredPrograms) => {
    return `
    You are viewing the non HTML version of this content, for a better experience, please use a 
    client that supports HTML emails. Thank you!

    New Program Content: ${JSON.stringify(newPrograms)}
    Waitlisted Programs: ${JSON.stringify(waitlistedPrograms)}
    Expired Programs: ${JSON.stringify(expiredPrograms)}
    `
}

const generateNewProgramContent = (programs) => {
    if (programs.length === 0) return "";

    let htmlContent = "<h2><strong><u>New Programs</u><strong></h2>";

    programs.forEach(program => {
        htmlContent += `
            <h3>${program.title}</h3>
            <p>
                Date: ${program.programDate}<br>
                Location: ${program.programLocation}<br>
                Registration Link: <a href="${program.link}" target="_blank" rel="noreferrer">Click here for registration</a><br>
            </p>
        `;
    });

    return htmlContent;
}
const generateWaitlistedProgramContent = (programs) => {
    if (programs.length === 0) return "";

    let htmlContent = "<h2><strong><u>Sorry, it looks like some programs have been waitlisted</u></strong></h2>";

    programs.forEach(program => {

        const daysToFillUp = calculateDays(program.firstSeenTimestamp, program.filledUpTimestamp)

        htmlContent += `
            <h3>${program.title}</h3>
            <p>
                Date: ${program.programDate}<br>
                Location: ${program.programLocation}<br>
                Waitlist Link: <a href="${program.link}" target="_blank" rel="noreferrer">Click here to join the waitlist</a><br>
                How long it took to reach capacity: ${daysToFillUp} days.<br>
            </p>
        `;
    });

    return htmlContent;

}
const generateExpiredProgramContent = (programs) => {
    if (programs.length === 0) return "";

    let htmlContent = "<h2><strong><u>These programs have expired</u></strong></h2>";

    programs.forEach(program => {
        const daysOnSite = calculateDays(program.firstSeenTimestamp, new Date().getTime());
        htmlContent += `
            <h3>${program.title}</h3>
            <p>
                Date: ${program.programDate}<br>
                Location: ${program.programLocation}<br>
                Days On Site: ${daysOnSite} days
            </p>
        `;
    });

    return htmlContent;

}

const calculateDays = (startMs, endMs) => {
    return Math.round((endMs - startMs) / MS_IN_A_DAY);
}
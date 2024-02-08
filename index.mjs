import main from './main.mjs';

export const handler = async (event) => {

    try {
        // Your code logic here
        console.log("Lambda function has started execution");

        // Example: Call another function or perform some operation
        // const result = await someOtherFunction();
        await main();

        // Return a response
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Lambda execution successful" }),
            headers: { "Content-Type": "application/json" }
        };
    } catch (error) {
        console.error("Error during Lambda execution", error);

        // Return an error response
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Error during Lambda execution" }),
            headers: { "Content-Type": "application/json" }
        };
    }
};

import { handler } from "../src/index.mjs";

async function executeLocal(){

    await handler();
}

executeLocal();
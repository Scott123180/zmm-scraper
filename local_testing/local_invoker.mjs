import { handler } from "../index.mjs";

async function executeLocal(){

    await handler();
}

executeLocal();
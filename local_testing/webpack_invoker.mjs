import { handler } from "../dist/index.mjs";

async function executeLocal(){

    await handler();
}

executeLocal();
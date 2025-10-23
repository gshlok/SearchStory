import express from "express";
import vercelServer from "./vercel-server";

const app = express();

// Use the vercel server as middleware
app.use(vercelServer);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Test server running on port ${port}`);
});
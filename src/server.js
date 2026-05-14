import http from "http";

import { createApp } from "./app/app.js";

import { env } from "./config/env.config.js";
import { connectDatabase } from "./config/database.config.js";

import { setupSocket } from "./socket/socket.js";

import { runSeeds } from "./database/seeds/index.js";

const app = createApp();

const server = http.createServer(app);

setupSocket(server);

await connectDatabase();

await runSeeds();

server.listen(env.port, () => {
  console.log(`🚀 Servidor rodando em ${env.appUrl}`);
});

#!/usr/bin/env node

import "dotenv/config";
import { createServer, startServer } from "./server.js";

async function main() {
  const server = createServer();
  await startServer(server);
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});

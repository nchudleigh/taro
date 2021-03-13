import { createServer } from "@taro/server/server.ts";

createServer({
  port: 8080,
  assetDirectory: `${Deno.cwd()}/example/assets`,
});

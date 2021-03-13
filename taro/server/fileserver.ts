import { ServerRequest } from "std/http/server.ts";

const CONTENT_TYPES: { [extensionType: string]: string } = {
  ".md": "text/markdown",
  ".html": "text/html",
  ".htm": "text/html",
  ".json": "application/json",
  ".map": "application/json",
  ".txt": "text/plain",
  ".ts": "text/typescript",
  ".tsx": "text/tsx",
  ".js": "application/javascript",
  ".jsx": "text/jsx",
  ".gz": "application/gzip",
  ".css": "text/css",
  ".wasm": "application/wasm",
  ".mjs": "application/javascript",
  ".mp3": "audio/mpeg",
};

function contentType(path: string): string | undefined {
  const fileType = `.${path.split(".").pop()}`;
  if (!fileType) {
    return undefined;
  }

  return CONTENT_TYPES[fileType];
}

export async function handleHTTP(req: ServerRequest, assetDirectory: string) {
  const url = req.url.split("?")[0];
  let filePath = url;
  if (url === "/") filePath = "/index.html";
  filePath = `${assetDirectory}${filePath}`;

  try {
    const headers = new Headers();
    const [file, fileInfo] = await Promise.all([
      Deno.open(filePath),
      Deno.stat(filePath),
    ]);

    headers.set("content-length", fileInfo.size.toString());

    const contentTypeValue = contentType(filePath);
    if (contentTypeValue) {
      headers.set("content-type", contentTypeValue);
    }
    req.done.then(() => {
      file.close();
    });

    req.respond({ status: 200, body: file, headers });
  } catch (error) {
    req.respond({ status: 404 });
  }
}

import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { extname, join, relative, sep } from "node:path";

const publicDir = new URL("../www/", import.meta.url);
const outputFile = new URL("../dist/server/index.js", import.meta.url);
const files = [];

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full);
    else files.push(full);
  }
}

walk(publicDir.pathname);

const assets = Object.fromEntries(
  files.map((file) => [
    "/" + relative(publicDir.pathname, file).split(sep).join("/"),
    readFileSync(file).toString("base64"),
  ]),
);

const mime = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webmanifest": "application/manifest+json",
};

const worker = `const assets = ${JSON.stringify(assets)};
const mime = ${JSON.stringify(mime)};
export default {
  async fetch(request) {
    const url = new URL(request.url);
    let path = url.pathname;
    if (!assets[path] && !path.includes(".")) path = "/index.html";
    const encoded = assets[path];
    if (!encoded) return new Response(null, { status: 404 });
    const bytes = Uint8Array.from(atob(encoded), (char) => char.charCodeAt(0));
    const headers = {
      "Content-Type": mime[path.slice(path.lastIndexOf("."))] || "application/octet-stream",
      "Cache-Control": path === "/index.html" ? "no-cache" : "public, max-age=31536000, immutable",
    };
    return new Response(request.method === "HEAD" ? null : bytes, { status: 200, headers });
  },
};
`;

writeFileSync(outputFile, worker);
console.log(outputFile.pathname);

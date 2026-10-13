import { createServer } from "node:http";
import { stat, readFile } from "node:fs/promises";
import { extname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const mime = { ".html": "text/html; charset=utf-8", ".js": "application/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".ttf": "font/ttf", ".png": "image/png", ".jpg": "image/jpeg" };
export function createPreviewServer(directory) {
  const root = resolve(directory);
  return createServer(async (req, res) => {
    if (!["GET", "HEAD"].includes(req.method)) { res.writeHead(405); res.end(); return; }
    try {
      const pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
      const target = resolve(root, "." + pathname); const rel = relative(root, target);
      if (rel === ".." || rel.startsWith(".." + sep) || pathname.includes("\0")) { res.writeHead(403); res.end(); return; }
      const candidates = pathname === "/" ? [join(root, "index.html")] : [target, target + ".html", join(target, "index.html")];
      let found;
      for (const candidate of candidates) { try { if ((await stat(candidate)).isFile()) { found = candidate; break; } } catch { /* Try the clean static route. */ } }
      let status = 200;
      if (!found) {
        // Only page requests get an accessible 404 shell. Missing assets must
        // never receive HTML or a successful response.
        if (!extname(pathname) || extname(pathname) === ".html") {
          const notFound = join(root, "+not-found.html");
          try { if ((await stat(notFound)).isFile()) { found = notFound; status = 404; } } catch { /* Plain 404 if no exported shell exists. */ }
        }
        if (!found) { res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }); res.end("Page not found"); return; }
      }
      const data = req.method === "HEAD" ? undefined : await readFile(found);
      res.writeHead(status, { "Content-Type": mime[extname(found)] ?? "application/octet-stream", "Cache-Control": "no-cache", "X-Content-Type-Options": "nosniff", "Referrer-Policy": "strict-origin-when-cross-origin", "Permissions-Policy": "camera=(), microphone=(), geolocation=()" });
      res.end(data);
    } catch { res.writeHead(400); res.end("Invalid request"); }
  });
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const argument = process.argv.indexOf("--port"); const port = argument >= 0 ? Number(process.argv[argument + 1]) : 4173;
  const server = createPreviewServer(fileURLToPath(new URL("../dist/", import.meta.url)));
  server.listen(port, "127.0.0.1", () => console.log(`Web preview: http://localhost:${port}/`));
}

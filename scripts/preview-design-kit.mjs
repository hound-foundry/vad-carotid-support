import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDesignKit, kitDirectory, projectRoot } from "./design-kit.mjs";
import { createPreviewServer } from "./preview-web.mjs";

const files = {"index.html":"text/html; charset=utf-8","DESIGN.md":"text/markdown; charset=utf-8","tokens.json":"application/json","palette.svg":"image/svg+xml","project.json":"application/json","manifest.json":"application/json"};
export function createDesignPreview(directory = kitDirectory, appDirectory = resolve(projectRoot,"dist")) {
  const app = createPreviewServer(appDirectory);
  return createServer(async (request,response)=>{
    const path = new URL(request.url,"http://localhost").pathname;
    if (path !== "/_design" && !path.startsWith("/_design/")) { app.emit("request",request,response); return; }
    if (!["GET","HEAD"].includes(request.method)) { response.writeHead(405); response.end(); return; }
    const name = path === "/_design" || path === "/_design/" ? "index.html" : path.slice("/_design/".length);
    if (!Object.hasOwn(files,name)) { response.writeHead(404); response.end("Design file not found"); return; }
    try {
      if (!(await stat(resolve(directory,name))).isFile()) throw new Error("Not a design file");
      const bytes = request.method === "HEAD" ? undefined : await readFile(resolve(directory,name));
      response.writeHead(200,{"Content-Type":files[name],"Cache-Control":"no-store","X-Content-Type-Options":"nosniff","Referrer-Policy":"no-referrer"}); response.end(bytes);
    } catch { response.writeHead(404); response.end("Generate the design kit first"); }
  });
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const argument = process.argv.indexOf("--port"); const port = argument >= 0 ? Number(process.argv[argument+1]) : 4180;
  if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error("Use an unprivileged local port");
  await buildDesignKit();
  createDesignPreview().listen(port,"127.0.0.1",()=>console.log(`Local design workbench: http://localhost:${port}/_design/`));
}

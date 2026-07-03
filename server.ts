import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Audio proxy route to bypass Google Drive direct link iframe restrictions and virus scan warnings
  app.get("/api/audio-proxy", async (req, res) => {
    const fileId = req.query.id as string;
    if (!fileId) {
      res.status(400).send("Missing file ID");
      return;
    }

    const rangeHeader = req.headers.range;
    const driveUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
    const abortController = new AbortController();

    req.on("close", () => {
      abortController.abort();
    });

    try {
      console.log(`[AudioProxy] Fetching Google Drive file: ${fileId} (Range: ${rangeHeader || "none"})`);
      
      const fetchHeaders: Record<string, string> = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      };
      if (rangeHeader) {
        fetchHeaders["Range"] = rangeHeader;
      }

      let response = await fetch(driveUrl, {
        headers: fetchHeaders,
        signal: abortController.signal
      });

      if (!response.ok && response.status !== 206) {
        console.error(`[AudioProxy] Direct fetch failed for ID ${fileId}: ${response.status} ${response.statusText}`);
        res.status(response.status).send(`Failed to fetch from Google Drive: ${response.statusText}`);
        return;
      }

      let contentType = response.headers.get("content-type") || "";
      let isHtml = contentType.includes("text/html");

      // If the file is large, Google Drive serves a confirmation screen instead of the direct file
      if (isHtml) {
        const html = await response.text();
        console.log(`[AudioProxy] Detected HTML response for ID ${fileId}. Scanning for confirmation code...`);

        // Extract confirmation token
        let confirmCode = "";
        const confirmMatch = html.match(/confirm=([a-zA-Z0-9_-]+)/);
        if (confirmMatch && confirmMatch[1]) {
          confirmCode = confirmMatch[1];
        } else {
          const inputMatch = html.match(/name="confirm"\s+value="([^"]+)"/) || html.match(/value="([^"]+)"\s+name="confirm"/);
          if (inputMatch && inputMatch[1]) {
            confirmCode = inputMatch[1];
          }
        }

        if (confirmCode) {
          console.log(`[AudioProxy] Found confirmation code: ${confirmCode}. Re-fetching with confirmation token...`);
          const confirmUrl = `https://drive.google.com/uc?export=download&id=${fileId}&confirm=${confirmCode}`;
          
          // Capture the 'set-cookie' header from the original response to retain the download session
          const setCookieHeaders = typeof response.headers.getSetCookie === "function" 
            ? response.headers.getSetCookie() 
            : (response.headers.get("set-cookie") ? [response.headers.get("set-cookie")!] : []);
          
          const cookieHeader = setCookieHeaders.map(c => c.split(";")[0]).join("; ");

          const confirmHeaders: Record<string, string> = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Cookie": cookieHeader,
          };
          if (rangeHeader) {
            confirmHeaders["Range"] = rangeHeader;
          }

          response = await fetch(confirmUrl, {
            headers: confirmHeaders,
            signal: abortController.signal
          });

          if (!response.ok && response.status !== 206) {
            console.error(`[AudioProxy] Fetch with confirmation failed: ${response.status} ${response.statusText}`);
            res.status(response.status).send(`Failed to bypass confirmation: ${response.statusText}`);
            return;
          }

          contentType = response.headers.get("content-type") || "audio/mpeg";
          isHtml = contentType.includes("text/html");
        } else {
          console.error(`[AudioProxy] Could not find Google Drive confirmation token in the HTML warning page.`);
          console.log(`[AudioProxy] HTML preview: ${html.substring(0, 300)}`);
          res.status(500).send("Google Drive request returned HTML and no download confirmation token was found. Please ensure the file is shared with 'Anyone with the link' can view.");
          return;
        }
      }

      const contentLength = response.headers.get("content-length");
      const contentRange = response.headers.get("content-range");
      const statusToReturn = response.status; // typically 200 or 206

      // Set status
      res.status(statusToReturn);

      // Set headers for audio streaming
      if (contentType && !isHtml) {
        res.setHeader("Content-Type", contentType);
      } else {
        res.setHeader("Content-Type", "audio/mpeg");
      }

      if (contentLength) {
        res.setHeader("Content-Length", contentLength);
      }
      if (contentRange) {
        res.setHeader("Content-Range", contentRange);
      }

      res.setHeader("Accept-Ranges", "bytes");
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");

      if (response.body) {
        const { Readable } = await import("stream");
        const nodeStream = Readable.fromWeb(response.body as any);
        nodeStream.pipe(res);
        
        req.on("close", () => {
          nodeStream.destroy();
        });
      } else {
        console.error(`[AudioProxy] No body received from Google Drive stream for ${fileId}`);
        res.status(500).send("No audio data body received from Google Drive");
      }
    } catch (error: any) {
      if (error.name === "AbortError") {
        console.log(`[AudioProxy] Client connection aborted for ID ${fileId}`);
        return;
      }
      console.error("[AudioProxy] Severe error:", error);
      res.status(500).send(`Audio proxy error: ${error.message}`);
    }
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();

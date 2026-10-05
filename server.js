// server.ts
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var app = express();
var PORT = 3e3;
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use("/images", express.static(path.resolve(__dirname, "public", "images")));
app.use("/assets/images", express.static(path.resolve(__dirname, "public", "assets", "images")));
app.use("/src/assets/images", express.static(path.resolve(__dirname, "src", "assets", "images")));
var DEFAULT_MAILGUN_KEY = "";
var DEFAULT_KEY_ID = "";
app.get("/api/mailgun/info", (_req, res) => {
  const activeKey = DEFAULT_MAILGUN_KEY || process.env.MAILGUN_API_KEY;
  const domain = process.env.MAILGUN_DOMAIN || "sandboxe83f76628af84a1eb4c6d6c3d422a624.mailgun.org";
  res.json({
    configured: !!activeKey,
    keyId: DEFAULT_KEY_ID,
    domain,
    maskedKey: activeKey ? `${activeKey.slice(0, 8)}...${activeKey.slice(-8)}` : null,
    authorizedRecipient: "zeerocodes@gmail.com",
    status: "connected"
  });
});
app.post("/api/mailgun/send", async (req, res) => {
  try {
    const { to, subject, html, text, apiKey: clientApiKey, domain: clientDomain, from: clientFrom } = req.body;
    const apiKey = clientApiKey && clientApiKey.trim() !== "API_KEY" && clientApiKey.trim() !== "YOUR_MAILGUN_API_KEY" ? clientApiKey.trim() : DEFAULT_MAILGUN_KEY || process.env.MAILGUN_API_KEY;
    const domain = clientDomain && clientDomain.trim() ? clientDomain.trim() : process.env.MAILGUN_DOMAIN || "sandboxe83f76628af84a1eb4c6d6c3d422a624.mailgun.org";
    const from = clientFrom && clientFrom.trim() ? clientFrom.trim() : process.env.MAILGUN_FROM_EMAIL || `Mailgun Sandbox <postmaster@${domain}>`;
    if (!to || !subject) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: "to" and "subject" are required.'
      });
    }
    if (!apiKey || apiKey === "MY_MAILGUN_API_KEY") {
      return res.status(200).json({
        success: false,
        simulated: true,
        message: "No Mailgun API Key configured. Please enter your Mailgun API key in the Mailgun Sandbox settings tab."
      });
    }
    const endpoint = `https://api.mailgun.net/v3/${domain}/messages`;
    const params = new URLSearchParams();
    params.append("from", from);
    params.append("to", to);
    params.append("subject", subject);
    if (text) params.append("text", text);
    if (html) params.append("html", html);
    const authHeader = `Basic ${Buffer.from(`api:${apiKey}`).toString("base64")}`;
    console.log(`[Mailgun] Dispatching message to: ${to} on domain: ${domain}`);
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: params.toString()
    });
    const responseText = await response.text();
    let responseData = {};
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = { message: responseText };
    }
    if (!response.ok) {
      console.warn(`[Mailgun] Error HTTP ${response.status}:`, responseData);
      let friendlyHint = "";
      if (domain.includes("sandbox") && responseText.includes("authorized recipients")) {
        friendlyHint = "Mailgun Sandbox subdomains only deliver to verified authorized recipients (e.g. zeerocodes@gmail.com). To send to other emails, add them in Mailgun Dashboard -> Authorized Recipients, or upgrade to a custom domain.";
      } else if (response.status === 401) {
        friendlyHint = "Invalid Mailgun API key. Please check your Mailgun API key in the settings drawer.";
      }
      return res.status(response.status).json({
        success: false,
        status: response.status,
        error: responseData.message || responseText,
        hint: friendlyHint
      });
    }
    console.log(`[Mailgun] Email successfully queued by Mailgun:`, responseData);
    return res.json({
      success: true,
      id: responseData.id,
      message: responseData.message || "Queued. Thank you."
    });
  } catch (error) {
    console.error("[Mailgun] Internal Server Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to dispatch email via Mailgun"
    });
  }
});
async function startServer() {
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.resolve(__dirname, "dist")));
    app.get("*", (_req, res) => {
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
  } else {
    const { createServer } = await import("vite");
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on port ${PORT}`);
  });
}
startServer();

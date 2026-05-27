import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import lighthouse from "lighthouse";
import chromeLauncher from "chrome-launcher";
import { chromium } from "playwright";

const server = new Server({
  name: "web-audit-server",
  version: "3.0.0",
});

server.tool(
  "audit_website",
  {
    description:
      "Run production-grade web audit with real metrics (performance + images + network)",
    inputSchema: {
      type: "object",
      properties: {
        url: { type: "string" },
      },
      required: ["url"],
    },
  },
  async ({ url }) => {
    // =========================
    // 🔹 1. LIGHTHOUSE (REAL METRICS)
    // =========================
    const chrome = await chromeLauncher.launch({
      chromeFlags: ["--headless"],
    });

    const result = await lighthouse(url, {
      port: chrome.port,
      output: "json",
      logLevel: "error",
      settings: {
        formFactor: "mobile", // more realistic
        throttlingMethod: "simulate",
      },
    });

    await chrome.kill();

    const lhr = result.lhr;

    // Extract numeric values (important for report)
    const metrics = {
      performanceScore: Math.round(lhr.categories.performance.score * 100),

      FCP: (lhr.audits["first-contentful-paint"].numericValue / 1000).toFixed(
        2,
      ),
      LCP: (lhr.audits["largest-contentful-paint"].numericValue / 1000).toFixed(
        2,
      ),
      TTFB: (lhr.audits["server-response-time"].numericValue / 1000).toFixed(2),
      speedIndex: (lhr.audits["speed-index"].numericValue / 1000).toFixed(2),
      TBT: lhr.audits["total-blocking-time"].numericValue.toFixed(0),

      transferSizeKB: Math.round(
        lhr.audits["total-byte-weight"].numericValue / 1024,
      ),
    };

    // =========================
    // 🔹 2. PLAYWRIGHT (REAL DOM + IMAGES)
    // =========================
    const browser = await chromium.launch();
    const page = await browser.newPage();

    const requests = [];
    page.on("requestfinished", (req) => {
      requests.push({
        url: req.url(),
        type: req.resourceType(),
      });
    });

    await page.goto(url, { waitUntil: "load" });

    const images = await page.$$eval("img", (imgs) =>
      imgs.map((img) => ({
        src: img.src,
        width: img.naturalWidth,
        height: img.naturalHeight,
        loading: img.loading || "auto",
      })),
    );

    await browser.close();

    // =========================
    // 🔹 3. IMAGE ANALYSIS (IMPORTANT)
    // =========================
    const totalImages = images.length;
    const lazyImages = images.filter((img) => img.loading === "lazy").length;

    const properlySizedImages = images.filter(
      (img) => img.width > 0 && img.height > 0,
    ).length;

    // =========================
    // 🔹 4. FINAL CLEAN OUTPUT
    // =========================
    const data = {
      // 📊 Core Metrics (for assignment)
      performance: metrics,

      // 🖼 Image Insights
      images: {
        total: totalImages,
        lazyLoaded: lazyImages,
        properlySized: properlySizedImages,
        sample: images.slice(0, 5),
      },

      // 🌐 Network
      network: {
        totalRequests: requests.length,
      },

      // 🚨 Technical Issues (REAL)
      issues: {
        unusedJS: lhr.audits["unused-javascript"]?.numericValue
          ? Math.round(lhr.audits["unused-javascript"].numericValue / 1024) +
            " KB"
          : "0 KB",

        unusedCSS: lhr.audits["unused-css-rules"]?.numericValue
          ? Math.round(lhr.audits["unused-css-rules"].numericValue / 1024) +
            " KB"
          : "0 KB",

        renderBlockingResources:
          lhr.audits["render-blocking-resources"]?.details?.items?.length || 0,

        textCompression:
          lhr.audits["uses-text-compression"]?.score === 1
            ? "Enabled"
            : "Not Enabled",
      },
    };

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  },
);

const transport = new StdioTransport();
await server.connect(transport);

import { createRequire } from "module";
const require = createRequire(import.meta.url);
try {
  const pdfParse = require("pdf-parse");
  console.log("PDF Parse required successfully");
} catch (e) {
  console.error(e);
}

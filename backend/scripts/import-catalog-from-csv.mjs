import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const defaultInputPath = path.resolve(__dirname, "../data/nykaa-products.csv");
const defaultOutputPath = path.resolve(__dirname, "../src/data/nykaaCatalog.json");

const inputPath = path.resolve(process.argv[2] || defaultInputPath);
const outputPath = path.resolve(process.argv[3] || defaultOutputPath);

function parseCsv(csvText) {
  const rows = [];
  let row = [];
  let value = "";
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i += 1) {
    const char = csvText[i];
    const next = csvText[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        value += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      row.push(value.trim());
      value = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") i += 1;
      row.push(value.trim());
      const nonEmpty = row.some((cell) => cell !== "");
      if (nonEmpty) rows.push(row);
      row = [];
      value = "";
      continue;
    }

    value += char;
  }

  if (value !== "" || row.length > 0) {
    row.push(value.trim());
    const nonEmpty = row.some((cell) => cell !== "");
    if (nonEmpty) rows.push(row);
  }

  return rows;
}

function normalizeHeader(header) {
  return header
    .replace(/^\uFEFF/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function parseNumber(value) {
  if (value === undefined || value === null || value === "") return undefined;
  const numeric = Number(String(value).replace(/[^\d.]/g, ""));
  return Number.isFinite(numeric) ? numeric : undefined;
}

function parseBoolean(value) {
  if (!value) return undefined;
  const normalized = String(value).toLowerCase().trim();
  if (["true", "yes", "1", "y"].includes(normalized)) return true;
  if (["false", "no", "0", "n"].includes(normalized)) return false;
  return undefined;
}

function splitMulti(value) {
  if (!value) return [];
  return value
    .split(/[|,]/g)
    .map((item) => item.trim())
    .filter(Boolean);
}

function getField(row, keys, fallback = "") {
  for (const key of keys) {
    if (row[key] !== undefined && row[key] !== null && row[key] !== "") {
      return row[key];
    }
  }
  return fallback;
}

function normalizeCategory(category) {
  const normalized = String(category || "").toLowerCase().trim();
  const map = {
    cleanser: "Cleansers",
    cleansers: "Cleansers",
    "face wash": "Cleansers",
    facewash: "Cleansers",
    serum: "Serums",
    serums: "Serums",
    moisturizer: "Moisturizers",
    moisturizers: "Moisturizers",
    "day cream": "Moisturizers",
    sunscreen: "Sunscreen",
    spf: "Sunscreen",
    treatment: "Treatments",
    treatments: "Treatments",
    mask: "Masks",
    masks: "Masks",
    toner: "Toners",
    toners: "Toners",
    essence: "Essences",
    essences: "Essences"
  };
  return map[normalized] || category || "Serums";
}

function toId(base, index, usedIds) {
  const slug = String(base || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  let candidate = slug || `sm-${index + 101}`;
  if (!usedIds.has(candidate)) {
    usedIds.add(candidate);
    return candidate;
  }

  let i = 2;
  while (usedIds.has(`${candidate}-${i}`)) i += 1;
  candidate = `${candidate}-${i}`;
  usedIds.add(candidate);
  return candidate;
}

function readRows(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Input CSV not found at ${filePath}`);
  }

  const csvText = fs.readFileSync(filePath, "utf-8");
  const rows = parseCsv(csvText);
  if (rows.length < 2) {
    throw new Error("CSV needs a header row and at least one product row.");
  }

  const headers = rows[0].map(normalizeHeader);
  return rows.slice(1).map((cells) => {
    const row = {};
    headers.forEach((header, index) => {
      row[header] = (cells[index] || "").trim();
    });
    return row;
  });
}

function toCatalogProduct(row, index, usedIds) {
  const brand = getField(row, ["brand"]);
  const name = getField(row, ["name", "product_name", "title"]);
  const category = normalizeCategory(getField(row, ["category", "product_category"], "Serums"));
  const price = parseNumber(getField(row, ["price", "selling_price", "current_price"]));

  if (!brand || !name || !price) return null;

  const primaryImage = getField(row, ["image_1", "primary_image", "image", "packshot_url"]);
  const secondaryImage = getField(row, ["image_2", "secondary_image"]);
  const thirdImage = getField(row, ["image_3", "tertiary_image"]);
  const extraImages = splitMulti(getField(row, ["additional_images", "gallery_images"]));
  const images = [primaryImage, secondaryImage, thirdImage, ...extraImages].filter(Boolean);

  const idSource = getField(row, ["id", "sku", "product_id"], `${brand}-${name}`);
  const id = toId(idSource, index, usedIds);

  const rating = parseNumber(getField(row, ["rating", "avg_rating"]));
  const reviews = parseNumber(getField(row, ["reviews", "review_count", "ratings_count"]));
  const discountPct = parseNumber(getField(row, ["discount_pct", "discount", "discount_percent"]));
  const mrp = parseNumber(getField(row, ["mrp", "list_price", "original_price"]));

  return {
    id,
    sku: id,
    brand,
    name,
    category,
    price,
    mrp,
    rating,
    reviews,
    discountPct,
    description: getField(row, ["description", "short_description"]),
    productUrl: getField(row, ["product_url", "url", "nykaa_url"]),
    images,
    includeIngredients: splitMulti(getField(row, ["include_ingredients", "ingredients"])),
    excludeIngredients: splitMulti(getField(row, ["exclude_ingredients"])),
    skinTypes: splitMulti(getField(row, ["skin_types", "skin_type"])),
    concerns: splitMulti(getField(row, ["concerns", "skin_concerns"])),
    tags: splitMulti(getField(row, ["tags"])),
    compatibilityTags: splitMulti(getField(row, ["compatibility_tags"])),
    routineStep: getField(row, ["routine_step"]),
    isNew: parseBoolean(getField(row, ["is_new", "new_launch"])),
    isBestSeller: parseBoolean(getField(row, ["is_best_seller", "best_seller"]))
  };
}

function writeCatalog(products, filePath) {
  const payload = JSON.stringify(products, null, 2);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${payload}\n`);
}

function run() {
  const rows = readRows(inputPath);
  const usedIds = new Set();
  const products = [];
  let skipped = 0;

  rows.forEach((row, index) => {
    const product = toCatalogProduct(row, index, usedIds);
    if (!product) {
      skipped += 1;
      return;
    }
    products.push(product);
  });

  writeCatalog(products, outputPath);

  const withImages = products.filter((item) => item.images.length > 0).length;
  const brands = new Set(products.map((item) => item.brand));

  console.log(`Imported products: ${products.length}`);
  console.log(`Skipped rows: ${skipped}`);
  console.log(`Products with images: ${withImages}`);
  console.log(`Unique brands: ${brands.size}`);
  console.log(`Output: ${outputPath}`);

  if (products.length < 50) {
    console.log("Warning: Fewer than 50 products found. Add more rows to match your target.");
  }
}

run();

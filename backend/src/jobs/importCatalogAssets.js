const fs = require('node:fs/promises');
const path = require('node:path');
const mongoose = require('mongoose');
const { connectDatabase, disconnectDatabase } = require('../config/database');
const Vendor = require('../models/Vendor');
const Product = require('../models/Product');

const assetRoot = path.resolve(__dirname, '../../../assets/vendors-meals');
const sources = [
  { slug: 'genesis', folder: 'genesis' },
  { slug: 'kilimanjaro', folder: 'kilimanjaro' },
  { slug: 'chicken-republic', folder: 'chicken republic' }
];
const imageExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);

function slugify(value) { return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
async function directories(folder) { return (await fs.readdir(folder, { withFileTypes: true })).filter((entry) => entry.isDirectory() && entry.name.toLowerCase() !== 'logo'); }
async function files(folder) { return (await fs.readdir(folder, { withFileTypes: true })).filter((entry) => entry.isFile() && imageExtensions.has(path.extname(entry.name).toLowerCase())); }

async function importCatalogAssets() {
  const report = { vendors: 0, products: 0, skipped: 0 };
  for (const source of sources) {
    const vendor = await Vendor.findOne({ slug: source.slug, active: true });
    if (!vendor) { report.skipped += 1; continue; }
    report.vendors += 1;
    const vendorFolder = path.join(assetRoot, source.folder);
    for (const categoryEntry of await directories(vendorFolder)) {
      const category = categoryEntry.name;
      let displayOrder = 0;
      for (const file of await files(path.join(vendorFolder, category))) {
        const imageUrl = `/assets/vendors-meals/${encodeURIComponent(source.folder)}/${encodeURIComponent(category)}/${encodeURIComponent(file.name)}`;
        const slug = `asset-${source.slug}-${slugify(category)}-${slugify(file.name.replace(path.extname(file.name), ''))}`;
        const result = await Product.updateOne(
          { vendor: vendor._id, slug },
          { $set: { vendor: vendor._id, name: file.name.replace(path.extname(file.name), ''), slug, category, price: 0, imageUrl, available: true, displayOrder } },
          { upsert: true }
        );
        if (result.upsertedCount) report.products += 1;
        displayOrder += 1;
      }
    }
  }
  return report;
}

if (require.main === module) {
  (async () => {
    try { await connectDatabase(); console.log(JSON.stringify(await importCatalogAssets())); }
    catch (error) { console.error(`Catalog asset import failed: ${error.message}`); process.exitCode = 1; }
    finally { await disconnectDatabase(); }
  })();
}

module.exports = { importCatalogAssets, assetRoot, sources };

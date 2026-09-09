const { connectDatabase, disconnectDatabase } = require('../config/database');
const Vendor = require('../models/Vendor');

const vendors = [
  { name: 'Genesis', slug: 'genesis', type: 'restaurant', logoUrl: '/assets/vendors-meals/genesis/logo/WhatsApp Image 2026-09-07 at 1.10.24 AM.jpeg', displayOrder: 1 },
  { name: 'Kilimanjaro', slug: 'kilimanjaro', type: 'restaurant', logoUrl: '/assets/vendors-meals/kilimanjaro/logo/WhatsApp Image 2026-09-04 at 9.29.33 PM.jpeg', displayOrder: 2 },
  { name: 'Chicken Republic', slug: 'chicken-republic', type: 'restaurant', logoUrl: '/assets/vendors-meals/chicken republic/logo/ken.jpeg', displayOrder: 3 },
  { name: 'Market Square', slug: 'market-square', type: 'get4me', logoUrl: '/assets/vendors-meals/market square/logo/WhatsApp Image 2026-09-05 at 6.55.24 PM.jpeg', displayOrder: 4 },
  { name: "D'Topic", slug: 'd-topic', type: 'get4me', logoUrl: '/assets/vendors-meals/D topic/logo/WhatsApp Image 2026-09-04 at 4.19.36 AM.jpeg', displayOrder: 5 },
  { name: 'Package Delivery', slug: 'package-delivery', type: 'package_delivery', logoUrl: '/assets/vendors-meals/package delivery/logo/WhatsApp Image 2026-09-07 at 1.20.23 AM.jpeg', displayOrder: 6 }
];

async function seedCatalog() {
  for (const vendor of vendors) {
    await Vendor.updateOne({ slug: vendor.slug }, { $set: vendor }, { upsert: true });
  }
  return Vendor.find({ slug: { $in: vendors.map((vendor) => vendor.slug) } }).sort({ displayOrder: 1 });
}

(async () => {
  try {
    await connectDatabase();
    const seeded = await seedCatalog();
    console.log(`Catalog vendors ready: ${seeded.length}`);
  } catch (error) {
    console.error('Catalog seed failed:', error.message);
    process.exitCode = 1;
  } finally {
    await disconnectDatabase();
  }
})();

module.exports = { seedCatalog, vendors };

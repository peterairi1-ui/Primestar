const { connectDatabase, disconnectDatabase } = require('../config/database');
const { seedAdmin } = require('../controllers/adminController');
(async () => { try { await connectDatabase(); const admin = await seedAdmin(); console.log(admin ? `Admin ready: ${admin.username}` : 'Admin seed skipped: credentials are not configured'); } catch (error) { console.error('Admin seed failed:', error.message); process.exitCode = 1; } finally { await disconnectDatabase(); } })();

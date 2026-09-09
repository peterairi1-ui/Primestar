const app = require('./app');
const config = require('./config/env');
const { connectDatabase } = require('./config/database');
const { startJobs } = require('./jobs/scheduler');

async function start() {
  await connectDatabase();
  const server = app.listen(config.port, () => console.log(`PRIMESTAR backend listening on port ${config.port}`));
  startJobs();
  return server;
}
if (require.main === module) start().catch((error) => { console.error('Server startup failed:', error.message); process.exit(1); });
module.exports = { start };

import { adminUser } from './admin.seed';

adminUser().catch((e) => {
  console.error(e);
  process.exit(1);
});

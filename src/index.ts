import { envs } from './config/envs';
import { MongoDatabase } from './data/mongodb';
import { AppRoutes } from './presentation/routes';
import { Server } from './presentation/server';

async function main() {
  await MongoDatabase.connect({
    mongoUrl: envs.MONGO_DB_URL,
    dbName: envs.MONGO_DB_NAME,
  });
  new Server({
    port: envs.PORT,
    routes: AppRoutes.routes,
  }).start();
}

main();

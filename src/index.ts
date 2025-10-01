import { envs } from './config/envs';
import { AppRoutes } from './presentation/routes';
import { Server } from './presentation/server';

(() => {
  main();
})();

function main() {
  new Server({
    port: envs.PORT,
    routes: AppRoutes.routes,
  }).start();
}

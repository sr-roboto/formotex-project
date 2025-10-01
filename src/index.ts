import { envs } from './config/envs';
import { Server } from './presentation/server';

(() => {
  main();
})();

function main() {
  new Server({
    port: envs.PORT,
  }).start();
}

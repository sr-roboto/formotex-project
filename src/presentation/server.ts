import express, { Router } from 'express';

interface Options {
  port: number;
  routes: Router;
}

export class Server {
  public readonly app = express();
  private readonly port: number;
  private readonly routes: Router;

  constructor(options: Options) {
    const { port, routes } = options;
    this.port = port;
    this.routes = routes;
  }

  async start() {
    // Midellewares
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Rutas
    this.app.use(this.routes);

    // Incio del servidor
    this.app.listen(this.port, () => {
      console.log(`Server runing on port ${this.port}`);
    });
  }
}

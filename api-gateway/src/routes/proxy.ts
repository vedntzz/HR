import { Router, Request, Response } from 'express';
import { createProxyMiddleware, Options } from 'http-proxy-middleware';
import { getServiceRegistry, ServiceDefinition } from '../config/services';

function buildProxyOptions(service: ServiceDefinition): Options {
  return {
    target: service.targetUrl,
    changeOrigin: true,
    pathRewrite: service.pathRewrite,
    timeout: 30000,
    proxyTimeout: 30000,
    on: {
      proxyReq: (_proxyReq, req) => {
        const incomingReq = req as Request;
        console.log(
          `[Proxy] ${incomingReq.method} ${incomingReq.originalUrl} -> ${service.targetUrl}`
        );
      },
      proxyRes: (proxyRes, req) => {
        const incomingReq = req as Request;
        console.log(
          `[Proxy] ${incomingReq.method} ${incomingReq.originalUrl} <- ${proxyRes.statusCode}`
        );
      },
      error: (err, req, res) => {
        const incomingReq = req as Request;
        console.error(
          `[Proxy] Error proxying ${incomingReq.method} ${incomingReq.originalUrl} ` +
          `to ${service.name}: ${err.message}`
        );

        const serverRes = res as Response;
        if (!serverRes.headersSent) {
          serverRes.status(502).json({
            error: 'Bad Gateway',
            message: `Service "${service.name}" is unavailable`,
            service: service.name,
          });
        }
      },
    },
  };
}

function registerServiceProxy(router: Router, service: ServiceDefinition): void {
  const proxyOptions = buildProxyOptions(service);
  const proxyMiddleware = createProxyMiddleware(proxyOptions);

  router.use(service.routePrefix, proxyMiddleware);

  console.log(
    `[Proxy] Registered route: ${service.routePrefix}/* -> ${service.targetUrl}`
  );
}

export function createProxyRouter(): Router {
  const router = Router();
  const services = getServiceRegistry();

  for (const service of services) {
    registerServiceProxy(router, service);
  }

  return router;
}

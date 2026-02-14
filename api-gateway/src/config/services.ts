import { config } from './index';

export interface ServiceDefinition {
  name: string;
  routePrefix: string;
  targetUrl: string;
  pathRewrite: Record<string, string>;
}

function createServiceDefinition(
  name: string,
  routePrefix: string,
  targetUrl: string
): ServiceDefinition {
  return {
    name,
    routePrefix,
    targetUrl,
    pathRewrite: {
      [`^${routePrefix}`]: '',
    },
  };
}

export function getServiceRegistry(): ServiceDefinition[] {
  return [
    createServiceDefinition('auth-service', '/api/auth', config.services.auth),
    createServiceDefinition('employee-service', '/api/employees', config.services.employee),
    createServiceDefinition('attendance-service', '/api/attendance', config.services.attendance),
    createServiceDefinition('payroll-service', '/api/payroll', config.services.payroll),
    createServiceDefinition('recruitment-service', '/api/recruitment', config.services.recruitment),
    createServiceDefinition('lms-service', '/api/lms', config.services.lms),
    createServiceDefinition('policy-service', '/api/policies', config.services.policy),
  ];
}

export function findServiceByPrefix(path: string): ServiceDefinition | undefined {
  const registry = getServiceRegistry();
  return registry.find((service) => path.startsWith(service.routePrefix));
}

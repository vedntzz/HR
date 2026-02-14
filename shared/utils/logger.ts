type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const CURRENT_LEVEL: LogLevel = (process.env.LOG_LEVEL as LogLevel) || 'info';

function formatMessage(level: LogLevel, service: string, message: string, meta?: object): string {
  const timestamp = new Date().toISOString();
  const base = JSON.stringify({ timestamp, level, service, message, ...meta });
  return base;
}

/**
 * Structured JSON logger for microservice environments.
 */
export function createLogger(service: string) {
  function log(level: LogLevel, message: string, meta?: object): void {
    if (LOG_LEVELS[level] < LOG_LEVELS[CURRENT_LEVEL]) return;
    const output = formatMessage(level, service, message, meta);

    if (level === 'error') {
      process.stderr.write(output + '\n');
    } else {
      process.stdout.write(output + '\n');
    }
  }

  return {
    debug: (msg: string, meta?: object) => log('debug', msg, meta),
    info: (msg: string, meta?: object) => log('info', msg, meta),
    warn: (msg: string, meta?: object) => log('warn', msg, meta),
    error: (msg: string, meta?: object) => log('error', msg, meta),
  };
}

export type Logger = ReturnType<typeof createLogger>;

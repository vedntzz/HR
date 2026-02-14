import { Request, Response, NextFunction } from 'express';

interface LogEntry {
  method: string;
  path: string;
  statusCode: number;
  duration: string;
  timestamp: string;
  ip: string;
  userAgent: string;
}

function formatLogEntry(entry: LogEntry): string {
  return (
    `[${entry.timestamp}] ${entry.method} ${entry.path} ` +
    `${entry.statusCode} ${entry.duration} - ${entry.ip}`
  );
}

function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.ip ?? req.socket.remoteAddress ?? 'unknown';
}

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const startTime = process.hrtime.bigint();
  const timestamp = new Date().toISOString();

  res.on('finish', () => {
    const endTime = process.hrtime.bigint();
    const durationNs = endTime - startTime;
    const durationMs = Number(durationNs) / 1_000_000;

    const entry: LogEntry = {
      method: req.method,
      path: req.originalUrl || req.url,
      statusCode: res.statusCode,
      duration: `${durationMs.toFixed(2)}ms`,
      timestamp,
      ip: getClientIp(req),
      userAgent: req.headers['user-agent'] ?? 'unknown',
    };

    const logLine = formatLogEntry(entry);

    if (res.statusCode >= 500) {
      console.error(logLine);
    } else if (res.statusCode >= 400) {
      console.warn(logLine);
    } else {
      console.log(logLine);
    }
  });

  next();
}

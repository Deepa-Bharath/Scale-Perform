import { type Request, type Response, type NextFunction } from "express";
import client from "prom-client";

export const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "HTTP request duration",
  labelNames: ["method", "route", "status"],
  buckets: [0.05, 0.1, 0.3, 0.5, 1, 2, 5, 10],
});


export function httpMetrics(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.path === "/metrics") {
    next();
    return;
  }

  const end = httpRequestDuration.startTimer({
    method: req.method,
  });

  res.on("finish", () => {
    end({
      route: req.route?.path || req.path,
      status: res.statusCode,
    });
  });

  next();
}

import client from "prom-client";

export const dbQueryDuration = new client.Histogram({
  name: "db_query_duration_seconds",
  help: "Time taken by database queries",
  labelNames: ["db", "operation"],
  buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5, 10],
});


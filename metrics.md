# Measurement Methodology

All metrics are collected using Prometheus histograms and visualized in Grafana.

Latency values are interpreted primarily using **P95 (95th percentile)** rather than averages, as P95 better represents worst-case user experience under load.

Load testing was performed using **k6** with a controlled ramp-up of virtual users.  
Latency values are reported differently based on traffic conditions:
- Under concurrent load, **P95 latency** observed in Grafana is used.
- Under single-user or low-traffic conditions, **observed request duration** is reported, as percentiles are not statistically meaningful.
---

## Baseline Performance (No Index, No Cache, No pagination)

Dataset size: ~100,000 products  
Query type: Full collection scan (`find()` with no pagination)

### Observed Metrics (Single User)
Note: Under single-user conditions, observed request duration is reported instead of percentiles.

- **HTTP request duration** (`http_request_duration_seconds`)
  - ≈ **7.6 seconds**

- **Use case execution duration** (`usecase_execution_duration_seconds`)
  - ≈ **6.5 seconds**

- **Database query duration** (`db_query_duration_seconds`)
  - ≈ **6.5 seconds**

### Interpretation

- HTTP time includes Express routing, controller execution, business logic,
  database query, and response serialization.
- Use case time measures only application business logic.
- Database time measures only MongoDB query execution.

The similarity between use case time and database time indicates that
the business logic itself is lightweight and the database query
dominates request latency.

### Conclusion

- Database query is the primary performance bottleneck.
- Optimizing controllers or application logic will not significantly
  improve response time.
- Query-level optimizations (pagination, indexing) are required.

### Next Steps

- Introduce pagination (`limit` / `skip`)
- Add MongoDB indexes
- Re-measure metrics and compare against this baseline

---

## Introduced Pagination

Dataset size: ~100,000 products  
Query type: Collection scan with pagination (`find()` with `limit = 20` and `skip`)

### Observed Metrics (Single User)
Note: Under single-user conditions, observed request duration is reported instead of percentiles.

- **HTTP request duration** (`http_request_duration_seconds`)
  - ≈ **0.09 seconds**

- **Use case execution duration** (`usecase_execution_duration_seconds`)
  - ≈ **0.07 seconds**

- **Database query duration** (`db_query_duration_seconds`)
  - ≈ **0.07 seconds**

Pagination significantly reduced database and overall request latency,
but the database remained the dominant contributor to response time.
The sharp reduction is primarily due to limiting result set size, which reduces database scan time, memory usage, and response serialization overhead.


### Load Test Configuration (With Pagination)

- Tool: **k6**
- Virtual users (VUs): ramped up to **50**
- Test duration: **30 seconds**
- Endpoint tested: `/api/products`
- Dataset size: ~100,000 products
- Pagination enabled (`limit = 20`)


### Load Test Results (With Pagination)

#### Throughput

- Total requests completed: **988**
- Client-side throughput (k6): ~**30 requests/second**
- Server-side throughput (Grafana): stabilized around **15–17 requests/second**

Throughput plateaued as latency increased, indicating the system reached
its saturation point under concurrent load.

#### P95 Latency Under Load

- **HTTP P95 latency** peaked at ≈ **2.4 seconds**
- **Database (MongoDB) P95 latency** peaked at ≈ **2.3 seconds**
- **Use case latency** closely followed database latency

HTTP latency closely tracked database latency, confirming that the
system is **database-bound under concurrent load**.

#### CPU Utilization Observation

- Node.js CPU utilization remained relatively stable during the load test
- No CPU saturation was observed
- Latency increased without a corresponding increase in CPU usage

This indicates the system is **IO-bound (database-bound)** rather than CPU-bound.


#### Why Only 988 Requests Were Completed

Each k6 virtual user performs a request, waits for the response,
and then sleeps for 1 second before the next iteration.

As request latency increased under load, iteration duration increased,
naturally limiting the total number of requests completed within the
30-second test window.

This behavior indicates **latency-driven throughput saturation**, not
request failures or instability.


#### Performance Summary

| Scenario                     | HTTP Latency Type | HTTP Latency | DB Latency | Throughput (RPS) | Bottleneck |
|-----------------------------|-------------------|--------------|------------|------------------|------------|
| No pagination, low load     | Observed (single) | ~7.6 s       | ~6.5 s     | N/A              | Database   |
| Pagination, low load        | Observed (single) | ~0.09 s      | ~0.07 s    | N/A              | Database   |
| Pagination, 50 VUs load     | P95               | ~2.4 s       | ~2.3 s     | ~15–30           | Database   |


### Key Takeaways

- P95 latency provides a more accurate view of user experience than averages
- Pagination significantly improves baseline and load-time latency
- Throughput saturates as database latency increases
- CPU utilization remaining stable confirms an IO-bound system
- Further performance gains require database-level optimizations


### Next Steps

- Implement cursor-based pagination
- Re-run load tests and compare P95 latency and throughput
- Evaluate cursor-based pagination
- Explore caching strategies to further reduce database load

---

## Introduced Cursor-based Pagination


## Baseline Performance (No Index, No Cache)

Dataset size: ~100,000 products  
Query type: Full collection scan (`find()` with no pagination)

### Observed Metrics

- HTTP request duration (`http_request_duration_seconds`)
  - ≈ 7.6 seconds

- Use case execution duration (`usecase_execution_duration_seconds`)
  - ≈ 6.5 seconds

- Database query duration (`db_query_duration_seconds`)
  - ≈ 6.5 seconds

### Interpretation

- HTTP time includes Express routing, controller execution,
  business logic, database query, and response serialization.
- Use case time measures only application business logic.
- Database time measures only MongoDB query execution.

The similarity between use case time and DB time indicates that
the business logic itself is lightweight and the database query
dominates request latency.

### Conclusion

- Database query is the primary performance bottleneck.
- Optimizing controllers or application logic will not
  significantly improve response time.
- Query-level optimizations (pagination, indexing) are required.

### Next Steps

- Introduce pagination (`limit` / `skip`)
- Add appropriate MongoDB indexes
- Re-measure metrics and compare with this baseline

## Introduced Pagination 

Dataset size: ~100,000 products  
Query type: Full collection scan (`find()` with limit 50 and skip)

### Observed Metrics

- HTTP request duration (`http_request_duration_seconds`)
  - ≈  seconds

- Use case execution duration (`usecase_execution_duration_seconds`)
  - ≈  seconds

- Database query duration (`db_query_duration_seconds`)
  - ≈  seconds

### Next Steps

- Introduce cursor pagination 
- Add appropriate MongoDB indexes
- Re-measure metrics and compare with this baseline
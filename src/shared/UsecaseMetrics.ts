import { Histogram } from "prom-client";

/**
 * This histogram stores how long use cases take to execute.
 * Time unit: seconds (Prometheus convention)
 */
const useCaseExecutionTime = new Histogram({
  name: "usecase_execution_duration_seconds",
  help: "Time taken to execute application use cases",
  labelNames: ["usecase"],
  buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2],
});
type UseCaseHandler<TArgs extends unknown[], TResult> = {
  execute(...args: TArgs): Promise<TResult>;
};
export class UsecaseMetrics<TArgs extends unknown [], TResult> implements UseCaseHandler<TArgs, TResult> {
    constructor(private usecase: UseCaseHandler<TArgs, TResult>, private usecaseName: string) {}

    async execute(...args: TArgs): Promise<TResult> {
    const endTimer = useCaseExecutionTime.startTimer({
      usecase: this.usecaseName,
    });

    try {
      return await this.usecase.execute(...args);
    } finally {
      endTimer();
    }
  }
}

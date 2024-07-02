import * as NodeSdk from "@effect/opentelemetry/NodeSdk"
import { BatchSpanProcessor, ConsoleSpanExporter } from "@opentelemetry/sdk-trace-base"

export const TracingConsole = NodeSdk.layer(() => ({
  resource: { serviceName: "example" },
  spanProcessor: new BatchSpanProcessor(new ConsoleSpanExporter()),
}))

/** 
 * Create a free account on https://honeycomb.io/ and get your API key
 * Make sure to install the following dependencies: https://effect.website/docs/guides/observability/telemetry/tracing#tutorial-visualizing-traces-with-docker-prometheus-grafana-and-tempo
 * Code snippet to send traces to Honeycomb

export const TracingLive = NodeSdk.layer(() => {
  const apiKey = "YOUR_API_KEY"
  const serviceName = "example"
  const headers = {
    "x-honeycomb-team": apiKey,
    "x-honeycomb-dataset": serviceName,
  }
  const traceExporter = new OTLPTraceExporter({
    url: "https://api.honeycomb.io/v1/traces",
    headers,
  })

  return {
    resource: { serviceName },
    spanProcessor: new BatchSpanProcessor(traceExporter, {
      scheduledDelayMillis: Duration.toMillis("1 seconds"),
    }),
  }
})
*/

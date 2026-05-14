export type Attributes = Record<string, unknown>
export type AnyValueMap = Record<string, unknown>
export type HrTime = [number, number]
export type MetricOptions = Record<string, unknown>

export type ExportResult = {
  code: number
  error?: Error
}

export const ExportResultCode = {
  SUCCESS: 0,
  FAILED: 1,
} as const

export type Logger = {
  emit(record: { body?: unknown; attributes?: Attributes }): void
}

const noopLogger: Logger = {
  emit() {},
}

export const logs = {
  getLogger(): Logger {
    return noopLogger
  },
  setGlobalLoggerProvider(_provider: unknown): void {},
}

export type Meter = {
  createCounter(
    name: string,
    options?: MetricOptions,
  ): { add(value: number, attributes?: Attributes): void }
}

const noopMeter: Meter = {
  createCounter() {
    return { add() {} }
  },
}

export class LoggerProvider {
  constructor(_options?: unknown) {}
  getLogger(): Logger {
    return noopLogger
  }
  async forceFlush(): Promise<void> {}
  async shutdown(): Promise<void> {}
}

export class MeterProvider {
  constructor(_options?: unknown) {}
  getMeter(): Meter {
    return noopMeter
  }
  async forceFlush(): Promise<void> {}
  async shutdown(): Promise<void> {}
}

export class BasicTracerProvider {
  constructor(_options?: unknown) {}
  async forceFlush(): Promise<void> {}
  async shutdown(): Promise<void> {}
}

export class BatchLogRecordProcessor {
  constructor(_exporter?: unknown, _options?: unknown) {}
}

export class BatchSpanProcessor {
  constructor(_exporter?: unknown, _options?: unknown) {}
}

export class PeriodicExportingMetricReader {
  constructor(_options?: unknown) {}
}

export class ConsoleLogRecordExporter {}
export class ConsoleMetricExporter {
  export(_metrics: unknown, callback: (result: ExportResult) => void): void {
    callback({ code: ExportResultCode.SUCCESS })
  }
}
export class ConsoleSpanExporter {}
export class OTLPLogExporter {
  constructor(_options?: unknown) {}
}
export class OTLPMetricExporter {
  constructor(_options?: unknown) {}
}
export class OTLPTraceExporter {
  constructor(_options?: unknown) {}
}
export class PrometheusExporter {}

export type Span = {
  spanContext(): { spanId: string }
  setAttribute(key: string, value: unknown): void
  setAttributes(attributes: Record<string, unknown>): void
  recordException(error: unknown): void
  setStatus(status: unknown): void
  end(): void
}

let spanCounter = 0

function createNoopSpan(): Span {
  const spanId = `noop-${++spanCounter}`
  return {
    spanContext: () => ({ spanId }),
    setAttribute() {},
    setAttributes() {},
    recordException() {},
    setStatus() {},
    end() {},
  }
}

const noopTracer = {
  startSpan(): Span {
    return createNoopSpan()
  },
}

export const trace = {
  getTracer() {
    return noopTracer
  },
  getActiveSpan(): Span | undefined {
    return undefined
  },
  setSpan<T>(ctx: T, _span: Span): T {
    return ctx
  },
  setGlobalTracerProvider(_provider: unknown): void {},
}

export const context = {
  active(): Record<string, never> {
    return {}
  },
}

export const DiagLogLevel = {
  ERROR: 30,
} as const

export type DiagLogger = {
  error(message: string, ...args: unknown[]): void
  warn(message: string, ...args: unknown[]): void
  info(message: string, ...args: unknown[]): void
  debug(message: string, ...args: unknown[]): void
  verbose(message: string, ...args: unknown[]): void
}

export const diag = {
  setLogger(_logger: DiagLogger, _level?: unknown): void {},
}

export type Resource = {
  attributes: Attributes
  merge(other: Resource): Resource
}

export function resourceFromAttributes(attributes: Attributes = {}): Resource {
  return {
    attributes,
    merge(other: Resource): Resource {
      return resourceFromAttributes({
        ...attributes,
        ...other.attributes,
      })
    },
  }
}

const emptyDetector = {
  detect(): Resource {
    return resourceFromAttributes()
  },
}

export const envDetector = emptyDetector
export const hostDetector = emptyDetector
export const osDetector = emptyDetector

export const ATTR_SERVICE_NAME = 'service.name'
export const ATTR_SERVICE_VERSION = 'service.version'
export const SEMRESATTRS_HOST_ARCH = 'host.arch'

export enum AggregationTemporality {
  DELTA = 0,
  CUMULATIVE = 1,
}

export type DataPoint<T = unknown> = {
  attributes?: Attributes
  value: T
  startTime?: HrTime
  endTime?: HrTime
}

export type MetricData = {
  descriptor: {
    name: string
    description?: string
    unit?: string
  }
  dataPoints?: DataPoint[]
}

export type ResourceMetrics = {
  resource: Resource
  scopeMetrics: Array<{
    metrics: MetricData[]
  }>
}

export type PushMetricExporter = {
  export(
    metrics: ResourceMetrics,
    resultCallback: (result: ExportResult) => void,
  ): void | Promise<void>
  forceFlush?(): Promise<void>
  shutdown?(): Promise<void>
}

export type ReadableLogRecord = {
  body?: unknown
  attributes?: Attributes
  hrTime: HrTime
  instrumentationScope?: {
    name?: string
  }
}

export type LogRecordExporter = {
  export(
    logs: ReadableLogRecord[],
    resultCallback: (result: ExportResult) => void,
  ): void | Promise<void>
  shutdown?(): Promise<void>
}

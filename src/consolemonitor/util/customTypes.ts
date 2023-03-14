export const ONE_KILO_BYTE = 1024
export const ONE_SECOND = 1000
export type TimeStamp = number & { t: 'Epoch time' }

export const StatusType = {
  debug: 'debug',
  error: 'error',
  info: 'info',
  warn: 'warn',
} as const

export type StatusType = typeof StatusType[keyof typeof StatusType]

export const ErrorSource = {
    CONSOLE: 'console',
    LOGGER: 'logger',
    NETWORK: 'network',
  } as const

export type ErrorSource = typeof ErrorSource[keyof typeof ErrorSource]  

export type LogsEvent = ConsoleLogsEvent
 
type Error = {
  kind?: string
  origin: ErrorSource // Todo: Remove in the next major release
  stack?: string
  [k: string]: unknown
}
  interface CommonLogsEvent {
    date: TimeStamp
    message: string
    status: StatusType
    error?: Error
  }

  export interface ConsoleLogsEvent extends CommonLogsEvent {
    origin: typeof ErrorSource.CONSOLE
  }

  export function timeStampNow() {
    return dateNow() as TimeStamp
  }
  export function dateNow() {
 
    return new Date().getTime()
  }

  export interface LogMessage {
    [x: string]: LogMessageValue
  }
  export type LogMessageValue = string | number | boolean | LogMessage | LogMessageArray | undefined | null
  export interface LogMessageArray extends Array<LogMessageValue> {}

  export interface LogConfiguration {
    // Batch configuration
    batchBytesLimit: number
    flushTimeout: number
    batchMessagesLimit: number
    messageBytesLimit: number
  }
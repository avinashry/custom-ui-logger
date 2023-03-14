import { CustomeObservable, mergeObservables } from "./customeObservable"
export const ConsoleApiName = {
    log: 'log',
    debug: 'debug',
    info: 'info',
    warn: 'warn',
    error: 'error',
  } as const

export type ConsoleApiName = typeof ConsoleApiName[keyof typeof ConsoleApiName]

export interface ConsoleLog {
    message: string
    api: ConsoleApiName
    stack?: string
}
const consoleObservablesByApi: { [k in ConsoleApiName]?: CustomeObservable<ConsoleLog> } = {}


export function initConsoleObservable(apis: ConsoleApiName[]) {
    const consoleObservables = apis.map((api) => {
      if (!consoleObservablesByApi[api]) {
        consoleObservablesByApi[api] = createConsoleObservable(api)
      }
      return consoleObservablesByApi[api]!
    })
  
    return mergeObservables<ConsoleLog>(...consoleObservables)
  }

function createConsoleObservable(api: ConsoleApiName) {
    const consoleObservable = new CustomeObservable<ConsoleLog>(()=> {
        const originalConsoleApi = console[api];
        console[api] = (...params: unknown[]) => {
            originalConsoleApi.apply(console, params)
                       
        consoleObservable.notify(buildConsoleLog(params, api))
        }

        return () => {
        console[api] = originalConsoleApi
        }

    });

    return consoleObservable;
  
}

function buildConsoleLog(params: unknown[], api: ConsoleApiName): ConsoleLog {
    // Todo: remove console error prefix in the next major version
    let message = params.map((param) => formatConsoleParameters(param)).join(' ')
    let stack
   
  
    return {
      api,
      message,
      stack
    }
  }

  function formatConsoleParameters(param: unknown) {
    if (typeof param === 'string') {
      return param
    }
    // if (param instanceof Error) {
    //   return formatErrorMessage(computeStackTrace(param))
    // }
    return jsonStringify(param, undefined, 2)
  }

  export function jsonStringify(
    value: unknown,
    replacer?: Array<string | number>,
    space?: string | number
  ): string | undefined {
    if (typeof value !== 'object' || value === null) {
      return JSON.stringify(value)
    }
    try {
        return JSON.stringify(value, replacer, space)
      } catch {
        return '<error: unable to serialize object>'
      }
}
import { ConsoleLogsEvent, LogsEvent } from "./util/customTypes";

export const enum ConsoleHandlerEventType {
    LOG_COLLECTED,
  }
  

export class ConsoleHandler {
    
    private callbacks: {[key in ConsoleHandlerEventType]?: Array<(data: any) => void> } = {}
    notify<E extends LogsEvent = LogsEvent>(
        eventType: ConsoleHandlerEventType.LOG_COLLECTED,
        data: LogsEventCollectedData<E>
      ): void 
    notify(eventType: ConsoleHandlerEventType, data?: any) {
        const eventCallbacks = this.callbacks[eventType]
        if (eventCallbacks) {
          eventCallbacks.forEach((callback) => callback(data))
        }
      }
      
      subscribe(callback: (data?: any) => void) {
        let eventType = ConsoleHandlerEventType.LOG_COLLECTED;
        if (!this.callbacks[eventType]) {
          this.callbacks[eventType] = []
        }
        this.callbacks[eventType]!.push(callback)
        return {
          unsubscribe: () => {
            this.callbacks[eventType] = this.callbacks[eventType]!.filter((other) => callback !== other)
          },
        }
      }
}

export interface LogsEventCollectedData<E extends LogsEvent = LogsEvent> {
    logsEvent: E
    messageContext?: object
    // savedCommonContext?: CommonContext
    // logger?: Logger
  }
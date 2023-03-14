import { ConsoleHandler, ConsoleHandlerEventType } from "./consoleHandler";
import { ConsoleApiName, ConsoleLog, initConsoleObservable } from "./consoleObservable";
import { ConsoleLogsEvent, ErrorSource, StatusType, timeStampNow } from "./util/customTypes";

const LogStatusForApi = {
    [ConsoleApiName.log]: StatusType.info,
    [ConsoleApiName.debug]: StatusType.debug,
    [ConsoleApiName.info]: StatusType.info,
    [ConsoleApiName.warn]: StatusType.warn,
    [ConsoleApiName.error]: StatusType.error,
  }
export function startConsoleCollection(consoleHandler: ConsoleHandler) {
    let forwardConsole =  ["log","info","debug","warn","error"] as ConsoleApiName[]; 

    const consoleSubscription = initConsoleObservable(forwardConsole).subscribe((log: ConsoleLog) => {
        const data = {
            logsEvent: {
              date: timeStampNow(),
              message: log.message,
              origin: ErrorSource.CONSOLE,
              error:
                log.api === ConsoleApiName.error
                  ? {
                      origin: ErrorSource.CONSOLE,  
                      stack: log.stack,
                    }
                  : undefined,
              status: LogStatusForApi[log.api],
            },
          };
        consoleHandler.notify<ConsoleLogsEvent>(ConsoleHandlerEventType.LOG_COLLECTED, 
            data
        );

  });
  return {
    stop: () => {
        consoleSubscription.unsubscribe()
      },
  }
}
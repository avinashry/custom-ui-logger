import { startConsoleCollection } from "./consoleCollection";
import { ConsoleHandler } from "./consoleHandler";
import { initiateLoggerBatch } from "./network/initiateLoggerBatch";
import { createLoggerEndpointBuilder } from "./network/loggerEndPointBuilder";
import { LogConfiguration, ONE_KILO_BYTE, ONE_SECOND } from "./util/customTypes";

export function startLogs() {
    const consoleHandler = new ConsoleHandler()
    const logConfiguration =  {
      
        batchBytesLimit: 16 * ONE_KILO_BYTE,
  
        eventRateLimiterThreshold: 3000,
 
        flushTimeout: 30 * ONE_SECOND,
  
        batchMessagesLimit: 50,
        messageBytesLimit: 256 * ONE_KILO_BYTE,
      } as LogConfiguration;
    const endPoint = createLoggerEndpointBuilder();
    startConsoleCollection(consoleHandler);
    const batch = initiateLoggerBatch(logConfiguration, endPoint)
    consoleHandler.subscribe((serverLogsEvent: any) => {
        batch.add(serverLogsEvent) ;
      });
}
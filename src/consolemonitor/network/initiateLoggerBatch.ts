import { LogConfiguration, LogMessage } from "../util/customTypes";
import { LoggerBatch } from "./LoggerBatch";
import { LoggerEndPointBuilder } from "./loggerEndPointBuilder";
import { createLoggerHttpRequest } from "./logHttpRequest";

export function initiateLoggerBatch<T extends LogMessage>(
    configuration: LogConfiguration,
    endpoint: LoggerEndPointBuilder) {
    const primaryBatch = createBatch(endpoint);

    function createBatch(endpointBuilder: LoggerEndPointBuilder) {
        return new LoggerBatch(
         createLoggerHttpRequest(endpointBuilder, configuration.batchBytesLimit),
          configuration.batchMessagesLimit,
          configuration.batchBytesLimit,
          configuration.messageBytesLimit,
          configuration.flushTimeout
        )
      }
      return {
        add(message: T) {
          primaryBatch.add(message)        
        },
      }  
}
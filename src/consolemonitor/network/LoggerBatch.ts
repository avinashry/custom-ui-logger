import { jsonStringify } from "../consoleObservable"
import { LogMessage } from "../util/customTypes"
import { LogHttpRequest } from "./logHttpRequest"

const HAS_MULTI_BYTES_CHARACTERS = /[^\u0000-\u007F]/
export class LoggerBatch {
    private messageBuffer: string[] = []
    private bufferBytesCount = 0
    private bufferMessagesCount = 0

    constructor(
        private request: LogHttpRequest,
        private batchMessagesLimit: number,
        private batchBytesLimit: number,
        private messageBytesLimit: number,
        private flushTimeout: number
      ) {
        this.flushPeriodically();
      }

    add(message: LogMessage) {
    this.addOrUpdate(message)
    }  
    flush(sendFn = this.request.send) {
        if (this.bufferMessagesCount !== 0) {
          const messages = this.messageBuffer
          const bytesCount = this.bufferBytesCount
    
          this.messageBuffer = []
          this.bufferBytesCount = 0
          this.bufferMessagesCount = 0
    
          sendFn(messages.join('\n'), bytesCount)
        }
    }
    private addOrUpdate(message: LogMessage) {
        const { processedMessage, messageBytesCount } = this.process(message)
        if (messageBytesCount >= this.messageBytesLimit) {
            //   display.warn(
            //     `Discarded a message whose size was bigger than the maximum allowed size ${this.messageBytesLimit}KB.`
            //   )
            return
        }
        if (this.willReachedBytesLimitWith(messageBytesCount)) {
            this.flush()
        }

        this.push(processedMessage, messageBytesCount)
        if (this.isFull()) {
            this.flush()
        }
    }
    private isFull() {
        return this.bufferMessagesCount === this.batchMessagesLimit || this.bufferBytesCount >= this.batchBytesLimit
    }
    private push(processedMessage: string, messageBytesCount: number) {
        if (this.bufferMessagesCount > 0) {
          // \n separator at serialization
          this.bufferBytesCount += 1
        }
 
        this.messageBuffer.push(processedMessage)
        this.bufferBytesCount += messageBytesCount
        this.bufferMessagesCount += 1
      }  
    
    private process(message: LogMessage) {
        const processedMessage = jsonStringify(message)!
        const messageBytesCount = this.computeBytesCount(processedMessage)
        return { processedMessage, messageBytesCount }
    }  
    private willReachedBytesLimitWith(messageBytesCount: number) {
        // byte of the separator at the end of the message
        return this.bufferBytesCount + messageBytesCount + 1 >= this.batchBytesLimit
    }

    computeBytesCount(candidate: string) {
        // Accurate bytes count computations can degrade performances when there is a lot of events to process
        if (!HAS_MULTI_BYTES_CHARACTERS.test(candidate)) {
          return candidate.length
        }
    
        if (window.TextEncoder !== undefined) {
          return new TextEncoder().encode(candidate).length
        }
    
        return new Blob([candidate]).size
      }

    private flushPeriodically() {
        setTimeout(() => {
            this.flush()
            this.flushPeriodically()
            },
            this.flushTimeout
        )
    }  



}
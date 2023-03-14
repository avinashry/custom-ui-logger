import { LoggerEndPointBuilder } from "./loggerEndPointBuilder";
//Constructs a type consisting of the return type of function Type.
export type LogHttpRequest = ReturnType<typeof createLoggerHttpRequest>

export function createLoggerHttpRequest(loggerEndPointBuilder: LoggerEndPointBuilder, bytesLimit: number) {
    function useSendBeacon(data: string | FormData, bytesCount: number) {
        const url = loggerEndPointBuilder.build()
        const canUseBeacon = !!navigator.sendBeacon && bytesCount < bytesLimit
        if (canUseBeacon) {
          try {
            const isQueued = navigator.sendBeacon(url, data)
    
            if (isQueued) {
              return
            }
          } catch (e) {
            //Handle error
          }
        }
    
        sendXHR(url, data)
      }

    function useFetchKeepAlive(data: string | FormData, bytesCount: number) {
        const url = loggerEndPointBuilder.build()
        const canUseKeepAlive = window.Request && 'keepalive' in new Request('') && bytesCount < bytesLimit
        if (canUseKeepAlive) {
          fetch(url, { method: 'POST', body: data, keepalive: true }).catch(
            () => {
              sendXHR(url, data)
            }
          )
        } else {
          sendXHR(url, data)
        }
      }  
      function sendXHR(url: string, data: string | FormData) {
        const request = new XMLHttpRequest()
        request.open('POST', url, true)
        request.send(data)
      }  
      return {
        send: (data: string | FormData, bytesCount: number) => {
            useFetchKeepAlive(data, bytesCount)
          },
          /**
           * Since fetch keepalive behaves like regular fetch on Firefox,
           * keep using sendBeaconStrategy on exit
           */
          sendOnExit: useSendBeacon,
      }
    
}
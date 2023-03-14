
export type LoggerEndPointBuilder =  ReturnType<typeof createLoggerEndpointBuilder>

export function createLoggerEndpointBuilder() {
    const host = "";
    const baseUrl = `https://${host}/api/v2/logs`
    return {
        build() {
            const endpointUrl = `${baseUrl}?`
            return endpointUrl;
        }
    }
}
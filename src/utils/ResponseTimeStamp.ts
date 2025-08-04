export function responseTimeStamp(startTime?: number): number {
    if (startTime) {
        const endTime = Number(process.hrtime.bigint());
        const responseTime = (endTime - startTime) / 1000000
        return parseFloat(responseTime.toFixed(2))
    } else {
        return Number(process.hrtime.bigint());
    }
}
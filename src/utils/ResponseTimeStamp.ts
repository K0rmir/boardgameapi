// Helper function to calculate response time //
export function responseTimeStamp(errorStatus: boolean, startTime?: number): number {
    if (errorStatus && startTime !== undefined) {
        const endTime = Number(process.hrtime.bigint());
        return endTime - startTime;
    } else {
        return Number(process.hrtime.bigint());
    }
}
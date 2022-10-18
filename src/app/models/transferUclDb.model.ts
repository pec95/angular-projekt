export class TransferUclDb {
    incomingId: string;
    outgoingId: string;
    playerId: string;
    timestamp: string;
    valueInMillions: number;

    constructor(incomingId: string, outgoingId: string, playerId: string, timestamp: string, valueInMillions: number) {
        this.incomingId = incomingId;
        this.outgoingId = outgoingId;
        this.playerId = playerId;
        this.timestamp = timestamp;
        this.valueInMillions = valueInMillions;
    }
}
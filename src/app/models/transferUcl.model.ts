export class TransferUcl {
    id: string;
    incomingId: string;
    outgoingId: string;
    playerId: string;
    timestamp: string;
    valueInMillions: number;

    constructor(id: string, incomingId: string, outgoingId: string, playerId: string, timestamp: string, valueInMillions: number) {
        this.id = id;
        this.incomingId = incomingId;
        this.outgoingId = outgoingId;
        this.playerId = playerId;
        this.timestamp = timestamp;
        this.valueInMillions = valueInMillions;
    }
}
export class Transfer {
    incoming: string;
    outgoing: string;
    player: string;
    timestamp: string;
    valueInMillions: number;

    constructor(incoming: string, outgoing: string, player: string, timestamp: string, valueInMillions: number) {
        this.incoming = incoming;
        this.outgoing = outgoing;
        this.player = player;
        this.timestamp = timestamp;
        this.valueInMillions = valueInMillions;
    }
}
import { ChainsInfo, PKsInfo } from "../config";
import { sendPing } from "./sendPing";
import { waitForRelayedMessage } from "./waitForRelayedMessage";

const MINUTE = 60 * 1000;

export async function startTracking (chainsInfo: ChainsInfo, pksInfo: PKsInfo, intervalMinutes: number = 10) {
    while (true) {
        const result = await sendPing(chainsInfo, pksInfo);
        await waitForRelayedMessage(chainsInfo, result.sentMessageSender, result.sentMessagePayload);

        console.log('');
        console.log("=== 🔄 Waiting for next tracking cycle ===");
        console.log('');

        await wait(intervalMinutes * MINUTE);
    }
}

function wait(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
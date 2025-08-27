# @wakeuplabs/op-interop-alerts-sdk — Technical Research

## Purpose

We aim to build a Crosschain Alert Monitoring Tool delivered as a TypeScript SDK to track and monitor interoperability messages across Superchain blockchains. At its core, the SDK will send lightweight cross-chain “pings” between Optimism and Base using the canonical L2CrossDomainMessenger (0x4200000000000000000000000000000000000007, the same across all OP Stack L2s). Each ping will report whether delivery succeeded, failed, or timed out, along with precise timing information.

By relying solely on the canonical OP Stack messenger (no fast or third-party relayers) and leveraging viem + @eth-optimism/viem under the hood, the tool ensures a deterministic and reliable measurement of cross-chain health. These results become the foundation for real-time metrics and alerts, enabling developers and operators to detect issues early and gain clear visibility into the state of cross-chain communication across the Superchain.

## Usage (recommended loop)

```typescript
import { base, optimism } from "viem/chains";
import { messagePing } from "@wakeuplabs/op-interop-alerts-sdk";
// we will need a PK with balance in base and optimism
while (true) {
  const result = await messagePing(base, optimism, process.env.PRIVATE_KEY!);
  await db.store(result);
  await wait(10 * MINUTE); // recommended interval; user may change it
}
```

## Private key requirements

A privateKey (hex, 0x…) would be passed by the user.

That key would need to hold funds on both chains being monitored (gas on the origin of each ping; if alternating directions, balance would be required on both).

## Public API

```typescript
import type { Chain } from "viem/chains";

/**
 * Would send a canonical OP Stack cross-chain ping via L2CrossDomainMessenger.
 * - Internally uses viem + @eth-optimism/viem.
 * - Defaults (subject to change):
 *   - minGasLimit: 200,000
 *   - confirmations: 1 (origin and destination)
 *   - timeout: 15 minutes
 *   - RPC: public endpoints via viem http() for the given Chain objects
 */
export declare function messagePing(
  origin: Chain,
  destination: Chain,
  privateKey: `0x${string}`
): Promise<PingResult>;
```

## Result type

```typescript
export type PingStatus = "success" | "fail" | "timeout";
export interface PingResult {
  status: PingStatus;
  txHashOrigin?: `0x${string}`;
  messageHash?: `0x${string}`;
  timestamps: {
    t0_submit: string;
    t1_l2a_mined?: number;
    t2_delivered?: number;
  };
  latency: {
    wallClockMs?: number;
    chainObservedSeconds?: number;
  };
  messengerEvents: {
    relayedMessageTx?: `0x${string}`;
    failedRelayedMessageTx?: `0x${string}`;
  };
  receiverEventTx?: `0x${string}`;
  error?: string;
}
```

## What the SDK would do

1. Build a minimal payload and call sendMessage on the origin chain's L2CrossDomainMessenger.

2. Wait for 1 confirmation on the origin, derive the message correlation (e.g., messageHash).

3. Watch the destination messenger for:
   - RelayedMessage → success
   - FailedRelayedMessage → fail

4. If neither shows up within 15 minutes, return timeout.

5. Compute latency both as:
   - wallClockMs: host-wall-clock duration (submit → delivery signal).
   - chainObservedSeconds: purely on-chain timing.

The SDK would not expose ABIs in the public API and would not include any deployment flows. Canonical path only.

## OP Stack notes (relevant to this SDK)

Canonical messenger address (all OP Stack L2s):
`0x4200000000000000000000000000000000000007`

Key destination signals:
- RelayedMessage → executed on destination (success path).
- FailedRelayedMessage → relay attempted but execution failed.

minGasLimit would default internally to 200k (sufficient for trivial ping).

## Defaults & constraints (planned):

- Networks: Optimism ↔ Base (mainnet or sepolia). Extendable to other OP Stack chains later.
- Private key: supplied by user, with balance on both chains.
- Deployments: any receiver contract would be deployed by the user (SDK would not deploy).
- Timeout: 15 minutes.
- Confirmations: 1 on origin, 1 on destination.
- Persistence: none (user app decides storage).
- RPC: public by default (from viem presets).
- Delivery path: canonical only.
- ID/correlation: internal only.
- Recommended interval: ~10 minutes between pings.

# Appendix: Findings & Next Steps

## 1. Current state of L2CrossDomainMessenger in OP Stack

When reviewing the official L2CrossDomainMessenger.sol, we observed that the contract calls _disableInitializers. This would mean it is disabled and not active on the network.

Tests on both testnet and mainnet suggest the canonical messenger would not work yet.

According to discussions with the Optimism community, there is no confirmed release date for when it might be enabled.

👉 Thus, although the SDK is planned to use the canonical messenger (0x4200…0007), that path would not be available at this stage.

## 2. Temporary workaround for testing

Since the canonical messenger is not available yet, we would need to take an alternative approach for development and testing:

- Custom deployment: we would deploy our own version of the L2CrossDomainMessenger contract on two testnets.
- Relay script: we would build a relay script to simulate cross-chain message delivery.
- Full compatibility: everything else in the SDK would remain unchanged (API, types, flow).
- Goal: validate the full end-to-end experience (sending, correlation, monitoring, latency) while waiting for the canonical messenger to go live.

Once the canonical L2CrossDomainMessenger is enabled on OP Stack mainnet/testnets, the SDK should be able to migrate seamlessly, simply switching to the canonical messenger address.

# Higher-Level Modules (within the same SDK)

## Tracking Module

Encapsulates the messagePing primitive and produces a PingResult for each execution. This is the raw tracking layer: it submits pings, captures results, and normalizes data (timestamps, messageHash, messenger events). Consumers typically schedule it in loops (e.g. ~10 minutes) to maintain a steady heartbeat between chains.

## Metrics Generation Module

Builds aggregated metrics from collections of PingResult. Functions compute latency distributions (P50, P95), success/failure/timeout rates, and overall interop status (active | paused | degraded) per chain pair and time window. This replaces the old "listen to arbitrary events" model with deterministic, synthetic measurement based on canonical pings.

## Alert Generation Module

Provides a lightweight rules engine on top of metrics. Users can configure thresholds for missing, delayed, or unexpected pings. When conditions are met, the SDK emits structured alert events with severities (info | warn | critical). Applications can subscribe to these events and route them to Slack, webhooks, email, or monitoring systems.



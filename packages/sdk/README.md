# OP Interop Alerts SDK

**OP Interop Alerts SDK** is a cross-chain communication monitoring tool designed specifically for the Optimism Superchain ecosystem. This TypeScript SDK enables tracking and monitoring of interoperability message health between different OP Stack L2 blockchains, such as Optimism and Base, providing real-time metrics about cross-chain communication status.

The project implements a synthetic "ping" system that uses the canonical L2CrossDomainMessenger to send lightweight messages between chains and measure whether delivery succeeded, failed, or timed out, along with precise latency information. By relying solely on the canonical OP Stack messenger and leveraging viem + @eth-optimism/viem, the tool ensures deterministic and reliable measurements that serve as the foundation for real-time alerts, enabling developers and operators to detect issues early and gain clear visibility into cross-chain communication health across the Superchain.

For detailed technical information and implementation details, see the [Technical Research](https://github.com/wakeuplabs-io/op-interop-alerts/blob/develop/technical-research.md) document.

## Installation

```bash
npm install @wakeuplabs/op-interop-alerts-sdk
```

## Quick Start

```typescript
import { startTracking } from '@wakeuplabs/op-interop-alerts-sdk';
import { CHAINS_INFO } from '@wakeuplabs/op-interop-alerts-sdk/config';

// Start monitoring cross-chain communication between Optimism and Base
const { stop } = await startTracking({
  sourceChain: CHAINS_INFO.optimism,
  targetChain: CHAINS_INFO.base,
  privateKey: 'your-private-key',
  pingIntervalMs: 30000, // Send ping every 30 seconds
  onSuccess: (metrics) => {
    console.log('Cross-chain message delivered successfully:', metrics);
  },
  onFailure: (error) => {
    console.error('Cross-chain message failed:', error);
  },
  onTimeout: (timeoutInfo) => {
    console.warn('Cross-chain message timed out:', timeoutInfo);
  }
});

// Stop monitoring when needed
// stop();
```

## Features

- **Real-time Cross-chain Monitoring**: Track message delivery status between OP Stack L2s
- **Synthetic Ping System**: Lightweight messages using canonical L2CrossDomainMessenger
- **Precise Metrics**: Latency measurements and delivery status tracking
- **TypeScript Support**: Full TypeScript support with comprehensive type definitions
- **Multiple Chain Support**: Works with any OP Stack L2 (Optimism, Base, etc.)
- **Event-driven Architecture**: Configurable callbacks for success, failure, and timeout events

## Supported Chains

Currently supported chains:
- Optimism Mainnet
- Base Mainnet

## API Reference

### `startTracking(options)`

Starts monitoring cross-chain communication between two chains.

**Parameters:**
- `sourceChain`: Chain configuration for the source chain
- `targetChain`: Chain configuration for the target chain  
- `privateKey`: Private key for sending transactions
- `pingIntervalMs`: Interval between ping messages (default: 30000ms)
- `timeoutMs`: Timeout for message delivery (default: 300000ms)
- `onSuccess`: Callback for successful message delivery
- `onFailure`: Callback for failed message delivery
- `onTimeout`: Callback for message timeout

**Returns:**
- `stop()`: Function to stop the monitoring

### `sendPing(options)`

Sends a single ping message between chains.

### `waitForRelayedMessage(options)`

Waits for a specific message to be relayed and provides delivery metrics.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see the [LICENSE](https://github.com/wakeuplabs-io/op-interop-alerts/blob/develop/LICENSE) file for details.

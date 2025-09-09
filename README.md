# OP Interop Alerts SDK

**OP Interop Alerts SDK** is a cross-chain communication monitoring tool designed specifically for the Optimism Superchain ecosystem. This TypeScript SDK enables tracking and monitoring of interoperability message health between different OP Stack L2 blockchains, such as Optimism and Base, providing real-time metrics about cross-chain communication status.

The project implements a synthetic "ping" system that uses the canonical L2CrossDomainMessenger to send lightweight messages between chains and measure whether delivery succeeded, failed, or timed out, along with precise latency information. By relying solely on the canonical OP Stack messenger and leveraging viem + @eth-optimism/viem, the tool ensures deterministic and reliable measurements that serve as the foundation for real-time alerts, enabling developers and operators to detect issues early and gain clear visibility into cross-chain communication health across the Superchain.

For detailed technical information and implementation details, see the [Technical Research](./technical-research.md) document.

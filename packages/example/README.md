# OP Interop Alerts SDK Example (TypeScript)

This is a TypeScript example package that demonstrates how to use the `@wakeuplabs/op-interop-alerts-sdk` to track cross-chain message relaying between Optimism L2 chains.

## Features

- Written in TypeScript with full type safety
- Uses environment variables for secure configuration
- Imports the SDK from npm
- Configures chain information for origin and destination chains
- Starts the tracking process with a configurable interval

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set up environment variables:

   ```bash
   cp env.example .env
   ```

3. Edit the `.env` file with your configuration:

   ```bash
   # Required: Add your private keys
   ORIGIN_PRIVATE_KEY=0x...
   DESTINATION_PRIVATE_KEY=0x...
   
   # Tracking Configuration (Optional)
   TRACKING_INTERVAL_MINUTES=10
   ```

## Usage

### Build and run

```bash
npm start
```

### Development mode with auto-rebuild

```bash
npm run dev
```

### Build only

```bash
npm run build
```

## Environment Variables

### Required

- `ORIGIN_PRIVATE_KEY`: Private key for the origin chain account
- `DESTINATION_PRIVATE_KEY`: Private key for the destination chain account

### Optional (with defaults)

- `TRACKING_INTERVAL_MINUTES`: Minutes between tracking cycles (default: 10)

## Security

⚠️ **Important Security Notes:**

- Never commit your `.env` file to version control
- The example private keys in `env.example` are for testing only
- Use secure, unique private keys for production environments
- Keep your private keys secure and never share them

## What it does

The tracking process:

1. Loads configuration from environment variables
2. Validates required private keys are present
3. Sends a ping message from the origin chain to the destination chain
4. Waits for the message to be relayed and processed
5. Logs the results with detailed information
6. Waits for the specified interval before repeating

This helps monitor the health and performance of cross-chain message relaying in the OP Stack interoperability system.

import { defineConfig } from '@wagmi/cli'
import MessageReceiver from './src/abis/MessageReceiver.json'
import L2ToL2CrossDomainMessenger from './src/abis/L2ToL2CrossDomainMessenger.json'
import { Abi } from 'viem'

export default defineConfig({
  out: 'src/abis/generated.ts',
  contracts: [{
    name: "MessageReceiver",
    abi: MessageReceiver.abi as Abi,
  },{
    name: "L2ToL2CrossDomainMessenger",
    abi: L2ToL2CrossDomainMessenger.abi as Abi,
  }],
  plugins: [],
})

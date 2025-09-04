//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// L2ToL2CrossDomainMessenger
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const l2ToL2CrossDomainMessengerAbi = [
  { type: 'error', inputs: [], name: 'EventPayloadNotSentMessage' },
  { type: 'error', inputs: [], name: 'IdOriginNotL2ToL2CrossDomainMessenger' },
  { type: 'error', inputs: [], name: 'InvalidMessage' },
  { type: 'error', inputs: [], name: 'MessageAlreadyRelayed' },
  { type: 'error', inputs: [], name: 'MessageDestinationNotRelayChain' },
  { type: 'error', inputs: [], name: 'MessageDestinationSameChain' },
  {
    type: 'error',
    inputs: [],
    name: 'MessageTargetL2ToL2CrossDomainMessenger',
  },
  { type: 'error', inputs: [], name: 'NotEntered' },
  { type: 'error', inputs: [], name: 'ReentrantCall' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'source',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'messageNonce',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'messageHash',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'returnDataHash',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: false,
      },
    ],
    name: 'RelayedMessage',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'destination',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'target',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'messageNonce',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      { name: 'message', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'SentMessage',
  },
  {
    type: 'function',
    inputs: [],
    name: 'crossDomainMessageContext',
    outputs: [
      { name: 'sender_', internalType: 'address', type: 'address' },
      { name: 'source_', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'crossDomainMessageSender',
    outputs: [{ name: 'sender_', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'crossDomainMessageSource',
    outputs: [{ name: 'source_', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'messageNonce',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'messageVersion',
    outputs: [{ name: '', internalType: 'uint16', type: 'uint16' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_id',
        internalType: 'struct Identifier',
        type: 'tuple',
        components: [
          { name: 'origin', internalType: 'address', type: 'address' },
          { name: 'blockNumber', internalType: 'uint256', type: 'uint256' },
          { name: 'logIndex', internalType: 'uint256', type: 'uint256' },
          { name: 'timestamp', internalType: 'uint256', type: 'uint256' },
          { name: 'chainId', internalType: 'uint256', type: 'uint256' },
        ],
      },
      { name: '_sentMessage', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'relayMessage',
    outputs: [{ name: 'returnData_', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_destination', internalType: 'uint256', type: 'uint256' },
      { name: '_nonce', internalType: 'uint256', type: 'uint256' },
      { name: '_sender', internalType: 'address', type: 'address' },
      { name: '_target', internalType: 'address', type: 'address' },
      { name: '_message', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'resendMessage',
    outputs: [
      { name: 'messageHash_', internalType: 'bytes32', type: 'bytes32' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_destination', internalType: 'uint256', type: 'uint256' },
      { name: '_target', internalType: 'address', type: 'address' },
      { name: '_message', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'sendMessage',
    outputs: [
      { name: 'messageHash_', internalType: 'bytes32', type: 'bytes32' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'sentMessages',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    name: 'successfulMessages',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MessageReceiver
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const messageReceiverAbi = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'message',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'MessageReceived',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getLastMessage',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getMessageCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'lastMessage',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'lastSender',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'messageCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_message', internalType: 'string', type: 'string' }],
    name: 'receiveMessage',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

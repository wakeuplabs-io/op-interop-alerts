

export const chainsInfoMock: ChainsInfo = {
    chainOrigin: {
        rpcUrl: "http://127.0.0.1:8545",
        chainId: 31337,
        l2CrossDomainMessenger: "0xb581c9264f59bf0289fa76d61b2d0746dce3c30d",
    },
    chainDestination: {
        rpcUrl: "http://127.0.0.1:9545",
        chainId: 31338,
        messageReceiver: "0xc469e7ae4ad962c30c7111dc580b4adbc7e914dd",
        l2CrossDomainMessenger: "0xb581c9264f59bf0289fa76d61b2d0746dce3c30d",
    },
}

export type PKsInfo = {
    origin: `0x${string}`,
    destination: `0x${string}`,
}

export type ChainsInfo = {
    chainOrigin: {
        rpcUrl: string,
        chainId: number,
        l2CrossDomainMessenger: `0x${string}`,
    },
    chainDestination: {
        rpcUrl: string,
        chainId: number,
        messageReceiver: `0x${string}`,
        l2CrossDomainMessenger: `0x${string}`,
    },
};
import { Contract } from "ethers";
import { provider } from "./getProvider";

export const connectContract = async (): Promise<
  | {
      contract: Contract;
    }
  | undefined
> => {
  try {
    const ABI = [
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "userAddress",
            type: "address",
          },
          {
            indexed: false,
            internalType: "string",
            name: "ipfsCid",
            type: "string",
          },
          {
            indexed: false,
            internalType: "string",
            name: "fileHash",
            type: "string",
          },
          {
            indexed: false,
            internalType: "bytes",
            name: "signature",
            type: "bytes",
          },
        ],
        name: "DocumentUploaded",
        type: "event",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        name: "documents",
        outputs: [
          {
            internalType: "string",
            name: "ipfsCid",
            type: "string",
          },
          {
            internalType: "bytes",
            name: "signature",
            type: "bytes",
          },
          {
            internalType: "string",
            name: "fileHash",
            type: "string",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "_userAddress",
            type: "address",
          },
        ],
        name: "getUserDocument",
        outputs: [
          {
            components: [
              {
                internalType: "string",
                name: "ipfsCid",
                type: "string",
              },
              {
                internalType: "bytes",
                name: "signature",
                type: "bytes",
              },
              {
                internalType: "string",
                name: "fileHash",
                type: "string",
              },
            ],
            internalType: "struct Web3DocSignerType.SignerInformation",
            name: "",
            type: "tuple",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "string",
            name: "_ipfsCid",
            type: "string",
          },
          {
            internalType: "bytes",
            name: "_signature",
            type: "bytes",
          },
          {
            internalType: "string",
            name: "_fileHash",
            type: "string",
          },
        ],
        name: "uploadDocument",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "signer",
            type: "address",
          },
          {
            internalType: "string",
            name: "message",
            type: "string",
          },
          {
            internalType: "bytes",
            name: "signature",
            type: "bytes",
          },
        ],
        name: "verifySignature",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
    ];

    const contractAddress = "0x6C0C995F9ed81d31Ed56D56B93CB5eDd2a1b9E5d";
    const signer = provider.getSigner();

    await provider.send("eth_requestAccounts", []);

    const contract = new Contract(contractAddress, ABI, signer);

    return { contract };
  } catch (error) {
    console.log("contract interaction: ", error);
  }
};

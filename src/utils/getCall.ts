import { functions } from "../abi/abi";
import { Call } from "@subsquid/substrate-processor";

function decodeEvmCall(
  inputData: string,
  functionName: keyof typeof functions,
) {
  if (functions[functionName]) {
    return functions[functionName].decode(inputData);
  } else {
    throw new Error(`Function with signature ${functionName} not found`);
  }
}

export function processCall(call: any, functionName: string) {
  if (call.name === "Ethereum.transact") {
    const inputData = call.args.transaction.value.input;
    const decodedEvmCall = decodeEvmCall(
      inputData,
      functionName as keyof typeof functions,
    );

    if (decodedEvmCall) {
      const nativeCall = {
        id: call.id,
        extrinsicIndex: call.extrinsicIndex,
        address: call.address,
        name: functionName,
        args: decodedEvmCall,
        success: call.success,
        ...(call.origin != null && { origin: call.origin }),
      };
      return nativeCall;
    } else {
      console.error("Failed to decode the EVM call.");
      return call;
    }
  } else {
    return call;
  }
}

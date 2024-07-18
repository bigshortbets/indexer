import * as ss58 from "@subsquid/ss58";
export const encodeUserValue = (inputUserValue: string) => {
  const hexUserValue = inputUserValue.slice(2); // removes 0x prefix
  if (!hexUserValue || !/^[0-9a-fA-F]+$/.test(hexUserValue)) {
    console.error("Invalid hexadecimal input");
    return "";
  } else {
    const uint8ArrayUserValue = new Uint8Array(
      // @ts-ignore
      hexUserValue.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
    );
    return ss58.codec(42).encode(uint8ArrayUserValue);
  }
};
export const encodeMarketTicker = (inputMarketTicker: string) => {
  const hexMarketTicker = inputMarketTicker.slice(2); // removes 0x prefix
  const buffer = Buffer.from(hexMarketTicker, "hex");
  return buffer.toString("utf8");
};

export const convertStringValueToHexBigEndian = (value: string) => {
  const bigIntValue = BigInt(value);
  let littleEndianHex = bigIntValue.toString(16);
  if (littleEndianHex.length % 2 !== 0) {
    littleEndianHex = "0" + littleEndianHex;
  }
  const chunks = littleEndianHex.match(/.{1,2}/g);
  if (chunks) {
    chunks.reverse();
    const bigEndianHex = chunks.join("");
    if (bigEndianHex.length % 2 !== 0) {
      return "0x0" + bigEndianHex;
    }
    return "0x" + bigEndianHex;
  }
  return "";
};

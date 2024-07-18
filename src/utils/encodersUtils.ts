import * as ss58 from "@subsquid/ss58";
export const encodeUserValue = (inputUserValue: string) => {
  const hexUserValue = inputUserValue.slice(2); // removes 0x prefix
  if (!hexUserValue || !/^[0-9a-fA-F]+$/.test(hexUserValue)) {
    console.error("Invalid hexadecimal input");
    return "";
  } else {
    const uint8ArrayUserValue = new Uint8Array(
      // @ts-ignore
      hexUserValue.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)),
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

const LUT_HEX_4b = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
];
const LUT_HEX_8b = new Array(0x100);
for (let n = 0; n < 0x100; n++) {
  LUT_HEX_8b[n] = `${LUT_HEX_4b[(n >>> 4) & 0xf]}${LUT_HEX_4b[n & 0xf]}`;
}

const bufferToHex = (buffer: Uint8Array) => {
  buffer = new Uint8Array(buffer);
  let out = "";
  for (let idx = 0, edx = buffer.length; idx < edx; idx++) {
    out += LUT_HEX_8b[buffer[idx]];
  }
  return "0x" + out.toLocaleLowerCase();
};

export const hexToLittleEndian = (hexValue: any) => {
  hexValue = hexValue.startsWith("0x") ? hexValue.slice(2) : hexValue;
  const hexBytes = hexValue.match(/.{1,2}/g);
  const littleEndianBytes = hexBytes.reverse();
  return "0x" + littleEndianBytes.join("");
};

export const convertToU8a = async (api: any, address: string) => {
  const decodedAddress = api.createType("AccountId", address);

  const u8aRepresentation = decodedAddress.toU8a(true);
  return bufferToHex(u8aRepresentation);
};

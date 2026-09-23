export function dataUrlToBuffer(dataUrl: string): Uint8Array {
  const match = /^data:image\/png;base64,([A-Za-z0-9+/]+=*)$/.exec(dataUrl);
  if (!match) throw new Error("Invalid signature.");
  return Buffer.from(match[1], "base64");
}

export function bufferToDataUrl(uint8Array: Uint8Array): string {
  const base64String = Buffer.from(uint8Array).toString("base64");
  return `data:image/png;base64,${base64String}`;
}

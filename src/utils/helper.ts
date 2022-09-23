
export const formatAddress = (address: string) => {
  const len = address.length;
  return address.substr(0, 5) + '...' + address.substring(len - 4, len);
};

export const formatSig = (sig: string) => {
  const len = sig.length;
  return sig.substr(0, 5) + '...' + sig.substring(len - 4, len);
};

export const formatDid = (did: string) => {
  const len = did.length;
  return did.substr(0, 22) + '...' + did.substring(len - 4, len);
};

export const isValidAddr = (address: string) => {
  const re = /^0x[a-fA-F0-9]{40}$/;
  return address.match(re);
};


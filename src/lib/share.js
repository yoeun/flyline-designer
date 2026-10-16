// The whole setup travels in the URL hash as base64url JSON.
export function encodeSetup(setup) {
  const { id, ...rest } = setup;
  const bytes = new TextEncoder().encode(JSON.stringify(rest));
  let bin = '';
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function decodeSetup(text) {
  try {
    const bin = atob(text.replace(/-/g, '+').replace(/_/g, '/'));
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    const setup = JSON.parse(new TextDecoder().decode(bytes));
    if (!setup?.reel || !setup?.line?.zones?.length || !setup?.backing) return null;
    return setup;
  } catch {
    return null;
  }
}

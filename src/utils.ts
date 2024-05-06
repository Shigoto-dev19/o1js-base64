import { randomBytes as generateRandomBytes } from 'node:crypto';

export { generateRandomBase64String, calculateB64DecodedBytesLength };

function generateRandomBase64String(maxLength: number): string {
  // Generate a random length between 1 and maxLength
  const length = Math.floor(Math.random() * maxLength) + 1;

  // Generate random bytes or buffer
  const randomBytes = generateRandomBytes(length);

  // Convert to Base64
  const base64String = randomBytes.toString('base64');

  return base64String;
}

function calculateB64DecodedBytesLength(base64String: string): number {
  // Calculate the length of the base64-encoded string
  const base64Length = base64String.length;

  // Count the number of padding characters '=' in the base64 string
  const padding = (base64String.match(/=/g) || []).length;

  // Calculate the length of the decoded bytes
  const byteLength = (base64Length * 3) / 4 - padding;

  return byteLength;
}

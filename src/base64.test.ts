import { Bytes } from 'o1js';
import { base64Decode } from './base64';
import { randomBytes as generateRandomBytes } from 'node:crypto';

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

describe('Base64 Decode Tests', () => {
  function testBase64Decode(base64String: string) {
    // Calculate the expected length of the decoded bytes
    const decodedByteLength = calculateB64DecodedBytesLength(base64String);

    // Decode the base64 string
    const decodedBytes = base64Decode(
      Bytes.fromString(base64String),
      decodedByteLength
    ).map((x) => Number(x.toBigInt()));

    // Calculate the expected decoded bytes using JS implementation
    const decodedString = atob(base64String);
    let expectedDecodedBytes = new Array(decodedString.length);

    // Populate the expected decoded bytes array with character codes
    for (let i = 0; i < decodedString.length; i++) {
      expectedDecodedBytes[i] = decodedString.charCodeAt(i);
    }

    // Assert that the decoded bytes match the expected decoded bytes
    expect(decodedBytes).toEqual(expectedDecodedBytes);
  }

  it('should decode a base64-encoded input', () => {
    const input = '7xQMDuoVVU4m0W0WRVSrVXMeGSIASsnucK9dJsrc+vU=';
    testBase64Decode(input);
  });

  it('should decode a base64-encoded input (1000 iterations)', () => {
    for (let i = 0; i < 100; i++) {
      const input = generateRandomBase64String(1000);
      testBase64Decode(input);
    }
  });

  it('should reject a base64-encoded input of length not a multiple of 4', () => {
    const input = 'ad/';
    const errorMessage = 'Input base64 byte length should be a multiple of 4!';
    expect(() => testBase64Decode(input)).toThrowError(errorMessage);
  });

  it('should reject input containing non-base64 characters', () => {
    const input = 'ad$=';
    const errorMessage =
      'Please provide base64-encoded bytes containing only alphanumeric characters and +/=';
    expect(() => testBase64Decode(input)).toThrowError(errorMessage);
  });
});

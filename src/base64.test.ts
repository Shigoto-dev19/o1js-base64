import { Bytes } from 'o1js';
import { base64Decode } from './base64';
import {
  calculateB64DecodedBytesLength,
  generateRandomBase64String,
} from './utils';

describe('Base64 Decode Tests', () => {
  function testBase64Decode(base64String: string) {
    // Calculate the expected length of the decoded bytes
    const decodedByteLength = calculateB64DecodedBytesLength(base64String);

    // Decode the base64 string
    const decodedBytes = base64Decode(
      Bytes.fromString(base64String),
      decodedByteLength
    ).toBytes();

    // Calculate the expected decoded bytes using JS implementation
    const decodedString = atob(base64String);
    let expectedDecodedBytes = new Uint8Array(decodedString.length);

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

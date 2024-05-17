import { Bytes } from 'o1js';
import { base64Decode, base64Encode } from './base64';
import { calculateB64DecodedBytesLength, generateRandomString } from './utils';

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
    for (let i = 0; i < 1000; i++) {
      const input = generateRandomString(100, 'base64');
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
      'Please provide Base64-encoded bytes containing only alphanumeric characters and +/=';
    expect(() => testBase64Decode(input)).toThrowError(errorMessage);
  });
});

describe('Base64 Encode Tests', () => {
  function testBase64Encode(input: string) {
    const inputBytes = Bytes.fromString(input);

    // Base64 Encode the input bytes
    const encodedBytes = base64Encode(inputBytes);

    // Calculate the expected encoded bytes using JS implementation
    const expectedEncodedBytes = Bytes.from(Buffer.from(btoa(input)));

    // Assert that the decoded bytes match the expected decoded bytes
    expect(encodedBytes).toEqual(expectedEncodedBytes);
  }

  it('should Base64 encode an input', () => {
    const input =
      'ef140c0eea15554e26d16d164554ab55731e1922004ac9ee70af5d26cadcfaf5';
    testBase64Encode(input);
  });

  it('should Base64 encode different inputs (1000 iterations)', () => {
    for (let i = 0; i < 1000; i++) {
      const input = generateRandomString(100, 'base64');
      testBase64Encode(input);
    }
  });
});

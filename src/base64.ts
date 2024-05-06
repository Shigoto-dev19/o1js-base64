import { Field, Bool, Bytes, assert } from 'o1js';

export { base64Decode };

function base64Decode(inputBytes: Bytes, byteLength: number) {
  const encodedB64Bytes = inputBytes.toFields();

  const charLength = encodedB64Bytes.length;
  assert(
    charLength % 4 === 0,
    'Input base64 byte length should be a multiple of 4!'
  );

  let decodedB64Bytes: Field[] = [];

  let bitsIn: Bool[][][] = Array.from({ length: charLength / 4 }, () => []);
  let bitsOut: Bool[][][] = Array.from({ length: charLength / 4 }, () =>
    Array.from({ length: 4 }, () => [])
  );

  let idx = 0;
  for (let i = 0; i < charLength; i += 4) {
    for (let j = 0; j < 4; j++) {
      const translated = base64Lookup(encodedB64Bytes[i + j]);
      bitsIn[i / 4][j] = translated.toBits(6);
    }

    // Convert from four 6-bit words to three 8-bit words, unpacking the base64 encoding
    bitsOut[i / 4][0] = [
      bitsIn[i / 4][1][4],
      bitsIn[i / 4][1][5],
      ...bitsIn[i / 4][0],
    ];

    for (let j = 0; j < 4; j++) {
      bitsOut[i / 4][1][j] = bitsIn[i / 4][2][j + 2];
      bitsOut[i / 4][1][j + 4] = bitsIn[i / 4][1][j];
    }

    bitsOut[i / 4][2] = [
      ...bitsIn[i / 4][3],
      bitsIn[i / 4][2][0],
      bitsIn[i / 4][2][1],
    ];

    for (let j = 0; j < 3; j++) {
      if (idx + j < byteLength) {
        decodedB64Bytes[idx + j] = Field.fromBits(bitsOut[i / 4][j]);
      }
    }
    idx += 3;
  }

  return decodedB64Bytes;
}

// Adapted from the algorithm described in: http://0x80.pl/notesen/2016-01-17-sse-base64-decoding.html#vector-lookup-base
function base64Lookup(input: Field): Field {
  // A variable to check if the input consists solely of valid base64 characters
  let isValidBase64Chars = Field(0);

  // ['A', 'Z']
  let le_Z = input.lessThan(Field(91 + 1));
  let ge_A = input.greaterThan(Field(65 - 1));
  let range_AZ = le_Z.and(ge_A);
  let sum_AZ = range_AZ.toField().mul(input.sub(65));
  isValidBase64Chars = isValidBase64Chars.add(range_AZ.toField());

  // ['a', 'z']
  let le_z = input.lessThan(Field(122 + 1));
  let ge_a = input.greaterThan(Field(97 - 1));
  let range_az = le_z.and(ge_a);
  let sum_az = range_az.toField().mul(input.sub(71)).add(sum_AZ);
  isValidBase64Chars = isValidBase64Chars.add(range_az.toField());

  // ['0', '9']
  let le_9 = input.lessThan(Field(57 + 1));
  let ge_0 = input.greaterThan(Field(48 - 1));
  let range_09 = le_9.and(ge_0);
  let sum_09 = range_09.toField().mul(input.add(4)).add(sum_az);
  isValidBase64Chars = isValidBase64Chars.add(range_09.toField());

  // '+'
  let equal_plus = input.equals(43);
  let sum_plus = equal_plus.toField().mul(input.add(19)).add(sum_09);
  isValidBase64Chars = isValidBase64Chars.add(equal_plus.toField());

  // '/'
  let equal_slash = input.equals(47);
  let sum_slash = equal_slash.toField().mul(input.add(16)).add(sum_plus);
  isValidBase64Chars = isValidBase64Chars.add(equal_slash.toField());

  // '='
  let equal_eqsign = input.equals(61);
  isValidBase64Chars = isValidBase64Chars.add(equal_eqsign.toField());

  // Validate if input contains only valid base64 characters
  isValidBase64Chars.assertEquals(
    1,
    'Please provide base64-encoded bytes containing only alphanumeric characters and +/='
  );

  return sum_slash;
}
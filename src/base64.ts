//TODO Check that input length is multiple of 4
//TODO Add a generic way to calculate byte length
//TODO Make generic given ByteLength
//TODO Add README 
//TODO Fix Notations

import { Field, Bool, Provable } from 'o1js';

export { base64Decode };

function base64Decode(input: Field[]) {
  const byteLength = 32;
  const charLength = input.length;
  // const byteLength = 4 * ((byteLength + 2) / 3); // 4 chars encode 3 bytes
  let out: Field[] = [];

  let bitsIn: Bool[][][] = Array.from({ length: charLength / 4 }, () => []);
  let bitsOut: Bool[][][] = Array.from({ length: charLength / 4 }, () =>
    Array.from({ length: 4 }, () => [])
  );

  let idx = 0;
  for (let i = 0; i < charLength; i += 4) {
    for (let j = 0; j < 4; j++) {
      const translated = base64Lookup(input[i + j]);
      bitsIn[i / 4][j] = translated.toBits(6);
    }

    // Do the re-packing from four 6-bit words to three 8-bit words.
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
        out[idx + j] = Field.fromBits(bitsOut[i / 4][j]);
      }
    }
    idx += 3;
  }

  return out;
}

function base64Lookup(input: Field): Field {
  // Any check
  let oddRangeCheck = Field(0);

  // ['A', 'Z']
  let le_Z = input.lessThan(Field(91 + 1));
  let ge_A = input.greaterThan(Field(65 - 1));

  let range_AZ = le_Z.and(ge_A);
  let sum_AZ = Provable.if(range_AZ, input.sub(65), Field(0));
  oddRangeCheck = oddRangeCheck.add(range_AZ.toField());

  // ['a', 'z']
  let le_z = input.lessThan(Field(122 + 1));
  let ge_a = input.greaterThan(Field(97 - 1));

  let range_az = le_z.and(ge_a);
  let sum_az = Provable.if(range_az, input.sub(71), Field(0));
  sum_az = sum_az.add(sum_AZ);

  oddRangeCheck = oddRangeCheck.add(range_az.toField());

  // ['0', '9']
  let le_9 = input.lessThan(Field(57 + 1));
  let ge_0 = input.greaterThan(Field(48 - 1));

  let range_09 = le_9.and(ge_0);
  let sum_09 = Provable.if(range_09, input.add(4), Field(0));
  sum_09 = sum_09.add(sum_az);
  oddRangeCheck = oddRangeCheck.add(range_09.toField());

  // '+'
  let equal_plus = input.equals(43);
  let sum_plus = Provable.if(equal_plus, input.add(19), Field(0));
  sum_plus = sum_plus.add(sum_09);
  oddRangeCheck = oddRangeCheck.add(equal_plus.toField());

  // '/'
  let equal_slash = input.equals(47);
  let sum_slash = Provable.if(equal_slash, input.add(16), Field(0));
  sum_slash = sum_slash.add(sum_plus);
  oddRangeCheck = oddRangeCheck.add(equal_slash.toField());

  // '='
  let equal_eqsign = input.equals(61);
  oddRangeCheck = oddRangeCheck.add(equal_eqsign.toField());

  oddRangeCheck.assertEquals(1, 'Something with lookup went wrong!');

  return sum_slash;
}

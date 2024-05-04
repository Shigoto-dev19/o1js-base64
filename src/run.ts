import { ZkProgram, Bytes, Provable } from 'o1js';
import { base64Decode } from './base64.js';

class Bytes44 extends Bytes(44) {}
class Bytes32 extends Bytes(32) {}

let base64DecodeZkProgram = ZkProgram({
  name: 'base64-decode',
  publicOutput: Bytes32.provable,
  methods: {
    decodeB64: {
      privateInputs: [Bytes44.provable],

      async method(base64Bytes: Bytes44) {
        const fields = base64Decode(base64Bytes.toFields());
        return Bytes32.provable.fromFields(fields);
      },
    },
  },
});

let { decodeB64 } = await base64DecodeZkProgram.analyzeMethods();

console.log(decodeB64.summary());

console.time('compile');
await base64DecodeZkProgram.compile();
console.timeEnd('compile');

console.time('prove');
const encodedB64 = Bytes44.fromString(
  '7xQMDuoVVU4m0W0WRVSrVXMeGSIASsnucK9dJsrc+vU='
);
let proof = await base64DecodeZkProgram.decodeB64(encodedB64);
console.timeEnd('prove');

console.time('verify');
await base64DecodeZkProgram.verify(proof);
console.timeEnd('verify');

const decodedString = atob('7xQMDuoVVU4m0W0WRVSrVXMeGSIASsnucK9dJsrc+vU=');
const uint8Array = new Uint8Array(decodedString.length);

for (let i = 0; i < decodedString.length; i++) {
  uint8Array[i] = decodedString.charCodeAt(i);
}

Provable.log('Proof bytes: ', proof.publicOutput.toFields());
console.log('JS decoded bytes: ', uint8Array);

/* 
{
  'Total rows': 8081,
  Generic: 1921,
  EndoMulScalar: 88,
  RangeCheck0: 2112,
  RangeCheck1: 1056,
  Zero: 1848,
  ForeignFieldAdd: 1056
}
*/

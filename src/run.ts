import { ZkProgram, Bytes } from 'o1js';
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
        const decodedBytes = base64Decode(base64Bytes, Bytes32.size);
        return Bytes32.from(decodedBytes);
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

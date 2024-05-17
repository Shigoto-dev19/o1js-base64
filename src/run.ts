import { ZkProgram, Bytes } from 'o1js';
import { base64Decode, base64Encode } from './base64.js';

class Bytes44 extends Bytes(44) {}
class Bytes32 extends Bytes(32) {}

// ------------------- decode -------------------

const base64DecodeZkProgram = ZkProgram({
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

const { decodeB64 } = await base64DecodeZkProgram.analyzeMethods();

console.log('base64Decode(Bytes44): ', decodeB64.summary());

console.time('compile');
await base64DecodeZkProgram.compile();
console.timeEnd('compile');

console.time('prove');
const encodedB64 = Bytes44.fromString(
  '7xQMDuoVVU4m0W0WRVSrVXMeGSIASsnucK9dJsrc+vU='
);
const proofD64 = await base64DecodeZkProgram.decodeB64(encodedB64);
console.timeEnd('prove');

console.time('verify');
await base64DecodeZkProgram.verify(proofD64);
console.timeEnd('verify');

// ------------------- encode -------------------

const base64EncodeZkProgram = ZkProgram({
  name: 'base64-encode',
  publicOutput: Bytes44.provable,
  methods: {
    encodeB64: {
      privateInputs: [Bytes32.provable],

      async method(base64Bytes: Bytes32) {
        const decodedBytes = base64Encode(base64Bytes);
        return Bytes44.from(decodedBytes);
      },
    },
  },
});

const { encodeB64 } = await base64EncodeZkProgram.analyzeMethods();

console.log('\nbase64Encode(Bytes32): ', encodeB64.summary());

console.time('compile');
await base64EncodeZkProgram.compile();
console.timeEnd('compile');

console.time('prove');
const input = Bytes32.fromHex(
  'ef140c0eea15554e26d16d164554ab55731e1922004ac9ee70af5d26cadcfaf5'
);
const proofE64 = await base64EncodeZkProgram.encodeB64(input);
console.timeEnd('prove');

console.time('verify');
await base64EncodeZkProgram.verify(proofE64);
console.timeEnd('verify');

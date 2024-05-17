# O1JS Base64 Encode/Decode

This repository offers a straightforward API to encode & decode base64-encoded input bytes. It's designed to be an easy-to-use and reliable tool for encoding & decoding base64 data in various projects using [o1js](https://docs.minaprotocol.com/zkapps/o1js/).

## How to use the package

Install the package

```sh
npm install o1js-base64
```

Import the provable type `Bytes` from `o1js`

```typescript
import { Bytes } from 'o1js';
```

### Base64 Decode

1. Import the `base64Decode` function

```typescript
import { base64Decode } from 'o1js-base64';
```

2. For the example of a **string** input:

```typescript
const encodedB64 = Bytes.fromString('7xQM+vU=');
const decodedB64 = base64Decode(encodedB64, 5);
```

### Base64 Encode

1. Import the `base64Encode` function

```typescript
import { base64Encode } from 'o1js-base64';
```

2. For the example of a **string** input:

```typescript
const inputBytes = Bytes.fromString('Childish Monderino');
const encodedB64 = base64Encode(inputBytes);
```

### Notes

- The `base64Encode` and `base64Decode` functions are interchangeable, but `base64Encode` is slightly more efficient.

- The `base64Decode` function will throw an error if the `encodedB64` length is not a multiple of 4 or contains **non-base64** characters.

- Ensure to provide the accurate **decoded byte length** parameter when invoking the `base64Decode` function.

- Utilize the `calculateB64DecodedBytesLength` function available within the package.

  - You can find an example of its usage in this [code snippet](https://github.com/Shigoto-dev19/o1js-base64/blob/main/src/base64.test.ts#L10-L17).

  - If needed, you can refer to this [gist](https://gist.github.com/carlos-jenkins/3d28f9b05b5ae679ae5efe13d9cff9e8) for manual calculation guidance.

- When employing the `base64Decode` function within a **zkProgram** or **zkApp**, it's crucial to use the appropriate `provable Byte` types for both input and output.

  - For reference, consider this [snippet](https://github.com/Shigoto-dev19/o1js-base64/blob/main/src/run.ts#L7-L20), which demonstrates a zkProgram designed to decode a base64-encoded SHA256 digest.
  - The encoded input has a length of 44, while the expected decoded output is 32 bytes long.
  - Hence, it's crucial to accurately and deterministically assign provable Byte types to match the input and output lengths.
  - Similarly, for base64 Encode, ensure the same careful consideration of Byte types.

## How to build

```sh
npm run build
```

## How to run tests

```sh
npm run test
npm run testw # watch mode
```

## How to run coverage

```sh
npm run coverage
```

## How to benchmark

```sh
npm run benchmark
```

### Preview

### Base64 Decode zkProgram

| Summary       |      |
| ------------- | ---- |
| Total rows    | 2138 |
| Generic       | 1522 |
| EndoMulScalar | 616  |

---

| Action  | Time (s) |
| ------- | -------- |
| Compile | 1.104    |
| Prove   | 11.219   |
| Verify  | 0.844    |

### Base64 Encode zkProgram

| Summary       |      |
| ------------- | ---- |
| Total rows    | 1697 |
| Generic       | 1203 |
| EndoMulScalar | 494  |

---

| Action  | Time (s) |
| ------- | -------- |
| Compile | 0.667    |
| Prove   | 9.383    |
| Verify  | 1.047    |

## Acknowledgement

- This repo is inspired by the [circom base64](https://github.com/zkemail/zk-email-verify/blob/main/packages/circuits/lib/base64.circom)
  implementation.

- Big thanks to [Gregor Mitscha-Baude](https://twitter.com/mitschabaude) for highlighting the inefficiency in processing full field elements.
  - By operating on `UInt8` instead of full field elements, the `base64Decode` circuit rows were reduced by around **75%** from **8081** to **2138**.

## License

[Apache-2.0](LICENSE)

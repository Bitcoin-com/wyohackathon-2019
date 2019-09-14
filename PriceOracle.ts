import { ECPair, Script } from "bitbox-sdk"

export class PriceOracle {
  constructor(public keypair: ECPair) {}

  // Encode a blockHeight and bchUsdPrice into a byte sequence of 8 bytes (4 bytes per value)
  createMessage(bchUsdPrice: number, blockHeight: number): Buffer {
    const lhs: Buffer = Buffer.alloc(4, 0)
    const rhs: Buffer = Buffer.alloc(4, 0)
    new Script().encodeNumber(bchUsdPrice).copy(lhs)
    new Script().encodeNumber(blockHeight).copy(rhs)
    return Buffer.concat([lhs, rhs])
  }

  signMessage(message: Buffer): Buffer {
    return this.keypair.sign(new Crypto().sha256(message)).toDER()
  }
}

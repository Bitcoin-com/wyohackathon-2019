// Usage
// > ./node_modules/.bin/ts-node fund.ts
// prompt: contract:  ppn2nh44nkuazpweh2fz7pdhw5xrh0wk0st2g245gz
// prompt: amount:  3000
// success: https://explorer.bitcoin.com/tbch/tx/3cc6dd2dda36588904ff9bb689c6b9c02dfa07395971a32b79dcb3f8eeeb7607#o=1

// MIT License https://en.wikipedia.org/wiki/MIT_License

// imports
import { BITBOX } from "bitbox-sdk"
import { AddressUtxoResult } from "bitcoin-com-rest"
import { ECPair, HDNode } from "bitcoincashjs-lib"

// consts
const prompt: any = require("prompt")

// Interfaces
interface Fund {
  contract: string
  amount: number
}

run()
export async function run(): Promise<void> {
  try {
    // BITBOX Instance
    const bitbox: BITBOX = new BITBOX({
      restURL: "https://trest.bitcoin.com/v2/"
    })

    // start the prompt to get user input
    prompt.start()

    // ask for contract and amount
    prompt.get(
      ["contract", "amount"],
      async (err: any, result: Fund): Promise<any> => {
        // contract
        const contract: string = result.contract

        // amount
        const amount: number = +result.amount

        // root seed buffer from mnemonic
        const rootSeed: Buffer = bitbox.Mnemonic.toSeed(
          "warfare economy chest million farm liar alone face media riot envelope movie attack corn piece enter outside frown ivory dutch garlic flip omit jewel"
        )

        // master HDNode
        let masterHDNode: HDNode = bitbox.HDNode.fromSeed(rootSeed, "testnet")

        // HDNode of BIP44 account
        let account: HDNode = bitbox.HDNode.derivePath(
          masterHDNode,
          "m/44'/145'/0'"
        )

        // derive the first external change address HDNode which is going to spend utxo
        let change: HDNode = bitbox.HDNode.derivePath(account, "0/0")

        // get the cash address
        let cashAddress: string = bitbox.HDNode.toCashAddress(change)

        // fetch utxo for cash addr
        let utxos = (await bitbox.Address.utxo(
          cashAddress
        )) as AddressUtxoResult

        // BITBOX Transaction Builder
        let transactionBuilder: any = new bitbox.TransactionBuilder("testnet")

        // original amount of satoshis in vin
        let originalAmount: number = utxos.utxos[0].satoshis

        // index of vout
        let vout: number = utxos.utxos[0].vout

        // txid of vout
        let txid: string = utxos.utxos[0].txid

        // add input with txid and index of vout
        transactionBuilder.addInput(txid, vout)

        // get byte count to calculate fee. paying 1 sat/byte
        let byteCount: number = bitbox.BitcoinCash.getByteCount(
          { P2PKH: 1 },
          { P2PKH: 2 }
        )

        // amount to send to receiver. It's the original amount - 1 sat/byte for tx size
        let sendAmount: number = originalAmount - byteCount

        // Send most of the tBCH back to self
        transactionBuilder.addOutput(cashAddress, sendAmount - amount)

        // send top off amount
        transactionBuilder.addOutput(contract, amount)

        // keypair
        let keyPair: ECPair = bitbox.HDNode.toKeyPair(change)

        // sign w/ HDNode
        let redeemScript: undefined
        transactionBuilder.sign(
          0,
          keyPair,
          redeemScript,
          transactionBuilder.hashTypes.SIGHASH_ALL,
          originalAmount
        )

        // build tx
        let tx: any = transactionBuilder.build()

        // output rawhex
        let hex: string = tx.toHex()
        console.log(hex)

        // sendRawTransaction to running BCH node
        // let success: string = await bitbox.RawTransactions.sendRawTransaction(
        //   hex
        // )

        // // success!
        // console.log(
        //   `success: https://explorer.bitcoin.com/tbch/tx/${success}#o=1`
        // )
      }
    )
  } catch (error) {
    console.log(error)
  }
}

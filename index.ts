import { BITBOX } from "bitbox-sdk"
import { AddressUtxoResult } from "bitcoin-com-rest"
import * as bcl from "bitcoincashjs-lib"

let foobar: Function = async () => {
  let bitbox = new BITBOX({
    restURL: "https://trest.bitcoin.com/v2/"
  })

  // for (let i: number = 0; i <= 1000; i++) {
  //   console.log("*******************************")
  // }
  let langs: string[] = [
    "english",
    "chinese_simplified",
    "chinese_traditional",
    "korean",
    "japanese",
    "french",
    "italian",
    "spanish"
  ]

  let lang: string = langs[Math.floor(Math.random() * langs.length)]
  // create 256 bit BIP39 mnemonic
  //   let mnemonic: string = bitbox.Mnemonic.generate(
  //     256,
  //     bitbox.Mnemonic.wordLists()[lang]
  //   )

  let mnemonic: string =
    "warfare economy chest million farm liar alone face media riot envelope movie attack corn piece enter outside frown ivory dutch garlic flip omit jewel"
  console.log(mnemonic)

  // root seed buffer
  let rootSeed: Buffer = bitbox.Mnemonic.toSeed(mnemonic)

  // master HDNode
  let masterHDNode: bcl.HDNode = bitbox.HDNode.fromSeed(rootSeed, "testnet")

  // HDNode of BIP44 account
  // BIP44 https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki
  // Registerd coin types. BCH is 145. SLP is 245
  // https://github.com/satoshilabs/slips/blob/master/slip-0044.md
  let account: bcl.HDNode = bitbox.HDNode.derivePath(
    masterHDNode,
    "m/44'/145'/0'"
  )

  // derive the first external change address HDNode which is going to spend utxo
  let change: bcl.HDNode = bitbox.HDNode.derivePath(account, "0/0")

  // get the cash address
  let cashAddress: string = bitbox.HDNode.toCashAddress(change)
  console.log(cashAddress)
  // bchtest:qp374ny8hjkwede9msydwxtux2lhj3fesy8zrh98m4
  // https://explorer.bitcoin.com/tbch/address/bchtest:qp374ny8hjkwede9msydwxtux2lhj3fesy8zrh98m4
  // https://explorer.bitcoin.com/tbch/tx/25b402c20fcf345110aa6b64108f2d707382bc85af47c879b31ee4e2d12580ef#o=1

  let result = (await bitbox.Address.utxo(cashAddress)) as AddressUtxoResult
  console.log(result)
  //{ utxos:
  //  [ { txid:
  //     '25b402c20fcf345110aa6b64108f2d707382bc85af47c879b31ee4e2d12580ef',
  //      vout: 1,
  //      amount: 0.1,
  //      satoshis: 10000000,
  //      height: 1327897,
  //      confirmations: 1 } ],
  // legacyAddress: 'mpdGUAMHWjtuFghMJeDuhawYmVrYERwVqP',
  // cashAddress: 'bchtest:qp374ny8hjkwede9msydwxtux2lhj3fesy8zrh98m4',
  // slpAddress: 'slptest:qp374ny8hjkwede9msydwxtux2lhj3fesyukyvlsfg',
  // scriptPubKey: '76a91463eacc87bcacecb725dc08d7197c32bf7945398188ac' }
  if (!result.utxos[0]) {
    return
  }

  return

  // instance of transaction builder
  let transactionBuilder = new bitbox.TransactionBuilder("mainnet")
  // original amount of satoshis in vin
  let originalAmount = result.utxos[0].satoshis

  // index of vout
  let vout = result.utxos[0].vout

  // txid of vout
  let txid = result.utxos[0].txid

  // add input with txid and index of vout
  transactionBuilder.addInput(txid, vout)

  // get byte count to calculate fee. paying 1 sat/byte
  let byteCount = bitbox.BitcoinCash.getByteCount({ P2PKH: 1 }, { P2PKH: 1 })
  // 192
  // amount to send to receiver. It's the original amount - 1 sat/byte for tx size
  let sendAmount = originalAmount - byteCount

  // add output w/ address and amount to send
  transactionBuilder.addOutput(cashAddress, sendAmount)

  // keypair
  let keyPair = bitbox.HDNode.toKeyPair(change)

  // sign w/ HDNode
  let redeemScript
  transactionBuilder.sign(
    0,
    keyPair,
    redeemScript,
    transactionBuilder.hashTypes.SIGHASH_ALL,
    originalAmount
  )

  // build tx
  let tx = transactionBuilder.build()
  // output rawhex
  let hex = tx.toHex()
  console.log(hex)

  // sendRawTransaction to running BCH node
  //   let rsp = await bitbox.RawTransactions.sendRawTransaction(hex)
  //   console.log(rsp)

  // class App extends Component {

  //   componentDidMount() {
  //     bitbox.Address.utxo(cashAddress).then(
  //       result => {
  //           result => {
  //             this.setState({
  //               txid: result
  //             })
  //           },
  //           err => {
  //             console.log(err)
  //           }
  //         )
  //       },
  //       err => {
  //         console.log(err)
  //       }
  //     )
  //   }

  //   render() {
  //     let addresses = []
  //     for (let i = 0; i < 10; i++) {
  //       let account = masterHDNode.derivePath(`m/44'/145'/0'/0/${i}`)
  //       addresses.push(
  //         <li key={i}>
  //           m/44&rsquo;/145&rsquo;/0&rsquo;/0/
  //           {i}: {bitbox.HDNode.toCashAddress(account)}
  //         </li>
  //       )
  //     }
  //     return (
  //       <div className="App">
  //         <header className="App-header">
  //           <img src={logo} className="App-logo" alt="logo" />
  //           <h1 className="App-title">Hello BITBOX</h1>
  //         </header>
  //         <div className="App-content">
  //           <h2>BIP44 $BCH Wallet</h2>
  //           <h3>256 bit {lang} BIP39 Mnemonic:</h3> <p>{this.state.mnemonic}</p>
  //           <h3>BIP44 Account</h3>
  //           <p>
  //             <code>"m/44'/145'/0'"</code>
  //           </p>
  //           <h3>BIP44 external change addresses</h3>
  //           <ul>{addresses}</ul>
  //           <h3>Transaction raw hex</h3>
  //           <p>{this.state.hex}</p>
  //           <h3>Transaction ID</h3>
  //           <p>{this.state.txid}</p>
  //         </div>
  //       </div>
  //     )
  //   }
  // }

  // export default App
}

foobar()

let SLPSDK: any = require("slp-sdk")

let main: Function = async (): Promise<void> => {
  let SLP: any = new SLPSDK({
    restURL: "https://trest.bitcoin.com/v2/"
  })

  try {
    let token = await SLP.TokenType1.create({
      fundingAddress: "slptest:qp374ny8hjkwede9msydwxtux2lhj3fesyukyvlsfg",
      fundingWif: "cPXh1nTCfCaP31GdGArpJa3uNwEDG9i7Jwb2hSzehUczJcWfieJP",
      tokenReceiverAddress:
        "slptest:qp374ny8hjkwede9msydwxtux2lhj3fesyukyvlsfg",
      bchChangeReceiverAddress:
        "bchtest:qp374ny8hjkwede9msydwxtux2lhj3fesy8zrh98m4",
      batonReceiverAddress:
        "slptest:qp374ny8hjkwede9msydwxtux2lhj3fesyukyvlsfg",
      decimals: 0,
      name: "Prize token",
      symbol: "PRIZE",
      documentUri: "gabriel@bitcoin.com",
      documentHash: null,
      initialTokenQty: 100
    })
    console.log(token)
  } catch (err) {
    console.log("ERROR: ", err)
  }
}

main()

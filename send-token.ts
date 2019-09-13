let SLPSDK: any = require("slp-sdk")

let main: Function = async (): Promise<void> => {
  let SLP: any = new SLPSDK({
    restURL: "https://trest.bitcoin.com/v2/"
  })

  try {
    let send = await SLP.TokenType1.send({
      fundingAddress: "slptest:qp374ny8hjkwede9msydwxtux2lhj3fesyukyvlsfg",
      fundingWif: "cPXh1nTCfCaP31GdGArpJa3uNwEDG9i7Jwb2hSzehUczJcWfieJP",
      tokenReceiverAddress:
        "slptest:qzj673u4kh0zxcyc4s3mu0rgdactlfsfxy7sjg4j8f",
      bchChangeReceiverAddress:
        "bchtest:qp374ny8hjkwede9msydwxtux2lhj3fesy8zrh98m4",
      tokenId:
        "eb08f3ceb2936285e438e712a17cd0a1dcf5bf818eeeb563f4b3360e5d201e7e",
      amount: 1
    })
    console.log(send)
  } catch (err) {
    console.log("ERROR: ", err)
  }
}

main()

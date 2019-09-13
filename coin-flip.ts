let SLPSDK: any = require("slp-sdk")

let main: Function = async (): Promise<void> => {
  const prompt: any = require("prompt")
  let SLP: any = new SLPSDK({
    restURL: "https://trest.bitcoin.com/v2/"
  })
  let outcomes: string[] = ["heads", "tails"]

  let outcome: string = outcomes[Math.floor(Math.random() * outcomes.length)]

  // start the prompt to get user input
  prompt.start()

  try {
    prompt.get(
      ["first", "second"],
      async (err: any, result: any): Promise<any> => {
        const first: string = result.first
        const second: string = result.second

        // verify user input
        if (!first) {
          throw "Must provide first address"
        }

        if (!second) {
          throw "Must provide second address"
        }

        // validate user input
        if (!SLP.Address.isSLPAddress(first)) {
          throw "First address isn't SLP format"
        }
        if (!SLP.Address.isSLPAddress(second)) {
          throw "Second address isn't SLP format"
        }
        let winner: string = first
        let addy: string = first
        if (outcome === "heads") {
          addy = first
          winner = first
        } else {
          addy = second
          winner = second
        }
        let txid: string = await SLP.TokenType1.send({
          fundingAddress: "slptest:qp374ny8hjkwede9msydwxtux2lhj3fesyukyvlsfg",
          fundingWif: "cPXh1nTCfCaP31GdGArpJa3uNwEDG9i7Jwb2hSzehUczJcWfieJP",
          tokenReceiverAddress: addy,
          bchChangeReceiverAddress:
            "bchtest:qp374ny8hjkwede9msydwxtux2lhj3fesy8zrh98m4",
          tokenId:
            "eb08f3ceb2936285e438e712a17cd0a1dcf5bf818eeeb563f4b3360e5d201e7e",
          amount: 1
        })

        // log outcome and winner
        console.log(`The outcome is: ${outcome}!`)
        console.log(
          `The winner is: https://explorer.bitcoin.com/tbch/address/${SLP.Address.toSLPAddress(
            winner
          )}!`
        )
        console.log(`Txid: https://explorer.bitcoin.com/tbch/tx/${txid}#o=1`)
      }
    )
  } catch (err) {
    console.log("ERROR: ", err)
  }
}

main()

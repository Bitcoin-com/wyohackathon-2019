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
        let addy: string = first
        if (outcome === "heads") {
          addy = first
        } else {
          addy = second
        }
        let send = await SLP.TokenType1.send({
          fundingAddress: "slptest:qp374ny8hjkwede9msydwxtux2lhj3fesyukyvlsfg",
          fundingWif: "cPXh1nTCfCaP31GdGArpJa3uNwEDG9i7Jwb2hSzehUczJcWfieJP",
          tokenReceiverAddress: addy,
          bchChangeReceiverAddress:
            "bchtest:qp374ny8hjkwede9msydwxtux2lhj3fesy8zrh98m4",
          tokenId:
            "eb08f3ceb2936285e438e712a17cd0a1dcf5bf818eeeb563f4b3360e5d201e7e",
          amount: 1
        })
        console.log(outcome)
        console.log(send)
      }
    )
  } catch (err) {
    console.log("ERROR: ", err)
  }
}

main()

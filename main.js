const axios = require("axios");
const fs = require("fs");
async function fetch(first, skip) {
  const data = await axios.post("https://hub.snapshot.org/graphql?", {
    query: `query Votes {\n  votes (\n    first: ${first}\n    skip: ${skip}\n    where: {\n      proposal: "0x44aba87414d2d7ce88218b676d9938338d7866a245f48a7829e805a99bcda6a2",\n    \t\n    }\n    orderBy: "created",\n    orderDirection: desc\n  ) {\n    id\n    voter\n    created\n    proposal {\n      id\n    }\n    choice\n    space {\n      id\n    }\n  }\n}\n`,
    variables: null,
    operationName: "Votes",
  });

  console.log(data.data.data.votes);
  return data.data.data.votes;
}
async function fetchAll() {
  let allVotes = [];

  for (var i = 0; i < 40; i++) {
    console.log("Gethering results for ", i * 2000);
    const results = await fetch(2000, i * 2000);
    if (results.length > 0) {
      allVotes = [...allVotes, ...results];
    } else {
      console.log("Reached limit, skipping ", i);
    }
  }
  const votedForCastleDao = allVotes.filter((i) => i.choice === 2);
  const addresses = votedForCastleDao.map((i) => i.voter);
  fs.writeFileSync("./voters.json", JSON.stringify(addresses, null, 2));
  console.log("Finished");
}

fetchAll();

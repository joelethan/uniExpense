const assert = require("assert");
const ganache = require("ganache-cli");
const { beforeEach } = require("mocha");
const Web3 = require("web3");

const web3 = new Web3(ganache.provider());

const compiledCampaign = require("../ethereum/build/Campaign.json");
const compiledFactory = require("../ethereum/build/CampaignFactory.json");

let accounts;
let campaignAddress;
let campaign;
let factory;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.instance))
    .deploy({ data: compiledFactory.bytecode })
    .send({ from: accounts[0], gas: "1000000" });

  await factory.methods
    .createCampaign()
    .send({ from: accounts[0], gas: "1000000" });
  [campaignAddress] = await factory.methods.getDeployedCampaigns().call();

  campaign = await new web3.eth.Contract(
    compiledCampaign.interface,
    campaignAddress
  );
});

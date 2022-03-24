const assert = require("assert");
const ganache = require("ganache-cli");
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
  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode })
    .send({ from: accounts[0], gas: "1000000" });

  await factory.methods
    .createCampaign()
    .send({ from: accounts[0], gas: "1000000" });
  [campaignAddress] = await factory.methods.getDeployedCampaigns().call();

  campaign = await new web3.eth.Contract(
    JSON.parse(compiledCampaign.interface),
    campaignAddress
  );
});

describe("Campaigns", () => {
  it("deploys a factory and a campaign", () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it("marks caller is the campaign manager", async () => {
    const manager = await campaign.methods.manager().call();
    assert.equal(manager, accounts[0]);
  });

  it("allows adding a board member", async () => {
    await campaign.methods
      .addMember(accounts[1])
      .send({ from: accounts[0], gas: "1000000" });
    const count = await campaign.methods.BOGcount().call();
    assert.equal(count, 1);
  });

  it("allows a board member to contribute funds", async () => {
    await campaign.methods
      .addMember(accounts[1])
      .send({ from: accounts[0], gas: "1000000" });
    await campaign.methods.fundContract().send({
      from: accounts[1],
      value: web3.utils.toWei("10", "ether"),
      gas: "1000000",
    });
    const balance = await campaign.methods.contractBalance().call();
    assert.equal(balance, web3.utils.toWei("10", "ether"));
  });
});

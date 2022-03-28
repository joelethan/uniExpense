const CampaignFactory = artifacts.require("CampaignFactory");
const Campaign = artifacts.require("Campaign");

let campaignAddress;
let campaign;
let factory;

contract("CampaignFactory", (accounts) => {
  before(async () => {
    await CampaignFactory.defaults({
      from: accounts[2],
      gas: 4612388,
    });
    factory = await CampaignFactory.new();
    await factory.createCampaign();
    [campaignAddress] = await factory.getDeployedCampaigns();
    campaign = await Campaign.at(campaignAddress);
  });

  describe("Campaign Deployment", () => {
    it("contracts have been deployed", async () => {
      assert.ok(factory.address);
      assert.ok(campaign.address);
    });

    it("allows adding a Board Member", async () => {
      await campaign.addMember(accounts[1], { from: accounts[2] });
      const member = await campaign.boardOfGov(accounts[1]);
      const count = await campaign.BOGcount();
      assert.ok(member);
      assert.equal(count.toNumber(), 1);
    });

    it("allows members to fund contract", async () => {
      await campaign.fundContract({ from: accounts[1], value: 1000 });
      const bal = await campaign.contractBalance();
      assert.equal(bal.toNumber(), 1000);
    });

    it("allows manager to check a member's contribution", async () => {
      const contribution = await campaign.getMemberContribution(accounts[1], {
        from: accounts[2],
      });
      assert.equal(contribution.toNumber(), 1000);
    });
  });
});

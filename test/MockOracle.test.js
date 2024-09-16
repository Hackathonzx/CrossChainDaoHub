const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MockOracle Contract", function () {
  let mockOracle;
  let linkToken;
  let owner;

  beforeEach(async function () {
    [owner] = await ethers.getSigners();

    const LinkToken = await ethers.getContractFactory("LinkToken");
    linkToken = await LinkToken.deploy();

    const MockOracle = await ethers.getContractFactory("MockOracle");
    mockOracle = await MockOracle.deploy(linkToken.address);
  });

  it("Should set the correct LINK token address", async function () {
    expect(await mockOracle.LINK()).to.equal(linkToken.address);
  });

  it("Should return correct project details", async function () {
    const project = await mockOracle.getProjectDetails(1);
    expect(project[0]).to.equal("Project A");
    expect(project[1]).to.equal("Description for Project A");
    expect(project[2].toNumber()).to.equal(1000);
    expect(project[3].toNumber()).to.equal(5000);
  });

  it("Should emit OracleRequest event on data request", async function () {
    await expect(mockOracle.requestProjectData(1))
      .to.emit(mockOracle, "OracleRequest");
  });

  it("Should fulfill project data correctly", async function () {
    const tx = await mockOracle.requestProjectData(1);
    const receipt = await tx.wait();
    const requestId = receipt.events[0].args[0]; // Assuming the requestId is the first argument in the emitted event
    await mockOracle.fulfillProjectData(requestId, 1);

    const projectCredits = await mockOracle.getProjectCredits(1);
    expect(projectCredits).to.equal(100);
  });
});
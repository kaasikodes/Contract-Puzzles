const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { assert } = require("chai");

describe("Game5", function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory("Game5");
    const game = await Game.deploy();

    return { game };
  }
  async function getWinnerWallet() {
    const threshold = "0x00FfFFfFFFfFFFFFfFfFfffFFFfffFfFffFfFFFf";
    let winnerAddress;

    while (!winnerAddress) {
      const wallet = ethers.Wallet.createRandom().connect(ethers.provider);
      const address = await wallet.getAddress();

      if (address < threshold) {
        winnerAddress = address;
        // Send Ether to the winner address to cover gas fees
        const [signer] = await ethers.getSigners(0);
        await signer.sendTransaction({
          to: winnerAddress,
          value: ethers.utils.parseEther("1.0"), // Sends exactly 1.0 ether
        });
        return wallet;
      }
    }
  }

  it("should be a winner", async function () {
    const { game } = await loadFixture(deployContractAndSetVariables);

    // good luck
    const signer = await getWinnerWallet();
    console.log(`Winner address found: ${signer.address}`);
    // Winner address found: 0x0052AdA58Fa86475aC670f38Fee165CbA60c78c7 (You can gen signer or something in case)
    await game.connect(signer).win();

    // leave this assertion as-is
    assert(await game.isWon(), "You did not win the game");
  });
});

/* eslint-disable */
const Ballot = artifacts.require('./Ballot.sol');

// The following tests require TronBox >= 2.1.x
// and Tron Quickstart (https://github.com/tronprotocol/docker-tron-quickstart)

contract('Ballot', (accounts) => {
  let ballot;

  async function createTestProposal(name) {
    await ballot.sendProposal(name);
    return (await ballot.proposalCount()) - 1
  }

  before(async () => {
    ballot = await Ballot.deployed();
    if (accounts.length < 3) {
      accounts.push('THaWoebLy1WDbrvZ5bThfiUozUsZiaR3o7')
      // Set your own accounts if you are not using Tron Quickstart

    }
  });

  it('Should verify that the chairPerson is who deployed the contract', async () => {
    const chairPerson = await ballot.chairPerson();
    const hexAddress = tronWeb.address.toHex(accounts[0]);
    assert.equal(chairPerson, hexAddress, 'Incorrect address');
  });

  it('Should create proposal by chairPerson', async () => {
    const proposalName = 'Test 1';
    const proposalIndex = await createTestProposal(proposalName);
    const sentProposal = await ballot.proposals(proposalIndex);
    const hexAddress = tronWeb.address.toHex(accounts[0]);
    assert.equal(sentProposal.name, proposalName, 'Incorrect proposal name');
    assert.equal(sentProposal.owner, hexAddress, 'Incorrect proposal address');
  });

  it('Should give right to vote', async () => {
    await ballot.giveRightToVote(accounts[1])
    const voter = await ballot.voters(accounts[1]);
    assert.equal(voter.weight.toNumber(), 1, 'Incorrect vote weight');
  });

  it('Should create and vote proposal', async () => {
    const proposalIndex = await createTestProposal('Test 2');
    await ballot.vote(proposalIndex);
    const votedProposal = await ballot.proposals(proposalIndex);
    assert.equal(votedProposal.voteCount.toNumber(), 1, 'Incorrect vote count');
  });

});

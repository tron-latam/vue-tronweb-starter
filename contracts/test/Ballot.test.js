/* eslint-disable no-undef */
const Ballot = artifacts.require('./Ballot.sol');

// The following tests require TronBox >= 2.1.x
// and Tron Quickstart (https://github.com/tronprotocol/docker-tron-quickstart)

contract('Ballot', (accounts) => {
  let ballot;
  const [owner, bob, alice, camile, dexter, earl, roger] = accounts;

  async function createTestProposal(name, from) {
    await ballot.sendProposal(name, { from });
    return (await ballot.proposalCount()) - 1;
  }

  function giveVotingRights(to) {
    const promises = [];
    for (let i = 0; i < to.length; i += 1) {
      promises.push(ballot.giveRightToVote(to[i], { from: owner }));
    }
    return Promise.all(promises);
  }

  before(async () => {
    ballot = await Ballot.deployed();
    if (accounts.length < 5) {
      // Set your own accounts if you are not using Tron Quickstart
      // [owner, bob, alice, camile, roger]
    }
    await giveVotingRights([alice, camile, dexter, earl]);
  });

  it('Should verify that the chairPerson is who deployed the contract', async () => {
    const chairPerson = await ballot.chairPerson({ from: owner });
    const hexAddress = tronWeb.address.toHex(owner);
    assert.equal(chairPerson, hexAddress, 'Incorrect address');
  });

  it('Should create proposal by chairPerson', async () => {
    const proposalName = 'Test 1';
    const proposalIndex = await createTestProposal(proposalName, owner);
    const sentProposal = await ballot.proposals(proposalIndex, { from: owner });
    const hexAddress = tronWeb.address.toHex(owner);
    assert.equal(sentProposal.name, proposalName, 'Incorrect proposal name');
    assert.equal(sentProposal.owner, hexAddress, 'Incorrect proposal address');
  });

  it('Should fail to create proposal with no rights', async () => {
    const currentCount = await ballot.proposalCount();
    await createTestProposal('Created by roger', roger);
    const newCount = await ballot.proposalCount();
    assert.equal(currentCount.toNumber(), newCount.toNumber(), 'Proposal count changes');
  });

  it('Should give right to vote', async () => {
    await ballot.giveRightToVote(bob, { from: owner });
    const voter = await ballot.voters(bob, { from: owner });
    assert.equal(voter.weight.toNumber(), 1, 'Incorrect vote weight');
    const proposalIndex = await createTestProposal('Created by bob', bob);
    await ballot.vote(proposalIndex, { from: bob });
    const votedProposal = await ballot.proposals(proposalIndex, { from: bob });
    assert.equal(votedProposal.voteCount.toNumber(), 1, 'Incorrect vote count');
  });

  it('Should fail to vote with no rights', async () => {
    const proposalIndex = await createTestProposal('Created by owner', owner);
    await ballot.vote(proposalIndex, { from: roger });
    const votedProposal = await ballot.proposals(proposalIndex, { from: roger });
    assert.equal(votedProposal.voteCount.toNumber(), 0, 'Incorrect vote count');
  });

  it('Should create and vote proposal', async () => {
    const proposalIndex = await createTestProposal('Test 2', owner);
    await ballot.vote(proposalIndex, { from: owner });
    const votedProposal = await ballot.proposals(proposalIndex, { from: owner });
    assert.equal(votedProposal.voteCount.toNumber(), 1, 'Incorrect vote count');
  });

  it('Should be able to delegate vote weight', async () => {
    await ballot.delegate(alice, { from: camile });
    const voter = await ballot.voters(alice, { from: alice });
    assert.equal(voter.weight.toNumber(), 2, 'Incorrect vote weight');
    const proposalIndex = await createTestProposal('Created by camile', camile);
    await ballot.vote(proposalIndex, { from: alice });
    const votedProposal = await ballot.proposals(proposalIndex, { from: alice });
    assert.equal(votedProposal.voteCount.toNumber(), 2, 'Incorrect vote count');
  });

  it('Should attribute vote after delegation', async () => {
    const proposalIndex = await createTestProposal('Created by alice', alice);
    await ballot.vote(proposalIndex, { from: dexter });
    await ballot.delegate(dexter, { from: earl });
    const votedProposal = await ballot.proposals(proposalIndex, { from: dexter });
    assert.equal(votedProposal.voteCount.toNumber(), 2, 'Incorrect vote count');
  });
});

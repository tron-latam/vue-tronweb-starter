// eslint-disable-next-line no-undef
const Ballot = artifacts.require('./Ballot.sol');

// eslint-disable-next-line func-names
module.exports = function (deployer) {
  deployer.deploy(Ballot);
};

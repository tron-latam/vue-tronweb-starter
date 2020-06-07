pragma solidity >=0.5 <=0.5.10;

/**
 * @title Ballot
 * @dev Implements voting process along with vote delegation
 */
contract Ballot {

    struct Voter {
        uint weight; // weight is accumulated by delegation
        bool voted;  // if true, that person already voted
        address delegate; // person delegated to
        uint vote;   // index of the voted proposal
    }

    struct Proposal {
        address owner;  // address that created the proposal
        // If you can limit the length to a certain number of bytes,
        // always use one of bytes1 to bytes32 because they are much cheaper
        string name;   // short name
        uint voteCount; // number of accumulated votes
    }

    address public chairPerson;

    uint public proposalCount;
    Proposal[] public proposals;

    mapping(address => Voter) public voters;

    event proposalSubmited(
        uint proposalIndex
    );

    event proposalVoted(
        uint proposalIndex
    );

    /**
     * @dev Modifier to validate if is chairPerson
     */
    modifier isChairPerson() {
        require(
            msg.sender == chairPerson,
            "Only chairPerson can give right to vote."
        );
        _;
    }

    /**
     * @dev Modifier to validate if sender has vote right
     */
    modifier hasVoteRight() {
        require(voters[msg.sender].weight != 0, "Has no right to vote");
        _;
    }

    /**
     * @dev Set chairPerson and give him voting rights
     */
    constructor() public {
        chairPerson = msg.sender;
        voters[chairPerson].weight = 1;
    }

    /**
     * @dev Creates and saves new proposal
     * @param _name name of proposal
     */
    function _createProposal(string memory _name, address _owner) internal {
         proposals.push(Proposal({
                owner: _owner,
                name: _name,
                voteCount: 0
            }));
        emit proposalSubmited(proposalCount);
        proposalCount++;
    }

    /**
     * @dev Sends a new proposal to be saved
     * @param _name Name of proposal
     */
    function sendProposal(string memory _name) public hasVoteRight {
        _createProposal(_name, msg.sender);
    }

    /**
     * @dev Give 'voter' the right to vote on this ballot. May only be called by 'chairPerson'.
     * @param _voter address of voter
     */
    function giveRightToVote(address _voter) public isChairPerson {
        require(
            !voters[_voter].voted,
            "The voter already voted."
        );
        require(voters[_voter].weight == 0, "Voter aready has right to vote");
        voters[_voter].weight = 1;
    }

    /**
     * @dev Delegate your vote to the voter 'to'.
     * @param _to address to which vote is delegated
     */
    function delegate(address _to) public hasVoteRight {
        Voter storage sender = voters[msg.sender];
        require(!sender.voted, "You already voted.");
        require(_to != msg.sender, "Self-delegation is disallowed.");

        sender.voted = true;
        sender.delegate = _to;
        Voter storage delegate_ = voters[_to];
        if (delegate_.voted) {
            // If the delegate already voted,
            // directly add to the number of votes
            proposals[delegate_.vote].voteCount += sender.weight;
            emit proposalVoted(delegate_.vote);
        } else {
            // If the delegate did not vote yet,
            // add to her weight.
            delegate_.weight += sender.weight;
        }
    }

    /**
     * @dev Give your vote (including votes delegated to you) to proposal 'proposals[proposal].name'.
     * @param _proposal index of proposal in the proposals array
     */
    function vote(uint _proposal) public hasVoteRight {
        Voter storage sender = voters[msg.sender];
        require(!sender.voted, "Already voted.");
        sender.voted = true;
        sender.vote = _proposal;

        // If 'proposal' is out of the range of the array,
        // this will throw automatically and revert all
        // changes.
        proposals[_proposal].voteCount += sender.weight;
        emit proposalVoted(_proposal);
    }

    /**
     * @dev Computes the winning proposal taking all previous votes into account.
     * @return winningProposal_ index of winning proposal in the proposals array
     */
    function winningProposal() public view
            returns (uint winningProposal_)
    {
        uint winningVoteCount = 0;
        for (uint p = 0; p < proposals.length; p++) {
            if (proposals[p].voteCount > winningVoteCount) {
                winningVoteCount = proposals[p].voteCount;
                winningProposal_ = p;
            }
        }
    }

    /**
     * @dev Calls winningProposal() function to get the index of the winner contained in the proposals array and then
     * @return winnerName_ the name of the winner
     */
    function winnerName() public view
            returns (string memory winnerName_)
    {
        winnerName_ = proposals[winningProposal()].name;
    }
}
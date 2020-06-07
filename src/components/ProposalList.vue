<template>
  <div class="content">
    <h2>Proposal List</h2>
    <p>We currently have: {{numberOfProposals}} proposals</p>
    <table v-if="numberOfProposals > 0">
      <thead>
        <tr>
          <th>Name</th>
          <th>Owner</th>
          <th>Votes</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(proposal, index) in proposals" :key='index'>
          <td>{{proposal.name}}</td>
          <td>{{proposal.owner}}</td>
          <td>{{proposal.voteCount}}</td>
          <td><ProposalVote :proposalIndex="index" /></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import ProposalVote from '@/components/ProposalVote.vue';
import { getTronWebInstance } from '@/services/tronWebUtils';

export default {
  name: 'ProposalList',
  components: {
    ProposalVote,
  },
  data() {
    return {
      numberOfProposals: null,
      proposals: [],
      error: false,
    };
  },
  async mounted() {
    const { contract } = await getTronWebInstance();
    this.numberOfProposals = (await contract.proposalCount().call()).toNumber();
    const loadingProposals = [];
    for (let i = 0; i < this.numberOfProposals; i += 1) loadingProposals.push(this.getProposal(i));
    this.proposals = await Promise.all(loadingProposals);
    contract.eventNewProposal().watch(async (err, event) => {
      if (err) {
        // Something went wrong
      }
      if (event) {
        const { proposalIndex } = event.result;
        const newProposal = await this.getProposal(proposalIndex);
        this.proposals.push(newProposal);
        this.numberOfProposals += 1;
      }
    });
  },
  methods: {
    async getProposal(proposalIndex) {
      const { contract } = await getTronWebInstance();
      const result = await contract.proposals(proposalIndex).call();
      return {
        owner: result.owner,
        name: result.name,
        voteCount: result.voteCount.toNumber(),
      };
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.send {
  margin: 10px;
}
table {
  margin-left:auto;
  margin-right:auto;
}
td, th {
  padding: 1em 3em;
}
</style>

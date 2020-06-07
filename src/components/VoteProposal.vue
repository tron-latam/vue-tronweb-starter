<template>
  <div>
    <button @click="voteProposal" :disabled="!enabled">Vote</button>
    <p v-if="message">{{message}}</p>
  </div>
</template>

<script>
import { getTronWebInstance } from '@/services/tronWebUtils';

export default {
  name: 'VoteProposal',
  props: {
    proposalIndex: null,
  },
  data() {
    return {
      message: null,
      error: false,
      enabled: false,
    };
  },
  async mounted() {
    const { tronWeb, contract, loggedIn } = await getTronWebInstance();
    if (!loggedIn) return;
    const voter = await contract.voters(tronWeb.defaultAddress.base58).call();
    if (voter.voted) return;
    this.enabled = true;
  },
  methods: {
    async voteProposal() {
      this.message = 'Voting proposal';
      const { contract, loggedIn } = await getTronWebInstance();
      if (!loggedIn) {
        this.message = 'You need to be logged in with TronLink to create vote a proposal';
        return;
      }
      try {
        await contract.vote(this.proposalIndex).send({ shouldPollResponse: true });
        this.message = 'Vote sent';
      } catch (e) {
        this.message = 'Failed to vote';
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.send {
  margin: 10px;
}
</style>

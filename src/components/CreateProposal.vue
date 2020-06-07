<template>
  <div>
    <h2>Create a new Proposal</h2>
    <input type="text" v-model="name" placeholder="Proposal name">
    <button class="send" @click='sendProposal'>Submit</button>
    <div class="error" v-if="message">
     <p>{{message}}</p>
    </div>
  </div>
</template>

<script>
import { getTronWebInstance } from '@/services/tronWebUtils';

export default {
  name: 'CreateProposal',
  data() {
    return {
      name: null,
      message: null,
      error: false,
    };
  },
  methods: {
    async sendProposal() {
      this.message = 'Sending proposal';
      const { contract, loggedIn } = await getTronWebInstance();
      if (!loggedIn) {
        this.message = 'You need to be logged in with TronLink to create proposals';
        return;
      }
      try {
        await contract.sendProposal(this.name).send({ shouldPollResponse: true });
        this.message = 'Proposal sent';
      } catch (e) {
        this.message = 'Failed to send proposal';
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

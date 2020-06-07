<template>
  <div>
      <h2>Give Right to Vote</h2>
      <input type="text" v-model="address" placeholder="Address">
      <button class="send" @click='giveRightToVote'>Submit</button>
      <p v-if="message">{{message}}</p>
  </div>
</template>

<script>
import { getTronWebInstance } from '@/services/tronWebUtils';

export default {
  name: 'GiveRightToVote',
  data() {
    return {
      address: null,
      message: null,
    };
  },
  methods: {
    async giveRightToVote() {
      this.message = 'Sending transaction';
      const { contract } = await getTronWebInstance();
      try {
        await contract.giveRightToVote(this.address).send({ shouldPollResponse: true });
        this.message = 'Transaction sent';
        this.name = null;
      } catch (e) {
        this.message = 'Failed to send transaction';
      }
    },
  },
};
</script>

<style scoped>
.send {
  margin: 10px;
}
</style>

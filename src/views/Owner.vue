<template>
  <div>
    <div v-if="!isOwner">
      <h2>For ChairMan only</h2>
    </div>
    <div v-else>
      <h2>Give Right to Vote</h2>
      <input type="text" v-model="address" placeholder="Address">
      <button class="send" @click='giveRightToVote'>Submit</button>
      <div v-if="message">
        <p>{{message}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { isOwner, getTronWebInstance } from '@/services/tronWebUtils';

export default {
  name: 'Owner',
  data() {
    return {
      isOwner: false,
      address: null,
      message: null,
    };
  },
  async mounted() {
    this.isOwner = await isOwner();
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.send {
  margin: 10px;
}
</style>

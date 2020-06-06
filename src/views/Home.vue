<template>
  <div class="home">
    <img alt="Tron logo" src="../assets/tron-trx-logo.png" class="logo">
    <img alt="Vue logo" src="../assets/logo.png" class="logo">
    <CreateProposal />
  </div>
</template>

<script>
// @ is an alias to /src
import CreateProposal from '@/components/CreateProposal.vue';

export default {
  name: 'Home',
  components: {
    CreateProposal,
  },
};
</script>

<style scoped>
.logo {
  max-width: 200px;
}
</style>

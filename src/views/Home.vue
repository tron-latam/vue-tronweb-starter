<template>
  <div class="home">
    <img alt="Tron logo" src="../assets/tron-trx-logo.png" class="logo">
    <img alt="Vue logo" src="../assets/logo.png" class="logo">
    <ProposalCreate />
    <ProposalList />
  </div>
</template>

<script>
// @ is an alias to /src
import ProposalCreate from '@/components/ProposalCreate.vue';
import ProposalList from '@/components/ProposalList.vue';

export default {
  name: 'Home',
  components: {
    ProposalCreate,
    ProposalList,
  },
};
</script>

<style scoped>
.home {
  padding: 36px;
}
.logo {
  max-width: 200px;
}
</style>

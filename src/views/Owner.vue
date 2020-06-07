<template>
  <div>
    <div v-if="!isOwner">
      <h2>For ChairMan only</h2>
    </div>
    <GiveRigthToVote  v-else />
  </div>
</template>

<script>
import { isOwner } from '@/services/tronWebUtils';
import GiveRigthToVote from '@/components/GiveRightToVote.vue';

export default {
  name: 'Owner',
  components: {
    GiveRigthToVote,
  },
  data() {
    return {
      isOwner: false,
    };
  },
  async mounted() {
    this.isOwner = await isOwner();
  },
};
</script>

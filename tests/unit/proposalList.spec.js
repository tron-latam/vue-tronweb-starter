import { expect } from 'chai';
import { shallowMount } from '@vue/test-utils';
import ProposalList from '@/components/ProposalList.vue';

describe('ProposalList.vue', () => {
  it('should mount', () => {
    const wrapper = shallowMount(ProposalList);
    expect(wrapper.exists()).to.equal(true);
  });
});

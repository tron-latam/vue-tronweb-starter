import { expect } from 'chai';
import { shallowMount } from '@vue/test-utils';
import ProposalCreate from '@/components/ProposalCreate.vue';

describe('ProposalCreate.vue', () => {
  it('renders with text input', () => {
    const wrapper = shallowMount(ProposalCreate);
    expect(wrapper.exists()).to.equal(true);
    expect(wrapper.contains('input')).to.equal(true);
  });
});

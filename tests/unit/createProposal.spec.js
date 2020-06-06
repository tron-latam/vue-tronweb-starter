import { expect } from 'chai';
import { shallowMount } from '@vue/test-utils';
import CreateProposal from '@/components/CreateProposal.vue';

describe('CreateProposal.vue', () => {
  it('renders with text input', () => {
    const wrapper = shallowMount(CreateProposal);
    expect(wrapper.exists()).to.equal(true);
    expect(wrapper.contains('input')).to.equal(true);
  });
});

import {newE2EPage} from '@stencil/core/testing';

describe('page-header-loading', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<page-header-loading></page-header-loading>');

    const element = await page.find('page-header-loading');
    expect(element).toHaveClass('hydrated');
  });
});

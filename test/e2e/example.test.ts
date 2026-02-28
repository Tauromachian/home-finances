import { describe, expect, it } from 'vitest'
import { $fetch, setup } from '@nuxt/test-utils/e2e'

describe('example e2e test', async () => {
  await setup()

  it('renders the index page', async () => {
    const html = await $fetch('/')
    expect(html).toContain('Nuxt')
  })
})

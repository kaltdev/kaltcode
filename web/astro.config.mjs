import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
  site: 'https://kaltcode.kaltcode.my.id',
  trailingSlash: 'always',
  redirects: {
    '/changelog/': 'https://github.com/kaltdev/kaltcode/releases',
  },
  integrations: [sitemap()],
})

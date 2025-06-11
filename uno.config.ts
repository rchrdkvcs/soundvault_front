import { defineConfig, presetIcons, presetWind4, transformerVariantGroup } from 'unocss'
import { presetDaisy } from '@ameinhardt/unocss-preset-daisy'

export default defineConfig({
  presets: [
    presetDaisy({
      themes: ['light', 'dark'],
    }),
    presetWind4(),
    presetIcons(),
  ],
  transformers: [transformerVariantGroup()],
})

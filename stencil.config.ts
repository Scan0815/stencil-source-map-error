import { Config } from '@stencil/core';
import {sass} from '@stencil/sass';
import nodePolyfills from 'rollup-plugin-node-polyfills';
// https://stenciljs.com/docs/config

export const config: Config = {
  globalScript: 'src/global/app.ts',
  globalStyle: 'src/global/app.scss',
  buildEs5: "prod",
  hashFileNames: true,
  sourceMap: true,
  extras: {
    cssVarsShim: true,
    dynamicImportShim: true,
    shadowDomShim: true,
    safari10: true,
    scriptDataOpts: true,
    appendChildSlotFix: false,
    cloneNodeFix: false,
    slotChildNodesFix: true
  },
  plugins: [
    sass()
  ],
  rollupPlugins: {
    after: [
      nodePolyfills()
    ]
  },
  outputTargets: [{
    type: 'www',
    serviceWorker: {
      swSrc: 'src/sw.js',
      globPatterns: [
        '**/*.{js,css,json,html,ico,png}'
      ]
    }
  }],

};

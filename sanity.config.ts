/**
 * This config is used to set up Sanity Studio that's mounted on the `/pages/studio/[[...index]].tsx` route
 */

import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
// import { deskTool } from 'sanity/desk'
import { structureTool } from 'sanity/structure'
import { media } from 'sanity-plugin-media'

// see https://www.sanity.io/docs/api-versioning for how versioning works
import { apiVersion, dataset, projectId } from '~/lib/sanity/sanity.api'
import { schema } from '~/schemas'

// const iframeOptions = {
//   url: defineUrlResolver({
//     base: '/api/draft',
//     requiresSlug: ['post'],
//   }),
//   urlSecretId: previewSecretId,
//   reload: { button: true },
// } satisfies IframeOptions

// This may help: https://github.com/sanity-io/template-nextjs-personal-website/blob/main/sanity.config.ts
export default defineConfig({
  basePath: '/studio',
  name: 'modern-alchemy-site',
  title: 'Modern Alchemy Site Studio',
  projectId,
  dataset,
  //edit schemas in './src/schemas'
  schema,
  plugins: [
    structureTool(),
    // deskTool({
    //   // `defaultDocumentNode` is responsible for adding a “Preview” tab to the document pane
    //   // You can add any React component to `S.view.component` and it will be rendered in the pane
    //   // and have access to content in the form in real-time.
    //   // It's part of the Studio's “Structure Builder API” and is documented here:
    //   // https://www.sanity.io/docs/structure-builder-reference
    //   defaultDocumentNode: (S, { schemaType }) => {
    //     return S.document().views([
    //       // Default form view
    //       S.view.form(),
    //       // Preview
    //       // S.view.component(Iframe).options(iframeOptions).title('Preview'),
    //     ])
    //   },
    // }),
    // Add the "Open preview" action
    // previewUrl({
    //   base: '/api/draft',
    //   requiresSlug: ['post'],
    //   urlSecretId: previewSecretId,
    // }),
    // Vision lets you query your content with GROQ in the studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({ defaultApiVersion: apiVersion }),
    media(),
  ],
})

import { createFormContext } from '@mantine/form'

import { TBlogEditorSchema } from './blogEditorUtils'

// createFormContext returns a tuple with 3 items:
// BlogEditorFormProvider is a component that sets form context
// useBlogEditorFormContext hook returns form object that was previously set in BlogEditorFormProvider
// useBlogEditorForm hook works the same way as useForm exported from the package but has predefined type
export const [
  BlogEditorFormProvider,
  useBlogEditorFormContext,
  useBlogEditorForm,
] = createFormContext<TBlogEditorSchema>()

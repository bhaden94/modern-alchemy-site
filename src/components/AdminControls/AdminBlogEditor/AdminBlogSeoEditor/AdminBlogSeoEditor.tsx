'use client'

import { Accordion, Pill, PillsInput, Textarea } from '@mantine/core'
import { IconSeo } from '@tabler/icons-react'
import { useState } from 'react'

import { useBlogEditorFormContext } from '~/utils/forms/blogEditorFormContext'
import { BlogEditorField } from '~/utils/forms/blogEditorUtils'

interface AdminBlogSeoEditorProps {
  disabled?: boolean
}

const AdminBlogSeoEditor = ({ disabled = false }: AdminBlogSeoEditorProps) => {
  const form = useBlogEditorFormContext()
  const [keywordInput, setKeywordInput] = useState('')

  const keywords = form.getValues().keywords || []

  const handleKeywordKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Enter' && keywordInput.trim()) {
      event.preventDefault()
      const trimmedKeyword = keywordInput.trim()

      // Avoid duplicates
      if (!keywords.includes(trimmedKeyword)) {
        form.setFieldValue(BlogEditorField.Keywords.id, [
          ...keywords,
          trimmedKeyword,
        ])
      }
      setKeywordInput('')
    }
  }

  const handleRemoveKeyword = (keywordToRemove: string) => {
    form.setFieldValue(
      BlogEditorField.Keywords.id,
      keywords.filter((keyword) => keyword !== keywordToRemove),
    )
  }

  return (
    <Accordion variant="separated" chevronPosition="left" mb="md">
      <Accordion.Item value="seo">
        <Accordion.Control icon={<IconSeo />}>SEO Settings</Accordion.Control>
        <Accordion.Panel>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            {/* Summary */}
            <Textarea
              id={BlogEditorField.Summary.id}
              label={BlogEditorField.Summary.label}
              placeholder={BlogEditorField.Summary.placeholder}
              disabled={disabled}
              description="Enter an SEO friendly summary of the blog post"
              minRows={3}
              maxRows={5}
              autosize
              {...form.getInputProps(BlogEditorField.Summary.id)}
            />

            {/* Keywords */}
            <PillsInput
              id={BlogEditorField.Keywords.id}
              label={BlogEditorField.Keywords.label}
              description="Press Enter to add a keyword"
              disabled={disabled}
              error={form.errors[BlogEditorField.Keywords.id] as string}
            >
              <Pill.Group>
                {keywords.map((keyword) => (
                  <Pill
                    key={keyword}
                    withRemoveButton
                    onRemove={() => handleRemoveKeyword(keyword)}
                    disabled={disabled}
                  >
                    {keyword}
                  </Pill>
                ))}
                <PillsInput.Field
                  placeholder={
                    keywords.length === 0
                      ? BlogEditorField.Keywords.placeholder
                      : undefined
                  }
                  value={keywordInput}
                  onChange={(event) =>
                    setKeywordInput(event.currentTarget.value)
                  }
                  onKeyDown={handleKeywordKeyDown}
                  disabled={disabled}
                />
              </Pill.Group>
            </PillsInput>
          </div>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  )
}

export default AdminBlogSeoEditor

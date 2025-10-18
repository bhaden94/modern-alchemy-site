import { test, expect, Page } from '@playwright/test'
import {
  clearBlogForm,
  fillBlogForm,
  navigateToBlogsPage,
  performBlogFormAction,
  verifyDateTimeUpdated,
} from './test-utils/test-utils'

// Shared test blog titles and URLs created once and reused across tests
let testBlogDraftTitle: string
const testBlogDraftContent: string = 'This is test content for the draft blog.'
let testBlogDraftUrl: string
let testBlogPublishedTitle: string
const testBlogPublishedContent: string =
  'This is test content for the published blog.'
let testBlogPublishedUrl: string

// Helper function to create a blog with title and content
async function createBlogWithContent(
  page: Page,
  title: string,
  content: string,
  shouldPublish: boolean = false,
): Promise<string> {
  await page.getByRole('button', { name: 'Create Article' }).click()
  await page.waitForURL(/.*\/blogs\/[a-zA-Z0-9]+$/)

  // Store the full URL path for later navigation
  const fullUrl = page.url()

  // Fill form and save
  await fillBlogForm(page, title, content)
  await performBlogFormAction(page, 'save')

  if (shouldPublish) {
    await performBlogFormAction(page, 'publish')
  }

  return fullUrl
}

// Helper function to navigate to a specific blog by URL
async function navigateToBlogEditor(page: Page, blogUrl: string) {
  await page.goto(blogUrl)
  await page.waitForURL(/.*\/blogs\/[a-zA-Z0-9-]+$/)
}

// Helper function to delete a blog by ID
async function deleteBlogById(page: Page, title: string) {
  // Find the blog by title and delete it
  const blogHeading = page.getByRole('heading', { name: title, level: 2 })
  const headingCount = await blogHeading.count()

  if (headingCount > 0) {
    await blogHeading
      .first()
      .locator('..')
      .locator('..')
      .getByRole('button', { name: 'Delete' })
      .click()
    await page.getByRole('button', { name: 'Confirm Deletion' }).click()
    await expect(page.getByText(/Successfully deleted blog post/)).toBeVisible()
    await page.waitForTimeout(500)
  }
}

// Create test blogs once before all tests in the file
test.beforeAll(async ({ browser }) => {
  const context = await browser.newContext()
  const page = await context.newPage()

  // Navigate to blogs page
  await navigateToBlogsPage(page)

  // Generate unique titles with timestamp
  const timestamp = Date.now()
  testBlogDraftTitle = `Test Editor Draft ${timestamp}`
  testBlogPublishedTitle = `Test Editor Published ${timestamp}`

  // Create draft blog
  testBlogDraftUrl = await createBlogWithContent(
    page,
    testBlogDraftTitle,
    testBlogDraftContent,
    false,
  )

  // Navigate back to blogs page
  await navigateToBlogsPage(page)

  // Create published blog
  testBlogPublishedUrl = await createBlogWithContent(
    page,
    testBlogPublishedTitle,
    testBlogPublishedContent,
    true,
  )

  // Verify blogs exist on blogs page
  await navigateToBlogsPage(page, 'Drafts')
  const draftBlogHeader = page.getByRole('heading', {
    name: testBlogDraftTitle,
    level: 2,
  })
  await expect(draftBlogHeader).toBeVisible()

  await navigateToBlogsPage(page, 'Published')
  const publishedBlogHeader = page.getByRole('heading', {
    name: testBlogPublishedTitle,
    level: 2,
  })
  await expect(publishedBlogHeader).toBeVisible()

  await context.close()
  console.log(
    `✅ Created test blogs: "${testBlogDraftTitle}" and "${testBlogPublishedTitle}"`,
  )
})

// Clean up test blogs after all tests complete
test.afterAll(async ({ browser }) => {
  const context = await browser.newContext()
  const page = await context.newPage()

  await navigateToBlogsPage(page, 'Drafts')
  await deleteBlogById(page, testBlogDraftTitle)
  await navigateToBlogsPage(page, 'Published')
  await deleteBlogById(page, testBlogPublishedTitle)

  await context.close()
  console.log('✅ Cleaned up test blogs')
})

test.describe('Blog Editor Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the draft blog for most tests
    await navigateToBlogEditor(page, testBlogDraftUrl)
  })

  test('title and content persist after page reload', async ({ page }) => {
    // Wait for editor to fully load
    await page.waitForLoadState('networkidle')

    // Verify the blog from beforeAll is loaded
    await expect(page.getByRole('textbox', { name: 'Title' })).toHaveValue(
      testBlogDraftTitle,
    )

    await page.waitForTimeout(2000)
    const contentEditor = page.getByRole('textbox').nth(1)
    const initialContent = await contentEditor.textContent()
    expect(initialContent).toContain(testBlogDraftContent)

    // Edit the title
    const updatedTitle = `${testBlogDraftTitle} - Edited`
    const updatedContent = 'Updated content after editing.'
    await clearBlogForm(page)
    await fillBlogForm(page, updatedTitle, updatedContent)

    // Save changes
    await performBlogFormAction(page, 'save')

    // Reload the page
    await page.reload()
    await page.waitForLoadState('networkidle')

    // Wait for the content editor to be fully loaded after reload
    // The editor takes time to hydrate after page reload
    await page.waitForTimeout(2000)
    await expect(contentEditor).toBeVisible()

    // Verify the edited title and content persisted after reload
    await expect(page.getByRole('textbox', { name: 'Title' })).toHaveValue(
      updatedTitle,
    )
    const reloadedContent = await contentEditor.textContent()
    expect(reloadedContent).toContain(updatedContent)

    // Restore original values
    await clearBlogForm(page)
    await fillBlogForm(page, testBlogDraftTitle, testBlogDraftContent)
    await performBlogFormAction(page, 'save')
  })

  test('toggle preview switches between editor and preview mode', async ({
    page,
  }) => {
    // Verify title and content are already there
    await expect(page.getByRole('textbox', { name: 'Title' })).toHaveValue(
      testBlogDraftTitle,
    )

    const contentEditor = page.getByRole('textbox').nth(1)

    // Verify we're in editor mode (content editor is visible)
    await expect(contentEditor).toBeVisible()

    // Click Toggle Preview
    await page.getByRole('button', { name: 'Toggle Preview' }).click()

    // Verify we're in preview mode (article is visible instead of editor)
    await expect(page.getByRole('article')).toBeVisible()
    await expect(
      page.getByRole('heading', { name: testBlogDraftTitle, level: 1 }),
    ).toBeVisible()

    // Click Toggle Preview again
    await page.getByRole('button', { name: 'Toggle Preview' }).click()

    // Verify we're back in editor mode
    await expect(contentEditor).toBeVisible()
  })

  test('draft blog shows "In draft" in Published field', async ({ page }) => {
    // Verify shows "In draft" since this is a draft blog
    await expect(page.getByText(/Published: In draft/)).toBeVisible()
  })

  test('saving changes shows success message', async ({ page }) => {
    // Make a minor change to the title
    const currentTitle = await page
      .getByRole('textbox', { name: 'Title' })
      .inputValue()
    await page.getByRole('textbox', { name: 'Title' }).fill(`${currentTitle} `)

    // Save changes using utility function
    await performBlogFormAction(page, 'save')

    // Verify Last saved timestamp is present
    await expect(page.getByText(/Last saved:/)).toBeVisible()
  })
})

test.describe('Blog Editor - Publishing Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the draft blog
    await navigateToBlogEditor(page, testBlogDraftUrl)
  })

  test.afterEach(async ({ page }) => {
    // Ensure blog is back in known state as draft with original title and content
    await navigateToBlogEditor(page, testBlogDraftUrl)

    // Check if it's published, if so convert back to draft
    const convertButton = page.getByRole('button', { name: 'Convert to draft' })
    const isPublished = await convertButton.isVisible().catch(() => false)

    if (isPublished) {
      await performBlogFormAction(page, 'convertToDraft')
    }

    // Ensure title and content are restored
    await clearBlogForm(page)
    await fillBlogForm(page, testBlogDraftTitle, testBlogDraftContent)
    await performBlogFormAction(page, 'save')
  })

  test('publishing without title fails with error message', async ({
    page,
  }) => {
    // Clear the title
    await clearBlogForm(page, { clearTitle: true, clearContent: false })

    // Try to publish without title
    await page.getByRole('button', { name: 'Publish' }).click()

    // Verify error message appears
    await expect(
      page.getByText(/Title and content are required to publish/),
    ).toBeVisible()

    // Verify Published status is still "In draft"
    await expect(page.getByText(/Published: In draft/)).toBeVisible()
  })

  test('publishing without content fails with error message', async ({
    page,
  }) => {
    // Clear the content
    await clearBlogForm(page, { clearTitle: false, clearContent: true })

    // Try to publish
    await page.getByRole('button', { name: 'Publish' }).click()

    // Verify error message appears
    await expect(
      page.getByText(/Title and content are required to publish/),
    ).toBeVisible()

    // Verify Published status is still "In draft"
    await expect(page.getByText(/Published: In draft/)).toBeVisible()
  })

  test('publishing with title and content succeeds', async ({ page }) => {
    const initialPublished = await page.getByText(/Published:/).textContent()
    expect(initialPublished).toContain('In draft')

    await performBlogFormAction(page, 'publish')

    // Verify Published timestamp shows an actual date (not "In draft")
    const updatedPublished = await page.getByText(/Published:/).textContent()
    expect(updatedPublished).not.toContain('In draft')

    // Extract the date string after "Published: "
    const dateString = updatedPublished?.replace('Published: ', '') || ''
    await verifyDateTimeUpdated(dateString)
  })
})

test.describe('Blog Editor - Published Blog Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the published blog
    await navigateToBlogEditor(page, testBlogPublishedUrl)
  })

  test('published blog shows date/time in Published field', async ({
    page,
  }) => {
    // Get the Published text
    const publishedText = await page.getByText(/Published:/).textContent()

    // Verify it contains a date/time pattern
    expect(publishedText).toMatch(/Published:.*(at|AM|PM)/)
    expect(publishedText).not.toContain('In draft')
  })
})

test.describe('Blog Editor - Cover Image Tests', () => {
  test('published blog with cover image shows change and remove buttons', async ({
    page,
  }) => {
    // Navigate to the published blog which has cover image
    await navigateToBlogEditor(page, testBlogPublishedUrl)

    // Verify cover image controls are present
    await expect(
      page.getByRole('button', { name: 'Change cover image' }),
    ).toBeVisible()
    await expect(
      page.getByRole('button', { name: 'Remove cover image' }),
    ).toBeVisible()
  })

  test('draft blog shows add cover image option', async ({ page }) => {
    // Navigate to draft blog
    await navigateToBlogEditor(page, testBlogDraftUrl)

    // Verify add cover image button is present
    await expect(
      page.getByRole('button', { name: 'Add cover image' }),
    ).toBeVisible()
  })
})

test.describe('Blog Editor - Complex Workflow', () => {
  test('create, save, publish, then convert back to draft workflow', async ({
    page,
  }) => {
    await navigateToBlogsPage(page)

    const uniqueTitle = `Workflow Test ${Date.now()}`

    try {
      // Step 1: Create new article
      await page.getByRole('button', { name: 'Create Article' }).click()
      await page.waitForURL(/.*\/blogs\/[a-zA-Z0-9]+$/)

      // Step 2: Add title and content using utility function
      await fillBlogForm(page, uniqueTitle, 'Content for workflow test.')

      // Step 3: Save using utility function
      await performBlogFormAction(page, 'save')
      await expect(page.getByText(/Published: In draft/)).toBeVisible()

      // Step 4: Publish using utility function
      await performBlogFormAction(page, 'publish')
      const publishedText = await page.getByText(/Published:/).textContent()
      expect(publishedText).not.toContain('In draft')

      // Step 5: Convert back to draft
      await page.getByRole('button', { name: 'Convert to draft' }).click()
      await expect(page.getByText(/Blog converted to draft/)).toBeVisible()
      await expect(page.getByRole('button', { name: 'Publish' })).toBeVisible()
      await expect(page.getByText(/Published: In draft/)).toBeVisible()

      // Step 6: Navigate back to blogs page and verify it's in Drafts tab
      await navigateToBlogsPage(page, 'Drafts')
      await expect(
        page.getByRole('heading', { name: uniqueTitle }),
      ).toBeVisible()
    } finally {
      // Cleanup: Always delete the workflow test blog, even if test fails
      await deleteBlogById(page, uniqueTitle).catch(() => {
        console.log(`Could not delete workflow test blog "${uniqueTitle}"`)
      })
    }
  })
})

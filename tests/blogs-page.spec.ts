import { test, expect, Page } from '@playwright/test'
import { navigateToBlogsPage } from './test-utils/test-utils'

const BASE_URL =
  'https://modern-alchemy-site-git-preview-brady-hadens-projects.vercel.app'

// Shared test blog titles created once and reused across tests
let testBlogDraft: string
let testBlogForNav: string

// Helper function to create a blog
async function createBlog(page: Page, title: string) {
  await page.getByRole('button', { name: 'Create Article' }).click()
  await page.waitForURL(/.*\/blogs\/[a-zA-Z0-9]+$/)
  await page.getByRole('textbox', { name: 'Title' }).fill(title)
  await page.getByRole('button', { name: 'Save Changes' }).click()
  await expect(page.getByText(/Blog updated/)).toBeVisible()
}

// Helper function to delete a blog by title
async function deleteBlog(page: Page, title: string) {
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

test.describe('Blogs Page Tests', () => {
  // Create test blogs once before all tests
  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext()
    const page = await context.newPage()

    // Generate unique titles with timestamp
    const timestamp = Date.now()
    testBlogDraft = `Test Draft Blog ${timestamp}`
    testBlogForNav = `Test Nav Blog ${timestamp}`

    // Navigate to blogs page
    await navigateToBlogsPage(page)

    // Create first test blog
    await createBlog(page, testBlogDraft)

    // Navigate back to blogs page
    await page.getByRole('button', { name: 'Settings' }).click()
    await page.getByRole('link', { name: 'Blog Articles' }).click()
    await page.waitForSelector('h1:has-text("My Blogs")')

    // Create second test blog
    await createBlog(page, testBlogForNav)

    await context.close()
    console.log(
      `✅ Created test blogs: "${testBlogDraft}" and "${testBlogForNav}"`,
    )
  })

  // Clean up test blogs after all tests complete
  test.afterAll(async ({ browser }) => {
    const context = await browser.newContext()
    const page = await context.newPage()

    await navigateToBlogsPage(page)

    // Delete test blogs
    await deleteBlog(page, testBlogDraft)
    await deleteBlog(page, testBlogForNav)

    await context.close()
    console.log('✅ Cleaned up test blogs')
  })

  test.beforeEach(async ({ page }) => {
    await navigateToBlogsPage(page)
  })

  test('load employee-portal blogs page and shows a list of blogs', async ({
    page,
  }) => {
    // Verify the page loaded correctly
    await expect(page.getByRole('heading', { name: 'My Blogs' })).toBeVisible()

    // Verify the Create Article button is visible
    await expect(
      page.getByRole('button', { name: 'Create Article' }),
    ).toBeVisible()

    // Verify the tabs are present
    await expect(page.getByRole('tab', { name: 'Drafts' })).toBeVisible()
    await expect(page.getByRole('tab', { name: 'Published' })).toBeVisible()
    await expect(page.getByRole('tab', { name: 'All Articles' })).toBeVisible()

    // Verify our test blogs are shown
    await expect(
      page.getByRole('heading', { name: testBlogDraft }),
    ).toBeVisible()
    await expect(
      page.getByRole('heading', { name: testBlogForNav }),
    ).toBeVisible()
  })

  test('can navigate between Drafts, Published, and All Articles tabs', async ({
    page,
  }) => {
    // Verify Drafts tab is selected by default
    await expect(page.getByRole('tab', { name: 'Drafts' })).toHaveAttribute(
      'aria-selected',
      'true',
    )

    // Click Published tab
    await page.getByRole('tab', { name: 'Published' }).click()
    await expect(page.getByRole('tab', { name: 'Published' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    await expect(
      page.getByRole('tabpanel', { name: 'Published' }),
    ).toBeVisible()

    // Click All Articles tab
    await page.getByRole('tab', { name: 'All Articles' }).click()
    await expect(
      page.getByRole('tab', { name: 'All Articles' }),
    ).toHaveAttribute('aria-selected', 'true')
    await expect(
      page.getByRole('tabpanel', { name: 'All Articles' }),
    ).toBeVisible()

    // Verify our test blogs appear in All Articles
    await expect(
      page.getByRole('heading', { name: testBlogDraft }),
    ).toBeVisible()
    await expect(
      page.getByRole('heading', { name: testBlogForNav }),
    ).toBeVisible()

    // Go back to Drafts
    await page.getByRole('tab', { name: 'Drafts' }).click()
    await expect(page.getByRole('tab', { name: 'Drafts' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    await expect(page.getByRole('tabpanel', { name: 'Drafts' })).toBeVisible()
  })

  test('clicking edit blog navigates to the blog editor page and loads existing data', async ({
    page,
  }) => {
    // Find our test blog and click edit
    const blogHeading = page.getByRole('heading', {
      name: testBlogDraft,
      level: 2,
    })
    await expect(blogHeading).toBeVisible()

    // Click the Edit link for this blog
    await blogHeading
      .locator('..')
      .locator('..')
      .getByRole('link', { name: 'Edit' })
      .click()

    // Wait for navigation (might open in new tab)
    await page.waitForTimeout(1000)

    // Get all pages/tabs
    const context = page.context()
    const pages = context.pages()
    const editorPage = pages[pages.length - 1] // Get the last opened page

    // Wait for editor to load
    await editorPage.waitForURL(/.*\/blogs\/[a-zA-Z0-9-]+$/)

    // Verify the title is loaded with our test blog title
    const titleInput = editorPage.getByRole('textbox', { name: 'Title' })
    await expect(titleInput).toHaveValue(testBlogDraft)

    // Verify buttons are present
    await expect(
      editorPage.getByRole('button', { name: 'Toggle Preview' }),
    ).toBeVisible()
    await expect(
      editorPage.getByRole('button', { name: 'Save Changes' }),
    ).toBeVisible()
  })

  test('clicking create article button creates a new blog and navigates to editor with empty fields', async ({
    page,
  }) => {
    // Click the Create Article button
    await page.getByRole('button', { name: 'Create Article' }).click()

    // Wait for navigation to the editor page
    await page.waitForURL(/.*\/blogs\/[a-zA-Z0-9]+$/)

    // Verify we're on the editor page
    await expect(
      page.getByRole('button', { name: 'Toggle Preview' }),
    ).toBeVisible()
    await expect(
      page.getByRole('button', { name: 'Save Changes' }),
    ).toBeVisible()
    await expect(page.getByRole('button', { name: 'Publish' })).toBeVisible()

    // Verify the title field is empty
    const titleInput = page.getByRole('textbox', { name: 'Title' })
    await expect(titleInput).toHaveValue('')

    // Verify Last saved text is present
    await expect(page.getByText(/Last saved:/)).toBeVisible()

    // Verify Published status shows "In draft"
    await expect(page.getByText(/Published: In draft/)).toBeVisible()

    // Navigate back to blogs page to delete the untitled blog
    await page.getByRole('button', { name: 'Settings' }).click()
    await page.getByRole('link', { name: 'Blog Articles' }).click()
    await page.waitForSelector('h1:has-text("My Blogs")')

    // Wait for images to load
    await page
      .waitForSelector('img[alt]', { state: 'visible', timeout: 5000 })
      .catch(() => {
        console.log('No blog images found or still loading')
      })
    await page.waitForTimeout(1000)

    // Clean up: Delete the untitled blog (it will be the first one with "Untitled" as title)
    const untitledBlogHeading = page
      .getByRole('heading', { name: 'Untitled', level: 2 })
      .first()
    await expect(untitledBlogHeading).toBeVisible()

    // Click the delete button
    await untitledBlogHeading
      .locator('..')
      .locator('..')
      .getByRole('button', { name: 'Delete' })
      .click()

    // Wait for the delete confirmation dialog
    const deleteDialog = page.getByRole('dialog', { name: 'Delete' })
    await expect(deleteDialog).toBeVisible()

    // Click "Confirm Deletion"
    await page.getByRole('button', { name: 'Confirm Deletion' }).click()

    // Wait for success message
    await expect(page.getByText(/Successfully deleted blog post/)).toBeVisible()
  })

  test('clicking delete shows confirmation and "do not delete" cancels deletion', async ({
    page,
  }) => {
    // Get the initial count of drafts
    const initialBlogCount = await page
      .getByRole('heading', { level: 2 })
      .count()

    // Click delete on our test blog
    const blogHeading = page.getByRole('heading', {
      name: testBlogForNav,
      level: 2,
    })
    await blogHeading
      .locator('..')
      .locator('..')
      .getByRole('button', { name: 'Delete' })
      .click()

    // Verify confirmation dialog appears
    const deleteDialog = page.getByRole('dialog', { name: 'Delete' })
    await expect(deleteDialog).toBeVisible()
    await expect(
      deleteDialog.getByText(new RegExp(testBlogForNav)),
    ).toBeVisible()

    // Click "Do not delete"
    await page.getByRole('button', { name: 'Do not delete' }).click()

    // Verify dialog is closed and blog is still there
    await expect(deleteDialog).not.toBeVisible()
    await expect(
      page.getByRole('heading', { name: testBlogForNav }),
    ).toBeVisible()

    // Verify blog count hasn't changed
    const finalBlogCount = await page.getByRole('heading', { level: 2 }).count()
    expect(finalBlogCount).toBe(initialBlogCount)
  })

  // DELETE TESTS - Run at the end to test deletion and clean up test data
  test('clicking delete and confirming deletes the blog', async ({ page }) => {
    // Get the initial count
    const initialBlogCount = await page
      .getByRole('heading', { level: 2 })
      .count()

    // Delete one of our test blogs
    const blogHeading = page.getByRole('heading', {
      name: testBlogDraft,
      level: 2,
    })
    await expect(blogHeading).toBeVisible()

    // Click the delete button
    await blogHeading
      .locator('..')
      .locator('..')
      .getByRole('button', { name: 'Delete' })
      .click()

    // Verify confirmation dialog appears
    const deleteDialog = page.getByRole('dialog', { name: 'Delete' })
    await expect(deleteDialog).toBeVisible()

    // Verify the blog title appears in the dialog confirmation text
    await expect(
      deleteDialog.getByText(new RegExp(testBlogDraft)),
    ).toBeVisible()

    // Click "Confirm Deletion"
    await page.getByRole('button', { name: 'Confirm Deletion' }).click()

    // Wait for success message
    await expect(page.getByText(/Successfully deleted blog post/)).toBeVisible()

    // Verify blog count decreased
    await page.waitForTimeout(500) // Wait for UI to update
    const finalBlogCount = await page.getByRole('heading', { level: 2 }).count()
    expect(finalBlogCount).toBe(initialBlogCount - 1)

    // Verify the deleted blog title is not in the list anymore
    await expect(
      page.getByRole('heading', { name: testBlogDraft }),
    ).not.toBeVisible()
  })

  test('deleted draft blog disappears from both Drafts and All Articles tabs', async ({
    page,
  }) => {
    // Verify the second test blog is shown in Drafts tab
    await expect(
      page.getByRole('heading', { name: testBlogForNav }),
    ).toBeVisible()

    // Delete the blog
    const blogHeading = page.getByRole('heading', {
      name: testBlogForNav,
      level: 2,
    })
    await blogHeading
      .locator('..')
      .locator('..')
      .getByRole('button', { name: 'Delete' })
      .click()
    await page.getByRole('button', { name: 'Confirm Deletion' }).click()
    await expect(page.getByText(/Successfully deleted blog post/)).toBeVisible()

    // Wait for success alert to disappear
    await page.waitForTimeout(500)

    // Verify it's not in Drafts tab
    await expect(
      page.getByRole('heading', { name: testBlogForNav }),
    ).not.toBeVisible()

    // Switch to All Articles tab
    await page.getByRole('tab', { name: 'All Articles' }).click()

    // Verify it's not in All Articles tab
    await expect(
      page.getByRole('heading', { name: testBlogForNav }),
    ).not.toBeVisible()
  })
})

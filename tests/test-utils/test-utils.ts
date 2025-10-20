import { expect, Page } from '@playwright/test'
import { parse } from 'date-fns'

// Helper function to navigate to blogs page
export async function navigateToBlogsPage(
  page: Page,
  tab: 'Drafts' | 'Published' | 'All Articles' = 'Drafts',
) {
  await page.goto('/')
  await page.getByRole('link', { name: 'Employee Portal' }).click()
  await page.waitForURL(/.*\/employee-portal\/.*/, { timeout: 10000 })
  await page.getByRole('button', { name: 'Settings' }).click()
  await page.getByRole('link', { name: 'Blog Articles' }).click()
  await page.waitForSelector('h1:has-text("My Blogs")', { timeout: 10000 })

  // Wait for images to load
  await page
    .waitForSelector('img[alt]', { state: 'visible', timeout: 5000 })
    .catch(() => {
      console.log('No blog images found or still loading')
    })
  await page.waitForTimeout(1000)

  // Select chosen tab
  await page.getByRole('tab', { name: tab }).click()
  await expect(page.getByRole('tab', { name: tab })).toHaveAttribute(
    'aria-selected',
    'true',
  )
  await expect(page.getByRole('tabpanel', { name: tab })).toBeVisible()
}

export async function fillBlogForm(
  page: Page,
  title: string,
  content: string,
  options?: {
    summary?: string
    keywords?: string[]
  },
) {
  await page.getByRole('textbox', { name: 'Title' }).fill(title)
  const contentEditor = page.getByRole('textbox').nth(1)
  await contentEditor.click()
  await contentEditor.pressSequentially(content, { delay: 10 })

  await page.waitForTimeout(250)

  // Fill SEO fields if provided
  if (options?.summary || options?.keywords) {
    // Expand the SEO accordion if it's collapsed
    const seoAccordion = page.getByRole('button', { name: 'SEO Settings' })
    const isExpanded = await seoAccordion.getAttribute('aria-expanded')
    if (isExpanded === 'false') {
      await seoAccordion.click()
      await page.waitForTimeout(250)
    }

    if (options.summary) {
      await page.getByRole('textbox', { name: 'Summary' }).fill(options.summary)
    }

    if (options.keywords && options.keywords.length > 0) {
      for (const keyword of options.keywords) {
        // Use ID selector which is stable regardless of pills present
        const keywordInput = page.locator('#keywords')
        await keywordInput.fill(keyword)
        await page.waitForTimeout(100)
        await keywordInput.press('Enter')
        await page.waitForTimeout(200)
      }
    }
  }
}

export async function clearBlogForm(
  page: Page,
  options: {
    clearTitle?: boolean
    clearContent?: boolean
    clearSeoFields?: boolean
  } = {
    clearTitle: true,
    clearContent: true,
    clearSeoFields: false,
  },
) {
  if (options.clearTitle) {
    await page.getByRole('textbox', { name: 'Title' }).fill('')
  }

  if (options.clearContent) {
    const contentEditor = page.getByRole('textbox').nth(1)
    await contentEditor.click()
    await page.waitForTimeout(250)
    await page.keyboard.press('Control+A')
    await page.waitForTimeout(250)
    await page.keyboard.press('Delete')
    await page.waitForTimeout(250)
  }

  if (options.clearSeoFields) {
    // Expand the SEO accordion if it's collapsed
    const seoAccordion = page.getByRole('button', { name: 'SEO Settings' })
    const isExpanded = await seoAccordion.getAttribute('aria-expanded')
    if (isExpanded === 'false') {
      await seoAccordion.click()
      await page.waitForTimeout(250)
    }

    // Clear summary
    await page.getByRole('textbox', { name: 'Summary' }).fill('')

    // Clear all keywords by clicking remove button on each pill
    const removePillButtons = page.locator(
      'button[aria-label*="Remove"], button:has-text("×")',
    )
    const count = await removePillButtons.count()
    for (let i = 0; i < count; i++) {
      // Always click the first button since the list updates after each removal
      await removePillButtons.first().click()
      await page.waitForTimeout(100)
    }
  }
}

export async function performBlogFormAction(
  page: Page,
  action: 'save' | 'publish' | 'convertToDraft' = 'save',
) {
  let actionButtonName = ''
  switch (action) {
    case 'save':
      actionButtonName = 'Save Changes'
      break
    case 'publish':
      actionButtonName = 'Publish'
      break
    case 'convertToDraft':
      actionButtonName = 'Convert to draft'
      break
  }

  await page
    .getByRole('button', {
      name: actionButtonName,
    })
    .click()
  await expect(page.getByText(/Blog updated/)).toBeVisible()
  await page.waitForTimeout(1000) // Wait for save to complete

  if (action === 'publish') {
    await expect(
      page.getByRole('button', { name: 'Convert to draft' }),
    ).toBeVisible()
  }

  if (action === 'convertToDraft') {
    await expect(page.getByRole('button', { name: 'Publish' })).toBeVisible()
  }
}

interface ICreateBlogWithContent {
  page: Page
  title: string
  content: string
  shouldPublish?: boolean
  seoSettings?: {
    summary?: string
    keywords?: string[]
  }
  coverImagePath?: string
}

export async function createBlogWithContent({
  page,
  title,
  content,
  shouldPublish = false,
  seoSettings,
  coverImagePath,
}: ICreateBlogWithContent): Promise<string> {
  await page.getByRole('button', { name: 'Create Article' }).click()
  await page.waitForURL(/.*\/blogs\/[a-zA-Z0-9]+$/)

  // Store the full URL path for later navigation
  const fullUrl = page.url()

  // Fill form and save
  await fillBlogForm(page, title, content, seoSettings ?? undefined)
  await performBlogFormAction(page, 'save')

  if (coverImagePath) {
    await addCoverImageToBlog(page, coverImagePath)
  }

  if (shouldPublish) {
    await performBlogFormAction(page, 'publish')
  }

  return fullUrl
}

export async function verifyDateTimeUpdated(dateTime: string) {
  const formatString = "MMMM dd, yyyy 'at' hh:mm aa"
  const parsedDate = parse(dateTime, formatString, new Date())

  expect(parsedDate.getTime()).not.toBeNaN()
  expect(parsedDate.getTime()).toBeLessThanOrEqual(Date.now())
}

export async function addCoverImageToBlog(page: Page, imagePath: string) {
  await expect(
    page.getByRole('button', { name: 'Add cover image' }),
  ).toBeVisible()

  const fileInput = page.locator('[role="presentation"] input[type="file"]')
  await fileInput.setInputFiles(imagePath)

  // Wait for image to be processed and displayed
  await page.waitForTimeout(1000)

  // Verify buttons changed to "Change" and "Remove"
  await expect(
    page.getByRole('button', { name: 'Change cover image' }),
  ).toBeVisible()
  await expect(
    page.getByRole('button', { name: 'Remove cover image' }),
  ).toBeVisible()
}

export async function removeCoverImageFromBlog(page: Page) {
  await page.getByRole('button', { name: 'Remove cover image' }).click()
  await expect(
    page.getByRole('button', { name: 'Add cover image' }),
  ).toBeVisible()
}

export async function updateCoverImageOfBlog(page: Page, imagePath: string) {
  // Verify current cover image controls
  await expect(
    page.getByRole('button', { name: 'Change cover image' }),
  ).toBeVisible()
  await expect(
    page.getByRole('button', { name: 'Remove cover image' }),
  ).toBeVisible()

  // Upload a different image
  const fileInput = page.locator('[role="presentation"] input[type="file"]')
  await fileInput.setInputFiles(imagePath)

  // Wait for image to be processed and displayed
  await page.waitForTimeout(500)

  // Verify buttons still show "Change" and "Remove"
  await expect(
    page.getByRole('button', { name: 'Change cover image' }),
  ).toBeVisible()
  await expect(
    page.getByRole('button', { name: 'Remove cover image' }),
  ).toBeVisible()
}

export async function verifyCoverImageDisplayedInPreview(page: Page) {
  const coverImageWrapper = page.locator('article > div[class*="CoverImage"]')
  await expect(coverImageWrapper).toBeVisible()
  const coverImage = coverImageWrapper.locator('img')
  await expect(coverImage).toBeVisible()
}

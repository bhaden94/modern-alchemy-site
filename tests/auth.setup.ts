import { test as setup, expect } from '@playwright/test'

const authFile = 'playwright/.auth/user.json'

setup('authenticate with Vercel and Google', async ({ page }) => {
  console.log('Starting authentication process...')

  // Step 1: Navigate to the preview site - will trigger Vercel auth
  console.log('Step 1: Navigating to preview URL...')
  await page.goto(
    'https://modern-alchemy-site-git-preview-brady-hadens-projects.vercel.app',
  )

  // Step 2: Handle Vercel authentication with GitHub
  console.log('Step 2: Checking for Vercel authentication...')
  console.log('⏳ Please sign in with GitHub when prompted...')

  // Wait for Vercel auth to complete and return to the site
  await page.waitForURL(/modern-alchemy-site-git-preview.*/, {
    timeout: 300000,
  })
  console.log('✅ Vercel authentication complete - back on site')

  // Step 3: Click Employee Portal link to trigger Google auth
  console.log('Step 3: Clicking Employee Portal link...')
  await page.getByRole('link', { name: 'Employee Portal' }).click()
  console.log('Clicked Employee Portal link')

  // Step 4: Handle Google authentication (may include 2FA)
  console.log('Step 4: Checking for Google authentication...')

  // Check if we're on Google auth or unauthorized page
  await page.waitForTimeout(2000) // Brief wait for redirect
  const currentUrl = page.url()

  if (
    currentUrl.includes('accounts.google.com') ||
    currentUrl.includes('unauthorized')
  ) {
    console.log('⏳ Please sign in with Google (including 2FA if prompted)...')

    // Wait for successful authentication to employee portal
    await page.waitForURL(/.*\/employee-portal\/[^/]+\/.*/, { timeout: 300000 })
    console.log('✅ Google authentication complete')
  } else if (currentUrl.includes('employee-portal')) {
    console.log('✅ Already authenticated to employee portal')
  } else {
    console.log(`⚠️  Unexpected URL: ${currentUrl}`)
    console.log('⏳ Waiting for navigation to employee portal...')
    await page.waitForURL(/.*\/employee-portal\/[^/]+\/.*/, { timeout: 300000 })
  }

  // Step 5: Verify we're fully authenticated by checking for expected content
  console.log('Step 5: Verifying authentication...')
  await expect(page.getByRole('button', { name: 'Settings' })).toBeVisible({
    timeout: 30000,
  })
  console.log('✅ Settings button visible - authentication verified')

  // Step 6: Save the authenticated state for future test runs
  console.log('Step 6: Saving authentication state...')
  await page.context().storageState({ path: authFile })
  console.log(`✅ Authentication state saved to ${authFile}`)

  console.log('\n🎉 Authentication setup complete! You can now run your tests.')
})

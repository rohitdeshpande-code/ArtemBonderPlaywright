
import {test, expect} from '@playwright/test'

test.beforeEach(async({page}, testInfo) => {

    await page.goto('https://playground.bondaracademy.com/')
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Dialog').click()
    testInfo.setTimeout(testInfo.timeout + 3000)

})


test('Auto waiting', async({page}) => {

    const dailogWithDelayForm = page.locator('nb-card', {hasText: "Open Dialog With Delay"})
    await dailogWithDelayForm.getByRole("button", {name: "Open with delay 3 seconds"}).click()

    const dialogContainer = page.locator('nb-dialog-container')
    //await dialogContainer.getByRole("button", {name: "OK"}).click()

    //const dailogHeaderText = await dialogContainer.locator('nb-card-header').textContent()
    const dailogHeaderText = await dialogContainer.locator('nb-card-header').allTextContents()
    expect(dailogHeaderText).toEqual('Friendly reminder')

    
})

test('Alternative waits', async({page}) => {

    const dailogWithDelayForm = page.locator('nb-card', {hasText: "Open Dialog With Delay"})
    await dailogWithDelayForm.getByRole("button", {name: "Open with delay 3 seconds"}).click()
    const dialogContainer = page.locator('nb-dialog-container')

    //Wait for the element
    //await dialogContainer.waitFor()

    //Wait for selector 
    //await page.waitForSelector('nb-dialog-container')

    //Wait for api response
    //await page.waitForResponse("**/delay/*")

    //Wait for load state (NOT RECOMMENDED)
    //await page.waitForLoadState('networkidle')


    //Hard coded wait (NEVER EVER USE)
    //await page.waitForTimeout(3500)


    //const dailogHeaderText = await dialogContainer.locator('nb-card-header').allTextContents()
    //expect(dailogHeaderText).toContain('Friendly reminder')

    await expect(dialogContainer.locator('nb-card-header')).toHaveText('Friendly reminder', {timeout: 8000})

    
})

test('Timeouts', async({page}) => {

    //test.setTimeout(120000) //Test timeout
    test.slow()
    const dailogWithDelayForm = page.locator('nb-card', {hasText: "Open Dialog With Delay"})
    await dailogWithDelayForm.getByRole("button", {name: "Open with delay 3 seconds"}).click()
    const dialogContainer = page.locator('nb-dialog-container')

    await dialogContainer.getByRole("button", {name: "OK"}).click({timeout:4000})
})
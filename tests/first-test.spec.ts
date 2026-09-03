
import {test, expect} from '@playwright/test'

// test.beforeEach(async({page}) => {
//         await page.goto('https://playground.bondaracademy.com/')
//     })


// test.describe('suite 1', () => {

//     test.beforeEach(async({page}) => {
//         await page.getByRole('link', {name: 'Forms'}).click()
//     })


//     test('This is a first test', async ({page}) => {
//         await page.getByRole('link', {name: 'Form Layouts'}).click()
//     })

//     test('This is a first test to datepicker', async ({page}) => {
//         await page.getByRole('link', {name: 'Datepicker'}).click()
//     })
// })

// test.describe('suite 2', () => {

//     test.beforeEach(async({page}) => {
//         await page.getByRole('link', {name: 'Charts'}).click()
//     })


//     test('This is a first test to Echarts', async ({page}) => {
//         await page.getByRole('link', {name: 'Echarts'}).click()
//     })
// })

test.beforeEach(async({page}) => {

    await page.goto('https://playground.bondaracademy.com/')
    await page.getByRole('link', {name: 'Forms'}).click()
    await page.getByRole('link', {name: 'Form Layouts'}).click()

})

test('locator syntax rules', async({page}) => {

    //Fing by tag
    page.locator("input")

    //Find by id
    page.locator("#inputEmail1")

    //Find by class value
    page.locator(".shape-rectangle")

    //Find by any attribute 
    page.locator("[placeholder='Email']")

    //Find by full class value
    page.locator('class="input-full-width size-medium status-basic shape-rectangle nb-transition"')

    //Find by several selectors
    page.locator("input[placeholder='Email'] [nbinput]")

    //Find by xpath (Not recommended by paywright)
    page.locator('//*[@id="inputEmail1"]')

    //Find by partial text match
    page.locator(':text("Using)')

    //Find by exact text match 
    page.locator(':text-is("Using the Grid")')


})

test('User-visible locators', async({page}) => {

    await page.getByRole('button', {name: 'Sign in'}).first().click()
    await page.getByRole('textbox', {name: 'Email'}).first().fill('test@test.com')

    await page.getByLabel('Email').first().fill('test@test.com')

    await page.getByPlaceholder('Jane Doe').fill('QA TESTER')

    await page.getByText('Submit').first().click()

    await page.getByTestId('inputEmail1').fill('test@test.com')

    await page.getByTitle('IoT Dashboard').click()

})

test('Locating child elements', async({page}) => {

    await page.locator('nb-card nb-radio-group').getByText('Option 1', { exact: true }).click()
    //await page.getByText('Option 1', { exact: true }).click();
    await page.locator('nb-card nb-radio-group').getByText('Option 2', { exact: true }).click()

    await page.locator('nb-card').getByRole('button', {name: 'Sign in'}).first().click()

    await page.locator('nb-card').nth(3).getByRole('button').click()
    await page.pause()
})

test('Locating parent elements', async({page}) => {

    await page.locator('nb-card', {hasText: 'Using the Grid'}).getByRole("button").click()
    await page.locator('nb-card', {has: page.locator('#inputEmail1')}).getByRole("button").click()

    await page.locator('nb-card').filter({hasText: 'Using the Grid'}).getByRole("button").click()

    await page.locator('nb-card')
        .filter({has: page.locator('.custom-checkbox')})
        .filter({hasText: 'Sign in'})
        .getByLabel('Email').fill('test@test.com')

    await page.getByText('Using the Grid').locator('..').getByRole("button").click()
})

test('Reusing locators', async({page}) => {

    const basicFormSection = page.locator('nb-card', {hasText: 'Basic form'})
    const emailInputField = basicFormSection.getByLabel('Email')

    await emailInputField.fill('test@test.com')
    await basicFormSection.getByLabel('Password').fill('Playwright')
    await basicFormSection.locator('.custom-checkbox').click()
    await basicFormSection.getByRole("button").click()

    await expect(emailInputField).toHaveValue('test@test.com')
})

test('Extracting values', async ({page}) => {

    //extracting text 
    const basicFormSection = page.locator('nb-card', {hasText: 'Basic form'})
    const submitButtonText = await basicFormSection.getByRole("button", {name: "Submit"}).textContent()
    console.log(submitButtonText)
    expect(submitButtonText).toEqual('Submit')

    //extrating multiple text values
    const allRadioButtonValues = await page.locator('nb-radio').allTextContents()
    //console.log(allRadioButtonValues)
    expect(allRadioButtonValues).toContain('Option 1')

    //extract input field values
    const emailField = basicFormSection.getByRole("textbox", {name: "Email"})
    await emailField.fill('test@test.com')
    const emailFieldValue = await emailField.inputValue()
    console.log(emailFieldValue)

    //extract attribute value 
    const emailPlaceholder = await emailField.getAttribute("placeholder")
    console.log(emailPlaceholder)
})


test('Assertions', async({page}) => {
    const basicFormSectionButton = page.locator('nb-card', {hasText: 'Basic form'}).getByRole("button", {name: "Submit"})

    //Generic assertions 
    const value = 5
    expect(value).toEqual(5)

    const submitButtonText = await basicFormSectionButton.textContent()
    expect(submitButtonText).toEqual('Submit')

    //Locator assertions - has built in auto mechanism of 5 seconds 
    await expect(basicFormSectionButton).toHaveText('Submit')

    //Soft Assertion - Allow your execution and keep going if assertion fails 
    await expect.soft(basicFormSectionButton).toHaveText('Submit')
    await basicFormSectionButton.click()

})

test('Generated test', async({page}) => {

    await page.getByRole('textbox', { name: 'Email address' }).fill('test@test.com')
})



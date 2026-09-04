
import {test, expect} from '@playwright/test'

test.beforeEach(async({page}) => {
    await page.goto('https://playground.bondaracademy.com/')
})

test.describe('Form layout page', () =>{

    test.beforeEach(async({page}) => {
        await page.getByRole('link', {name: 'Forms'}).click()
        await page.getByRole('link', {name: 'Form Layouts'}).click()
    })

    test('Input fields', async({page}) => {

        const usingTheGridEmailInput = page.locator('nb-card').filter({hasText: 'Using the Grid'}).getByRole("textbox", {name: "Email"})
        await usingTheGridEmailInput.fill("test@test.com")
        await usingTheGridEmailInput.clear()
        await usingTheGridEmailInput.pressSequentially("test2@test.com")

        //extract the value 
        const inputvalue = await usingTheGridEmailInput.inputValue()
        console.log(inputvalue)

        //assertions
        await expect(usingTheGridEmailInput).toHaveValue('test2@test.com')
        await expect(usingTheGridEmailInput).toHaveValue(/test.com/)
    })

    test('radio buttons', async({page}) => {

        const usingTheGridForm = page.locator('nb-card', {hasText: 'Using the Grid'})

        await usingTheGridForm.getByLabel("Option 1").check({force:true})
        await usingTheGridForm.getByRole("radio", {name: "Option 2"}).check({force:true})

        const bool = usingTheGridForm.getByRole("radio", {name: "Option 2"}).isChecked()
        expect(bool).toBeTruthy()

        await expect(usingTheGridForm.getByRole("radio", {name: "Option 1"})).not.toBeChecked()

    })


    test('checkboxes', async({page}) => {
        
        await page.getByRole('link', {name: 'Modal & Overlays'}).click()
        await page.getByRole('link', {name: 'Toastr'}).click()

        await page.getByRole("checkbox", {name: "Hide on click"}).uncheck({force:true})

        const allBoxes = page.getByRole("checkbox")
        for(const box of await allBoxes.all()) {
            await box.uncheck({force:true})
            await expect(box).not.toBeChecked()
        }

        await page.pause()
    })

    test('List and Drop downs', async({page}) => {
        
        await page.getByRole('link', {name: 'Modal & Overlays'}).click()
        await page.getByRole('link', {name: 'Toastr'}).click()

        //standard drop down 
        await page.locator('.form-group', {hasText: "Toast type:"}).getByRole("combobox").selectOption("info")
        await expect(page.getByRole("combobox")).toHaveValue("info")

        //custom drop down 
        await page.locator(".form-group", {hasText: "Position:"}).locator('nb-select').click()
        //option1
        //await page.getByRole("list").getByText("top-right").click()
        //option2
        await page.locator("nb-option", {hasText: "top-end"}).click()
        await expect(page.locator(".form-group", {hasText: "Position:"}).locator('nb-select')).toHaveText("top-end")

        //Looping through the list 
        const positionDropDown = page.locator(".form-group", {hasText: "Position:"}).locator('nb-select')
        await positionDropDown.click()
        const allDropDownOptions = await page.locator("nb-option").allTextContents()
        for(const allOptions of allDropDownOptions) {

            await page.locator("nb-option", {hasText: allOptions}).click()
            await expect(page.locator(".form-group", {hasText: "Position:"}).locator('nb-select')).toHaveText(allOptions)
            await positionDropDown.click()
        }

    })

    test('tooltips', async({page}) => {

        await page.getByRole('link', {name: 'Modal & Overlays'}).click()
        await page.getByRole('link', {name: 'Tooltip'}).click()

        await page.getByRole("button", {name: "Top"}).hover()
        await expect(page.getByRole("tooltip")).toHaveText("This is a tooltip")

    })

    test('dialog box', async({page}) => {

        await page.getByRole('link', {name: 'Tables & Data'}).click()
        await page.getByRole('link', {name: 'Smart Table'}).click()

        page.on('dialog', dialog =>{
            expect(dialog.message()).toEqual("Are you sure you want to delete?")
            dialog.accept()
        })
        await page.locator('tr', {hasText: "mdo@gmail.com"}).locator(".nb-trash").click()
        await expect(page.locator('tr', {hasText: "mdo@gmail.com"}).locator(".nb-trash")).not.toBeVisible()

    })

    test('web tables', async({page}) => {

        await page.getByRole('link', {name: 'Tables & Data'}).click()
        await page.getByRole('link', {name: 'Smart Table'}).click()

        const tableRowByEmail = page.getByRole("row", {name: "twitter@outlook.com"})

        //1 how to select row by any visible text
        await tableRowByEmail.locator(".nb-edit").click()
        await tableRowByEmail.getByPlaceholder("Age").fill("35")
        await tableRowByEmail.locator(".nb-checkmark").click()
        await expect(tableRowByEmail.locator('td').last()).toHaveText("35")

        //2 get row by a specific column value
        const tableRowById = page.getByRole("row").filter({has: page.getByRole("cell").nth(1).getByText("10")})
        await tableRowById.locator(".nb-edit").click()
        await page.locator('tbody').getByPlaceholder("E-mail").fill("test@test.com")
        await page.locator('tbody').locator(".nb-checkmark").click()
        await expect(tableRowById.locator('td').nth(5)).toHaveText("test@test.com")

        //3 loop through table rows 
        const ages = ["20", "30", "40", "200"]

        for(const age of ages) {
            await page.getByPlaceholder("Age").fill(age)

            if(age === "200") {
                await expect(page.locator('tbody')).toContainText("No data found")
            } else {

                await expect(page.locator('tbody tr').first().locator('td').last()).toHaveText(age)
                const allTableRows = await page.locator('tbody tr').all()
                for(const row of allTableRows) {
                    await expect(row.locator('td').last()).toHaveText(age)

                }

            }
        }

    })

    test('date picker', async({page}) => {

        await page.getByRole('link', {name: 'Forms'}).click()
        await page.getByRole('link', {name: 'Datepicker'}).click()

        const calendarInputField = page.getByPlaceholder("Form Picker")
        await calendarInputField.click()

        const date = new Date()
        date.setDate(date.getDate()+10)
        const expectedDay = date.getDate().toString()
        const expectedMonth = date.toLocaleDateString('en-Us',{month:'short'})
        const expectedMonthLong = date.toLocaleDateString('en-Us', {month: 'long'})
        const expectedYear = date.getFullYear().toString()
        const expectedDate = `${expectedMonth} ${expectedDay}, ${expectedYear}`

    
        let currentMonthAndYear = await page.locator("nb-calendar-view-mode").textContent()
        let expectedMonthAndYear = `${expectedMonthLong} ${expectedYear}`
        if(!currentMonthAndYear?.includes(expectedMonthAndYear)) {
            await page.locator(".next-month").click()
            currentMonthAndYear = await page.locator("nb-calendar-view-mode").textContent()
        }



        await page.locator(".day-cell:not(.bounding-month)").getByText(expectedDay, {exact: true}).click()
        await expect(calendarInputField).toHaveValue(expectedDate)

    })

    test('sliders', async({page}) => {

        //1 setting the attribute vales 
        // const tempGauge = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle')
        // await tempGauge.evaluate( element => {
        //     element.setAttribute("cy", "232.630")
        //     element.setAttribute("cy", "232.630")
        // })

        // await tempGauge.click()

        //2 Mouse movement 
        const tempBox = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger')
        await tempBox.scrollIntoViewIfNeeded()

        const box = await tempBox.boundingBox()
        const x = box?.x + box?.width / 2
        const y = box?.x + box?.height / 2

        await page.mouse.move(x,y)
        await page.mouse.down()
        await page.mouse.move(x+100, y)
        await page.mouse.move(x+100, y+100)
        await page.mouse.up()

        await expect(tempBox).toContainText("30")

    })

    test('iFrames', async({page}) => {

        await page.getByRole('link', {name: 'Modal & Overlays'}).click()
        await page.getByRole('link', {name: 'Dialog'}).click()

        const iframe =page.frameLocator('[data-cy="esc-close-iframe"]')
        await iframe.getByRole("button", {name: "Open Dialog with esc close"}).click()

    })

    test('Drag and drop', async({page}) => {

        await page.getByRole('link', {name: 'Extra Components'}).click()
        await page.getByRole('link', {name: 'Drag & Drop'}).click()

        //1
        await page.getByText("Get groceries").dragTo(page.locator("#drop-list"))

        //2 
        await page.getByText("Feed the dog").hover()
        await page.mouse.down()
        await page.locator("#drop-list").hover()
        await page.mouse.up()

        
    })
})
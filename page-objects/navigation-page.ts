
import {type Page, type Locator} from '@playwright/test'

export class NavigationPage {

    page: Page
    smartTableMenu: Locator
    toasterMenu: Locator
    tooltipMenu: Locator
    datePickerMenu: Locator
    formLayoutMenu: Locator

    constructor(page: Page) {
        this.page =page
        this.smartTableMenu = page.getByRole('link', {name: 'Smart Table'})
        this.toasterMenu = page.getByRole('link', {name: 'Toastr'})
        this.tooltipMenu = page.getByRole('link', {name: 'Tooltip'})
        this.datePickerMenu = page.getByRole('link', {name: 'Datepicker'})
        this.formLayoutMenu =page.getByRole('link', {name: 'Form Layouts'})

    }

    async formLayOutPage() {

        await this.selectGroupMenuItem('Forms')
        await this.formLayoutMenu.click()

    }

    async datePickerPage() {

        await this.selectGroupMenuItem('Forms')
        await this.page.waitForTimeout(1000)
        await this.datePickerMenu.click()
    }

    async toasterPage() {

        await this.selectGroupMenuItem('Modal & Overlays')
        await this.toasterMenu.click()

    }

    async tooltipPage() {

        await this.selectGroupMenuItem('Modal & Overlays')
        await this.tooltipMenu.click()

    }

    async smartTablePage() {

        await this.selectGroupMenuItem('Tables & Data')
        await this.smartTableMenu.click()
    }

    private async selectGroupMenuItem(groupMenuTitle: string) {
        const groupMenuItem = this.page.getByTitle(groupMenuTitle)
        const expandedState = await groupMenuItem.getAttribute('aria-expanded')
        if(expandedState === 'false') {
            await groupMenuItem.click()
        }
    }



}
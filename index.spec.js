import dotenv from '@dword-design/dotenv-json-extended'
import tester from '@dword-design/tester'
import testerPluginPuppeteer from '@dword-design/tester-plugin-puppeteer'
import execa from 'execa'
import P from 'path'

dotenv.config()

export default tester(
  {
    async works() {
      await this.page.goto('https://werstreamt.es')

      /* const acceptCookiesButton = await this.page.waitForSelector(
        '.cmpboxbtnyes'
      )
      await acceptCookiesButton.click() */
      const loginLink = await this.page.waitForSelector('li.login a')
      await loginLink.click()
      await this.page.waitForNavigation()
      await this.page.type('input[type=email]', process.env.USER_EMAIL)
      await this.page.type('input[type=password]', process.env.USER_PASSWORD)
      await this.page.click('input[name=action_dologin]')

      const watchlistLink = await this.page.waitForXPath(
        "//a[text()='Watchlist']"
      )

      const loginMenu = await this.page.waitForSelector('li.login')
      await loginMenu.hover()

      const listsDropdown = await loginMenu.$('.has-dropdown')
      await listsDropdown.hover()
      await watchlistLink.click()
      await this.page.waitForNavigation()

      const editButton = await this.page.waitForSelector(
        '.werstreamtes-list-links-edit'
      )
      expect(await this.page.url()).toEqual(
        'https://www.werstreamt.es/filme-serien/liste-604612/'
      )
      expect(await this.page.screenshot()).toMatchImageSnapshot(this)
      await editButton.click()
      await this.page.waitForNavigation()
      expect(await this.page.url()).toEqual(
        'https://www.werstreamt.es/listen/bearbeiten/604612'
      )
      expect(await this.page.screenshot()).toMatchImageSnapshot(this)
      expect(
        await this.page.$eval('.werstreamtes-list-links-view', el => el.href)
      ).toEqual('https://www.werstreamt.es/filme-serien/liste-604612')
    },
  },
  [
    { before: () => execa.command('base prepublishOnly') },
    testerPluginPuppeteer({
      launchOptions: {
        args: [
          `--load-extension=${P.join(process.cwd(), 'dist')}`,
          `--disable-extensions-except=${P.join(process.cwd(), 'dist')}`,
        ],
        headless: false,
      },
    }),
  ]
)

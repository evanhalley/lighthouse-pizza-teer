'use strict';

const puppeteer = require('puppeteer');
const lighthouse = require('lighthouse');
const config = require('lighthouse/lighthouse-core/config/lr-desktop-config.js');
const reportGenerator = require('lighthouse/lighthouse-core/report/report-generator');

require('dotenv').config();

const PIZZA_PROFILE_URL = 'https://www.dominos.com/en/pages/customer/#!/customer/profile/';

(async() => {
    let { browser, page } = await navigateToPizzaProfile()
    
    console.log('Running lighthouse...');
    const { report } = await lighthouse(page.url(), {
        port: (new URL(browser.wsEndpoint())).port,
        output: 'json',
        logLevel: 'info',
        disableDeviceEmulation: true,
        chromeFlags: ['--disable-mobile-emulation']
    }, config);
    const json = reportGenerator.generateReport(report.lhr, 'json');
    console.log(`Lighthouse scores: ${json}`);

    await page.close();
    await browser.close();
})();

async function navigateToPizzaProfile() {
    const browser = await puppeteer.launch({ headless: false });

    console.log('Navigating to Pizza Profile...');
    const page = (await browser.pages())[0];
    await page.goto(PIZZA_PROFILE_URL, { waitUntil: 'networkidle0' });

    console.log('Starting login...');
    await Promise.all([
        await page.click('#js-rewards > div > section.section--full.section--blue > div > div.profile-links > p:nth-child(2) > button'),
        await page.waitForSelector('#Email')
    ]);

    console.log('Entering username and password...');
    await page.type('#Email', process.env.DOMINOS_USERNAME);
    await page.type('#Password', process.env.DOMINOS_PASSWORD);

    console.log('Logging in....');
    await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle0' }),
        page.click('#pizzaProfileLoginOverlay > form > div.grid > div > div.js-anonymous > div:nth-child(3) > div.grid.loginButtonsContainer > div:nth-child(2) > button'),
    ]);

    console.log('Pizza profile unlocked!');
    return { browser: browser, page: page };
}
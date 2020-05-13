'use strict';

const fs = require('fs');
const puppeteer = require('puppeteer');
const lighthouse = require('lighthouse');
const config = require('lighthouse/lighthouse-core/config/lr-desktop-config.js');
const reportGenerator = require('lighthouse/lighthouse-core/report/report-generator');

require('dotenv').config();

const PIZZA_PROFILE_URL = 'https://salviospizza.hungerrush.com/Account/Manage';

(async() => {
    let browser = null;
    let page = null;

    try {
        browser = await navigateToPizzaProfile();
        page = (await browser.pages())[0];
        console.log(browser.wsEndpoint());
        console.log('Running lighthouse...');
        const report = await lighthouse(page.url(), {
            port: (new URL(browser.wsEndpoint())).port,
            output: 'json',
            logLevel: 'info',
            disableDeviceEmulation: true,
            chromeFlags: ['--disable-mobile-emulation']
        }, config);
        const json = reportGenerator.generateReport(report.lhr, 'json');
        const html = reportGenerator.generateReport(report.lhr, 'html');
        console.log(`Lighthouse scores: ${report.lhr.score}`);

        console.log('Writing results...');
        fs.writeFileSync('report.json', json);
        fs.writeFileSync('report.html', html);
        console.log('Done!');
    } catch (error) {
        console.error('Error!', error);
    } finally {
        await page.close();
        await browser.close();
    }
})();

async function navigateToPizzaProfile() {
    const browser = await puppeteer.launch({ headless: true });

    console.log('Navigating to Pizza Profile...');
    const page = (await browser.pages())[0];
    await page.goto(PIZZA_PROFILE_URL, { waitUntil: 'networkidle0' });

    console.log('Starting login, entering username and password...');
    await page.type('#UserName', process.env.USERNAME);
    await page.type('#Password', process.env.PASSWORD);

    console.log('Logging in....');
    await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle0' }),
        page.click('#btnLogin'),
    ]);

    console.log('Pizza profile unlocked!');
    return browser;
}
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth')();
const hcaptcha = require('./hcap_module.js');

puppeteer.use(StealthPlugin);

puppeteer.launch({ 
    headless: false,
    //executablePath: '/usr/bin/chromium-browser', // Custom path of Chromium
    defaultViewport: null,
    ignoreHTTPSErrors: true,
    args: [
		    '--disable-setuid-sandbox',
        '--no-sandbox',
        '--new-window',
        '--window-position=0,0',
        '--window-size=1600,900',
        '--disable-features=IsolateOrigins,site-per-process',
        '--ignore-certificate-errors',
    ],
    devtools: false,
}).then(async browser => {
	    const pages = await browser.pages();
	    const page = pages[0];

	    await page.goto('https://accounts.hcaptcha.com/demo', {
	        "waitUntil" : "networkidle0",
	        timeout: 70000
	    });

	    await hcaptcha.resolve(page);
});

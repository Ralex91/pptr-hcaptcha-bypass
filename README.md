<p>
    <img width="80" align="left" src="https://cdn.worldvectorlogo.com/logos/hcaptcha-2-2.svg">
    <h1>Hcaptcha Bypass Puppeteer 🤖</h1>
</p>

<h3>⚠ WARNING: this script does not currently work with new versions of Hcaptcha. The script is open source so you can use it to improve it, for example by putting another AI model :^)</h3>

<br>

<h2>⚙ How it works</h2>
<h3>The script uses Tensorflow and the Cocossd model to recognize the elements in the captcha images and then select them in the captcha</h3>

<img width="40" align="left" src="https://raw.githubusercontent.com/devicons/devicon/master/icons/tensorflow/tensorflow-original.svg">
<h3> <a href="https://github.com/tensorflow/tfjs">Tensorflow JS</a> </h3>


<img width="40" align="left" src="https://img.icons8.com/color-glass/512/experiment-trial.png">
<h3> <a href="https://github.com/tensorflow/tfjs-models/tree/master/coco-ssd">CocoSSD</a> </h3>

<h4>⚠ CocoSSD AI model does not currently work with new versions of Hcaptcha, make your own one finds another ⚠</h4>
<br>

<h2>🛠 Installation</h2>

<h3>To make your browser less detectable use puppeteer-extra and puppeteer-extra-plugin-stealth in addition to the classic puppeteer </h3>

- [puppeteer-extra](https://www.npmjs.com/package/puppeteer-extra)
- [puppeteer-extra-plugin-stealth](https://www.npmjs.com/package/puppeteer-extra-plugin-stealth)

Commands : 

```bash
npm install puppeteer puppeteer-extra
npm i puppeteer-extra-plugin-stealth
```

-----

<h3>📦 Dependencies</h3>

🔗 NPM link :
 - [@tensorflow/tfjs-node](https://www.npmjs.com/package/@tensorflow/tfjs-node)
 - [@tensorflow-models/coco-ssd](https://www.npmjs.com/package/@tensorflow-models/coco-ssd)
 - [unidecode](https://www.npmjs.com/package/unidecode)
 - [phin](https://www.npmjs.com/package/phin)

Commands : 
```bash
npm i @tensorflow/tfjs-node
npm i @tensorflow-models/coco-ssd
npm i unidecode
npm i phin
```
<br>


<h2>📚 Exemple</h2>

```js
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
        '--disable-features=IsolateOrigins,site-per-process', // Important argument to get the contents of the captcha iframe
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
```

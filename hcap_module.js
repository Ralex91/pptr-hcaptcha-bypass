const p = require('phin');
const unidecode = require('unidecode');
const cocoSsd = require('@tensorflow-models/coco-ssd');
const tf = require('@tensorflow/tfjs-node');

const magikCoco = async (imgURL) => {
    try {
        const buffer = await p({
    	   'url': imgURL,
        })
        
        const blob = buffer.body
        const model = await cocoSsd.load();
        const predictions = await model.detect(tf.node.decodeImage(blob));
    	
        return predictions;
    } catch {
        return null;
    }
}
        
const getPredictions = async (reqImg, images, keyword) => {
    let answers = [];
    let threads = [];

    for (const task of reqImg) {
        threads.push(magikCoco(task));
    }

    try {
        await Promise.all(threads).then((results, i) => {

            results.forEach( async (res, index) => {
                let [data] = res;
                if (data !== undefined && data.score > 0.5 && data.class.toLowerCase() == keyword) {
                    answers.push(index);
                }
            });

        });
    } catch (err) {
        console.log(err);
    }
    return answers;
};

const imgGetURL = async (page, images) => {
    let tab = [];

    for (let image of images) {
        let img_background = await page.evaluate(image => image.style['background-image'], image);
        let matches = img_background.match(/^url\("(.*)"\)$/);
                    
        if (matches.length > 0) {
            let url = matches[matches.length - 1];

            if (url) {
                tab.push(url);
            }
        }
    }

    return tab;
}

const resolve = async (page) => {
    const iframeAll = page.frames();
        
    let iframeCheckbox, iframeChallenge;

    iframeAll.forEach((iframe) => {
        if (iframe.url().startsWith('https://newassets.hcaptcha.com/captcha/') ) {

            if (iframe.url().includes('hcaptcha.html#frame=checkbox')) {
                iframeCheckbox = iframe;
            }
            
            if (iframe.url().includes('hcaptcha.html#frame=challenge')) {
                iframeChallenge = iframe;
            }
        }
    });
        
    await iframeCheckbox.hover('#checkbox');
    await iframeCheckbox.click('#checkbox');
              
    await page.waitForTimeout(5000);

    const start = async () => {
        if (await iframeChallenge.$('.prompt-text') === null)
            return console.log('[+] Captcha Solved !');
        
        const promptElement = await iframeChallenge.$('.prompt-text');
        const promptText = await iframeChallenge.evaluate(promptElement => promptElement.textContent, promptElement);
        const promptParsed = promptText.split(' ');
        const promptWord = promptParsed.slice(-1).toString();

        let promptWordClean = unidecode(promptWord);
        
        if (promptWordClean == 'dzeaplane');
    	    promptWordClean = 'seaplane';
    		
        if (promptWordClean == 'trusk');
    	    promptWordClean = 'truck';

        if (promptWordClean == 'sar');
            promptWordClean = 'car';

        //console.log(promptWordClean)
                
        let imgElements = await iframeChallenge.$$('.task-grid .task-image .image');
                    
        let imgURL = await imgGetURL(iframeChallenge, imgElements);  
        let imgValid = await getPredictions(imgURL, imgElements, promptWordClean);

        async function* ForAsync() {
        	var i = 0;
        	while (i < imgValid.length) {
        	    yield i++;
        	}
        }
                    
        for await (let i of ForAsync()) {
    	   await images[imgValid[i]].hover();
    	   await images[imgValid[i]].click();
        }
        
        await page.waitForTimeout(1000);
                        
        await iframeChallenge.hover(".button-submit");
        await iframeChallenge.click(".button-submit");
        
        await page.waitForTimeout(2000);
        
        start();
    }

    start();
}

exports.resolve = resolve;

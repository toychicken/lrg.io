import express, { json } from 'express';
import { buildPreviewData, sanitiseUrl } from './link-preview-steps.js';
import fs from 'fs-extra';
// import urls from './link-preview-store/urls.json' with {type: 'json'};
const app = express();
const port = 3000;
const urlStorePath = './link-preview-store/urls.json';
const urls = fs.readJSONSync(urlStorePath);

console.log(JSON.stringify(urls, null, 2));

app.use(express.json());
// on start, load up the urls, and check for freshness, anything old than N should be updated




app.get('/', (req, res) => {
    const instructions = `<h1>Instructions</h1>
    `
    res.send(instructions);
})

app.post('/', async (req, res) => {
    const urlObject = sanitiseUrl(req.body.url);
    const urlStoreKey = urlObject.storeKey;
    // should probably sanitise the url, so that it's stripped of #indexes and
    // the queryString is always in a consistent order - so our url key:
    // http://a.com?q=dog&s=cat === http://a.com?s=cat&q=dog
    
    // check the 'urls' data to see if it's already in here
    console.log('body.url', urlStoreKey, urls);
    if (urls[urlStoreKey]) {
        console.log('Got from cache');
        res.json(urls[urlStoreKey]);
    } else {

        // if not, fetch the latest from the url
        // send the response back
        // add the data to the urls.json

        // if fails send 400 & error, otherwise, it'll show the broken stuff

        console.log('REQ', req.body);

        try {
            const resp = await fetch(urlStoreKey);
            if (!resp.ok) {
                throw new Error(`Response: ${resp.status}`)
            }
            const document = await resp.text();

            const { data, error } = buildPreviewData(document, urlObject);
            if (error) {
                throw new Error(`Preview failure: ${error}`)
            }

            // write the data back into the urls store

            console.log('write out to  urls', data);
            urls[urlStoreKey] = {...data};
            fs.writeJSONSync(urlStorePath, urls);


            // Send back the result
            res.json(data);

        } catch (err) {
            res.status(400);
            res.json({
                error: err
            })
        }

    }


    res.end();

})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
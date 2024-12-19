import express, { json } from 'express';
import { buildPreviewData, sanitiseUrl } from './link-preview-steps.js';
import urls from './link-preview-store/urls.json' with {type: 'json'};
const app = express();
const port = 3000;



app.use(express.json());

// on start, load up the urls, and check for freshness, anything old than N should be updated




app.get('/', (req, res) => {
    const instructions = `<h1>Instructions</h1>
    `
    res.send(instructions);
})

app.post('/', async (req, res) => {
    const url = sanitiseUrl(req.body.url);
    // should probably sanitise the url, so that it's stripped of #indexes and
    // the queryString is always in a consistent order - so our url key:
    // http://a.com?q=dog&s=cat === http://a.com?s=cat&q=dog
    
    // check the 'urls' data to see if it's already in here
    console.log('body.url', url, urls);
    if (urls[url]) {
        console.log('Got from cache');
        res.json(urls[url]);
    } else {

        // if not, fetch the latest from the url
        // send the response back
        // add the data to the urls.json

        // if fails send 400 & error, otherwise, it'll show the broken stuff

        console.log('REQ', req.body);

        try {
            const resp = await fetch(url);
            if (!resp.ok) {
                throw new Error(`Response: ${resp.status}`)
            }
            const document = await resp.text();

            const { data, error } = buildPreviewData(document, url);
            if (error) {
                throw new Error(`Preview failure: ${error}`)
            }


            // Send back the result
            console.log(data);
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
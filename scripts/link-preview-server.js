import express, { json } from 'express';
import { buildPreviewData } from './link-preview-steps.js';
// import urls from './link-preview-store/urls.json' assert { type: "json" };
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

    // check the 'urls' data to see if it's already in here

    // if not, fetch the latest from the url

    // if fails send 400 & error, otherwise, it'll show the broken stuff

    console.log('REQ', req.body);

    try {
        const resp = await fetch(req.body.url);
        if(!resp.ok) {
            throw new Error(`Response: ${resp.status}`)
        }
        const document = await resp.text();

        const { data, error } = buildPreviewData(document, req.body.url);
        if(error) {
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


    res.end();

})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
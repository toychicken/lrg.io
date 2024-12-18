import express, { json } from 'express';
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

app.post('/', (req, res) => {

    console.log('REQ', req.body);
    // Send back the result
    res.json({
        data: "Hey there!",
      });
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
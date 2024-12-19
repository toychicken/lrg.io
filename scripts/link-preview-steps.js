export const sanitiseUrl = (urlString) => {
    const url = new URL(urlString);


    // NB simply returning the href var will add a trailing slash in the following case
    // urlString = 'http://a.com?a=1'
    // url.href = 'http://a.com/?a=1'
    // which, for the purposes of string comparison or using as an object key is... not the same :)
    


    let output = {};
    for (let key in url) {
        output[key] = url[key]
    }

    output.storeKey = output.href.split('#')[0];

    return output;

}


import { parse } from "node-html-parser";
export const buildPreviewData = (docString, urlObject) => {
    let data = {
        src : urlObject.href,
        lastUpdate : new Date().getTime(),
        urlData : urlObject
    }
    // https://andrejgajdos.com/how-to-create-a-link-preview/
    try {

        // console.log('buildPreviewData', docString);
        const document = parse(docString);




        

        // shoot for the OG data first
        data.sitename = document.querySelector('head meta[property=og:site_name]').getAttribute('content');
        data.title = document.querySelector('head meta[property=og:title]').getAttribute('content');
        data.description = document.querySelector('head meta[property=og:description]').getAttribute('content');
        data.image = document.querySelector('head meta[property=og:image]').getAttribute('content');
        

        // is there image meta data, if so get it and give us a clue for resolution / ratio etc.
        
        // is there OG data?
        
        // is there a Favicon?
        
        // is there a title tag?
        
        // is there an image witha link rel=
        
        // OH - if we need that image, we need to cache it somewhere :/
        // MAKE SURE ALL TEXT IS SANITISED!
        
    } catch (err) {
        console.error('FAILED', err);
        // return { error : new Error(`Failed to build preview: ${err}`)}
    }   


    return { data }
}
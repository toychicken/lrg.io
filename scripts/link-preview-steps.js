export const sanitiseUrl = (urlString) => {
    const url = new URL(urlString);


    // NB simply returning the href var will add a trailing slash in the following case
    // urlString = 'http://a.com?a=1'
    // url.href = 'http://a.com/?a=1'
    // which, for the purposes of string comparison or using as an object key is... not the same :)
    return url.href.split('#')[0]; // lose the hash index
}

import { parse } from "node-html-parser";
export const buildPreviewData = (document, url) => {

    // https://andrejgajdos.com/how-to-create-a-link-preview/

    let data = {
            title : '',
            description : '', 
            image : '',
            src : url,
            lastUpdate : new Date().getTime()
        }

    // is there OG data?

    // is there a Favicon?

    // is there a title tag?

    // is there an image witha link rel=

    // MAKE SURE ALL TEXT IS SANITISED!
    
    console.log('buildPreviewData', data);


    return { data }
}
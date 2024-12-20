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

const ogProperties = [
    "og:title",
    "og:type",
    "og:url",
    "og:description",
    "og:site_name",

    "og:image",
    "og:image:url",
    "og:image:secure_url",
    "og:image:type",
    "og:image:width",
    "og:image:height",
    "og:image:alt",

    "og:video",
    "og:video:url",
    "og:video:secure_url",
    "og:video:type",
    "og:video:width",
    "og:video:height",
    "og:video:alt",

    "og:audio",
    "og:audio:url",
    "og:audio:secure_url",
    "og:audio:type",
]

import { parse } from "node-html-parser";

const getAcceptableUrlData = (urlObject) => {
    const {
        href, origin, protocol, host, hostname, port, pathname, search, hash, storeKey
    } = urlObject;
    return {
        href, origin, protocol, host, hostname, port, pathname, search, hash, storeKey
    }
}

const getTitle = document => {
    return (() => {

        const twitterTitleEl = document.querySelector('meta[name="twitter:title"]');
        if (twitterTitleEl) {
            const twitterTitle = twitterTitleEl.getAttribute('content');
            if (twitterTitle) {
                return twitterTitle;
            }
        }
        const docTitleEl = document.querySelector('title')
        if (docTitleEl) {
            const docTitle = docTitleEl.innerText;
            if (docTitle != null && docTitle.length > 0) {
                return docTitle;
            }
        }
        const h1El = document.querySelector("h1")
        if (h1El) {
            const h1 = h1El.innerText;
            if (h1 != null && h1.length > 0) {
                return h1;
            }
        }
        const h2El = document.querySelector("h2")
        if (h2El) {
            const h2 = h2El.innerText;
            if (h2 != null && h2.length > 0) {
                return h2;
            }
        }
        return null;
    })();
}
/*
        const element = document.querySelector('selector');
        if(element) {
            const val = element.getAttribute('content');
            if(val) {
                return val;
            }
        }
*/
const getDescription = document => {
    return (() => {

        const twitterDescriptionEl = document.querySelector('meta[name="twitter:description"]');
        if(twitterDescriptionEl) {
            const twitterDescription = twitterDescriptionEl.getAttribute('content');
            if(twitterDescription && twitterDescription !== "") {
                return twitterDescription;
            }
        }


        const metaDescriptionEl = document.querySelector('selector');
        if(metaDescriptionEl) {
            const metaDescription = metaDescriptionEl.getAttribute('content');
            if(metaDescription && metaDescription !== "") {
                return metaDescription;
            }
        }
        
        const firstParaEl = document.querySelector('p');
        if(firstParaEl) {
            const firstPara = firstParaEl.innerText;
            if(firstPara) {
                return firstPara;
            }
        }
    })();
}





export const buildPreviewData = (docString, urlObject) => {


    let data = {
        src: urlObject.href, // unless we get a link canonical!?
        lastUpdate: new Date().getTime(),
        urlData: getAcceptableUrlData(urlObject)
    }
    // https://andrejgajdos.com/how-to-create-a-link-preview/
    try {

        // // console.log('buildPreviewData', docString);
        const document = parse(docString);

        // shoot for the OG data first
        for (const prop of ogProperties) {
            let el = document.querySelector(`head meta[property=${prop}]`);
            if (el) {
                let val = el.getAttribute('content');
                if (val) {
                    let key = prop.split('og:')[1].replace(':', '_');
                    data[key] = val;
                }
            }

        }

        if (!data.title) {
            data.title = getTitle(document);
        }
        if (!data.description) {
            data.description = getDescription(document);
        }
        // is there image meta data, if so get it and give us a clue for resolution / ratio etc.

        // if we don't get title, desc or image so far, try:

        // is there a Favicon?

        // is there a title tag?

        // is there an image witha link rel=

        // OH - if we need that image, we need to cache it somewhere :/
        // MAKE SURE ALL TEXT IS SANITISED!

    } catch (err) {
        console.error('FAILED', err);
        return { error: new Error(`Failed to build preview: ${err}`) }
    }


    return { data }
}
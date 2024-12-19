export const buildPreviewData = (document, url) => {

    // https://andrejgajdos.com/how-to-create-a-link-preview/

    let data = {
            title : 'LEIGH',
            description : 'CHICKEN FEED', 
            image : '/images/balinese_mask@600x600',
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
const leighs = require('./tweets.js')
const moment = require('moment')
const matter = require('gray-matter')
const fs = require('fs')

for (tX of leighs.tweets) {
  
  let t = {...tX};


  //ignore any replies or old-style RT
  if(t.tweet.in_reply_to_user_id_str === undefined && !t.tweet.full_text.startsWith('RT @')) {

    //does this tweet have media?
    let allMedia = []
    if(t.tweet.entities.media) {
      for (media of t.tweet.entities.media) {
        let file = media.media_url.substring(media.media_url.lastIndexOf('/') + 1)
        allMedia.push(`/images/tweets_media/${t.tweet.id}-${file}`)
      }
    }

    //does this tweet have links?
    let allLinks = []
    if(t.tweet.entities.urls) {
      for (url of t.tweet.entities.urls) {
        allLinks.push(url.expanded_url)
      }
    }

    //does this tweet mention a user?
    let allMentions = []
    if(t.tweet.entities.user_mentions) {
      for(mention of t.tweet.entities.user_mentions) {
        allMentions.push(`@${mention.screen_name}`)
      }
    }

    //does this tweet have hashtags?
    let allHashTags = []
    if(t.tweet.entities.hashtags) {
      for(tag of t.tweet.entities.hashtags) {
        allHashTags.push(tag.text)
      }
    }

    const photos = allMedia.length === 0 ? {} : { images: allMedia }
    const links = allLinks.length === 0 ? {} : { links: allLinks }
    const mentions = allMentions.length === 0 ? {} : { mentions: allMentions }
    const tags = allHashTags.length === 0 ? {} : { tags: allHashTags }

    //remove any links
    let fileText = t.tweet.full_text.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '')
    let descriptionText = t.tweet.full_text.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '')
    //replace @mentions with linked mentioned
    for (mention of allMentions) {
      fileText = fileText.replace(new RegExp(mention, "gi"), `[${mention}](https://twitter.com/${mention})`)
    }

    fileText = fileText + `
    
{{< tweet ${t.tweet.favorite_count} ${t.tweet.retweet_count} >}}
    `
    const description = {description: `"${descriptionText}"`};

    const parsedDate = moment(new Date(t.tweet.created_at)).format('YYYY-MM-DDTHH:MM:ssZ')

    let fileContent = matter.stringify(fileText, {
      title: `Tweet - ${t.tweet.id}`,
      ...description,
      date: parsedDate,
      ...photos,
      ...links,
      ...mentions,
      ...tags,
      style: "tweet",
      application : t.tweet.source,
      source: `${JSON.stringify(t.tweet, '', 2)}`
      
    })
    //console.log(`Date: ${moment(t.tweet.created_at).format('YYYY-MM-DD')}`)
    fs.writeFileSync(`../content/posts/${moment(t.tweet.created_at).format('YYYY-MM-DD')}-${t.tweet.id}.md`, fileContent)
  }

  
}
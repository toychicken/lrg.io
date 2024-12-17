const leighs = require('./tweets.js')
const { DateTime } = require('luxon')
const matter = require('gray-matter')
const fs = require('fs-extra')

const postPath = '../content/twitter/';


const getLinkedUpTextAsMarkdown = (tweet, allMentions, allHashTags) => {

  //remove any links
  let fileText = tweet.full_text
    .replace(/(?:https?|ftp):\/\/[\n\S]+/g, '')
    .replace(/\n/g, '\n\n'); // Twitter doesn't double space lines
  let descriptionText = tweet.full_text.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '')

  //replace @mentions with linked mentioned
  for (mention of allMentions) {
    fileText = fileText.replace(new RegExp(mention, "gi"), `[${mention}](https://twitter.com/${mention}) `)
  }

  for (tag of allHashTags) {
    let hashed = `#(${tag})([^a-zA-Z0-9]|$)`
    fileText = fileText.replace(new RegExp(hashed, "gi"), `[#${tag}](/tags/${tag})$2`);
  }


  return {
    fileText,
    descriptionText
  }
}

const uniqueOnly = (value, index, array) => {
  return array.indexOf(value) === index;
}


// first, break them all up into YYYY/MM chunks. Each page will be 'all the tweets from month X'
let sortedByDate = {}
for (item of leighs.tweets) {


  const tweet = item.tweet;
  //  console.log(tweet.id_str);

  let outputPost = {
    id: tweet.id_str,
    description: tweet.full_text || "",
    application: tweet.source || "",
    images: [],
    category: "",
    style: "layout-tweet post",
    author: "@toychicken",
    tweeted_date: tweet.created_at || "NEVER"
    
  }

  const luxTweetDate = DateTime.fromJSDate(new Date(tweet.created_at))//, "EEE MMM dd HH:mm:ss 'T' yyyy");
  // get the text out
  outputPost.date = luxTweetDate.toISO();
  outputPost.luxDate = luxTweetDate;
  let yy = luxTweetDate.toFormat('yyyy');
  let mm = luxTweetDate.toFormat('MM');

  /// https://twitter.com/gawanmac/status/984865835566141440
  if(tweet.in_reply_to_status_id && tweet.in_reply_to_screen_name) {
    outputPost.replyURL = `https://twitter.com/${tweet.in_reply_to_screen_name}/status/${tweet.in_reply_to_status_id}`;
    outputPost.replyUser = `@${tweet.in_reply_to_screen_name}`;
  }

  if (!sortedByDate[yy]) {
    sortedByDate[yy] = {
      title: yy,
      description: `It was the year ${yy}...`,
      months: {}
    };
  }
  if (!sortedByDate[yy].months[mm]) {
    sortedByDate[yy].months[mm] = {
      title: `${luxTweetDate.toFormat('MMMM, yyyy')}`,
      description: `It was ${luxTweetDate.toFormat('MMMM')} ${yy}, and this was what I was tweeting about...`,
      posts: []
    };
  }

  //does this tweet have media?
  let allMedia = []
  if (tweet.entities.media) {
    for (media of tweet.entities.media) {
      let file = media.media_url.substring(media.media_url.lastIndexOf('/') + 1)
      allMedia.push(`/images/tweets_media/${tweet.id}-${file}`)
    }
  }
  outputPost.images = allMedia;

  //does this tweet have links?
  let allLinks = []
  if (tweet.entities.urls) {
    for (url of tweet.entities.urls) {
      allLinks.push(url.expanded_url)
    }
  }
  outputPost.urls = allLinks;

  //does this tweet mention a user?
  let allMentions = []
  if (tweet.entities.user_mentions) {
    for (mention of tweet.entities.user_mentions) {
      allMentions.push(`@${mention.screen_name}`)
    }
  }
  outputPost.mentions = allMentions;

  //does this tweet have hashtags?
  let allHashTags = []
  if (tweet.entities.hashtags) {
    for (tag of tweet.entities.hashtags) {
      allHashTags.push(tag.text)
    }
  }
  outputPost.tags = allHashTags;
  outputPost.favorite_count = tweet.favorite_count || "0";
  outputPost.retweet_count = tweet.retweet_count || "0";

  const { fileText, descriptionText } = getLinkedUpTextAsMarkdown(tweet, allMentions, allHashTags);
  outputPost.fullText = fileText,
    outputPost.description = descriptionText;

  sortedByDate[yy].months[mm].posts.push(outputPost);
}
// console.log(JSON.stringify(sortedByDate, null, 2));



// for each year
for (const [kY, yr] of Object.entries(sortedByDate)) {


  let yearMeta = {
    title: `${yr.title}`,
    subtitle: "",
    subheading: "Tweets",
    description: yr.description,
    images: ["/images/twitter-is-dead.png"],
    date: `${yr.title}-12-31T23:59:59`,
    style: "layout-notebook posts",
    noPreview : true
  }




  // for each month
  for (const [kM, mnth] of Object.entries(yr.months)) {

    let content = ``;

    // write a month _index
    let monthMeta = {
      title: `${mnth.title}`,
      subtitle: "",
      subheading: "Tweets",
      description: mnth.description,
      images: ["/images/twitter-is-dead.png"],
      tags: [],
      date: DateTime.fromObject({ year: kY, month: kM }).endOf('month').toISO(),
      style: "layout-notebook posts",
      author: "@toychicken",
      noPreview: true
    }




    // each post of this month
    mnth.posts.sort((a, b) => {
      let x = a.luxDate.toMillis();
      let y = b.luxDate.toMillis();
      return x - y;
    })

    for (post of mnth.posts) {


      // add tags to the month file

      let someTags = [...monthMeta.tags, ...post.tags].filter(uniqueOnly);
      monthMeta.tags = someTags;

      // make a markdown file;
      content += `
<p><a id="${post.id}" href="#${post.id}"><em title="${post.luxDate.toISO()}">${post.luxDate.toFormat('cccc DDD - T')}</em></a></p>
      `

      if(post.replyURL && post.replyUser) {
        content += `
{{< embed "${post.replyURL}" "In reply to: ${post.replyUser}" >}}

`
      }


      if (post.images.length > 0) {
        for (image of post.images) {
          content += `{{< main_image "${image}" >}}
          
          `
        }
      }
      content += `
${post.fullText}
`

for (url of post.urls) {
  content += `
{{< embed "${url}" "${url}" >}}

`
}
//       content += `
// \`\`\`json
//       ${JSON.stringify(post, null, 2)}
// \`\`\`
// `; 
content += `
{{< tweet ${post.favorite_count} ${post.retweet_count} >}}

---
`;

      // end loop
    }


    let fileContent = matter.stringify(content, monthMeta);

    fs.outputFileSync(`${postPath}/${yr.title}/${kM}.md`, fileContent);


  }
  let yearContent = matter.stringify(yr.description, yearMeta);
  fs.outputFileSync(`${postPath}/${yr.title}/_index.md`, yearContent);
}



return;

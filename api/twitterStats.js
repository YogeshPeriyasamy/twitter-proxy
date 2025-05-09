// api/twitterStats.js
require('dotenv').config();
const { TwitterApi } = require('twitter-api-v2');
const express = require('express');
const serverless = require('serverless-http');

const app = express();
const client = new TwitterApi(process.env.TWITTER_BEARER_TOKEN);

app.get('/api/twitter-stats', async (req, res) => {
  try {
    const { username } = req.query;
    
    if (!username) {
      return res.status(400).json({ error: 'Username required' });
    }
    let userarray=username.split(/[\s,]+/);
    console.log(userarray);
    let records=[];
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
    for(let name of userarray)
    {
      console.log(name);
      await sleep(20000);
      const { data } = await client.v2.userByUsername(name, {
        'user.fields': ['public_metrics']
      });
      console.log(data);
      records.push({
        username: data.username,
        followers: data.public_metrics.followers_count,
        following: data.public_metrics.following_count
      });
    }
    records.sort((a, b) => b.followers - a.followers);

    console.log(records);
    res.json(records);

  } catch (error) {
    console.log(error);
    res.status(500).json({ 
      error: error.message || 'Twitter API failed' 
    });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`API running on http://localhost:${process.env.PORT}`);
});

// module.exports = serverless(app);
// api/twitterStats.js
require('dotenv').config();
const { TwitterApi } = require('twitter-api-v2');
const express = require('express');

const app = express();
const client = new TwitterApi(process.env.TWITTER_BEARER_TOKEN);

app.get('/api/twitter-stats', async (req, res) => {
  try {
    const { username } = req.query;
    
    if (!username) {
      return res.status(400).json({ error: 'Username required' });
    }

    const { data } = await client.v2.userByUsername(username, {
      'user.fields': ['public_metrics']
    });

    res.json({
      username: data.username,
      followers: data.public_metrics.followers_count,
      following: data.public_metrics.following_count
    });

  } catch (error) {
    res.status(500).json({ 
      error: error.message || 'Twitter API failed' 
    });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`API running on http://localhost:${process.env.PORT}`);
});
const express = require('express');
const { withDB } = require('../db/db.js');
const router = express.Router();


router.get('/' , (req,res)=>{
  res.send("hello world")
})

router.get('/:name', async (req, res) => {
  withDB(async (db) => {
    const articleName = req.params.name;
    const articlesInfo = await db.collection('articles').findOne({ name: articleName });
    res.status(200).json(articlesInfo);
  }, res);
});

router.post('/:name/upvotes', async (req, res) => {
  withDB(async (db) => {
    const name = req.params.name;
    const article = await db.collection('articles').findOne({ name: name });

    if (!article) {
      const articleInfo = {
        name: name,
        upvotes: 1,
        downvotes: 0,
        comments: []
      };
      await db.collection('articles').insertOne(articleInfo);
      return res.status(201).json(articleInfo);
    } else {
      await db.collection('articles').updateOne(
        { name: name },
        { '$set': { upvotes: article.upvotes + 1 } }
      );

      const updatedArticleInfo = await db.collection('articles').findOne({ name: name });
      return res.status(200).json(updatedArticleInfo);
    }
  }, res);
});

router.post('/:name/downvotes', async (req, res) => {
  withDB(async (db) => {
    const name = req.params.name;
    const article = await db.collection('articles').findOne({ name: name });

    if (!article) {
      const articleInfo = {
        name: name,
        upvotes: 0,
        downvotes: 1,
        comments: []
      };
      console.log("Connected to DB");
      await db.collection('articles').insertOne(articleInfo);
      return res.status(201).json(articleInfo);
    } else {
      await db.collection('articles').updateOne(
        { name: name },
        { '$set': { downvotes: article.downvotes + 1 } }
      );

      const updatedArticleInfo = await db.collection('articles').findOne({ name: name });
      return res.status(200).json(updatedArticleInfo);
    }
  }, res);
});




router.post('/:name/add-comment', async (req, res) => {
  withDB(async (db) => {
    const articleName = req.params.name;
    const { username, text } = req.body;

    const articlesInfo = await db.collection('articles').findOne({ name: articleName });

    if (!articlesInfo) {
      const newArticle = {
        name: articleName,
        upvotes: 0,
        downvotes: 0,
        comments: [{ username, text }]
      };
      await db.collection('articles').insertOne(newArticle);
      return res.status(201).json(newArticle);
    } else {
      await db.collection('articles').updateOne(
        { name: articleName },
        {
          '$set': {
            comments: articlesInfo.comments.concat({ username, text })
          }
        }
      );

      const updatedArticleInfo = await db.collection('articles').findOne({ name: articleName });
      return res.status(200).json(updatedArticleInfo);
    }
  }, res);
});

router.delete('/:name/:key/delete', async (req, res) => {
  const { name, key } = req.params;
  const value = parseInt(key, 10);

  withDB(async (db) => {
    const articleInfo = await db.collection('articles').findOne({ name: name });
    if (!articleInfo) {
      return res.status(404).json({ message: 'Article not found' });
    }

    const updatedComments = articleInfo.comments.filter((_, index) => index !== value);
    await db.collection('articles').updateOne(
      { name: name },
      { '$set': { comments: updatedComments } }
    );

    const updatedArticleInfo = await db.collection('articles').findOne({ name: name });
    return res.status(200).json(updatedArticleInfo);
  }, res);
});

router.put('/:name/update-comment/:idx', async (req, res) => {
  withDB(async (db) => {
    const { name, idx } = req.params; // Extracting article name and comment index
    const { username, text } = req.body; // Extracting updated comment data
    const articleInfo = await db.collection('articles').findOne({ name }); // Fetching article by name

    if (!articleInfo) {
      return res.status(404).json({ message: 'Article not found' });
    }

    // Ensure idx is a valid integer and within bounds
    const commentIndex = parseInt(idx, 10);
    if (isNaN(commentIndex) || commentIndex < 0 || commentIndex >= articleInfo.comments.length) {
      return res.status(400).json({ message: 'Invalid comment index' });
    }

    // Update the specific comment in the comments array
    const updatedComments = articleInfo.comments.map((item, i) =>
      i === commentIndex ? { ...item, username, text } : item
    );

    // Update the article document in the database
    await db.collection('articles').updateOne(
      { name },
      { $set: { comments: updatedComments } }
    );

    // articleInfo.comments[commentIndex] = { username, text };

    // await db.collection('articles').updateOne(
    //   { name },
    //   { '$set': { comments: articleInfo.comments } }
    // );

    // Fetch and return the updated article information
    const updatedArticleInfo = await db.collection('articles').findOne({ name });
    return res.status(200).json(updatedArticleInfo);
  }, res);
});



module.exports = router;

const express = require("express");
const { withDB } = require("../db/db.js");
const router = express.Router();
const Joi = require("joi");

// ==================== Joi Validation Schema ====================

const commentSchema = Joi.object({
  username: Joi.string()
    .trim()
    .min(3)
    .pattern(/^[A-Za-z ]+$/)
    .required()
    .messages({
      "string.empty": "Name is required",
      "string.min": "Name must be at least 3 characters",
      "string.pattern.base": "Name can contain only letters",
      "any.required": "Name is required",
    }),

  text: Joi.string()
    .trim()
    .min(13)
    .required()
    .messages({
      "string.empty": "Comment is required",
      "string.min": "Comment must be at least 13 characters",
      "any.required": "Comment is required",
    }),
});

// ==================== Home Route ====================

router.get("/", (req, res) => {
  res.send("hello world");
});

// ==================== Get Article ====================

router.get("/:name", async (req, res) => {
  withDB(async (db) => {
    const articleName = req.params.name;

    const articlesInfo = await db
      .collection("articles")
      .findOne({ name: articleName });

    res.status(200).json(articlesInfo);
  }, res);
});

// ==================== Upvote Article ====================

router.post("/:name/upvotes", async (req, res) => {
  withDB(async (db) => {
    const name = req.params.name;

    const article = await db
      .collection("articles")
      .findOne({ name: name });

    if (!article) {
      const articleInfo = {
        name: name,
        upvotes: 1,
        downvotes: 0,
        comments: [],
      };

      await db.collection("articles").insertOne(articleInfo);

      return res.status(201).json(articleInfo);
    } else {
      await db.collection("articles").updateOne(
        { name: name },
        {
          $set: {
            upvotes: article.upvotes + 1,
          },
        }
      );

      const updatedArticleInfo = await db
        .collection("articles")
        .findOne({ name: name });

      return res.status(200).json(updatedArticleInfo);
    }
  }, res);
});

// ==================== Downvote Article ====================

router.post("/:name/downvotes", async (req, res) => {
  withDB(async (db) => {
    const name = req.params.name;

    const article = await db
      .collection("articles")
      .findOne({ name: name });

    if (!article) {
      const articleInfo = {
        name: name,
        upvotes: 0,
        downvotes: 1,
        comments: [],
      };

      await db.collection("articles").insertOne(articleInfo);

      return res.status(201).json(articleInfo);
    } else {
      await db.collection("articles").updateOne(
        { name: name },
        {
          $set: {
            downvotes: article.downvotes + 1,
          },
        }
      );

      const updatedArticleInfo = await db
        .collection("articles")
        .findOne({ name: name });

      return res.status(200).json(updatedArticleInfo);
    }
  }, res);
});

// ==================== Add Comment ====================

router.post("/:name/add-comment", async (req, res) => {

  // Joi validation
  const { error } = commentSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }

  withDB(async (db) => {
    const articleName = req.params.name;
    const { username, text } = req.body;

    const articlesInfo = await db
      .collection("articles")
      .findOne({ name: articleName });

    if (!articlesInfo) {
      const newArticle = {
        name: articleName,
        upvotes: 0,
        downvotes: 0,
        comments: [{ username, text }],
      };

      await db.collection("articles").insertOne(newArticle);

      return res.status(201).json(newArticle);
    } else {
      await db.collection("articles").updateOne(
        { name: articleName },
        {
          $set: {
            comments: articlesInfo.comments.concat({
              username,
              text,
            }),
          },
        }
      );

      const updatedArticleInfo = await db
        .collection("articles")
        .findOne({ name: articleName });

      return res.status(200).json(updatedArticleInfo);
    }
  }, res);
});

// ==================== Delete Comment ====================

router.delete("/:name/:key/delete", async (req, res) => {
  const { name, key } = req.params;
  const value = parseInt(key, 10);

  withDB(async (db) => {
    const articleInfo = await db
      .collection("articles")
      .findOne({ name: name });

    if (!articleInfo) {
      return res.status(404).json({
        message: "Article not found",
      });
    }

    const updatedComments = articleInfo.comments.filter(
      (_, index) => index !== value
    );

    await db.collection("articles").updateOne(
      { name: name },
      {
        $set: {
          comments: updatedComments,
        },
      }
    );

    const updatedArticleInfo = await db
      .collection("articles")
      .findOne({ name: name });

    return res.status(200).json(updatedArticleInfo);
  }, res);
});

// ==================== Update Comment ====================

router.put("/:name/update-comment/:idx", async (req, res) => {

  // Joi validation
  const { error } = commentSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }

  withDB(async (db) => {
    const { name, idx } = req.params;
    const { username, text } = req.body;

    const articleInfo = await db
      .collection("articles")
      .findOne({ name });

    if (!articleInfo) {
      return res.status(404).json({
        message: "Article not found",
      });
    }

    // Check comment index
    const commentIndex = parseInt(idx, 10);

    if (
      isNaN(commentIndex) ||
      commentIndex < 0 ||
      commentIndex >= articleInfo.comments.length
    ) {
      return res.status(400).json({
        message: "Invalid comment index",
      });
    }

    // Update comment
    const updatedComments = articleInfo.comments.map((item, i) =>
      i === commentIndex
        ? {
            ...item,
            username,
            text,
          }
        : item
    );

    await db.collection("articles").updateOne(
      { name },
      {
        $set: {
          comments: updatedComments,
        },
      }
    );

    const updatedArticleInfo = await db
      .collection("articles")
      .findOne({ name });

    return res.status(200).json(updatedArticleInfo);
  }, res);
});

module.exports = router;
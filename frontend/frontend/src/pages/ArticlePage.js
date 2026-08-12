// importing React
import React, { useState, useEffect } from "react";
import articleContent from "../pages/article-content";
import ArticleList from "../components/ArticleList";
import { useParams } from "react-router-dom";
import CommentList from "../components/CommentList";
import UpvotesSection from "../components/UpvotesSection";
import AddCommentForm from "../components/AddCommentForm";

const ArticlePage = () => {
  const { name } = useParams();

  const [edit, setEdit] = useState(null);
  const [idx, setIdx] = useState(null);
  const [editName, setEditName] = useState("");

  const [articleInfo, setArticleInfo] = useState({
    upvotes: 0,
    downvotes: 0,
    comments: [],
  });

  const article = articleContent.find(
    (article) => article.name === name
  );

  const otherArticles = articleContent.filter(
    (article) => article.name !== name
  );

  // Fetch article data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetch(
          `https://article-management-vtj7.onrender.com/${name}`
        );

        const body = await result.json();

        if (result.ok && body !== null) {
          setArticleInfo(body);
        } else {
          setArticleInfo({
            upvotes: 0,
            downvotes: 0,
            comments: [],
          });
        }
      } catch (error) {
        console.error("Fetch article error:", error);
      }
    };

    fetchData();
  }, [name]);

  // Edit comment
  const handleEdit = (comment, name, idx) => {
    setEdit(comment);
    setEditName(name);
    setIdx(idx);
  };

  if (!article) {
    return <h1>Article does not exist</h1>;
  }

  return (
    <>
      <h1>{article.title}</h1>

      <UpvotesSection
        articleName={name}
        upvotes={articleInfo.upvotes}
        downvotes={articleInfo.downvotes}
        setArticleInfo={setArticleInfo}
      />

      {article.content.map((paragraph, key) => (
        <p key={key}>{paragraph}</p>
      ))}

      <CommentList
        comments={articleInfo.comments}
        articleName={name}
        setArticleInfo={setArticleInfo}
        handleEdit={handleEdit}
      />

      <AddCommentForm
        articleName={name}
        setArticleInfo={setArticleInfo}
        edit={edit}
        idx={idx}
        setIdx={setIdx}
        setEdit={setEdit}
        editName={editName}
      />

      <ArticleList articles={otherArticles} />
    </>
  );
};

export default ArticlePage;
import React from "react";
import { BiSolidLike, BiSolidDislike } from "react-icons/bi";

const UpvotesSection = ({
  articleName,
  upvotes,
  setArticleInfo,
  downvotes,
}) => {
  const upvoteArticle = async () => {
    try {
      const result = await fetch(
        `https://article-management-vtj7.onrender.com/${articleName}/upvotes`,
        {
          method: "POST",
        }
      );

      const body = await result.json();

      if (!result.ok) {
        throw new Error(body.message || "Upvote failed");
      }

      setArticleInfo(body);
    } catch (error) {
      console.error("Upvote error:", error);
    }
  };

  const downvoteArticle = async () => {
    try {
      const result = await fetch(
        `https://article-management-vtj7.onrender.com/${articleName}/downvotes`,
        {
          method: "POST",
        }
      );

      const body = await result.json();

      if (!result.ok) {
        throw new Error(body.message || "Downvote failed");
      }

      setArticleInfo(body);
    } catch (error) {
      console.error("Downvote error:", error);
    }
  };

  return (
    <div className="d-flex align-items-center gap-3">
      <div>
        <span className="text-danger fw-bolder">Upvotes</span> &{" "}
        <span className="text-secondary fw-bolder">Downvotes</span> this
        Article
      </div>

      <div className="d-flex gap-1">
        <button
          className="btn btn-sm btn-outline-danger fw-bolder"
          onClick={upvoteArticle}
        >
          <BiSolidLike /> {upvotes}
        </button>

        <button
          className="btn btn-sm btn-outline-secondary fw-bolder"
          onClick={downvoteArticle}
        >
          <BiSolidDislike /> {downvotes}
        </button>
      </div>
    </div>
  );
};

export default UpvotesSection;
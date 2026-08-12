import React, { useEffect } from "react";
import { useFormik } from "formik";

const AddCommentForm = ({
  articleName,
  setArticleInfo,
  edit,
  idx,
  setIdx,
  setEdit,
  editName,
}) => {
  const formik = useFormik({
    initialValues: {
      username: "",
      commentText: "",
    },

    validate: (values) => {
      const errors = {};

      // ==================== Name Validation ====================

      if (!values.username.trim()) {
        errors.username = "Name is required !!";
      } else if (values.username.trim().length < 3) {
        errors.username = "Name must be at least 3 characters !!";
      } else if (!/^[A-Za-z ]+$/.test(values.username.trim())) {
        errors.username = "Name can contain only letters !!";
      }

      // ==================== Comment Validation ====================

      if (!values.commentText.trim()) {
        errors.commentText = "Comment is required !!";
      } else if (values.commentText.trim().length < 13) {
        errors.commentText =
          "Comment must be at least 13 characters !!";
      } else if (/^\d+$/.test(values.commentText.trim())) {
        errors.commentText =
          "Comment cannot be only numbers !!";
      }

      return errors;
    },

    onSubmit: async (values) => {
      if (edit) {
        await updateComment(values);
      } else {
        await addComment(values);
      }
    },
  });

  // ==================== Add Comment ====================

  const addComment = async (values) => {
    try {
      const result = await fetch(
        `https://article-management-vtj7.onrender.com/${articleName}/add-comment`,
        {
          method: "POST",
          body: JSON.stringify({
            username: values.username,
            text: values.commentText,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const body = await result.json();

      if (!result.ok) {
        throw new Error(body.message || "Failed to add comment");
      }

      setArticleInfo(body);
      formik.resetForm();
    } catch (error) {
      console.error("Add comment error:", error);
    }
  };

  // ==================== Update Comment ====================

  const updateComment = async (values) => {
    try {
      const result = await fetch(
        `https://article-management-vtj7.onrender.com/${articleName}/update-comment/${idx}`,
        {
          method: "PUT",
          body: JSON.stringify({
            username: values.username,
            text: values.commentText,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const body = await result.json();

      if (!result.ok) {
        throw new Error(body.message || "Failed to update comment");
      }

      setArticleInfo(body);

      formik.resetForm();
      setEdit(null);
      setIdx(null);
    } catch (error) {
      console.error("Update comment error:", error);
    }
  };

  // ==================== Edit Comment Data ====================

  useEffect(() => {
    if (edit) {
      formik.setValues({
        username: edit.username || "",
        commentText: edit.text || "",
      });
    } else {
      formik.resetForm();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [edit]);

  // ==================== UI ====================

  return (
    <div id="add-comment-form">
      <h3 className="text-secondary fw-bolder">
        {edit ? "Update Comment" : "Add Comment"}
      </h3>

      <form onSubmit={formik.handleSubmit}>
        <table>
          <tbody>
            {/* ==================== Name ==================== */}

            <tr>
              <td>
                <label
                  className="form-label"
                  htmlFor="username"
                >
                  Name:
                </label>
              </td>

              <td>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formik.values.username}
                  className={`form-control ${
                    formik.touched.username &&
                    formik.errors.username
                      ? "is-invalid"
                      : ""
                  }`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />

                {formik.touched.username &&
                  formik.errors.username && (
                    <div
                      style={{ fontSize: "15px" }}
                      className="invalid-feedback"
                    >
                      {formik.errors.username}
                    </div>
                  )}
              </td>
            </tr>

            {/* ==================== Comment ==================== */}

            <tr>
              <td>
                <label
                  className="form-label"
                  htmlFor="commentText"
                >
                  Comment:
                </label>
              </td>

              <td>
                <textarea
                  id="commentText"
                  name="commentText"
                  rows="2"
                  cols="30"
                  value={formik.values.commentText}
                  className={`form-control ${
                    formik.touched.commentText &&
                    formik.errors.commentText
                      ? "is-invalid"
                      : ""
                  }`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />

                {formik.touched.commentText &&
                  formik.errors.commentText && (
                    <div
                      style={{ fontSize: "14px" }}
                      className="invalid-feedback"
                    >
                      {formik.errors.commentText}
                    </div>
                  )}
              </td>
            </tr>
          </tbody>
        </table>

        <button
          type="submit"
          className="btn btn-secondary mt-2"
        >
          {edit ? "Update Comment" : "Add Comment"}
        </button>
      </form>
    </div>
  );
};

export default AddCommentForm;
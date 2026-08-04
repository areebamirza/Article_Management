import React, { useEffect, useState } from "react";

const AddCommentForm = ({ articleName, setArticleInfo, edit,idx,setIdx,setEdit, editName }) => {
    const [username, setUsername] = useState('');
    const [commentText, setCommentText] = useState('');
    const [error , setError] = useState({});
    useEffect(() => {
        if (edit) {
            setUsername(edit.username || "");
            setCommentText(edit.text || "");
        }
    }, [edit]);

    const validation = ()=>{
        const newErrors = {};
        if(!username.trim()){
            newErrors.username = "Name must be required !!";
        }else if(username.length<4){
            newErrors.username = "Name must be at least 4 chracters !!";
        }

        if(!commentText.trim()){
            newErrors.commentText = "Comment must be required !!";
        }else if(commentText.length<13){
            newErrors.commentText = "comment must be at least 13 chracters !!";
        }

        setError(newErrors)
        return Object.keys(newErrors).length ===0;
    }

    const addComment = async () => {
        const result = await fetch(`/${articleName}/add-comment`, {
            method: 'POST',
            body: JSON.stringify({ username, text: commentText }),
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const body = await result.json();
        setArticleInfo(body);
        setUsername('');
        setCommentText('');
    };

    const updateComment = async () => {
        if (!username) {
            alert("PLEASE FILL YOUR NAME !!");
            return;
        }
        if (!commentText) { 
            alert("PLEASE WRITE A COMMENT !!");
            return;
        }

        const result = await fetch(`/${articleName}/update-comment/${idx}`, {
            method: 'PUT',
            body: JSON.stringify({ username, text: commentText }), // include comment ID for update
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const body = await result.json();
        setArticleInfo(body);
        setUsername('');
        setCommentText('');
        setEdit(null)
        setIdx(null)
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if(!validation()){
            return
        }else{
            if (edit) {
                updateComment();
            } else {
                addComment();
            }

        }

       
    };

    return (
        <div id="add-comment-form">
            <h3 className="text-secondary fw-bolder">{edit ? "Update Comment" : "Add Comment"}</h3>
            <table>
                <tbody>
                    <tr>
                        <td>
                            <label className="form-label" htmlFor="username">Name:</label>
                        </td>
                        <td>
                            <input 
                                id="username"
                                type="text" 
                                value={username} 
                                className={`form-control ${error.username?"is-invalid":""}`}
                                onChange={(event) => setUsername(event.target.value)} 
                            />
                            {error.username &&(<div style={{fontSize:'15px'}} className="invalid-feedback">{error.username}</div>)}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label className="form-label" htmlFor="commentText">Comment:</label>
                        </td>
                        <td>
                            <textarea
                                id="commentText"
                                rows="2" 
                                cols="30" 
                                className={`form-control ${error.commentText?"is-invalid":""}`}
                                value={commentText} 
                                onChange={(event) => setCommentText(event.target.value)}
                            ></textarea>
                            {error.commentText &&(<div style={{fontSize:"14px"}} className="invalid-feedback">{error.commentText}</div>)}
                        </td>
                    </tr>
                </tbody>
            </table>
            <button 
                type="button" 
                className="btn btn-secondary mt-2" 
                onClick={handleSubmit}
            >
                {edit ? "Update Comment" : "Add Comment"}
            </button>
        </div>
    );
};

export default AddCommentForm;

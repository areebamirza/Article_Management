import React from "react";
import { MdDeleteForever, MdEdit } from "react-icons/md";

const CommentList = ({ comments,articleName,setArticleInfo,handleEdit }) => {

  const handleDeltee =async (key)=>{
    const data  =  await fetch(`/${articleName}/${key}/delete`,{
      method:'delete'
    });
    const body = await data.json();
    setArticleInfo(body)
  }

  
  return (
    <>
    <div className="card p-2 bg-warning-subtle">
      <h4 className="fw-semibold">Comments:</h4>
      {
      (comments || []).map((comment, key) => (
        <div className="bg-white rounded d-flex align-items-center justify-content-between p-3 m-1 border " key={key}>
          <div>

          <h6 className="">{comment.username.toUpperCase()}</h6>
          <p className="text-muted">{comment.text}</p>
          </div>


         <div className="d-flex gap-2">
          {/* <div></div> */}
         <div onClick={()=>handleEdit(comment , articleName ,key)} ><MdEdit className="text-primary" size={25}/></div>
         <div onClick={()=>handleDeltee(key)} ><MdDeleteForever className="text-danger" size={25}/></div>
         </div>
        
        
        </div>
      ))
      }
      </div>
    </>
  );
};

export default CommentList;

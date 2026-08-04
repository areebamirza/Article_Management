// importing React
import React from 'react';
import articleContent from '../pages/article-content';
import ArticleList from '../components/ArticleList';
import {useParams} from 'react-router-dom';




const ArticlePage = ()=>{
   // const name = match.params.name;
   const {name} = useParams();
   //console.log(name);
    const article= articleContent.find((article)=>article.name===name);
    if(!article){
    return <h1>Arricle does not exist</h1>;
    }

    const otherArticles = articleContent.filter((article)=>article.name !== name);

    
   
    return(
        <>
        
        <h1> {article.title} </h1>
        {article.content.map((paragraph,key)=>(<p key = {key}>{paragraph}</p>))}
     
        <ArticleList articless = {otherArticles}/>
   </>  

    )
   
};
export default ArticlePage;

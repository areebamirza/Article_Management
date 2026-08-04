import React from 'react';
import articleContent from '../pages/article-content';
import { useParams } from 'react-router-dom';
import Article from './article';

const ArticlePage = () => {

    const { name } = useParams();

    const article = articleContent.find(
        (article) => article.name === name
    );

    if (!article) {
        return <h1>Article does not exist</h1>;
    }

    const otherArticles = articleContent.filter(
        (article) => article.name !== name
    );

    return (
        <>
            <h1>{article.title}</h1>

            {article.content.map((paragraph, key) => (
                <p key={key}>{paragraph}</p>
            ))}

            <Article articles ={otherArticles} />
            
        </>
    );
};

export default ArticlePage;
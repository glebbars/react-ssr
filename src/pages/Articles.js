import React from "react";
import { useDataSSR } from "../useDataSSR";
export const Articles = () => {
  const fetchArticles = () => {
    console.log("no preloaded articles found - loading from server");
    return fetch("http://localhost:8080/api/articles")
      .then((res) => res.json())
      .catch(console.error);
  };

  const articles = useDataSSR("articles", fetchArticles);

  return (
    <>
      <h1>Articles</h1>
      {!!articles?.length &&
        articles.map((article) => (
          <div key={article.title}>
            <h3>{article.title}</h3>
            <p>{article.author}</p>
          </div>
        ))}
    </>
  );
};

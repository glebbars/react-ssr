import React, { useEffect, useState } from "react";

export const Articles = () => {
  const [articles, setArticles] = useState(window?.preloadedArticles);

  useEffect(() => {
    if (!window?.preloadedArticles) {
      console.log("no preloaded articles found - loading from server");
      fetch("/api/articles")
        .then((res) => res.json())
        .then(setArticles)
        .catch(console.error);
    }
  }, []);

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

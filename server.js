import "isomorphic-fetch"; // enables calling fetch from server
import express from "express";
import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import App from "./src/App";
import path from "path";
import fs from "fs";
import { ServerStyleSheet } from "styled-components";
import { InitialDataContext } from "./src/InitialDataContext";

global.window = {};

const app = express();

app.use(express.static("./build", { index: false }));

const articles = [
  { title: "Article 1", author: "Jake" },
  { title: "Article 2", author: "Bob" },
  { title: "Article 3", author: "Mike" },
  { title: "Article 4", author: "Paul" },
];

app.get("/api/articles", (req, res) => {
  const loadedArticles = articles; // like a db query
  res.json(loadedArticles);
});

app.get("/*", async (req, res) => {
  const sheet = new ServerStyleSheet();

  const contextObj = { _isServerSide: true, _requests: [], _data: {} };

  renderToString(
    sheet.collectStyles(
      <InitialDataContext.Provider value={contextObj}>
        <StaticRouter location={req.url}>
          <App />
        </StaticRouter>
      </InitialDataContext.Provider>
    )
  );

  await Promise.all(contextObj._requests);
  contextObj._isServerSide = false;
  delete contextObj._requests;

  const reactApp = renderToString(
    <InitialDataContext.Provider value={contextObj}>
      <StaticRouter location={req.url}>
        <App />
      </StaticRouter>
    </InitialDataContext.Provider>
  );

  const templateFile = path.resolve("./build/index.html");
  fs.readFile(templateFile, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).send();
    }

    return res.send(
      data
        .replace(
          '<div id="root"></div>',
          `<script>window.preloadedData = ${JSON.stringify(
            contextObj
          )}</script>;<div id="root">${reactApp}</div>`
        )
        .replace("<style id='style-root'></style>", sheet.getStyleTags())
    );
  });
});

app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});

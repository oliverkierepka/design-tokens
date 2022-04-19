// server.js
const express = require("express");
const app = express();
const { Octokit } = require("@octokit/core");

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

const bodyParser = require("body-parser");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.text()); //the content type is plain text

const octokit = new Octokit({ auth: process.env.GITHUB_PERSONAL_ACCESS_TOKEN });

app.post("/commit-tokens", async (req, res) => {
  let file;

  try {
    file = await octokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
      owner: "oliverkierepka",
      repo: "style-dictionary",
      path: "input/design-tokens.json",
    });
  } catch (ex) {
    //swallow 404
  }

  const buffer = Buffer.from(req.body.client_payload.tokens);
  const content = buffer.toString("base64");

  await octokit.request("PUT /Repos/{owner}/{repo}/contents/{path}", {
    owner: "oliverkierepka",
    repo: "style-dictionary",
    path: "input/design-tokens.json",
    message: "Update design tokens",
    content,
    sha: file && file.data && file.data.sha ? file.data.sha : null,
  });
  res.sendStatus(200);
});
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

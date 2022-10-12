// External dependencies
const fs = require("fs")
const path = require("path")
const { createAppAuth } = require("@octokit/auth-app")
const { graphql } = require("@octokit/graphql")

// Local dependencies
const updateBodyFor = require(path.join(__dirname, "api-request-bodies.js"))

// Setup
const privateKey = fs.readFileSync(process.env.DownloadPrCommenterGitHubApp.secureFilePath, "utf8")
const githubAppId = process.env.GithubAppId
const installationId = process.env.GithubAppInstallationId

// App

const auth = createAppAuth({
  id: githubAppId,
  privateKey: privateKey,
  installationId: installationId
})

const graphqlWithAuth = graphql.defaults({
  request: {
    hook: auth.hook
  }
})


const owner = process.env.Build.Repository.Name.split('/')[0]
const repositoryName = process.env.Build.Repository.Name.split('/')[1]
const prNumber = process.env.System.PullRequest.PullRequestNumber
const body = process.env.Build.SourceVersionAuthor

try {
  graphqlWithAuth(updateBodyFor("get_pull_request_id"), {
    owner: owner,
    repositoryName: repositoryName,
    prNumber: prNumber
  }).then(function(result) {
    graphqlWithAuth(updateBodyFor("new_pull_request_comment"), {
      body: body,
      prId: result.repository.pullRequest.id
    })
  })
  return
} catch (err) {
  console.log(err)
}


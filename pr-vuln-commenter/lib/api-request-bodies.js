const getPullRequestId = `
  query($owner:String!, $repositoryName:String!, $prNumber:Int!) {
    repository(owner: $owner, name: $repositoryName) {
      pullRequest(number: $prNumber) {
        id
      }
    }
  }
`

const newPullRequestComment = `
  mutation($prId:ID!, $body:String!) {
    addComment(input: {subjectId: $prId, body: $body}) {
      commentEdge {
        node {
          id
        }
      }
    }
  }
`

function updateBodyFor (name) {
  switch (name) {
    case "get_pull_request_id":
      return getPullRequestId
    case "new_pull_request_comment":
      return newPullRequestComment
  }
}

module.exports = updateBodyFor

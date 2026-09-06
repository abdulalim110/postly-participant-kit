export const typeDefs = `#graphql
  type User {
    id: ID!
    email: String!
    username: String!
    avatar: String
    createdAt: String!
    posts: [Post!]!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Post {
    id: ID!
    caption: String!
    imageUrl: String!
    author: User!
    comments: [Comment!]!
    createdAt: String!
  }

  type Comment {
    id: ID!
    content: String!
    postId: ID!
    author: User!
    post: Post!
    parentId: ID
    parent: Comment
    replies: [Comment!]!
    createdAt: String!
  }

  type Query {
    ping: String!
    me: User
    feed: [Post!]!
    post(id: ID!): Post
    userProfile(username: String!): User
  }

  type Mutation {
    register(email: String!, username: String!, password: String!, avatar: String): AuthPayload!
    login(identifier: String!, password: String!): AuthPayload!
    createPost(caption: String!, imageUrl: String!): Post!
    createComment(postId: ID!, parentId: ID, content: String!): Comment!
  }
`;

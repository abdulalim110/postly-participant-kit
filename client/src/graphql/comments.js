import { gql } from '@apollo/client';

export const CREATE_COMMENT_MUTATION = gql`
  mutation CreateComment($postId: ID!, $parentId: ID, $content: String!) {
    createComment(postId: $postId, parentId: $parentId, content: $content) {
      id
      content
      parentId
      createdAt
      author {
        id
        username
        avatar
      }
    }
  }
`;

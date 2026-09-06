import { gql } from '@apollo/client';

export const PUBLIC_FEED_QUERY = gql`
  query PublicFeed {
    feed {
      id
      caption
      imageUrl
      createdAt
      author {
        id
        username
        avatar
      }
      comments {
        id
        content
        parentId
        createdAt
        author {
          id
          username
          avatar
        }
        replies {
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
    }
  }
`;

export const CREATE_POST_MUTATION = gql`
  mutation CreatePost($caption: String!, $imageUrl: String!) {
    createPost(caption: $caption, imageUrl: $imageUrl) {
      id
      caption
      imageUrl
      createdAt
      author {
        id
        username
        avatar
      }
      comments {
        id
        content
        parentId
        createdAt
        author {
          id
          username
          avatar
        }
        replies {
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
    }
  }
`;

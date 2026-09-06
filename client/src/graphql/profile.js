import { gql } from '@apollo/client';

export const USER_PROFILE_QUERY = gql`
  query UserProfile($username: String!) {
    userProfile(username: $username) {
      id
      username
      email
      avatar
      createdAt
      posts {
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
  }
`;

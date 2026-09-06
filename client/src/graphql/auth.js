import { gql } from '@apollo/client';

export const REGISTER_MUTATION = gql`
  mutation Register($email: String!, $username: String!, $password: String!, $avatar: String) {
    register(email: $email, username: $username, password: $password, avatar: $avatar) {
      token
      user {
        id
        email
        username
        avatar
        createdAt
      }
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($identifier: String!, $password: String!) {
    login(identifier: $identifier, password: $password) {
      token
      user {
        id
        email
        username
        avatar
        createdAt
      }
    }
  }
`;

export const ME_QUERY = gql`
  query Me {
    me {
      id
      email
      username
      avatar
      createdAt
    }
  }
`;

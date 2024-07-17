import { gql } from 'apollo-angular';

export const getUsers = gql`
  query {
    users {
      id
      username
      gender
      birth
      phone
    }
  }
`;

export const getUserById = gql`
  query getUserById($id: ID!) {
    user(id: $id) {
      id
      username
      gender
      birth
      phone
    }
  }
`;

export const addUser = gql`
  mutation addUser($username: String!, $gender: String!, $birth: String!, $phone: String!) {
    createUser(username: $username, gender: $gender, birth: $birth, phone: $phone) {
      id
      username
      gender
      birth
      phone
    }
  }
`;

export const deleteUser = gql`
  mutation deleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;
export const typeDefs = `#graphql
  type Author {
    id: ID!
    name: String!
    country: String!
    books: [Book!]!
  }

  type Publisher {
    id: ID!
    name: String!
    city: String!
    books: [Book!]!
  }

  type Book {
    id: ID!
    title: String!
    isbn: String!
    publicationYear: Int!
    author: Author!
    publisher: Publisher!
  }

  type HealthStatus {
    status: String!
    database: String!
    dataLoaderEnabled: Boolean!
  }

  input CreateAuthorInput { name: String!, country: String! }
  input UpdateAuthorInput { name: String, country: String }
  input CreatePublisherInput { name: String!, city: String! }
  input UpdatePublisherInput { name: String, city: String }
  input CreateBookInput {
    title: String!
    isbn: String!
    publicationYear: Int!
    authorId: ID!
    publisherId: ID!
  }
  input UpdateBookInput {
    title: String
    isbn: String
    publicationYear: Int
    authorId: ID
    publisherId: ID
  }

  type Query {
    health: HealthStatus!
    authors: [Author!]!
    author(id: ID!): Author
    publishers: [Publisher!]!
    publisher(id: ID!): Publisher
    books(authorId: ID, publisherId: ID, search: String): [Book!]!
    book(id: ID!): Book
  }

  type Mutation {
    createAuthor(input: CreateAuthorInput!): Author!
    updateAuthor(id: ID!, input: UpdateAuthorInput!): Author!
    deleteAuthor(id: ID!): Boolean!
    createPublisher(input: CreatePublisherInput!): Publisher!
    updatePublisher(id: ID!, input: UpdatePublisherInput!): Publisher!
    deletePublisher(id: ID!): Boolean!
    createBook(input: CreateBookInput!): Book!
    updateBook(id: ID!, input: UpdateBookInput!): Book!
    deleteBook(id: ID!): Boolean!
  }
`;

export const typeDefs = `
  scalar Upload
  scalar JSON

  type User {
    id: ID!
    name: String!
    email: String!
    role: String!
    createdAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type FileMeta {
    id: ID!
    filename: String!
    mimetype: String!
    encoding: String!
    size: Int!
    url: String!
    uploadedAt: String!
  }

  type Document {
    id: ID!
    title: String!
    templateData: JSON!
    html: String!
    pdfUrl: String!
    createdAt: String!
  }

  type Query {
    me: User
    files: [FileMeta!]
    documents: [Document!]!
  }

  type Mutation {
    register(name: String!, email: String!, password: String!): User!
    login(email: String!, password: String!): AuthPayload!
    uploadFile(file: Upload!): FileMeta!
    createDocument(title: String!, templateData: JSON!, sendEmailTo: String): Document!
  }
`;

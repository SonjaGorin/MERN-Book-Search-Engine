const typeDefs = `
    type User {
        _id: ID!
        username: String!
        email: String!
        bookCount: Int
        savedBooks: [Book]
    }

    type Book {
        // Check the bookId type
        bookId: ID!
        authors: [String]
        description: String
        title: String!
        image: String
        link: String
    }

    input saveBook {
        bookId: String!
        authors: [String]
        description: String
        title: String!
        image: String
        link: String
    }

    type Auth {
        token: ID!
        user: User
    }

    type Query {
        me: User
    }

    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        saveBook(input: saveBook!): User
        removeBook(bookId: ID!): User
    }
`

module.exports = typeDefs;
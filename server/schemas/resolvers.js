const { User } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
    Query: {
        // finding all users
        users: async () => {
            return User.find();
        },

        // finding single user using user id
        singleUser: async (parent, {userId}) => {
            return User.findOne({ _id: userId });
        },

        // finging user that is logged in
        me: async (parent, args, context) => {
            if (context.user) {
                
                return User
                    .findOne({ _id: context.user._id })
            }
            console.log("1")
            throw AuthenticationError;
        },
    },

    Mutation: {
        // creating new user
        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);
            return { token, user };
        },

        // logging in and authenticating user's credentials
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
    
            if (!user) {
                throw AuthenticationError;
            }
    
            const correctPw = await user.isCorrectPassword(password);
    
            if (!correctPw) {
                throw AuthenticationError;
            }
    
            const token = signToken(user);
    
            return { token, user };
        },

        // saving book to user's list
        saveBook: async (parent, book, context) => {
            if (context.user) {
                console.log(book)
                const updateUser = await User.findOneAndUpdate(
                        { _id: context.user._id }, 
                        { $addToSet: { savedBooks: book } },
                        { 
                            new: true,
                            runValidators: true,
                        },
                    )
                    .populate("savedBooks");
                return updateUser;
            };
            throw AuthenticationError;
        },

        // removing book from user's list
        removeBook: async ( parent , {bookId}, context) => {
            if (context.user) {
                const updateUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: {bookId} }},
                    { new: true }
                )
                return updateUser;
            }
            throw AuthenticationError;
        },
    }
}

module.exports = resolvers;
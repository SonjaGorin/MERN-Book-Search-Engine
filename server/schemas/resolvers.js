const { User } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
    Query: {
        user: async (parent, {userId}) => {
            return User.findOne({ _id: userId })
        },

        me: async (parent, args, context) => {
            if (context.user) {
                return User
                    .findOne({ _id: context.user._id })
                    .populate("savedBooks")
                    .select(-__v -password);
            }
            throw AuthenticationError;
        },
    },

    Mutation: {
        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);
            return { token, user };
        },

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

        saveBook: async (parent, { input }, context) => {
            if (context.user) {
                const updateUser = await User.findOneAndUpdate(
                        { _id: context.user._id }, 
                        { $addToSet: { savedBooks: input } },
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

        removeBook: async ( parent , { bookId }, context) => {
            if (context.user) {
                const updateUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: {bookId} } },
                    { new: true }
                )
                return updateUser;
            }
            throw AuthenticationError;
        },
    }
}

module.exports = resolvers;
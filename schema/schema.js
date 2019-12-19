const graphql = require('graphql');
const User = require('../mongo-models/user');

const { 
    GraphQLObjectType, GraphQLString, 
    GraphQLID, GraphQLInt,GraphQLSchema, 
    GraphQLList,GraphQLNonNull 
} = graphql;

//Schema defines data on the Graph like object types(book type), relation between 
//these object types and descibes how it can reach into the graph to interact with 
//the data to retrieve or mutate the data   

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLID  },
        username: { type: GraphQLString }, 
        password: { type: GraphQLString },
        fullName: { type: GraphQLString }
    })
});

//RootQuery describe how users can use the graph and grab data.
//E.g Root query to get all authors, get all books, get a particular book 
//or get a particular author.
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user:{
            type:UserType,
            args: { id: {type:GraphQLID} },
            resolve(parent, args) {
                return User.findById(args.id);
            }
        },
        users:{
            type:new GraphQLList(UserType),
            resolve(parent, args) {
                return User.find({});
            }
        }
    }
});
//Very similar to RootQuery helps user to add/update to the database.
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addUser: {
            type: UserType,
            args: {
                //GraphQLNonNull make these field required
                username: { type: new GraphQLNonNull(GraphQLString) },
                password: { type: new GraphQLNonNull(GraphQLString) },
                fullName: { type: GraphQLString },
            },
            resolve(parent, args) {
                let user = new User({
                    username: args.username,
                    password: args.password,
                    fullName: args.fullName
                });
                return user.save();
            }
        },
        updateUser: {
            type: UserType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLString)},
                username: {type: new GraphQLNonNull(GraphQLString)},
                password: {type: new GraphQLNonNull(GraphQLString)},
                fullName: {type: GraphQLString}
            },
            resolve(parent, args){
                //----------------- promise version ( Asynchronous version on deleteUser) -----------------//
                return User.findByIdAndUpdate(
                    {"_id": args.id},
                    { "$set":{password: args.password, fullName: args.fullName}, $inc: { __v: 1 }}, //inc untuk increase __v di mongodb
                    {"new": true} //returns new document
                ).then(result => {
                    console.log("data has been updated");
                    return result;
                }).catch(error=> {
                    console.log(error);
                });
            }
        },
        deleteUser: {
            type: UserType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLString)},
            },
            resolve : async(parent, args) =>{
                //----------------- asynchronous version (promise version on updateUser) -----------------//
                // const removedUser = await User.findByIdAndRemove(args.id)
                // if (!removedUser) {
                // throw new Error('error')
                // }
                // return removedUser;

                try {
                    const removedUser = await User .findByIdAndRemove(args.id)
                    console.log("data has been deleted");
                    return removedUser
                }
                catch(error) {
                    console.log(error);
                }
            }
        }


    }
});
 
//Creating a new GraphQL Schema, with options query which defines query 
//we will allow users to use when they are making request.
module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation:Mutation
});
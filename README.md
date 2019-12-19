# MERN STACK By Me

## Folder Structure
    .
    ├── react-fronted           # structure is coming soon
    │   └── ...   
    ├── mongo-models            
    │   ├── user.js             # generate class from collection on database
    │   └── ...   
    ├── schema                  
    │   └── schema.js           # CRUD model
    ├── server.js               # API frontend to backend and set connection to database
    ├── nodemon.json            # in my case study i will use that for mongoDB environment, but you can use that like a global variable if you need. actually the main function nodemon not for a global variable, nodemon is used for automatically restarting the node application when file changes in the directory are detected.
    ├── package-lock.json
    └── package.json            # it's all your dependencies from npm.

## Installation

- npm init -y //create package.json
- npm install --save-dev nodemon //when we run command "npm start" nodemon will auto updating when we save the file and you can use nodemon like global variable on nodemon.json(this file you must create before)
- to active nodemon you need make litle change on package.json. follow command line below :
```json
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "nodemon server.js"
  },
```

Create two folder for **ReactJS** and **ExpressJS**

in each folder do the steps below :

**Express :**
- npm install express --save
- npm install express-graphql graphql --save
- npm install mongoose --save

**ReactJS :**
- npx create-react-app react-frontend

## Usage
**ExpressJS - MongoDB**

- create enviroment for mongoDB on nodemom.json(nodemon.json you must create before)
- Fill the file like the command line below
```json
{
    "env": {
        "MONGO_USER": "vi**o*",
        "MONGO_PASSWORD": "****",
        "MONGO_DATABASE": "**gas**hi*"
    }
}
```
- env is all you need to connect on your mongoDB account. you can use env on above like this "process.env.MONGO_USER" and you will get return value "vi**o*"
- next step create server.js in root folder
- Fill the file like the command line below. Ignore the schema if that show the error, it's normal because for now we don't have it yet.
```javascript
const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema')

const app = express();
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-hjseo.mongodb.net/${process.env.DATABASE}?retryWrites=true&w=majority', { useNewUrlParser: true })
mongoose.connection.once('open', () => {
    console.log('conneted to database');
});

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql:true
}));
app.listen(4000, () => {
    console.log('Listening on port 4000');
}); 
```
- next step is create the mongo-models folder
- mongo-models is folder for a collection of model to synchronize all the collection that you have in mongoDB.
- Fill the file like the command line below for any collection you have in mongoDB
```javascript
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({

    username:String,
    password:String,
    email:String,
    fullName: String
});

module.exports = mongoose.model('users', userSchema);
```
- next step is create the schema folder and create schema.js inside.
- schema.js is communication between backend and database. in this file you will create CRUD to any collection in your database.
- Fill the file like the command line below
```javascript

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
```
- RootQuery is R(Read) all data or certain data that you need.
- Mutation is CUD(Create,Update,Delete) on certain data that you need.
- now try CRUD on graphql, go to [graphql](http://localhost:4000/graphql) and fill the file like the command line below
```javascript
mutation{
  # addUser(username:"coba1", password:"1234", fullName:"again")
  # {
  #   username
  # }
  updateUser(id:"5dfa344050f7032d0ce5f044", username:"coba22", password:"1234", fullName:"s")
  {
    username
  }
}

# {
#   user(id:"5df65fa18e965523b0cbf801")
#   {
#     id
#     username
#     password
#     fullName
#   }
# }
```
- now you can explore more about express-graphql-mongodb. Enjoy learning :)

**ExpressJS - MongoDB**
- COMING SOON

-------------- Informasi tambahan -----------------
# Graphql Apollo
Ada tiga cara bagaimana menggunakan apollo
- Props
- Hooks
- HOC
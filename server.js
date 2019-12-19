const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema')

const app = express();

const mongoose = require('mongoose');

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-hjseo.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`, { useNewUrlParser: true })

mongoose.connection.once('open', () => {
    console.log('conneted to database');
});

app.use('/graphql', graphqlHTTP({
    //directing express-graphql to use this schema to map out the graph 
    schema,
    //directing express-graphql to use graphiql when goto '/graphql' address in the browser
    //which provides an interface to make GraphQl queries
    graphiql:true
}));
process.env.MY_VARIABLE = 'ahoy';
app.listen(4000, () => {
    console.log('Listening on port 4000');
    console.log(process.env.MY_VARIABLE);
}); 
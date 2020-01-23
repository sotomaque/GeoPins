const { ApolloServer } = require("apollo-server");
 
const typeDefs = require("./typeDefs");
const resolvers = require("./resolvers");
const { findOrCreateUser } = require('./controllers/userController'); 
const mongoose = require("mongoose");
require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log(`DB Connected`))
  .catch(err => console.log(err));
 
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    let authToken = null;
    let currentUser = null;
    
    try {
      authToken = req.headers.authorization;
      if (authToken) {
        currentUser = await findOrCreateUser(authToken);
      }
    } catch (err) {
      console.error(`Unable to auth user with token ${authToken}`);
    }

    return { currentUser }
  }
});
 
server.listen().then(({ url }) => console.log(url));
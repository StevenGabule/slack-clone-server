export default `
   type User {
    id: Int!
    username: String!
    email: String!
    teams: [Team!]!
   }
   
   type Message {
    id: Int!
    text: String!
    user: User!
    channel: Channel!
   }
   
   type Channel {
    id: Int!
    name: String!
    public: Boolean!
    messages: [Message!]!
    user: [User!]!
   }
   
   type Team {
      owner: User!
      members: [User!]!
      channels: [Channel!]!
    }

    type Query {
        h1: String
    }
`;

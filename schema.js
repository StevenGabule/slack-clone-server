export default `
type User {
  id: Int!
  username: String!
  email: String!
  password: String!
  teams: [Team!]!
}
   
type Channel {
  id: Int!
  name: String!
  public: Boolean!
  messages: [Message!]!
  user: [User!]!
}
   
type Message {
  id: Int!
  text: String!
  user: User!
  channel: Channel!
}
   
type Team {
  owner: User!
  members: [User!]!
  channels: [Channel!]!
}
   
type Query {
  getUser(id: Int!): User!
  allUsers: [User!]!
  hi: String
}

type Mutation {
  register(username: String!, email: String!,password: String!): Boolean!
  createTeam(name: String!): Boolean!
  createChannel(teamId: Int!,name: String!, public: Boolean=false): Boolean!
  createMessage(channelId: Int!, text: String!): Boolean!
}
`;

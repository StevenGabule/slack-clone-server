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
  teamId: Int!
}
   
type Message {
  id: Int!
  text: String!
  user: User!
  channel: Channel!
}
   
type Team {
  id: Int!
  name: String!
  owner: User!
  members: [User!]!
  channels: [Channel!]!
}
   

type Error {
  path: String!
  message: String
}

type RegisterResponse {
  ok: Boolean!
  user: User
  errors: [Error!]
}

type LoginResponse {
  ok: Boolean!
  token: String
  refreshToken: String
  errors: [Error!]
}

type CreateTeamResponse {
  ok: Boolean!
  errors: [Error!]
}

type CreateChannelResponse {
  ok: Boolean!
  channel: Channel
  errors: [Error!]
}

type Query {
  getUser(id: Int!): User!
  getCurrentUser: User
  allUsers: [User!]!
  allTeams: [Team!]!
}


type Mutation {
  register(username: String!, email: String!,password: String!): RegisterResponse!
  login(email: String!,password: String!): LoginResponse!
  createTeam(name: String!): CreateTeamResponse!
  createChannel(teamId: Int!,name: String!, public: Boolean=false): CreateChannelResponse!
  createMessage(channelId: Int!, text: String!): Boolean!
}
`;

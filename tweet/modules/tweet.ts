import { gqml } from "gqml";
import { p, getUserId, gql } from "../utils";

gqml.yoga({
  typeDefs: gql`
    type Query {
      tweet(id: ID!): Tweet
    }

    type Mutation {
      createTweet(text: String!, location: LocationInput!): Tweet!
    }

    type Tweet {
      id: ID!
      createdAt: DateTime!
      text: String!
      owner: User!
      location: Location!
    }

    input LocationInput {
      latitude: Float!
      longitude: Float!
    }

    type Location {
      latitude: Float!
      longitude: Float!
    }
  `,
  resolvers: {
    Query: {
      tweet: (parent, { id }) => {
        return p.tweet({ id });
      }
    },
    Mutation: {
      createTweet: (parent, { text, location }, ctx) => {
        const userId = getUserId(ctx);
        return p.createTweet({
          text,
          location: {
            create: location
          },
          owner: { connect: { id: userId } }
        });
      }
    }
  }
});

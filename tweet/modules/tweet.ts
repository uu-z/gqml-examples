import { gqml, or } from "gqml";
import { p, getUserId, gql, r } from "../utils";

gqml.yoga({
  typeDefs: gql`
    type Query {
      tweet(id: ID!): Tweet
    }

    type Mutation {
      createTweet(text: String!): Tweet!
      deleteTweet(id: ID!): Tweet
    }

    type Tweet {
      id: ID!
      createdAt: DateTime!
      text: String!
      owner: User!
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
          owner: { connect: { id: userId } }
        });
      },
      deleteTweet: {
        shield: or(r.isAdmin, r.isTweetOwner),
        resolve: (parent, { id }) => {
          return p.deleteTweet({ id });
        }
      }
    },
    Tweet: {
      // owner: parent => p.tweet({ id: parent.id }).owner()
    }
  }
});

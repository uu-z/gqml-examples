import { gqml, or } from "gqml";
import { p, getUserId, gql, r } from "../utils";

gqml.yoga({
  typeDefs: gql`
    type Query {
      tweet(id: ID!): Tweet
      tweets(where: TweetWhereInput, orderBy: TweetOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Tweet]!
    }
    type Mutation {
      createTweet(text: String!): Tweet!
      deleteTweet(id: ID!): Tweet
    }
  `,
  resolvers: {
    Query: {
      tweet: (parent, { id }) => {
        return p.tweet({ id });
      },
      tweets: (parent, args) => {
        return p.tweets(args);
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

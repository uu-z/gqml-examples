import { gqml, or } from "gqml";
import { p, getUserId, r } from "../utils";

gqml.yoga({
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
      createTweet: (parent, { text }, ctx) => {
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
    Subscription: {
      tweet: {
        subscribe: (parent, { where }) => {
          return p.$subscribe.tweet(where);
        },
        resolve: (payload, args) => {
          return payload;
        }
      }
    }
  }
});

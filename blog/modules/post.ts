import { gqml } from "gqml";
import { p, r, getUserId, gql } from "../utils";

gqml.yoga({
  typeDefs: gql`
    type Query {
      filterPosts(seachString: String): [Post!]!
    }
    type Mutation {
      createDraft(content: String, title: String!): Post!
      publish(id: ID!): Post
    }
  `,
  resolvers: {
    Query: {
      posts(parent, args) {
        return p.posts(args);
      },
      post(parent, { where }) {
        return p.post(where);
      },
      filterPosts(parent, { searchString }) {
        return p.posts({
          where: {
            OR: [{ title_contains: searchString }, { content_contains: searchString }]
          }
        });
      }
    },
    Mutation: {
      createDraft: {
        shield: r.isAuthUser,
        resolve: async (parnet, { content, title }, ctx) => {
          const userId = getUserId(ctx);
          return p.createPost({
            title,
            content,
            author: { connect: { id: userId } }
          });
        }
      },
      publish: {
        shield: r.isPostOwner,
        resolve(parent, { id }) {
          return p.updatePost({
            where: { id },
            data: { published: true }
          });
        }
      },
      deletePost: {
        shield: r.isPostOwner,
        resolve(parent, { where }) {
          return p.deletePost(where);
        }
      }
    },
    Subscription: {
      post: {
        subscribe: (parent, { where }) => {
          return p.$subscribe.post(where);
        },
        resolve: payload => {
          return payload;
        }
      }
    },
    Post: {
      author(parent, args) {
        return p.post({ id: parent.id }).author();
      }
    }
  }
});

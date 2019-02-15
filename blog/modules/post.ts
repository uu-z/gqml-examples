import { gqml } from "gqml";
import { p, getTokenData, gql } from "../utils";

gqml.yoga({
  typeDefs: gql`
    type Query {
      filterPosts(seachString: String): [Post!]!
      drafts(orderBy: PostOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Post]! @isAuthUser
    }
    type Mutation {
      createDraft(content: String, title: String!): Post! @isAuthUser
      publish(id: ID!): Post @isOwner(type: "post")
      deletePost(where: PostWhereUniqueInput): Post @isOwnerOrHasRole(type: "post", roles: ["ADMIN"])
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
      drafts(parent, args, ctx) {
        const { userId } = getTokenData(ctx);
        return p.posts({ where: { author: { id: userId }, published: false }, ...args });
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
      createDraft: async (parnet, { content, title }, ctx) => {
        const { userId } = getTokenData(ctx);
        return p.createPost({
          title,
          content,
          author: { connect: { id: userId } }
        });
      },
      publish: (parent, { id }) => {
        return p.updatePost({
          where: { id },
          data: { published: true }
        });
      },
      deletePost: (parent, { where }) => {
        return p.deletePost(where);
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

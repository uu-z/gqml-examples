import { gqml } from "gqml";
import { p, r, getUserId } from "../utils";

gqml.yoga({
  resolvers: {
    Query: {
      postFeed() {
        return p.posts({ where: { published: true } });
      },
      post(parent, { id }) {
        return p.post({ id });
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
        resolve(parent, { id }) {
          return p.deletePost({ id });
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

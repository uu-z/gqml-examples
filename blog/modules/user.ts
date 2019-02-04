import { gqml } from "gqml";
import { p } from "../utils";

gqml.yoga({
  resolvers: {
    Query: {
      publishedPosts(parent, args) {
        return p.posts({ where: { published: true } });
      },
      post(parent, { postId }) {
        return p.post({ id: postId });
      },
      postsByUser(parent, { userId }) {
        return p
          .user({
            id: userId
          })
          .posts();
      }
    },
    Mutation: {
      createDraft(parnet, { userId, title }) {
        return p.createPost({
          title,
          author: {
            connect: { id: userId }
          }
        });
      },
      publish(parent, { postId }) {
        return p.updatePost({
          where: { id: postId },
          data: { published: true }
        });
      },
      createUser(parent, { name }) {
        return p.createUser({
          name
        });
      }
    },
    User: {
      posts(parent, args) {
        return p
          .user({
            id: parent.id
          })
          .posts();
      }
    },
    Post: {
      author(parent, args) {
        return p
          .post({
            id: parent.id
          })
          .author();
      }
    }
  }
});

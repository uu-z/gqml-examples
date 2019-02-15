import axios from "axios";
import { gqml } from "gqml";
import { gql, p, signToken } from "../utils";

gqml.yoga({
  typeDefs: gql`
    type Mutation {
      authenticate_github(code: String!): AuthPayload!
    }
  `,
  resolvers: {
    Mutation: {
      authenticate_github: async (parent, { code }) => {
        const githubToken = await getGithubToken(code);
        const githubUser = await getGithubUser(githubToken);
        let user = await p.user({ githubUserId: `${githubUser.id}` });
        if (!user) {
          user = await p.createUser({
            githubUserId: `${githubUser.id}`,
            email: githubUser.email,
            name: githubUser.name,
            avatar: githubUser.avatar_url
          });
        }
        return {
          token: signToken(user),
          user
        };
      }
    }
  }
});

export interface GithubUser {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
}

export async function getGithubToken(code: string): Promise<string> {
  try {
    const { data } = await axios({
      url: "https://github.com/login/oauth/access_token",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json"
      },
      data: {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code
      }
    });
    return data.access_token;
  } catch (e) {
    throw new Error(e);
  }
}

export async function getGithubUser(access_token: string): Promise<GithubUser> {
  try {
    const { data } = await axios(`https://api.github.com/user?access_token=${access_token}`);
    return data;
  } catch (e) {
    throw new Error(e);
  }
}

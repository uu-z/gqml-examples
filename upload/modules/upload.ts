import * as shortid from "shortid";
import * as mkdirp from "mkdirp";
import { gqml } from "gqml";
import { p } from "../utils";
import fs from "fs";

const uploadDir = "./uploads";
mkdirp.sync(uploadDir);

const storeUpload = async ({ stream, filename }): Promise<any> => {
  const id = shortid.generate();
  const path = `${uploadDir}/${id}-${filename}`;

  return new Promise((resolve, reject) =>
    stream
      .pipe(fs.createWriteStream(path))
      .on("finish", () => resolve({ id, path }))
      .on("error", reject)
  );
};

const processUpload = async upload => {
  const { stream, filename, mimetype, encoding } = await upload;
  const { id, path } = await storeUpload({ stream, filename });
  return p.createFile({
    filename,
    mimetype,
    encoding,
    path
  });
};

gqml.yoga({
  resolvers: {
    Query: {
      file: (parent, { id }) => {
        return p.file({ id });
      },
      files: (parent, {}) => {
        return p.files();
      }
    },
    Mutation: {
      singleUpload: (parent, { file }) => processUpload(file),
      multipleUpload: (parent, { files }) => Promise.all(files.map(processUpload))
    }
  }
});

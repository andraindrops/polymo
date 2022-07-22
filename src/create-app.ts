import path from "path";
import fse from "fs-extra";

export const createApp = async ({ name }: { name: string }) => {
  fse.mkdirSync(name);

  const iDir = path.join(__dirname, "template");
  const oDir = name;

  fse.copySync(iDir, oDir);

  fse.renameSync(`${oDir}/.gitignore.example`, `${oDir}/.gitignore`);

  fse.copyFileSync(`${oDir}/.env.example`, `${oDir}/.env`);
};

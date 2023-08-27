import { promisify } from "util";
import fs from "fs";
import path from "path";
import handleAsync from "../utils/handelAsync";

const readfile = promisify(fs.readFile);
const writefile = promisify(fs.writeFile);

class FileManager {
  path = path.join(__dirname, "/../gitserver/data.json");
  read = handleAsync(async () => {
    const data = await readfile(this.path, "utf8");
    const jsonData = JSON.parse(data);
    console.log("file read");
    return jsonData;
  });

  write = handleAsync(async (data: any) => {
    writefile(this.path, JSON.stringify(data, null, 2), "utf8");
    console.log("file updated");
  });
}

const fileManger = new FileManager();

export default fileManger;

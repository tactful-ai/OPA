import { promisify } from "util";
import fs from "fs";
import path from "path";
import handleAsync from "../utils/handleAsync";
import { IDEFile } from "../DTO/types";
import { throws } from "assert";

const readfile = promisify(fs.readFile);
const writefile = promisify(fs.writeFile);

class FileManager {
  folderName = "OPA_Code";
  relativeCodePath = `/../${this.folderName}/`;
  OPACodePath = path.join(__dirname, this.relativeCodePath);
  ignoreList = [".git"];
  dataPath = path.join(
    __dirname,
    this.relativeCodePath + process.env.DATA_PATH
  );
  IDEContent: IDEFile[] = [];
  readData = async () => {
    const data = await readfile(this.dataPath, "utf8");
    const jsonData = JSON.parse(data);
    console.log("file read");
    return jsonData;
  };

  writeData = async (data: any) => {
    writefile(this.dataPath, JSON.stringify(data, null, 2), "utf8");
    console.log("file updated");
  };

  write = async (data: any, ID: string) => {
    try {
      let file = this.IDEContent.find((file) => file.ID == ID);
      if (!file) {
        throw new Error("file not found");
      }

      fs.writeFileSync(file.path, data, "utf8");
      console.log("file updated");
    } catch (error) {
      throw error;
    }
  };

  listFilesRecursively = async (directoryPath: string) => {
    const files = fs.readdirSync(directoryPath);

    files.forEach((file) => {
      // Construct whole file-path & retrieve file's stats
      const filePath = path.join(directoryPath, file);
      const stats = fs.statSync(filePath);
      if (this.ignoreList.includes(file)) {
        return;
      }
      //get ID
      const ID = filePath.slice(this.OPACodePath.length);
      //add child if there is a child
      this.checkChildDir(directoryPath, ID);

      let code = null;
      //get file contents if it is a file
      if (stats.isFile()) {
        code = fs.readFileSync(filePath, "utf8");
      }

      this.IDEContent.push({
        file: stats.isFile() ? true : false,
        path: filePath,
        text: file,
        ID: filePath.slice(this.OPACodePath.length),
        code,
        children: [],
        root: directoryPath == this.OPACodePath ? true : false,
      });

      if (stats.isFile()) {
        console.log("file " + filePath);
        //add file to IDEContent
      } else if (stats.isDirectory() && file !== ".git") {
        console.log("directory ", filePath);
        this.listFilesRecursively(filePath); // Recursively list files in subdirectories
      }
    });
  };
  checkChildDir = (dir: string, ID: string) => {
    this.IDEContent.forEach((file) => {
      if (file.path == dir) {
        file.children.push(ID);
      }
    });
  };
}


const fileManger = new FileManager();

export default fileManger;

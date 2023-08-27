import axios from "axios";

class OPALManager {
  retrieveOPALData = async () => {
    const opalData = await axios.get(process.env.OPAL_URL! + "/policy");
    console.log(
      "🚀 ~ file: OPALManger.ts:6 ~ OPALManager ~ retrieveOPALData= ~ opalData:",
      opalData.data.data_modules[0].data
    );
    return JSON.parse(opalData.data.data_modules[0].data);
  };
}

const opalManager = new OPALManager();
export default opalManager;

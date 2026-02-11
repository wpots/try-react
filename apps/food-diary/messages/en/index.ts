import baseMessages from "../en.json";
import commonMessages from "./common.json";
import landingMessages from "./landing.json";

const messages = {
  ...baseMessages,
  common: {
    ...baseMessages.common,
    ...commonMessages,
  },
  landing: landingMessages,
};

export default messages;

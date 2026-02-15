import baseMessages from "../nl.json";
import commonMessages from "./common.json";
import landingMessages from "./landing.json";
import entryMessages from "./entry.json";

const messages = {
  ...baseMessages,

  common: {
    ...baseMessages.common,

    ...commonMessages,
  },
  landing: landingMessages,
  entry: entryMessages,
};

export default messages;

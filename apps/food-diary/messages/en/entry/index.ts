import baseMessages from "./base.json";
import coachMessages from "./coach.json";
import coachReplyMessages from "./coachReplies.json";
import formMessages from "./form.json";
import supportingMessages from "./supporting.json";
import taxonomyMessages from "./taxonomy.json";

const entryMessages = {
  ...baseMessages,
  coach: coachMessages,
  coachReplies: coachReplyMessages,
  ...taxonomyMessages,
  form: formMessages,
  ...supportingMessages,
};

export default entryMessages;

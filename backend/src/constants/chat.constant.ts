export const MESSAGE_TYPE = ["text", "file", "image"] as const;

export type messageTypes = (typeof MESSAGE_TYPE)[number];

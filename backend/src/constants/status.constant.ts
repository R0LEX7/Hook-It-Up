export const INTERACTION_STATUSES = ["interested", "ignored"] as const;
export const FINAL_STATUSES = ["accepted", "rejected"] as const;

export type InteractionStatus = typeof INTERACTION_STATUSES[number];
export type FinalStatus = typeof FINAL_STATUSES[number];

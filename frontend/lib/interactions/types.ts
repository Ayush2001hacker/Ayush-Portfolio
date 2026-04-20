/** Domain keys for persisted likes & comments on the portfolio home. */
export type InteractionKind =
  | "blog"
  | "repository"
  | "portfolioWork"
  | "certification"
  | "experience";

export type InteractionComment = {
  id: string;
  text: string;
  at: number;
  /** Display name for the commenter (older stored comments may normalize to `"Anonymous"`). */
  authorName: string;
};

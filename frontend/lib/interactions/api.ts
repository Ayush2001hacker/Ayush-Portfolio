import { assertPublicApiUrl } from "@/lib/apiBase";
import type { InteractionComment, InteractionKind } from "./types";

export type InteractionsPayload = {
  comments: InteractionComment[];
  liked: boolean;
  likeCount: number;
};

export async function fetchInteractions(
  kind: InteractionKind,
  entityId: string,
  clientId: string,
): Promise<InteractionsPayload> {
  const base = assertPublicApiUrl();
  const qs = clientId ? `?clientId=${encodeURIComponent(clientId)}` : "";
  const url = `${base}/api/interactions/${encodeURIComponent(kind)}/${encodeURIComponent(entityId)}${qs}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`GET interactions failed: ${res.status}`);
  }
  const data = (await res.json()) as {
    comments?: InteractionComment[];
    liked?: boolean;
    likeCount?: number;
  };
  return {
    comments: Array.isArray(data.comments) ? data.comments : [],
    liked: Boolean(data.liked),
    likeCount: Number(data.likeCount ?? 0),
  };
}

export async function postComment(
  kind: InteractionKind,
  entityId: string,
  authorName: string,
  text: string,
): Promise<{ comment: InteractionComment }> {
  const base = assertPublicApiUrl();
  const res = await fetch(
    `${base}/api/interactions/${encodeURIComponent(kind)}/${encodeURIComponent(entityId)}/comments`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ authorName, text }),
    },
  );
  if (!res.ok) {
    throw new Error(`POST comment failed: ${res.status}`);
  }
  const data = (await res.json()) as { comment?: InteractionComment };
  if (!data.comment) throw new Error("Invalid comment response");
  return { comment: data.comment };
}

export async function toggleLikeRequest(
  kind: InteractionKind,
  entityId: string,
  clientId: string,
): Promise<{ liked: boolean; likeCount: number }> {
  const base = assertPublicApiUrl();
  const res = await fetch(
    `${base}/api/interactions/${encodeURIComponent(kind)}/${encodeURIComponent(entityId)}/like/toggle`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId }),
    },
  );
  if (!res.ok) {
    throw new Error(`POST like toggle failed: ${res.status}`);
  }
  const data = (await res.json()) as { liked?: boolean; likeCount?: number };
  return {
    liked: Boolean(data.liked),
    likeCount: Number(data.likeCount ?? 0),
  };
}

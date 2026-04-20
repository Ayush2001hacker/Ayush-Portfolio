"use client";

import type { ReactNode } from "react";
import { IconArticle, IconHome, IconSearch, IconSend, IconUser } from "./icons";

export type NavKey = "home" | "stack" | "blogs" | "contact" | "admin";

export const primaryNavItems: {
  key: NavKey;
  label: string;
  icon: (active: boolean) => ReactNode;
}[] = [
  { key: "home", label: "Home", icon: (a) => <IconHome active={a} /> },
  { key: "stack", label: "Stack", icon: () => <IconSearch /> },
  { key: "blogs", label: "Blogs", icon: () => <IconArticle /> },
  { key: "contact", label: "Contact", icon: () => <IconSend /> },
  { key: "admin", label: "Admin", icon: (a) => <IconUser active={a} /> },
];

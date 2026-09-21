"use client";

import { signOut } from "next-auth/react";
import PrimaryButton from "./primary-button";

export default function LogoutButton() {
  return <PrimaryButton text="Log out" onClick={() => signOut({ callbackUrl: "/login" })} />;
}

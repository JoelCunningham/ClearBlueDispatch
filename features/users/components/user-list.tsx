"use client";

import { useState } from "react";

import PrimaryButton from "@/components/buttons/primary-button";
import Card from "@/components/wrappers/card";
import List from "@/components/wrappers/list";
import { capitalise } from "@/lib/utils/string-utils";

interface UserListProps {
  users: {
    id: number;
    name: string;
    email: string;
    role: string;
    createdAt: string;
    deleted?: boolean;
  }[];
}

export function UserList({ users }: UserListProps) {
  const [showDeleted, setShowDeleted] = useState(false);

  const cardSubtitle = (user: { role: string; deleted?: boolean }) => {
    return user.deleted ? `${capitalise(user.role)} (deleted)` : capitalise(user.role);
  };

  return (
    <List emptyText="No users have been created yet.">
      {users
        .filter(user => (showDeleted ? user.deleted : !user.deleted))
        .map(user => (
          <Card
            key={user.id}
            title={user.name}
            subtitle={cardSubtitle(user)}
            href={`/users/${user.id}`}
            colour={user.deleted ? "muted" : "normal"}
          />
        ))}
      <PrimaryButton text={showDeleted ? "Show active" : "Show deleted"} onClick={() => setShowDeleted(!showDeleted)} />
    </List>
  );
}

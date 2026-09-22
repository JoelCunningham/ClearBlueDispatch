"use client";

import { ChevronDown } from "lucide-react";

type UserFilterProps = {
  users: { id: number; name: string }[];
  selectedUserId?: number;
};

export default function UserFilter({ users, selectedUserId }: UserFilterProps) {
  return (
    <form method="get">
      <div className="relative w-fit flex -mt-3">
        <ChevronDown />
        <select
          id="assignedUserId"
          name="assignedUserId"
          defaultValue={selectedUserId?.toString() ?? ""}
          onChange={event => {
            event.currentTarget.form?.requestSubmit();
          }}
          className="appearance-none cursor-pointer px-3 -mx-2 outline-none border-0 focus:ring-0"
        >
          <option value="">All drivers</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>
    </form>
  );
}

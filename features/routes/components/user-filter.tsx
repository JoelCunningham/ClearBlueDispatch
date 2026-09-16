"use client";

type UserFilterProps = {
  users: { id: number; name: string }[];
  selectedUserId?: number;
};

export function UserFilter({ users, selectedUserId }: UserFilterProps) {
  return (
    <form method="get" className="space-y-2">
      <label htmlFor="assignedUserId" className="text-sm font-medium">
        Assigned user
      </label>

      <select
        id="assignedUserId"
        name="assignedUserId"
        defaultValue={selectedUserId?.toString() ?? ""}
        onChange={event => {
          event.currentTarget.form?.requestSubmit();
        }}
        className="w-full rounded-md border bg-background px-3 py-2"
      >
        <option value="">All users</option>

        {users.map(user => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>
    </form>
  );
}

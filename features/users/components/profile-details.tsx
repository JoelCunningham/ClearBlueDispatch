import { capitalise } from "@/lib/utils/string-utils";
import { UserRole } from "@/types/next-auth";

type ProfileDetailsProps = {
  name?: string;
  email: string;
  role: UserRole;
  dateCreated: Date;
};

export function ProfileDetails({ name, email, role, dateCreated }: ProfileDetailsProps) {
  return (
    <section className="rounded-lg border">
      <div className="divide-y">
        {name && (
          <div className="p-4">
            <p className="text-sm text-muted-foreground">Name</p>
            <p className="mt-1 font-medium">{name}</p>
          </div>
        )}

        <div className="p-4">
          <p className="text-sm text-muted-foreground">Email</p>
          <p className="mt-1 font-medium">{email}</p>
        </div>

        <div className="p-4">
          <p className="text-sm text-muted-foreground">Role</p>
          <p className="mt-1 font-medium capitalize">{capitalise(role)}</p>
        </div>

        <div className="p-4">
          <p className="text-sm text-muted-foreground">Date created</p>
          <p className="mt-1 font-medium">{new Date(dateCreated).toLocaleDateString()}</p>
        </div>
      </div>
    </section>
  );
}

"use client";

import { RoleBadge } from "@/components/marketplace";
import { Button, Card, CardContent, PageHeader } from "@/components/ui";
import { useAuth } from "@/hooks/use-auth";
import { formatDate } from "@/lib/utils";
import { useRouter } from "next/navigation";

function ProfileContent() {
  const { user, logout } = useAuth();
  const router = useRouter();

  if (!user) return null;

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profile"
        description="Your account information."
      />

      <Card className="max-w-lg">
        <CardContent className="space-y-4 p-6">
          <div>
            <p className="text-sm text-zinc-500">Name</p>
            <p className="font-medium text-zinc-900 dark:text-zinc-100">{user.name}</p>
          </div>
          <div>
            <p className="text-sm text-zinc-500">Email</p>
            <p className="font-medium text-zinc-900 dark:text-zinc-100">{user.email}</p>
          </div>
          <div>
            <p className="text-sm text-zinc-500">Role</p>
            <div className="mt-1">
              <RoleBadge role={user.role} />
            </div>
          </div>
          <div>
            <p className="text-sm text-zinc-500">Member since</p>
            <p className="font-medium text-zinc-900 dark:text-zinc-100">
              {formatDate(user.createdAt)}
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ProfilePage() {
  return <ProfileContent />;
}

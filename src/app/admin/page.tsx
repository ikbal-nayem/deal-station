
'use client';

import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Welcome, Admin!</CardTitle>
            <CardDescription>Here's an overview of your application.</CardDescription>
          </CardHeader>
        </Card>
         <Card>
          <CardHeader>
            <CardTitle>Organizations</CardTitle>
            <CardDescription>Manage partner organizations.</CardDescription>
          </CardHeader>
        </Card>
         <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>Manage all user accounts.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}

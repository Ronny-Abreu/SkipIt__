import { ProtectedRoute } from "@/components/features/ProtectedRoute";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-gray-50">{children}</div>
    </ProtectedRoute>
  );
}


import { useAuthStore } from "@/stores/useAuthStore";
import { Loader } from "lucide-react";
import { Navigate } from "react-router-dom";

const AdminPage = () => {
  const { isAdmin, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-zinc-900 text-white">
        <Loader className="size-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <p className="text-zinc-400">Welcome to the Admin Dashboard.</p>
    </div>
  );
};

export default AdminPage;
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth.store";

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const logoutStore = useAuthStore((state) => state.logout);
  const clearUser = useAuthStore((state) => state.clearUser);

  const logout = () => {
    // 1. & 2. Hapus Token (di-handle oleh Zustand karena token & user disimpan disana)
    // 3. Hapus seluruh data auth pada Zustand (menggunakan clearUser / logout)
    logoutStore();
    clearUser(); 
    
    // 4. Hapus React Query cache yang berhubungan dengan user
    queryClient.clear();
    
    // 5. Redirect ke Landing Page
    router.push("/");
  };

  return logout;
}

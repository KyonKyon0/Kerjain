import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useLogin = () => {
  const loginStore = useAuthStore(state => state.login);
  const router = useRouter();

  return useMutation({
    mutationFn: ({ email, password }: Record<string, string>) => authService.login({ email, password }),
    onSuccess: (res: any) => {
      loginStore(res.data.user, res.data.role, res.data.token);
      toast.success("Login berhasil!");
      router.push("/dashboard");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal masuk");
    },
  });
};

export const useRegister = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: Record<string, unknown>) => authService.register(data),
    onSuccess: () => {
      toast.success("Registrasi berhasil, silakan login!");
      router.push("/login");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal mendaftar");
    },
  });
};

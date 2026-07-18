import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogin } from "@/hooks/api/auth/useLogin";

// ─── Validation schema ────────────────────────────────────────────────────────

const loginSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// ─── Component ────────────────────────────────────────────────────────────────

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mutate: login, isPending } = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  // After login, redirect back to where the user came from (or home)
  const from = (location.state as { from?: string })?.from ?? "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (values: LoginFormValues) => {
    login(values, {
      onSuccess: () => navigate(from, { replace: true }),
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f1ff] px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        {/* Header */}
        <div className="mb-8 text-center">
          <Link to="/">
            <img className="mx-auto mb-6 w-28" src="/navLogo.webp" alt="Evora" />
          </Link>
          <h1 className="text-2xl font-bold text-[#18181b]">Masuk ke Akun Anda</h1>
          <p className="mt-1 text-sm text-[#71717a]">
            Belum punya akun?{" "}
            <Link to="/register" className="font-medium text-[#6d28d9] hover:underline">
              Daftar sekarang
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {/* Email */}
          <div>
            <Label htmlFor="email" className="mb-1 block text-sm font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="mb-1 flex items-center justify-between">
              <Label htmlFor="password" className="block text-sm font-medium">
                Password
              </Label>
              <Link to="/forgot-password" className="text-xs font-semibold text-[#6d28d9] hover:underline">
                Lupa password?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Masukkan password"
                className="pr-10"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#71717a] hover:text-[#6d28d9]"
                aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="mt-2 w-full rounded-xl bg-[#6d28d9] py-5 text-[15px] font-semibold text-white hover:bg-[#5b21b6] disabled:opacity-60"
          >
            {isPending ? "Masuk..." : "Masuk"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;

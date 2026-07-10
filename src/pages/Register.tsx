import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRegister } from "@/hooks/api/auth/useRegister";

// ─── Validation schema ────────────────────────────────────────────────────────

const registerSchema = z
  .object({
    firstName: z.string().min(1, "Nama depan wajib diisi"),
    lastName: z.string().min(1, "Nama belakang wajib diisi"),
    email: z.string().email("Format email tidak valid"),
    password: z
      .string()
      .min(8, "Password minimal 8 karakter")
      .regex(/[A-Z]/, "Harus mengandung huruf kapital")
      .regex(/[0-9]/, "Harus mengandung angka"),
    confirmPassword: z.string(),
    role: z.enum(["CUSTOMER", "ORGANIZER"]),
    referralCode: z.string().optional(),
    organizerName: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"],
  })
  .refine(
    (data) =>
      data.role !== "ORGANIZER" || (data.organizerName?.trim().length ?? 0) > 0,
    {
      message: "Nama organisasi wajib diisi",
      path: ["organizerName"],
    }
  );

type RegisterFormValues = z.infer<typeof registerSchema>;

// ─── Component ────────────────────────────────────────────────────────────────

const Register = () => {
  const navigate = useNavigate();
  const { mutate: register, isPending } = useRegister();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register: field,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "CUSTOMER" },
  });

  const selectedRole = watch("role");

  const onSubmit = (values: RegisterFormValues) => {
    register(
      {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        role: values.role,
        referralCode: values.referralCode || undefined,
        organizerName: values.organizerName || undefined,
      },
      {
        onSuccess: () => navigate("/login"),
      }
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f1ff] px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        {/* Header */}
        <div className="mb-8 text-center">
          <Link to="/">
            <img className="mx-auto mb-6 w-28" src="/navLogo.webp" alt="Evora" />
          </Link>
          <h1 className="text-2xl font-bold text-[#18181b]">Buat Akun Baru</h1>
          <p className="mt-1 text-sm text-[#71717a]">
            Sudah punya akun?{" "}
            <Link to="/login" className="font-medium text-[#6d28d9] hover:underline">
              Masuk di sini
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {/* Name row */}
          <div className="flex gap-3">
            <div className="flex-1">
              <Label htmlFor="firstName" className="mb-1 block text-sm font-medium">
                Nama Depan
              </Label>
              <Input id="firstName" placeholder="John" {...field("firstName")} />
              {errors.firstName && (
                <p className="mt-1 text-xs text-red-500">{errors.firstName.message}</p>
              )}
            </div>
            <div className="flex-1">
              <Label htmlFor="lastName" className="mb-1 block text-sm font-medium">
                Nama Belakang
              </Label>
              <Input id="lastName" placeholder="Doe" {...field("lastName")} />
              {errors.lastName && (
                <p className="mt-1 text-xs text-red-500">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email" className="mb-1 block text-sm font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              {...field("email")}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <Label htmlFor="password" className="mb-1 block text-sm font-medium">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Min. 8 karakter"
                className="pr-10"
                {...field("password")}
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

          {/* Confirm Password */}
          <div>
            <Label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium">
              Konfirmasi Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirm ? "text" : "password"}
                placeholder="Ulangi password"
                className="pr-10"
                {...field("confirmPassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#71717a] hover:text-[#6d28d9]"
                aria-label={showConfirm ? "Sembunyikan konfirmasi" : "Tampilkan konfirmasi"}
              >
                {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Role */}
          <div>
            <Label className="mb-1 block text-sm font-medium">Daftar sebagai</Label>
            <div className="flex gap-3">
              {(["CUSTOMER", "ORGANIZER"] as const).map((role) => (
                <label
                  key={role}
                  className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all ${
                    selectedRole === role
                      ? "border-[#6d28d9] bg-[#f3edff] text-[#6d28d9]"
                      : "border-[#e4e4e7] text-[#71717a] hover:border-[#a78bfa]"
                  }`}
                >
                  <input
                    type="radio"
                    value={role}
                    className="sr-only"
                    {...field("role")}
                  />
                  {role === "CUSTOMER" ? "Pelanggan" : "Event Organizer"}
                </label>
              ))}
            </div>
          </div>

          {/* Organizer Name — only for ORGANIZER */}
          {selectedRole === "ORGANIZER" && (
            <div>
              <Label htmlFor="organizerName" className="mb-1 block text-sm font-medium">
                Nama Organisasi
              </Label>
              <Input
                id="organizerName"
                placeholder="Nama perusahaan atau organisasi"
                {...field("organizerName")}
              />
              {errors.organizerName && (
                <p className="mt-1 text-xs text-red-500">{errors.organizerName.message}</p>
              )}
            </div>
          )}

          {/* Referral Code — only for CUSTOMER */}
          {selectedRole === "CUSTOMER" && (
            <div>
              <Label htmlFor="referralCode" className="mb-1 block text-sm font-medium">
                Kode Referral{" "}
                <span className="font-normal text-[#71717a]">(opsional)</span>
              </Label>
              <Input
                id="referralCode"
                placeholder="Masukkan kode referral teman"
                className="uppercase placeholder:normal-case"
                {...field("referralCode")}
              />
              {errors.referralCode && (
                <p className="mt-1 text-xs text-red-500">{errors.referralCode.message}</p>
              )}
            </div>
          )}

          <Button
            type="submit"
            disabled={isPending}
            className="mt-2 w-full rounded-xl bg-[#6d28d9] py-5 text-[15px] font-semibold text-white hover:bg-[#5b21b6] disabled:opacity-60"
          >
            {isPending ? "Mendaftarkan..." : "Buat Akun"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Register;

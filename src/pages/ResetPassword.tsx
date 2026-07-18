import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, LoaderCircle, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useResetPassword } from "@/hooks/api/auth/usePasswordReset";

const schema = z
  .object({
    token: z.string().min(1, "Token reset wajib diisi"),
    newPassword: z.string().min(8, "Password minimal 8 karakter"),
    confirmPassword: z.string(),
  })
  .refine((value) => value.newPassword === value.confirmPassword, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirmPassword"],
  });
type FormValues = z.infer<typeof schema>;

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const resetPassword = useResetPassword();
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { token: searchParams.get("token") ?? "" },
  });

  const onSubmit = (values: FormValues) => {
    resetPassword.mutate(
      { token: values.token, newPassword: values.newPassword },
      { onSuccess: () => navigate("/login", { replace: true }) }
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f1ff] px-4 py-12">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm">
        <span className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-purple-100 text-[#6d28d9]"><LockKeyhole /></span>
        <h1 className="text-2xl font-bold text-[#211333]">Buat password baru</h1>
        <p className="mt-2 text-sm text-zinc-500">Token hanya dapat digunakan sekali dan berlaku selama 1 jam.</p>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-4" noValidate>
          <div><Label htmlFor="token" className="mb-2">Token reset</Label><Input id="token" placeholder="Tempel token reset" {...register("token")} />{errors.token && <p className="mt-1 text-xs text-red-500">{errors.token.message}</p>}</div>
          <div>
            <Label htmlFor="newPassword" className="mb-2">Password baru</Label>
            <div className="relative"><Input id="newPassword" type={showPassword ? "text" : "password"} className="pr-10" {...register("newPassword")} /><button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500">{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button></div>
            {errors.newPassword && <p className="mt-1 text-xs text-red-500">{errors.newPassword.message}</p>}
          </div>
          <div><Label htmlFor="confirmPassword" className="mb-2">Konfirmasi password</Label><Input id="confirmPassword" type={showPassword ? "text" : "password"} {...register("confirmPassword")} />{errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>}</div>
          <Button type="submit" disabled={resetPassword.isPending} className="w-full rounded-xl bg-[#6d28d9] py-5 text-white hover:bg-[#5b21b6]">{resetPassword.isPending && <LoaderCircle className="animate-spin" />} Simpan password baru</Button>
        </form>
        <p className="mt-6 text-center text-sm text-zinc-500">Ingat password? <Link to="/login" className="font-semibold text-[#6d28d9] hover:underline">Masuk</Link></p>
      </div>
    </div>
  );
};

export default ResetPassword;


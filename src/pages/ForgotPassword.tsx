import { useState } from "react";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, KeyRound, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForgotPassword } from "@/hooks/api/auth/usePasswordReset";

const schema = z.object({ email: z.string().email("Invalid email format") });
type FormValues = z.infer<typeof schema>;

const ForgotPassword = () => {
  const forgotPassword = useForgotPassword();
  const [resetToken, setResetToken] = useState<string>();
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (values: FormValues) => {
    forgotPassword.mutate(values.email, {
      onSuccess: (response) => setResetToken(response.data?.resetToken),
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f1ff] px-4 py-12">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm">
        <Link to="/login" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[#6d28d9]">
          <ArrowLeft className="size-4" /> Back to login
        </Link>
        <span className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-purple-100 text-[#6d28d9]"><KeyRound /></span>
        <h1 className="text-2xl font-bold text-[#211333]">Forgot your password?</h1>
        <p className="mt-2 text-sm leading-6 text-zinc-500">Enter your account email to create a reset link that is valid for 1 hour.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-4" noValidate>
          <div>
            <Label htmlFor="email" className="mb-2">Email</Label>
            <Input id="email" type="email" placeholder="name@email.com" {...register("email")} />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>
          <Button type="submit" disabled={forgotPassword.isPending} className="w-full rounded-xl bg-[#6d28d9] py-5 text-white hover:bg-[#5b21b6]">
            {forgotPassword.isPending && <LoaderCircle className="animate-spin" />} Create reset link
          </Button>
        </form>

        {forgotPassword.isSuccess && (
          <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
            {resetToken ? (
              <>
                <p className="mb-3">Development mode: the token was created successfully.</p>
                <Link to={`/reset-password?token=${resetToken}`} className="font-bold underline">Continue resetting password</Link>
              </>
            ) : (
              <p>If the email is registered, check your inbox to continue.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;

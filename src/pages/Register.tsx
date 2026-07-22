import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useForm, useWatch } from "react-hook-form";
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
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email format"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain an uppercase letter")
      .regex(/[0-9]/, "Must contain a number"),
    confirmPassword: z.string(),
    role: z.enum(["CUSTOMER", "ORGANIZER"]),
    referralCode: z.string().optional(),
    organizerName: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine(
    (data) =>
      data.role !== "ORGANIZER" || (data.organizerName?.trim().length ?? 0) > 0,
    {
      message: "Organization name is required",
      path: ["organizerName"],
    }
  );

type RegisterFormValues = z.infer<typeof registerSchema>;

// ─── Component ────────────────────────────────────────────────────────────────

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { mutate: register, isPending } = useRegister();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register: field,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "CUSTOMER",
      referralCode: searchParams.get("ref")?.toUpperCase() ?? "",
    },
  });

  const selectedRole = useWatch({ control, name: "role" });

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
          <h1 className="text-2xl font-bold text-[#18181b]">Create a New Account</h1>
          <p className="mt-1 text-sm text-[#71717a]">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-[#6d28d9] hover:underline">
              Log in here
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {/* Name row */}
          <div className="flex gap-3">
            <div className="flex-1">
              <Label htmlFor="firstName" className="mb-1 block text-sm font-medium">
                First Name
              </Label>
              <Input id="firstName" placeholder="John" {...field("firstName")} />
              {errors.firstName && (
                <p className="mt-1 text-xs text-red-500">{errors.firstName.message}</p>
              )}
            </div>
            <div className="flex-1">
              <Label htmlFor="lastName" className="mb-1 block text-sm font-medium">
                Last Name
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
                placeholder="Min. 8 characters"
                className="pr-10"
                {...field("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#71717a] hover:text-[#6d28d9]"
                aria-label={showPassword ? "Hide password" : "Show password"}
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
              Confirm Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirm ? "text" : "password"}
                placeholder="Re-enter your password"
                className="pr-10"
                {...field("confirmPassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#71717a] hover:text-[#6d28d9]"
                aria-label={showConfirm ? "Hide password confirmation" : "Show password confirmation"}
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
            <Label className="mb-1 block text-sm font-medium">Sign up as</Label>
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
                  {role === "CUSTOMER" ? "Customer" : "Event Organizer"}
                </label>
              ))}
            </div>
          </div>

          {/* Organizer Name — only for ORGANIZER */}
          {selectedRole === "ORGANIZER" && (
            <div>
              <Label htmlFor="organizerName" className="mb-1 block text-sm font-medium">
                Organization Name
              </Label>
              <Input
                id="organizerName"
                placeholder="Company or organization name"
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
                Referral Code{" "}
                <span className="font-normal text-[#71717a]">(optional)</span>
              </Label>
              <Input
                id="referralCode"
                placeholder="Enter a friend's referral code"
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
            {isPending ? "Creating account..." : "Create Account"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Register;

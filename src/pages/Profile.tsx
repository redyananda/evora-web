import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  CalendarClock,
  Camera,
  Check,
  Copy,
  Gift,
  KeyRound,
  LoaderCircle,
  Sparkles,
  TicketPercent,
  UserRound,
  Users,
} from "lucide-react";
import toast from "react-hot-toast";
import Navbar from "@/components/sections/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  useChangePassword,
  useProfile,
  useUpdateProfile,
} from "@/hooks/api/profile/useProfile";

const profileSchema = z.object({
  firstName: z.string().min(1, "Nama depan wajib diisi"),
  lastName: z.string().min(1, "Nama belakang wajib diisi"),
  email: z.string().email("Format email tidak valid"),
  phoneNumber: z.string(),
  address: z.string(),
  organizerName: z.string(),
  organizerDescription: z.string(),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Password saat ini wajib diisi"),
    newPassword: z.string().min(8, "Password baru minimal 8 karakter"),
    confirmPassword: z.string(),
  })
  .refine((value) => value.newPassword === value.confirmPassword, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirmPassword"],
  });

type ProfileForm = z.infer<typeof profileSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));

const rewardStatus = {
  ACTIVE: { label: "Aktif", className: "bg-emerald-100 text-emerald-700" },
  EXPIRED: { label: "Kedaluwarsa", className: "bg-zinc-100 text-zinc-500" },
  USED: { label: "Sudah dipakai", className: "bg-amber-100 text-amber-700" },
};

const Profile = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>();
  const { data: profile, isLoading, isError, refetch } = useProfile();
  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      address: "",
      organizerName: "",
      organizerDescription: "",
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPasswordForm,
    formState: { errors: passwordErrors },
  } = useForm<PasswordForm>({ resolver: zodResolver(passwordSchema) });

  useEffect(() => {
    if (!profile) return;
    reset({
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
      phoneNumber: profile.phoneNumber ?? "",
      address: profile.address ?? "",
      organizerName: profile.organizer?.organizerName ?? "",
      organizerDescription: profile.organizer?.organizerDescription ?? "",
    });
  }, [profile, reset]);

  const onPhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Pilih file gambar PNG, JPG, atau WebP");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran foto maksimal 2 MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setProfilePicture(String(reader.result));
    reader.readAsDataURL(file);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f5ff] text-[#6d28d9]">
        <LoaderCircle className="mr-2 size-6 animate-spin" /> Memuat profil...
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#f8f5ff]">
        <p className="text-zinc-600">Profil belum dapat dimuat.</p>
        <Button onClick={() => refetch()}>Coba lagi</Button>
      </div>
    );
  }

  const copyReferral = async () => {
    if (!profile.referralCode) return;
    await navigator.clipboard.writeText(profile.referralCode);
    toast.success("Kode referral disalin");
  };

  const displayedProfilePicture = profilePicture === undefined
    ? profile.profilePicture
    : profilePicture;

  const shareReferral = async () => {
    if (!profile.referralCode) return;
    const url = `${window.location.origin}/register?ref=${profile.referralCode}`;
    await navigator.clipboard.writeText(url);
    toast.success("Link referral disalin");
  };

  const onSubmitProfile = (values: ProfileForm) => {
    updateProfile.mutate({
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      phoneNumber: values.phoneNumber || null,
      address: values.address || null,
      profilePicture: displayedProfilePicture,
      ...(profile.userRole === "ORGANIZER"
        ? {
            organizerName: values.organizerName,
            organizerDescription: values.organizerDescription || null,
          }
        : {}),
    });
  };

  const onSubmitPassword = (values: PasswordForm) => {
    changePassword.mutate(
      {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      },
      { onSuccess: () => resetPasswordForm() }
    );
  };

  const initials = `${profile.firstName[0] ?? ""}${profile.lastName[0] ?? ""}`;

  return (
    <div className="min-h-screen bg-[#f8f5ff]">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#7c3aed]">
              Akun Evora
            </p>
            <h1 className="font-heading text-4xl font-semibold text-[#211333]">Profil & Hadiah</h1>
            <p className="mt-2 text-zinc-600">
              Kelola identitas, keamanan, poin, dan kupon Anda.
            </p>
          </div>
          <Link to="/" className="text-sm font-semibold text-[#6d28d9] hover:underline">
            Kembali ke beranda
          </Link>
        </div>

        <section className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl bg-gradient-to-br from-[#6d28d9] to-[#9333ea] p-6 text-white shadow-lg shadow-purple-200">
            <div className="mb-8 flex items-center justify-between">
              <Sparkles className="size-7" />
              <span className="rounded-full bg-white/15 px-3 py-1 text-xs">Saldo aktif</span>
            </div>
            <p className="text-sm text-purple-100">Poin referral</p>
            <p className="mt-1 text-3xl font-bold">{profile.userPoint.toLocaleString("id-ID")}</p>
            <p className="mt-3 text-xs text-purple-100">Setiap reward berlaku 3 bulan kalender.</p>
          </div>

          <div className="rounded-3xl border border-purple-100 bg-white p-6">
            <div className="mb-8 flex items-center justify-between text-[#6d28d9]">
              <Users className="size-7" />
              <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold">Referral</span>
            </div>
            <p className="text-sm text-zinc-500">Teman yang bergabung</p>
            <p className="mt-1 text-3xl font-bold text-[#211333]">{profile.referralCount}</p>
            <p className="mt-3 text-xs text-zinc-500">+10.000 poin per pelanggan berhasil daftar.</p>
          </div>

          <div className="rounded-3xl border border-purple-100 bg-white p-6">
            <div className="mb-6 flex items-center justify-between text-[#6d28d9]">
              <Gift className="size-7" />
              <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold">
                {profile.coupons.filter((coupon) => coupon.status === "ACTIVE").length} aktif
              </span>
            </div>
            <p className="text-sm text-zinc-500">Kode referral Anda</p>
            <button
              type="button"
              onClick={copyReferral}
              className="mt-2 flex w-full items-center justify-between rounded-xl bg-purple-50 px-4 py-3 font-mono font-bold text-[#6d28d9]"
            >
              {profile.referralCode ?? "-"} <Copy className="size-4" />
            </button>
            <button type="button" onClick={shareReferral} className="mt-2 text-xs font-semibold text-[#6d28d9] hover:underline">
              Salin link undangan
            </button>
          </div>
        </section>

        <div className="grid gap-8 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="space-y-8">
            <section className="rounded-3xl border border-purple-100 bg-white p-6 sm:p-8">
              <div className="mb-7 flex items-center gap-3">
                <span className="rounded-xl bg-purple-100 p-2.5 text-[#6d28d9]"><UserRound /></span>
                <div>
                  <h2 className="text-xl font-bold text-[#211333]">Informasi profil</h2>
                  <p className="text-sm text-zinc-500">Ditampilkan pada akun dan aktivitas Evora.</p>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmitProfile)} className="space-y-5" noValidate>
                <div className="flex flex-col items-center gap-4 rounded-2xl bg-purple-50/70 p-5 sm:flex-row">
                  <div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#6d28d9] text-2xl font-bold text-white">
                    {displayedProfilePicture ? (
                      <img src={displayedProfilePicture} alt="Foto profil" className="size-full object-cover" />
                    ) : initials.toUpperCase()}
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="font-semibold text-[#211333]">Foto profil</p>
                    <p className="mb-3 text-xs text-zinc-500">PNG, JPG, atau WebP, maksimal 2 MB.</p>
                    <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={onPhotoChange} className="hidden" />
                    <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} className="mr-2">
                      <Camera className="size-4" /> Ganti foto
                    </Button>
                    {displayedProfilePicture && (
                      <button type="button" onClick={() => setProfilePicture(null)} className="text-xs font-semibold text-red-500">
                        Hapus
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div><Label htmlFor="firstName" className="mb-2">Nama depan</Label><Input id="firstName" {...register("firstName")} />{errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName.message}</p>}</div>
                  <div><Label htmlFor="lastName" className="mb-2">Nama belakang</Label><Input id="lastName" {...register("lastName")} />{errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName.message}</p>}</div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div><Label htmlFor="profileEmail" className="mb-2">Email</Label><Input id="profileEmail" type="email" {...register("email")} />{errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}</div>
                  <div><Label htmlFor="phoneNumber" className="mb-2">Nomor telepon</Label><Input id="phoneNumber" placeholder="08xxxxxxxxxx" {...register("phoneNumber")} /></div>
                </div>
                <div><Label htmlFor="address" className="mb-2">Alamat</Label><Textarea id="address" placeholder="Alamat lengkap" {...register("address")} /></div>

                {profile.userRole === "ORGANIZER" && (
                  <div className="space-y-4 rounded-2xl border border-purple-100 p-5">
                    <p className="font-semibold text-[#6d28d9]">Profil event organizer</p>
                    <div><Label htmlFor="organizerName" className="mb-2">Nama organisasi</Label><Input id="organizerName" {...register("organizerName")} />{errors.organizerName && <p className="mt-1 text-xs text-red-500">{errors.organizerName.message}</p>}</div>
                    <div><Label htmlFor="organizerDescription" className="mb-2">Deskripsi organisasi</Label><Textarea id="organizerDescription" {...register("organizerDescription")} /></div>
                  </div>
                )}

                <Button type="submit" disabled={updateProfile.isPending} className="rounded-xl bg-[#6d28d9] px-6 text-white hover:bg-[#5b21b6]">
                  {updateProfile.isPending ? <LoaderCircle className="animate-spin" /> : <Check />} Simpan perubahan
                </Button>
              </form>
            </section>

            <section className="rounded-3xl border border-purple-100 bg-white p-6 sm:p-8">
              <div className="mb-6 flex items-center gap-3">
                <span className="rounded-xl bg-purple-100 p-2.5 text-[#6d28d9]"><KeyRound /></span>
                <div><h2 className="text-xl font-bold text-[#211333]">Ubah password</h2><p className="text-sm text-zinc-500">Gunakan minimal 8 karakter.</p></div>
              </div>
              <form onSubmit={handlePasswordSubmit(onSubmitPassword)} className="grid gap-4 sm:grid-cols-3" noValidate>
                <div><Label htmlFor="currentPassword" className="mb-2">Password saat ini</Label><Input id="currentPassword" type="password" {...registerPassword("currentPassword")} />{passwordErrors.currentPassword && <p className="mt-1 text-xs text-red-500">{passwordErrors.currentPassword.message}</p>}</div>
                <div><Label htmlFor="newPassword" className="mb-2">Password baru</Label><Input id="newPassword" type="password" {...registerPassword("newPassword")} />{passwordErrors.newPassword && <p className="mt-1 text-xs text-red-500">{passwordErrors.newPassword.message}</p>}</div>
                <div><Label htmlFor="confirmNewPassword" className="mb-2">Konfirmasi password</Label><Input id="confirmNewPassword" type="password" {...registerPassword("confirmPassword")} />{passwordErrors.confirmPassword && <p className="mt-1 text-xs text-red-500">{passwordErrors.confirmPassword.message}</p>}</div>
                <div className="sm:col-span-3"><Button type="submit" disabled={changePassword.isPending} variant="outline" className="border-[#6d28d9] text-[#6d28d9] hover:bg-purple-50">{changePassword.isPending ? "Menyimpan..." : "Ubah password"}</Button></div>
              </form>
            </section>
          </div>

          <aside className="space-y-8">
            <section className="rounded-3xl border border-purple-100 bg-white p-6">
              <div className="mb-5 flex items-center gap-3"><TicketPercent className="text-[#6d28d9]" /><h2 className="text-lg font-bold text-[#211333]">Kupon saya</h2></div>
              <div className="space-y-3">
                {profile.coupons.length === 0 && <p className="rounded-xl bg-zinc-50 p-4 text-sm text-zinc-500">Gunakan kode referral saat mendaftar untuk memperoleh kupon.</p>}
                {profile.coupons.map((coupon) => {
                  const status = rewardStatus[coupon.status];
                  return (
                    <div key={coupon.id} className="rounded-2xl border border-dashed border-purple-200 p-4">
                      <div className="flex items-start justify-between gap-2"><div><p className="font-mono text-sm font-bold text-[#6d28d9]">{coupon.code}</p><p className="mt-1 text-lg font-bold text-[#211333]">{formatCurrency(coupon.discount)}</p></div><span className={`rounded-full px-2 py-1 text-[10px] font-bold ${status.className}`}>{status.label}</span></div>
                      <p className="mt-3 flex items-center gap-1 text-xs text-zinc-500"><CalendarClock className="size-3.5" /> Berlaku hingga {formatDate(coupon.expiredAt)}</p>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="rounded-3xl border border-purple-100 bg-white p-6">
              <div className="mb-5 flex items-center gap-3"><Sparkles className="text-[#6d28d9]" /><h2 className="text-lg font-bold text-[#211333]">Riwayat poin</h2></div>
              <div className="space-y-3">
                {profile.points.length === 0 && <p className="rounded-xl bg-zinc-50 p-4 text-sm text-zinc-500">Bagikan kode referral untuk mulai mendapatkan poin.</p>}
                {profile.points.map((point) => {
                  const status = rewardStatus[point.status];
                  return (
                    <div key={point.id} className="flex items-start justify-between gap-3 border-b border-zinc-100 pb-3 last:border-0">
                      <div><p className="font-bold text-emerald-600">+{point.amount.toLocaleString("id-ID")}</p><p className="text-xs text-zinc-500">{formatDate(point.createdAt)} · exp. {formatDate(point.expiredAt)}</p></div>
                      <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${status.className}`}>{status.label}</span>
                    </div>
                  );
                })}
              </div>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Profile;

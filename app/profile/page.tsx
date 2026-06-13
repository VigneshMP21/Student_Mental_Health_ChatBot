"use client";

import { useState, useEffect, useRef } from "react";
import AppLayout from "@/components/layout/AppLayout";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { validatePassword } from "@/utils/security";
import { getInitials } from "@/utils/helpers";
import { User, Mail, Lock, Camera, Save, Eye, EyeOff, ZoomIn, X } from "lucide-react";

export default function ProfilePage() {
  const { profile, refreshProfile } = useAuth();
  const supabase = createClient();

  const [name, setName] = useState(profile?.name || "");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [cropModal, setCropModal] = useState(false);
  const [rawImage, setRawImage] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const viewportSize = 200;

  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setAvatarUrl(profile.avatar || "");
    }
  }, [profile]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setRawImage(reader.result as string);
      setScale(1);
      setCropModal(true);
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCropConfirm = () => {
    const img = imageRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;

    const size = viewportSize;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const displayW = img.clientWidth;
    const displayH = img.clientHeight;
    const cropSize = Math.min(displayW, displayH);
    const offsetX = (displayW - cropSize) / 2;
    const offsetY = (displayH - cropSize) / 2;
    const ratio = img.naturalWidth / displayW;

    ctx.drawImage(
      img,
      offsetX * ratio, offsetY * ratio, cropSize * ratio, cropSize * ratio,
      0, 0, size, size
    );

    setAvatarUrl(canvas.toDataURL("image/jpeg", 0.9));
    setCropModal(false);
    setRawImage(null);
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    setMessage("");
    setError("");

    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, avatar: avatarUrl || null }),
    });

    if (res.ok) {
      setMessage("Profile updated successfully");
      await refreshProfile();
    } else {
      const data = await res.json();
      setError(data.error || "Failed to update profile");
    }
    setProfileLoading(false);
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordLoading(true);
    setMessage("");
    setError("");

    const pwCheck = validatePassword(newPassword);
    if (!pwCheck.valid) {
      setError(pwCheck.message!);
      setPasswordLoading(false);
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: profile?.email || "",
      password: currentPassword,
    });

    if (signInError) {
      setError("Current password is incorrect");
      setPasswordLoading(false);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });

    if (updateError) {
      setError(updateError.message);
    } else {
      setMessage("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
    }
    setPasswordLoading(false);
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Profile Settings</h1>
          <p className="text-sm text-slate-500">Manage your account and preferences</p>
        </div>

        {message && (
          <div className="rounded-xl bg-green-50 border border-green-200 p-3 text-sm text-green-700" role="status">
            {message}
          </div>
        )}
        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-700" role="alert">
            {error}
          </div>
        )}

        <div className="card">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-accent-400 text-2xl font-bold text-white overflow-hidden">
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  getInitials(name || profile?.name)
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-md border border-slate-200 text-slate-500 hover:text-primary-600 hover:border-primary-300 transition-colors"
                aria-label="Upload profile photo"
              >
                <Camera className="h-4 w-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
            <div>
              <p className="font-semibold text-slate-900">{name || profile?.name}</p>
              <p className="text-sm text-slate-500">{profile?.email}</p>
            </div>
          </div>

          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">Personal Information</h2>

            <div>
              <label htmlFor="profile-name" className="block text-sm font-medium text-slate-700 mb-1.5">Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" aria-hidden="true" />
                <input id="profile-name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-field pl-10" />
              </div>
            </div>

            <div>
              <label htmlFor="profile-email" className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" aria-hidden="true" />
                <input id="profile-email" type="email" value={profile?.email || ""} disabled className="input-field pl-10 opacity-60 cursor-not-allowed" />
              </div>
            </div>

            <Button type="submit" loading={profileLoading}>
              <Save className="h-4 w-4" aria-hidden="true" />
              Save Profile
            </Button>
          </form>
        </div>

        <div className="card">
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">Change Password</h2>

            <div>
              <label htmlFor="current-password" className="block text-sm font-medium text-slate-700 mb-1.5">Current Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" aria-hidden="true" />
                <input id="current-password" type={showPassword ? "text" : "password"} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="input-field pl-10 pr-10" />
              </div>
            </div>

            <div>
              <label htmlFor="new-password" className="block text-sm font-medium text-slate-700 mb-1.5">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" aria-hidden="true" />
                <input id="new-password" type={showPassword ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="input-field pl-10 pr-10" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600" aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" loading={passwordLoading} variant="secondary">
              Update Password
            </Button>
          </form>
        </div>
      </div>

      {cropModal && rawImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Crop Profile Photo</h3>
              <button
                onClick={() => { setCropModal(false); setRawImage(null); }}
                className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                aria-label="Cancel crop"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div
              className="mx-auto overflow-hidden rounded-full border-4 border-white shadow-xl bg-slate-100"
              style={{ width: viewportSize, height: viewportSize }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={imageRef}
                src={rawImage}
                alt="Crop preview"
                className="h-full w-full object-cover"
                style={{ transform: `scale(${scale})`, objectPosition: "center" }}
              />
            </div>

            <div className="mt-4 flex items-center gap-3">
              <ZoomIn className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
              <input
                type="range"
                min="1"
                max="3"
                step="0.1"
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="w-full accent-primary-600"
                aria-label="Zoom scale"
              />
              <span className="text-xs text-slate-500 w-8 text-right">{scale}x</span>
            </div>

            <div className="mt-5 flex gap-3">
              <button
                onClick={() => { setCropModal(false); setRawImage(null); }}
                className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCropConfirm}
                className="flex-1 rounded-xl bg-gradient-to-r from-primary-600 to-accent-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all"
              >
                Save Photo
              </button>
            </div>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </AppLayout>
  );
}

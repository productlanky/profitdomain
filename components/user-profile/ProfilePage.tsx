"use client";

import React, { useEffect, useState, useCallback } from "react";
import { 
  AlertCircle, 
  MapPin, 
  ShieldCheck, 
  Key, 
  User, 
  FileText, 
  Camera,
  CheckCircle2,
  Lock,
  Edit2,
  Mail,
  Phone,
  Calendar,
  Globe,
  UploadCloud,
  X,
  Loader2,
  Clock,
  LucideIcon
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import Loading from "@/components/ui/Loading";

import { getUser } from "@/lib/appwrite/auth";
import {
  databases,
  DB_ID,
  PROFILE_COLLECTION_ID,
  RECEIPTS_BUCKET,
  storage,
} from "@/lib/appwrite/client";
import { ID, Query, Models } from "appwrite";

// ----------------------------------------------------------------------
// 1. STRICT TYPES & INTERFACES
// ----------------------------------------------------------------------

export type KYCStatus = "pending" | "reviewing" | "approved" | "rejected";

export interface ProfileDocument extends Models.Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  state: string;
  city: string;
  zip: string;
  address: string;
  gender: string;
  dob: string;
  refereeId: string;
  referredBy: string | null;
  photo_url: string | null;
  tierLevel: number;
  tiers?: { name: string };
  withdrawalPassword?: string | null;
  kycStatus?: KYCStatus;
  kycFront?: string | null;
  kycBack?: string | null;
}

export interface ProfileType {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  country: string;
  state: string;
  city: string;
  zip: string;
  address: string;
  gender: string;
  dob: string;
  referral_code: string;
  referred_by: string | null;
  photo_url: string | null;
  created_at: string;
  tier_level: number;
  tiers?: { name: string };
  withdrawal_password?: string | null;
  kycStatus: KYCStatus;
  kycFront?: string | null;
  kycBack?: string | null;
  refresh: () => void;
}

interface InfoItemProps {
  label: string;
  value: string | null | undefined;
  icon: LucideIcon;
}

interface DropZoneProps {
  label: string;
  file: File | null;
  preview: string | null;
  onDrop: (file: File | null) => void;
}

interface ErrorStateProps {
  error: string;
  retry: () => void;
}

interface AddressFormState {
  country: string;
  city: string;
  state: string;
  zip: string;
  address: string;
}

// ----------------------------------------------------------------------
// 2. MAIN PAGE COMPONENT
// ----------------------------------------------------------------------

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const router = useRouter();

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError(null);

      const user = await getUser();
      if (!user) {
        router.replace("/signin");
        return;
      }

      const profileResult = await databases.listDocuments<ProfileDocument>(
        DB_ID,
        PROFILE_COLLECTION_ID,
        [Query.equal("userId", user.$id)]
      );

      if (!profileResult?.documents?.length) {
        setLoadError("No profile found.");
        setProfile(null);
        return;
      }

      const doc = profileResult.documents[0];
      
      const mapped: ProfileType = {
        id: doc.$id,
        first_name: doc.firstName || "",
        last_name: doc.lastName || "",
        email: doc.email || "",
        phone: doc.phone || "",
        country: doc.country || "",
        state: doc.state || "",
        city: doc.city || "",
        zip: doc.zip || "",
        address: doc.address || "",
        gender: doc.gender || "",
        dob: doc.dob || "",
        referral_code: doc.refereeId || "",
        referred_by: doc.referredBy || null,
        photo_url: doc.photo_url || null,
        created_at: doc.$createdAt,
        tier_level: Number(doc.tierLevel || 0),
        tiers: doc.tiers,
        withdrawal_password: doc.withdrawalPassword || null,
        kycStatus: doc.kycStatus || "pending",
        kycFront: doc.kycFront,
        kycBack: doc.kycBack,
        refresh: () => {}, 
      };

      mapped.refresh = () => fetchProfile();
      setProfile(mapped);
    } catch (err) {
      console.error("Profile load error:", err);
      setLoadError("Failed to load profile.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (loading) return <div className="h-screen flex items-center justify-center"><Loading /></div>;
  if (loadError || !profile) return <ErrorState error={loadError!} retry={fetchProfile} />;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-brand-600 via-brand-700 to-indigo-900 p-8 md:p-12 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 blur-[100px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/30 blur-[80px] rounded-full pointer-events-none translate-y-1/3" />

        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
          
          <div className="relative group">
            <div className="h-32 w-32 rounded-full p-1 bg-white/20 backdrop-blur-md">
              <Avatar className="h-full w-full rounded-full border-4 border-white/10 shadow-xl">
                <AvatarImage src={profile.photo_url || "/images/user/user-01.png"} className="object-cover" />
                <AvatarFallback className="bg-brand-800 text-2xl font-bold">{profile.first_name[0]}</AvatarFallback>
              </Avatar>
            </div>
          </div>

          <div className="flex-1 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-medium backdrop-blur-sm mb-2">
              <ShieldCheck className="h-3 w-3 text-emerald-400" />
              <span>{profile.tiers?.name || "Member"} Status</span>
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight">{profile.first_name} {profile.last_name}</h1>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-white/80 mt-1">
              <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> {profile.email}</span>
              <span className="w-1 h-1 bg-white/40 rounded-full self-center" />
              <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {profile.city || "No City"}, {profile.country || "Global"}</span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 min-w-[200px]">
            <p className="text-xs uppercase tracking-wider text-white/60 font-semibold mb-2">Identity Status</p>
            <div className="flex items-center gap-2">
              {profile.kycStatus === 'approved' ? (
                <>
                  <div className="h-8 w-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30">
                    <CheckCircle2 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-lg leading-none">Verified</p>
                    <p className="text-[10px] text-emerald-300">Level 2 Access</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="h-8 w-8 bg-amber-500 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30">
                    <AlertCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-lg leading-none capitalize">{profile.kycStatus}</p>
                    <p className="text-[10px] text-amber-300">Action Required</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.5fr_1fr] gap-8">
        <div className="space-y-8">
          <PersonalInfoCard profile={profile} />
          <AddressCard profile={profile} />
        </div>
        <div className="space-y-8">
          <SecurityCard profile={profile} />
          <KYCSection profile={profile} />
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 3. SUB-COMPONENTS
// ----------------------------------------------------------------------

function PersonalInfoCard({ profile }: { profile: ProfileType }) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
          <User className="h-5 w-5" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Personal Details</h3>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <InfoItem label="Full Name" value={`${profile.first_name} ${profile.last_name}`} icon={User} />
        <InfoItem label="Email" value={profile.email} icon={Mail} />
        <InfoItem label="Phone" value={profile.phone || "Not set"} icon={Phone} />
        <InfoItem label="Date of Birth" value={profile.dob ? new Date(profile.dob).toLocaleDateString() : "Not set"} icon={Calendar} />
      </div>
    </div>
  );
}

function AddressCard({ profile }: { profile: ProfileType }) {
  const { isOpen, openModal, closeModal } = useModal();
  const [loading, setLoading] = useState(false);
  
  const [form, setForm] = useState<AddressFormState>({
    country: profile.country || "",
    city: profile.city || "",
    state: profile.state || "",
    zip: profile.zip || "",
    address: profile.address || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await databases.updateDocument(
        DB_ID,
        PROFILE_COLLECTION_ID,
        profile.id,
        form
      );

      toast.success("Address updated successfully.");
      profile.refresh();
      closeModal();
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update address.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5 relative overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-indigo-50 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Globe className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Residential Address</h3>
        </div>
        <Button variant="outline" size="sm" onClick={openModal} className="rounded-full gap-2 text-xs h-9">
          <Edit2 className="h-3 w-3" /> Edit
        </Button>
      </div>

      <div className="bg-gray-50 dark:bg-black/20 rounded-2xl p-5 border border-gray-100 dark:border-white/5">
        <div className="grid gap-4">
          <div className="flex justify-between border-b border-gray-200 dark:border-white/10 pb-3">
            <span className="text-sm text-gray-500">Street</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white text-right max-w-[200px] truncate">{profile.address || "--"}</span>
          </div>
          <div className="flex justify-between border-b border-gray-200 dark:border-white/10 pb-3">
            <span className="text-sm text-gray-500">City / State</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">{profile.city || "--"}, {profile.state || "--"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Country</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">{profile.country || "--"}</span>
          </div>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-lg">
        <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl">
          <h3 className="text-xl font-bold mb-1 text-gray-900 dark:text-white">Edit Address</h3>
          <p className="text-sm text-gray-500 mb-6">Update your location details for verification.</p>
          
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs">Country</Label>
                <Input name="country" value={form.country} onChange={handleChange} className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">City</Label>
                <Input name="city" value={form.city} onChange={handleChange} className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">State</Label>
                <Input name="state" value={form.state} onChange={handleChange} className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">Zip Code</Label>
                <Input name="zip" value={form.zip} onChange={handleChange} className="mt-1" />
              </div>
            </div>
            <div>
              <Label className="text-xs">Street Address</Label>
              <Input name="address" value={form.address} onChange={handleChange} className="mt-1" />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button type="button" variant="ghost" onClick={closeModal}>Cancel</Button>
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}

function SecurityCard({ profile }: { profile: ProfileType }) {
  const { isOpen, openModal, closeModal } = useModal();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const hasPassword = !!profile.withdrawal_password;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) return toast.error("Password too short (min 6 chars)");
    if (password !== confirmPassword) return toast.error("Passwords do not match");

    setLoading(true);
    try {
      await databases.updateDocument(
        DB_ID, 
        PROFILE_COLLECTION_ID, 
        profile.id, 
        { withdrawalPassword: password }
      );
      toast.success(hasPassword ? "Password updated" : "Password set successfully");
      profile.refresh();
      closeModal();
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error("Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-full bg-rose-50 dark:bg-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-400">
          <Key className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Security Vault</h3>
          <p className="text-xs text-gray-500">Withdrawal Protection</p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-2xl p-6 relative overflow-hidden">
        <div className="relative z-10 flex justify-between items-center">
          <div>
            <p className="text-xs text-white/60 uppercase tracking-wider mb-1">Withdrawal PIN</p>
            <p className="text-lg font-bold flex items-center gap-2">
              {hasPassword ? "Active & Secure" : "Not Configured"}
              {hasPassword ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <AlertCircle className="h-4 w-4 text-amber-400" />}
            </p>
          </div>
          <Button 
            size="sm" 
            onClick={openModal}
            className="bg-white text-gray-900 hover:bg-gray-100 border-none h-9 text-xs font-bold"
          >
            {hasPassword ? "Change PIN" : "Setup PIN"}
          </Button>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 transform translate-y-1/3 translate-x-1/4">
          <Lock className="h-32 w-32" />
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-md">
        <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl">
          <h3 className="text-xl font-bold mb-1 text-gray-900 dark:text-white">
            {hasPassword ? "Update Withdrawal PIN" : "Set Withdrawal PIN"}
          </h3>
          <p className="text-sm text-gray-500 mb-6">Required for all outgoing transactions.</p>
          
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <Label>New PIN / Password</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label>Confirm PIN / Password</Label>
              <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="mt-1" />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button type="button" variant="ghost" onClick={closeModal}>Cancel</Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Security PIN"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}

function KYCSection({ profile }: { profile: ProfileType }) {
  const status = profile.kycStatus;
  const isPending = status === "pending" || status === "rejected";

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-full bg-brand-50 dark:bg-brand-500/20 flex items-center justify-center text-brand-600 dark:text-brand-400">
          <FileText className="h-5 w-5" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">KYC Verification</h3>
      </div>

      {isPending ? (
        <KYCUploadForm profile={profile} />
      ) : (
        <div className="text-center py-8 bg-gray-50 dark:bg-white/5 rounded-2xl border border-dashed border-gray-300 dark:border-white/10">
          <div className="mx-auto h-16 w-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
            {status === 'approved' ? (
              <CheckCircle2 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            ) : (
              <Clock className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            )}
          </div>
          <h4 className="text-gray-900 dark:text-white font-bold capitalize">{status === 'reviewing' ? 'Under Review' : 'Verified'}</h4>
          <p className="text-sm text-gray-500 mt-1 px-6">
            {status === 'reviewing' 
              ? "Your documents are being processed. This usually takes 24-48 hours." 
              : "Identity confirmed. You have full access to all platform features."
            }
          </p>
        </div>
      )}
    </div>
  );
}

function KYCUploadForm({ profile }: { profile: ProfileType }) {
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const [backPreview, setBackPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    return () => {
      if (frontPreview) URL.revokeObjectURL(frontPreview);
      if (backPreview) URL.revokeObjectURL(backPreview);
    };
  }, [frontPreview, backPreview]);

  const handleSubmit = async () => {
    if (!frontFile || !backFile) return toast.error("Please upload both sides of ID");
    setUploading(true);

    try {
      const frontUpload = await storage.createFile(RECEIPTS_BUCKET, ID.unique(), frontFile);
      const frontUrl = storage.getFileView(RECEIPTS_BUCKET, frontUpload.$id);

      const backUpload = await storage.createFile(RECEIPTS_BUCKET, ID.unique(), backFile);
      const backUrl = storage.getFileView(RECEIPTS_BUCKET, backUpload.$id);

      await databases.updateDocument(DB_ID, PROFILE_COLLECTION_ID, profile.id, {
        kycStatus: "reviewing",
        kycFront: frontUrl,
        kycBack: backUrl
      });

      toast.success("Documents submitted for review");
      profile.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <DropZone 
          label="Front of ID" 
          file={frontFile} 
          preview={frontPreview}
          onDrop={(f) => { setFrontFile(f); setFrontPreview(f ? URL.createObjectURL(f) : null); }} 
        />
        <DropZone 
          label="Back of ID" 
          file={backFile} 
          preview={backPreview}
          onDrop={(f) => { setBackFile(f); setBackPreview(f ? URL.createObjectURL(f) : null); }} 
        />
      </div>
      <Button 
        onClick={handleSubmit} 
        disabled={uploading || !frontFile || !backFile}
        className="w-full mt-4"
      >
        {uploading ? "Uploading Securely..." : "Submit Verification"}
      </Button>
    </div>
  );
}

function DropZone({ label, file, preview, onDrop }: DropZoneProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    maxFiles: 1,
    onDrop: (files) => onDrop(files[0] || null)
  });

  return (
    <div 
      {...getRootProps()} 
      className={`
        relative border-2 border-dashed rounded-xl h-40 flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden
        ${isDragActive ? "border-brand-500 bg-brand-50/50" : "border-gray-300 dark:border-white/10 hover:border-brand-400 hover:bg-gray-50 dark:hover:bg-white/5"}
      `}
    >
      <input {...getInputProps()} />
      {preview ? (
        <>
          <Image src={preview} alt="Preview" fill className="object-cover opacity-60" />
          <div className="relative z-10 bg-black/50 text-white text-xs px-2 py-1 rounded-md">
            {file?.name}
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); onDrop(null); }}
            className="absolute top-2 right-2 p-1 bg-white text-black rounded-full shadow-md z-20"
          >
            <X className="h-3 w-3" />
          </button>
        </>
      ) : (
        <>
          <div className="h-10 w-10 bg-gray-100 dark:bg-white/10 rounded-full flex items-center justify-center mb-2 text-gray-500">
            <Camera className="h-5 w-5" />
          </div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">{label}</p>
          <p className="text-[10px] text-gray-500">Tap to upload</p>
        </>
      )}
    </div>
  );
}

// ----------------------------------------------------------------------
// 4. HELPER COMPONENTS
// ----------------------------------------------------------------------

const InfoItem = ({ label, value, icon: Icon }: InfoItemProps) => (
  <div className="flex items-start gap-3">
    <div className="h-8 w-8 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-400 shrink-0">
      <Icon className="h-4 w-4" />
    </div>
    <div>
      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{label}</p>
      <p className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">{value ?? "Not set"}</p>
    </div>
  </div>
);

const ErrorState = ({ error, retry }: ErrorStateProps) => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6">
    <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
      <AlertCircle className="h-8 w-8 text-red-600" />
    </div>
    <h2 className="text-xl font-bold text-gray-900">Profile Error</h2>
    <p className="text-gray-500 mt-2 mb-6">{error}</p>
    <Button onClick={retry} variant="outline">Try Again</Button>
  </div>
);
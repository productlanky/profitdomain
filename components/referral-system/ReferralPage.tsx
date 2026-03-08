"use client";

import { useEffect, useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { 
  Users, 
  Gift, 
  Link as LinkIcon, 
  Copy, 
  Share2, 
  Download, 
  Mail, 
  Send,
  X,
  Search
} from "lucide-react";
import { FaTwitter, FaWhatsapp } from "react-icons/fa"; // You might need react-icons installed
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  databases,
  DB_ID,
  PROFILE_COLLECTION_ID,
} from "@/lib/appwrite/client";
import { Query } from "appwrite";
import { getUser } from "@/lib/appwrite/auth";
import { toast } from "sonner";
import { format } from "date-fns";

// --- TYPES ---
type ReferredUser = {
  id: string;
  bonus: number;
  referred_by: string;
  created_at: string;
  profiles: {
    email: string;
    created_at: string;
  };
};

export default function ReferralPage() {
  const [referralLink, setReferralLink] = useState("");
  const [totalReferred, setTotalReferred] = useState(0);
  const [referralBonus, setReferralBonus] = useState(0);
  const [referredUsers, setReferredUsers] = useState<ReferredUser[]>([]);
  const qrRef = useRef<HTMLCanvasElement>(null);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://yourapp.com";

  useEffect(() => {
    const fetchReferralInfo = async () => {
      try {
        const user = await getUser();
        if (!user) return;

        const profileRes = await databases.listDocuments(
          DB_ID,
          PROFILE_COLLECTION_ID,
          [Query.equal("userId", user.$id)]
        );

        const profileDoc = profileRes.documents[0];
        if (!profileDoc) return;

        const code = profileDoc.refereeId;
        if (code) setReferralLink(`${baseUrl}/signup?ref=${code}`);

        const referralsList = await databases.listDocuments(
          DB_ID,
          PROFILE_COLLECTION_ID,
          [Query.equal("referredBy", code)]
        );

        const mappedReferredUsers: ReferredUser[] =
          referralsList.documents.map((ref) => ({
            id: ref.$id,
            bonus: 10,
            referred_by: ref.referredBy || "",
            created_at: ref.$createdAt,
            profiles: {
              email: ref.email,
              created_at: ref.$createdAt,
            },
          }));

        setReferredUsers(mappedReferredUsers);
        setTotalReferred(referralsList.total);
        setReferralBonus(referralsList.total * 10);
      } catch (error) {
        console.error("Error fetching referral info:", error);
      }
    };

    fetchReferralInfo();
  }, [baseUrl]);

  const handleDownloadQR = () => {
    const canvas = qrRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "referral-qr.png";
    link.click();
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success("Referral link copied!");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto py-8">
      
      {/* 1. HERO HEADER */}
      <div className="relative rounded-[2rem] overflow-hidden bg-brand-600 dark:bg-brand-900 p-8 md:p-12 text-white shadow-2xl">
        {/* Abstract Shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/30 rounded-full blur-[60px] translate-y-1/3 -translate-x-1/4 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 border border-white/20 text-xs font-semibold backdrop-blur-sm mb-4">
              <Gift className="h-3.5 w-3.5" />
              <span>Partner Program</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
              Invite friends, <br className="hidden md:block" /> get paid together.
            </h1>
            <p className="text-white/80 text-lg">
              Earn <span className="font-bold text-white">$10</span> for every friend who joins and deposits. There's no limit to how much you can earn.
            </p>
          </div>

          <div className="flex gap-4">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 min-w-[140px] text-center">
              <p className="text-xs uppercase tracking-wider text-white/60 font-medium mb-1">Referrals</p>
              <p className="text-3xl font-bold">{totalReferred}</p>
            </div>
            <div className="bg-white text-brand-900 rounded-2xl p-5 min-w-[140px] text-center shadow-lg">
              <p className="text-xs uppercase tracking-wider text-brand-900/60 font-medium mb-1">Earned</p>
              <p className="text-3xl font-bold">${referralBonus}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.5fr_1fr] gap-8">
        
        {/* LEFT COLUMN */}
        <div className="space-y-8">
          
          {/* Share Link Card */}
          <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-full bg-brand-50 dark:bg-brand-500/20 flex items-center justify-center text-brand-600 dark:text-brand-400">
                <LinkIcon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">Your Unique Link</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Share this link to track your referrals.</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Input 
                  readOnly 
                  value={referralLink} 
                  className="h-12 pl-4 pr-12 bg-gray-50 dark:bg-black/20 border-gray-200 dark:border-white/10 rounded-xl text-gray-600 dark:text-gray-300 font-mono text-sm"
                />
                <button 
                  onClick={copyToClipboard}
                  className="absolute right-2 top-2 p-2 hover:bg-white dark:hover:bg-white/10 rounded-lg text-gray-400 hover:text-brand-500 transition-colors"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => window.open(`https://twitter.com/intent/tweet?text=Join%20me!%20${referralLink}`, "_blank")}
                  variant="outline" 
                  size="icon"
                  className="h-12 w-12 rounded-xl border-gray-200 dark:border-white/10 hover:bg-blue-50 hover:border-blue-200 dark:hover:bg-blue-500/10 text-gray-600 dark:text-gray-400 hover:text-blue-500"
                >
                  <FaTwitter className="h-5 w-5" />
                </Button>
                <Button 
                  onClick={() => window.open(`https://wa.me/?text=Join%20me!%20${referralLink}`, "_blank")}
                  variant="outline" 
                  size="icon"
                  className="h-12 w-12 rounded-xl border-gray-200 dark:border-white/10 hover:bg-green-50 hover:border-green-200 dark:hover:bg-green-500/10 text-gray-600 dark:text-gray-400 hover:text-green-500"
                >
                  <FaWhatsapp className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Email Invite */}
          <InviteFriends />

          {/* Referral List */}
          <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-gray-100 dark:border-white/5 flex justify-between items-center">
              <h3 className="font-bold text-gray-900 dark:text-white">Referred Users</h3>
              <span className="text-xs bg-gray-100 dark:bg-white/10 px-2 py-1 rounded-md text-gray-500 dark:text-gray-400 font-medium">
                {totalReferred} Total
              </span>
            </div>
            
            {referredUsers.length === 0 ? (
              <div className="p-12 text-center">
                <div className="h-16 w-16 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-gray-300 dark:text-gray-600" />
                </div>
                <p className="text-gray-900 dark:text-white font-medium">No referrals yet</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Start sharing your link to earn rewards.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-white/5">
                {referredUsers.map((user) => (
                  <div key={user.id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-brand-100 dark:bg-brand-500/20 flex items-center justify-center text-brand-700 dark:text-brand-400 font-bold text-sm">
                        {user.profiles.email.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{user.profiles.email}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Joined {format(new Date(user.created_at), 'MMM d, yyyy')}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400">
                        +${user.bonus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-8">
          
          {/* QR Code Card */}
          <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-8 text-center shadow-sm flex flex-col items-center">
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Scan to Join</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Let friends scan this code for instant access.</p>
            
            <div className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 mb-6">
              <QRCodeCanvas ref={qrRef} value={referralLink} size={200} />
            </div>

            <Button 
              onClick={handleDownloadQR}
              variant="outline" 
              className="w-full rounded-xl gap-2 border-gray-200 dark:border-white/10"
            >
              <Download className="h-4 w-4" /> Save QR Image
            </Button>
          </div>

          {/* How it works */}
          <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">How it works</h3>
            <div className="space-y-4">
              {[
                { step: "01", text: "Send your unique link to friends." },
                { step: "02", text: "They sign up and make a deposit." },
                { step: "03", text: "You both get a $10 bonus instantly." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <span className="text-xs font-bold text-brand-500 mt-1">{item.step}</span>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function InviteFriends() {
  const [inputValue, setInputValue] = useState("");
  const [emails, setEmails] = useState<string[]>([]);

  const addEmail = (email: string) => {
    const trimmed = email.trim().replace(/,$/, "");
    if (trimmed && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed) && !emails.includes(trimmed)) {
      setEmails((prev) => [...prev, trimmed]);
    }
    setInputValue("");
  };

  const removeEmail = (email: string) => setEmails((prev) => prev.filter((e) => e !== email));

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && inputValue.trim()) {
      e.preventDefault();
      addEmail(inputValue);
    } else if (e.key === "Backspace" && !inputValue && emails.length) {
      e.preventDefault();
      setEmails((prev) => prev.slice(0, -1));
    }
  };

  return (
    <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
          <Mail className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white">Email Invites</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Send direct invitations to your contacts.</p>
        </div>
      </div>

      <div className="p-2 min-h-[56px] w-full flex flex-wrap items-center gap-2 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-black/20 focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:border-brand-500 transition-all">
        {emails.map((email) => (
          <span key={email} className="inline-flex items-center gap-1 pl-2.5 pr-1 py-1 rounded-lg bg-gray-100 dark:bg-white/10 text-xs font-medium text-gray-700 dark:text-gray-200">
            {email}
            <button onClick={() => removeEmail(email)} className="p-0.5 hover:bg-black/10 dark:hover:bg-white/20 rounded-md">
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          className="flex-1 bg-transparent border-none outline-none text-sm min-w-[120px] h-8 px-2 text-gray-900 dark:text-white placeholder:text-gray-400"
          placeholder={emails.length ? "" : "Type emails here..."}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleInputKeyDown}
        />
      </div>
      
      <div className="flex justify-between items-center mt-4">
        <p className="text-xs text-gray-400">Press Enter to add email</p>
        <Button 
          disabled={!emails.length} 
          onClick={() => {
            if(emails.length) {
              toast.success(`Invites sent to ${emails.length} people!`);
              setEmails([]);
            }
          }}
          className="rounded-xl h-10 px-6 bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-500/20"
        >
          Send Invites
        </Button>
      </div>
    </div>
  );
}
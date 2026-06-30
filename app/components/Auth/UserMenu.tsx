"use client";

import { User, LogOut } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

interface UserMenuProps {
  email?: string;
  avatarUrl?: string;
  onSignOut: () => void;
}

export function UserMenu({ email, avatarUrl, onSignOut }: UserMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-full border border-slate-200 hover:bg-slate-50 transition-colors"
      >
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt="Avatar"
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <User className="w-5 h-5 text-slate-600" />
        )}
        <span className="text-sm font-medium text-slate-700 max-w-32 truncate">
          {email?.split("@")[0]}
        </span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 z-50 overflow-hidden">
            <button
              onClick={async () => {
                setOpen(false);
                await onSignOut();
              }}
              className="w-full flex items-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors text-sm font-medium"
            >
              <LogOut className="w-4 h-4" />
              تسجيل الخروج
            </button>
          </div>
        </>
      )}
    </div>
  );
}

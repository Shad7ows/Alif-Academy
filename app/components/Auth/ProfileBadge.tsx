"use client";

import { Trophy, Star } from "lucide-react";
import { UserMenu } from "./UserMenu";

interface ProfileBadgeProps {
  email?: string;
  avatarUrl?: string;
  xp: number;
  completedLessons: number;
  onSignOut: () => void;
}

export function ProfileBadge({
  email,
  avatarUrl,
  xp,
  completedLessons,
  onSignOut,
}: ProfileBadgeProps) {
  return (
    <div className="hidden md:flex items-center gap-4">
      <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-full border border-slate-200 font-bold text-slate-700 text-sm">
        <div className="flex items-center gap-1.5 text-orange-600">
          <Star className="w-4 h-4 fill-orange-500" /> {xp}
        </div>
        <div className="w-px h-4 bg-slate-300" />
        <div className="flex items-center gap-1.5 text-emerald-600">
          <Trophy className="w-4 h-4" /> {completedLessons} دروس مكتملة
        </div>
      </div>
      <UserMenu email={email} avatarUrl={avatarUrl} onSignOut={onSignOut} />
    </div>
  );
}

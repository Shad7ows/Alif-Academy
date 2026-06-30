import { GoogleIcon, GitHubIcon } from "@/components/Auth/Icons";
interface SignInButtonProps {
  onGoogle?: () => void;
  onGitHub?: () => void;
  loading?: boolean;
  variant?: "google" | "github";
}

export function SignInButton({
  onGoogle,
  onGitHub,
  loading,
  variant = "google",
}: SignInButtonProps) {
  if (variant === "google" && onGoogle) {
    return (
      <button
        onClick={onGoogle}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-slate-300 rounded-xl font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-colors"
      >
        <GoogleIcon className="w-5 h-5" />
        {loading ? "جاري..." : "تسجيل الدخول بـ Google"}
      </button>
    );
  }

  if (variant === "github" && onGitHub) {
    return (
      <button
        onClick={onGitHub}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 disabled:opacity-50 transition-colors"
      >
        <GitHubIcon className="w-5 h-5" />
        {loading ? "جاري..." : "تسجيل الدخول بـ GitHub"}
      </button>
    );
  }

  return null;
}

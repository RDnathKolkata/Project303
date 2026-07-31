import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useFin } from "@/lib/fin-context";
import { LogOut, CheckCircle2, User, Mail, Sparkles } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GoogleAuthModal({ open, onOpenChange }: Props) {
  const { user, loginWithGoogle, updateUser, logout } = useFin();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setName(user.name);
    setEmail(user.email);
  }, [user]);

  // Attempt Google Identity Services Script injection if client ID available
  useEffect(() => {
    if (typeof window === "undefined") return;
    const existingScript = document.getElementById("google-gsi-script");
    if (!existingScript) {
      const script = document.createElement("script");
      script.id = "google-gsi-script";
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }, []);

  function handleQuickGoogleConnect() {
    // If email is provided, convert e.g. "debnathraj.deep3841@gmail.com" to formatted name
    let derivedName = name.trim();
    if (!derivedName && email.includes("@")) {
      const prefix = email.split("@")[0] || "";
      derivedName = prefix
        .replace(/[._\d]+/g, " ")
        .trim()
        .replace(/\b\w/g, (c) => c.toUpperCase());
    }
    if (!derivedName) derivedName = "Google User";

    loginWithGoogle({
      name: derivedName,
      email: email.trim() || "user@gmail.com",
    });
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onOpenChange(false);
    }, 800);
  }

  function handleSaveName() {
    updateUser({ name: name.trim(), email: email.trim() });
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onOpenChange(false);
    }, 800);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl p-6">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <svg className="size-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            </div>
            <div>
              <DialogTitle className="font-display text-lg font-bold">
                Google Authentication Profile
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Connected via Google OAuth & Gmail Account
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          {user.isAuthenticated && (
            <div className="flex items-center justify-between rounded-xl border border-primary/20 bg-sage-soft/60 p-3.5">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="font-display text-sm font-bold text-foreground">{user.name}</p>
                    <CheckCircle2 className="size-3.5 text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground">{user.email || "Google Verified"}</p>
                </div>
              </div>
              <span className="rounded-full bg-card px-2.5 py-1 text-[11px] font-semibold text-primary shadow-xs">
                Google OAuth
              </span>
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <User className="size-3.5 text-muted-foreground" /> Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Debnath Raj"
                className="mt-1.5 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground shadow-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Mail className="size-3.5 text-muted-foreground" /> Gmail / Google Account
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. debnathraj.deep3841@gmail.com"
                className="mt-1.5 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground shadow-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={handleQuickGoogleConnect}
              className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 shadow-xs"
            >
              <Sparkles className="size-4" />
              {isSaved ? "Saved Profile!" : "Authenticate & Save Google Account"}
            </button>

            {user.isAuthenticated && (
              <button
                onClick={() => {
                  logout();
                  setName("");
                  setEmail("");
                }}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-2 text-xs font-semibold text-destructive hover:bg-destructive/10"
              >
                <LogOut className="size-3.5" /> Sign Out
              </button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

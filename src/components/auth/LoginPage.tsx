import { FormEvent, useMemo, useState } from 'react';
import {
  ArrowRight,
  Eye,
  EyeOff,
  GitBranch,
  Lock,
  Mail,
  User,
  ShieldCheck,
  Sparkles,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { useAppStore } from '../../store/useAppStore';

type AuthMode = 'register' | 'login';
type StoredUser = {
  name: string;
  email: string;
  password: string;
};

const USERS_STORAGE_KEY = 'app-graph-builder:users';

export function LoginPage() {
  const login = useAppStore((state) => state.login);
  const [mode, setMode] = useState<AuthMode>('register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const normalizedEmail = useMemo(() => email.trim().toLowerCase(), [email]);
  const isRegistering = mode === 'register';

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!normalizedEmail || password.length < 6) {
      setError('Enter an email and a password with at least 6 characters.');
      setSuccess('');
      return;
    }

    const users = getStoredUsers();
    const existingUser = users.find((user) => user.email === normalizedEmail);

    if (isRegistering) {
      if (!name.trim()) {
        setError('Enter your name to create an account.');
        setSuccess('');
        return;
      }

      if (password !== confirmPassword) {
        setError('Password and confirm password must match.');
        setSuccess('');
        return;
      }

      if (existingUser) {
        setError('Account already exists for this email. Please login instead.');
        setMode('login');
        setPassword('');
        setConfirmPassword('');
        setSuccess('');
        return;
      }

      saveStoredUsers([
        ...users,
        {
          name: name.trim(),
          email: normalizedEmail,
          password,
        },
      ]);
      setError('');
      setSuccess('Registration successful! Please log in below.');
      setMode('login');
      setPassword('');
      setConfirmPassword('');
      return;
    }

    if (!existingUser) {
      setError('No account found with this email. Please register first.');
      setSuccess('');
      return;
    }

    if (existingUser.password !== password) {
      setError('Incorrect password. Please try again.');
      setSuccess('');
      return;
    }

    setError('');
    setSuccess('');
    login({ name: existingUser.name, email: existingUser.email });
  };

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setError('');
    setSuccess('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#0f0f10] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.11)_1px,transparent_1.5px)] [background-size:18px_18px]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[linear-gradient(180deg,rgba(37,99,235,0.20),transparent)]" />

      <section className="relative z-10 grid min-h-screen grid-cols-1 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="flex min-h-[36vh] flex-col justify-between p-5 sm:p-10 lg:min-h-screen">
          <div className="flex h-12 w-fit items-center overflow-hidden rounded-md border border-[#333] bg-[#151515] shadow-2xl">
            <div className="grid h-12 w-14 place-items-center border-r border-[#2a2a2a] bg-black">
              <div className="h-8 w-8 rounded-sm border-4 border-white border-r-transparent border-t-transparent" />
            </div>
            <div className="grid h-12 w-12 place-items-center bg-[#6657f4]">
              <Zap className="h-5 w-5" />
            </div>
            <div className="px-4 text-sm font-semibold">App Graph Builder</div>
          </div>

          <div className="max-w-2xl py-8 sm:py-12 lg:py-0">
            <Badge className="mb-6 border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
              <ShieldCheck className="mr-1 h-3.5 w-3.5" />
              Secure workspace
            </Badge>
            <h1 className="text-3xl font-semibold leading-tight tracking-normal sm:text-5xl lg:text-6xl">
              Build service topology with confidence.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-zinc-400">
              Register your workspace, login when your account exists, and then
              manage application graphs with saved layouts and service
              inspection.
            </p>
          </div>

          <div className="hidden grid-cols-3 gap-3 text-sm text-zinc-300 sm:grid">
            <FeaturePill icon={GitBranch} label="ReactFlow canvas" />
            <FeaturePill icon={Sparkles} label="Live inspector" />
            <FeaturePill icon={ShieldCheck} label="Saved workspace" />
          </div>
        </div>

        <div className="flex items-center justify-center px-5 pb-10 sm:px-10 lg:pb-0">
          <div className="w-full max-w-md rounded-lg border border-[#2d2d2d] bg-black/88 p-6 shadow-2xl backdrop-blur sm:p-8">
            <div className="mb-8">
              <div className="mb-2 text-2xl font-semibold">
                {isRegistering ? 'Create your account' : 'Welcome back'}
              </div>
              <p className="text-sm text-zinc-500">
                {isRegistering
                  ? 'First register a workspace account. You will land on the graph builder after signup.'
                  : 'Login with your existing account to continue to the graph builder.'}
              </p>
            </div>

            <form className="space-y-5" onSubmit={onSubmit}>
              {isRegistering ? (
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-zinc-300">
                    Full name
                  </span>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                    <Input
                      className="h-11 border-[#2f2f2f] bg-[#151515] pl-10 text-white placeholder:text-zinc-600"
                      type="text"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Your name"
                      autoComplete="name"
                    />
                  </div>
                </label>
              ) : null}

              <label className="block space-y-2">
                <span className="text-sm font-medium text-zinc-300">
                  Email address
                </span>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                  <Input
                    className="h-11 border-[#2f2f2f] bg-[#151515] pl-10 text-white placeholder:text-zinc-600"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@company.com"
                    autoComplete="email"
                  />
                </div>
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-zinc-300">
                  Password
                </span>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                  <Input
                    className="h-11 border-[#2f2f2f] bg-[#151515] pl-10 pr-11 text-white placeholder:text-zinc-600"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter password"
                    autoComplete="current-password"
                  />
                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors hover:text-white"
                    type="button"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowPassword((value) => !value)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </label>

              {isRegistering ? (
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-zinc-300">
                    Confirm password
                  </span>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                    <Input
                      className="h-11 border-[#2f2f2f] bg-[#151515] pl-10 text-white placeholder:text-zinc-600"
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(event) =>
                        setConfirmPassword(event.target.value)
                      }
                      placeholder="Confirm password"
                      autoComplete="new-password"
                    />
                  </div>
                </label>
              ) : null}

              {error ? (
                <div className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                  {error}
                </div>
              ) : null}

              {success ? (
                <div className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
                  {success}
                </div>
              ) : null}

              <Button
                className="h-11 w-full bg-[#2563eb] text-base hover:bg-[#1d4ed8]"
                type="submit"
              >
                {isRegistering ? 'Register account' : 'Login'}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>

            <div className="mt-6 rounded-md border border-[#262626] bg-[#111] p-4 text-sm text-zinc-500">
              {isRegistering ? 'Already have an account?' : 'New here?'}{' '}
              <button
                className="font-medium text-blue-300 transition-colors hover:text-blue-200"
                type="button"
                onClick={() => switchMode(isRegistering ? 'login' : 'register')}
              >
                {isRegistering ? 'Login instead' : 'Register first'}
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function FeaturePill({
  icon: Icon,
  label,
}: {
  icon: LucideIcon;
  label: string;
}) {
  return (
    <div className="flex h-12 items-center gap-3 rounded-md border border-[#2b2b2b] bg-black/70 px-4 shadow-xl">
      <Icon className="h-4 w-4 text-[#60a5fa]" />
      <span>{label}</span>
    </div>
  );
}

function getStoredUsers() {
  try {
    const saved = window.localStorage.getItem(USERS_STORAGE_KEY);
    return saved ? (JSON.parse(saved) as StoredUser[]) : [];
  } catch {
    return [];
  }
}

function saveStoredUsers(users: StoredUser[]) {
  window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

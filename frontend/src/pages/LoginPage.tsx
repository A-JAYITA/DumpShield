import { useState, type FormEvent } from 'react';
import { LogIn, ShieldCheck } from 'lucide-react';
import AuthLayout from '../components/auth/AuthLayout';
import { useAuth } from '../contexts/AuthContext';

interface LoginPageProps {
  onNavigate: (path: '/signup') => void;
}

const LoginPage = ({ onNavigate }: LoginPageProps) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim() || !password) {
      setError('Email and password are required.');
      return;
    }

    try {
      setIsSubmitting(true);
      await login({ email: email.trim(), password });
      setSuccess('Login successful. Opening command console...');
      window.history.pushState({}, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to log in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md">
        <div className="mb-8 text-center lg:text-left">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500 text-black lg:mx-0">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-emerald-400">
            Operator Login
          </p>
          <h2 className="mt-3 text-4xl font-black uppercase italic tracking-tight text-white">
            Welcome Back
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="glass-card p-6 sm:p-8">
          <label className="block">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              Email
            </span>
            <input
              className="mt-3 w-full border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-400"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
            />
          </label>

          <label className="mt-5 block">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              Password
            </span>
            <input
              className="mt-3 w-full border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-400"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
            />
          </label>

          {error && (
            <p className="mt-5 border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </p>
          )}

          {success && (
            <p className="mt-5 border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
              {success}
            </p>
          )}

          <button
            className="mt-6 flex w-full items-center justify-center gap-3 bg-emerald-500 px-5 py-4 text-[11px] font-black uppercase tracking-[0.3em] text-black transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
            type="submit"
            disabled={isSubmitting}
          >
            <LogIn className="h-4 w-4" />
            {isSubmitting ? 'Signing In' : 'Sign In'}
          </button>

          <p className="mt-6 text-center text-sm text-slate-400">
            Need an operator account?{' '}
            <button
              type="button"
              onClick={() => onNavigate('/signup')}
              className="font-bold text-emerald-300 hover:text-white"
            >
              Create one
            </button>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;

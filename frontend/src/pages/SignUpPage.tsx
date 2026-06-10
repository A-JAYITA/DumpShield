import { useMemo, useState, type FormEvent } from 'react';
import { ShieldPlus, UserPlus } from 'lucide-react';
import AuthLayout from '../components/auth/AuthLayout';
import { useAuth } from '../contexts/AuthContext';

interface SignUpPageProps {
  onNavigate: (path: '/login') => void;
}

const SignUpPage = ({ onNavigate }: SignUpPageProps) => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const passwordHint = useMemo(() => {
    if (!password) {
      return '';
    }

    return password.length >= 8
      ? 'Password length looks good.'
      : 'Use at least 8 characters.';
  }, [password]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError('All fields are required.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setIsSubmitting(true);
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
        confirm_password: confirmPassword,
      });
      setSuccess('Account created. Opening command console...');
      window.history.pushState({}, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md">
        <div className="mb-8 text-center lg:text-left">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500 text-black lg:mx-0">
            <ShieldPlus className="h-7 w-7" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-emerald-400">
            Operator Signup
          </p>
          <h2 className="mt-3 text-4xl font-black uppercase italic tracking-tight text-white">
            Create Access
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="glass-card p-6 sm:p-8">
          <label className="block">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              Name
            </span>
            <input
              className="mt-3 w-full border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-400"
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="name"
            />
          </label>

          <label className="mt-5 block">
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
              autoComplete="new-password"
            />
            {passwordHint && (
              <span className="mt-2 block text-xs text-slate-500">{passwordHint}</span>
            )}
          </label>

          <label className="mt-5 block">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              Confirm Password
            </span>
            <input
              className="mt-3 w-full border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-400"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              autoComplete="new-password"
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
            <UserPlus className="h-4 w-4" />
            {isSubmitting ? 'Creating' : 'Create Account'}
          </button>

          <p className="mt-6 text-center text-sm text-slate-400">
            Already have access?{' '}
            <button
              type="button"
              onClick={() => onNavigate('/login')}
              className="font-bold text-emerald-300 hover:text-white"
            >
              Sign in
            </button>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default SignUpPage;

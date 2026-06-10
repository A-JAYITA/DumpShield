import { ShieldCheck, Zap } from 'lucide-react';
import type { ReactNode } from 'react';

const AuthLayout = ({ children }: { children: ReactNode }) => (
  <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-emerald-500/30 overflow-hidden">
    <div className="fixed inset-0 z-0">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_#1e293b_0%,_transparent_50%)] opacity-50" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b1a_1px,transparent_1px),linear-gradient(to_bottom,#1e293b1a_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="absolute -right-32 top-12 h-[520px] w-[520px] rounded-full bg-emerald-500/10 blur-[130px]" />
    </div>

    <main className="relative z-10 grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
      <section className="hidden lg:flex flex-col justify-between border-r border-white/5 px-12 py-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)]">
            <Zap className="w-6 h-6 text-black" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">
              DUMP<span className="text-emerald-500">SHIELD</span>
            </h1>
            <p className="text-[10px] font-black text-emerald-500/50 uppercase tracking-[0.4em]">
              City OS v4.2
            </p>
          </div>
        </div>

        <div className="max-w-2xl">
          <ShieldCheck className="mb-8 h-16 w-16 text-emerald-400" />
          <p className="mb-6 text-[11px] font-black uppercase tracking-[0.45em] text-emerald-400">
            Secure Command Access
          </p>
          <h2 className="text-6xl font-black uppercase italic tracking-tight text-white">
            Predict.
            <br />
            Prevent.
            <br />
            Protect.
          </h2>
          <p className="mt-8 max-w-xl text-sm leading-7 text-slate-400">
            Authorized teams can monitor hotspots, run neural scans, and coordinate
            cleanup intelligence from a protected operational console.
          </p>
        </div>

        <p className="text-[10px] font-black uppercase tracking-[0.35em] text-slate-600">
          Hyderabad Smart City Intelligence
        </p>
      </section>

      <section className="flex min-h-screen items-center justify-center px-5 py-10">
        {children}
      </section>
    </main>
  </div>
);

export default AuthLayout;

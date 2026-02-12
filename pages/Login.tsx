
import React, { useState } from 'react';
import { Zap, ArrowLeft, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface LoginProps {
  store: any;
}

const Login: React.FC<LoginProps> = ({ store }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login, signup } = store;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isLogin) {
        await login(email);
      } else {
        await signup(name, email, password);
      }
      navigate('/dashboard');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Authentication failed. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-6 transition-colors duration-500">
      <Link 
        to="/" 
        className="fixed top-8 left-8 flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-blue-500 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Home
      </Link>

      <div className="w-full max-w-md glass-card p-10 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-2xl space-y-8 animate-in zoom-in slide-in-from-bottom-4 duration-700">
        <div className="text-center space-y-3">
          <div className="inline-flex bg-blue-600 p-4 rounded-3xl text-white mb-4 shadow-xl shadow-blue-500/30">
            <Zap size={36} fill="currentColor" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter">ZenSpace</h1>
          <p className="text-zinc-500 font-medium">{isLogin ? 'Step back into your flow.' : 'Start your journey to clarity.'}</p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-2xl p-4 flex gap-3 text-sm">
            <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        <div className="flex p-1 glass-inset rounded-2xl">
          <button 
            onClick={() => {
              setIsLogin(true);
              setError(null);
            }}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${isLogin ? 'bg-white dark:bg-zinc-800 shadow-sm text-blue-600' : 'text-zinc-500'}`}
          >
            Sign In
          </button>
          <button 
            onClick={() => {
              setIsLogin(false);
              setError(null);
            }}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${!isLogin ? 'bg-white dark:bg-zinc-800 shadow-sm text-blue-600' : 'text-zinc-500'}`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1">Full Name</label>
                <input 
                  required
                  type="text" 
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 py-4 px-5 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/30 transition-all font-medium disabled:opacity-50"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1">Email</label>
              <input 
                required
                type="email" 
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 py-4 px-5 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/30 transition-all font-medium disabled:opacity-50"
              />
              {isLogin && <p className="text-[10px] text-zinc-500 pl-1">Demo: demo@example.com</p>}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Password</label>
                {isLogin && <button type="button" className="text-[10px] font-bold text-blue-600 hover:underline">Forgot?</button>}
              </div>
              <input 
                required
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 py-4 px-5 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/30 transition-all disabled:opacity-50"
              />
            </div>
          </div>

          <button 
            disabled={isLoading}
            type="submit" 
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-xl shadow-blue-500/30 transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                {!isLogin ? <Sparkles size={18} fill="currentColor" className="group-hover:rotate-12 transition-transform" /> : <Zap size={18} fill="currentColor" className="group-hover:scale-125 transition-transform" />}
              </>
            )}
          </button>
        </form>

        <p className="text-center text-[10px] text-zinc-500 leading-relaxed font-medium">
          {isLogin ? 'New to ZenSpace?' : 'Already have an account?'} <button onClick={() => {
            setIsLogin(!isLogin);
            setError(null);
          }} className="text-blue-600 font-bold hover:underline">{isLogin ? 'Sign up here' : 'Sign in here'}</button>.
        </p>
      </div>
    </div>
  );
};

export default Login;

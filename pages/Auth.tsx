import React, { useState } from 'react';
import { User } from '../types';
import * as StorageService from '../services/storageService';
import { Button, Input } from '../components/UIComponents';
import { Lock, Mail, User as UserIcon, ArrowRight, Sparkles, CheckCircle2, Wand2 } from 'lucide-react';

interface AuthProps {
  onSuccess: (user: User) => void;
}

interface LoginProps extends AuthProps {
  onSwitchToRegister: () => void;
}

interface RegisterProps extends AuthProps {
  onSwitchToLogin: () => void;
}

// --- Shared Layout Component ---
const AuthLayout: React.FC<{ children: React.ReactNode; title: string; subtitle: string }> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex bg-white font-sans">
      {/* Left Side - Branding (Visible on large screens) */}
      <div className="hidden lg:flex lg:w-1/2 bg-indigo-600 relative overflow-hidden flex-col justify-between p-16 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-700 to-violet-800 z-0"></div>
        <div className="absolute top-0 right-0 -mr-32 -mt-32 w-[600px] h-[600px] bg-white opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-indigo-400 opacity-20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
             <div className="w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl flex items-center justify-center shadow-2xl">
                <Sparkles className="text-white w-7 h-7" />
             </div>
             <span className="text-2xl font-extrabold tracking-tight text-white">AdGenius</span>
          </div>
          
          <h2 className="text-5xl font-bold leading-tight mb-6">Transform your ad campaigns with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-pink-200">AI intelligence</span></h2>
          <p className="text-indigo-100 text-lg max-w-md leading-relaxed opacity-90">Create, manage, and optimize your advertisements instantly with the power of advanced Gemini models.</p>
        </div>

        <div className="relative z-10 space-y-5">
          <div className="flex items-center space-x-4 bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/10 hover:bg-white/15 transition-colors cursor-default">
            <div className="p-2.5 bg-indigo-500/40 rounded-xl">
              <Wand2 className="w-6 h-6 text-indigo-50" />
            </div>
            <div>
              <h3 className="font-bold text-white">AI Copywriting</h3>
              <p className="text-sm text-indigo-200">Generate compelling text instantly</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/10 hover:bg-white/15 transition-colors cursor-default">
            <div className="p-2.5 bg-indigo-500/40 rounded-xl">
              <Sparkles className="w-6 h-6 text-indigo-50" />
            </div>
            <div>
              <h3 className="font-bold text-white">Smart Image Gen</h3>
              <p className="text-sm text-indigo-200">Create visuals from descriptions</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex justify-between items-center text-xs text-indigo-300/70 font-medium tracking-wide uppercase">
          <span>© 2024 AdGenius Inc.</span>
          <span>Privacy & Terms</span>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-20 bg-white overflow-y-auto">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <div className="lg:hidden w-12 h-12 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center text-white shadow-lg mb-8 mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">{title}</h2>
            <p className="mt-3 text-slate-500 text-base">{subtitle}</p>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
};

export const Login: React.FC<LoginProps> = ({ onSuccess, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const user = await StorageService.loginUser(email, password);
      onSuccess(user);
    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Login failed";
        setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Welcome back" 
      subtitle="Sign in to your admin dashboard to continue"
    >
      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="space-y-5">
          <Input 
            label="Email Address" 
            type="email" 
            placeholder="admin@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            icon={<Mail className="w-5 h-5" />}
          />
          <div className="relative">
            <Input 
              label="Password" 
              type="password"
              placeholder="••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              icon={<Lock className="w-5 h-5" />}
            />
            <div className="text-right mt-1">
                 <a href="#" className="text-xs font-medium text-indigo-600 hover:text-indigo-500">Forgot password?</a>
            </div>
          </div>
        </div>
        
        {error && (
          <div className="p-4 bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl flex items-start animate-shake">
            <span className="mr-2 mt-0.5 font-bold">!</span> {error}
          </div>
        )}

        <Button type="submit" className="w-full py-3.5 text-base shadow-lg shadow-indigo-500/20" isLoading={isLoading}>
          Sign In to Dashboard
        </Button>
      </form>

      <div className="mt-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-slate-500 font-medium">New to AdGenius?</span>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button 
            onClick={onSwitchToRegister} 
            className="text-base font-bold text-indigo-600 hover:text-indigo-500 hover:underline transition-all"
          >
            Create an account
          </button>
        </div>
      </div>
    </AuthLayout>
  );
};

export const Register: React.FC<RegisterProps> = ({ onSuccess, onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const user = await StorageService.registerUser(name, email, password);
      onSuccess(user);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Create an account" 
      subtitle="Get started with your 30-day free trial"
    >
      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <Input 
          label="Full Name" 
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          icon={<UserIcon className="w-5 h-5" />}
        />
        <Input 
          label="Work Email" 
          type="email" 
          placeholder="name@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          icon={<Mail className="w-5 h-5" />}
        />
        <div>
          <Input 
            label="Password" 
            type="password"
            placeholder="••••••" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            icon={<Lock className="w-5 h-5" />}
          />
          <p className="mt-1.5 text-xs text-slate-500 font-medium">Must be at least 6 characters</p>
        </div>

        <div className="space-y-3 pt-2 pb-2">
           <div className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-slate-600">Access to Gemini Flash 2.5</span>
           </div>
           <div className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-slate-600">Unlimited Ad generations</span>
           </div>
        </div>

        <Button type="submit" className="w-full py-3.5 text-base shadow-lg shadow-indigo-500/20" isLoading={isLoading}>
          Create Account <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-slate-600">
        Already have an account?{' '}
        <button onClick={onSwitchToLogin} className="text-indigo-600 hover:text-indigo-500 font-bold hover:underline">
          Sign in
        </button>
      </div>
    </AuthLayout>
  );
};
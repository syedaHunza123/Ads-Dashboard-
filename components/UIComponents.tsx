import React from 'react';
import { Loader2 } from 'lucide-react';

// --- Button ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, variant = 'primary', isLoading, icon, className = '', ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none";
  
  const variants = {
    // Gradient Primary Button with Lift & Glow
    primary: "bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 text-white border border-transparent shadow-md hover:shadow-indigo-500/30 hover:-translate-y-0.5 hover:bg-gradient-to-r hover:from-indigo-500 hover:via-purple-500 hover:to-violet-500 focus:ring-indigo-500",
    
    // Clean Secondary
    secondary: "bg-white text-slate-700 border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/50 hover:-translate-y-0.5 shadow-sm focus:ring-slate-200",
    
    // Danger with soft background
    danger: "bg-white text-red-600 border border-slate-200 hover:border-red-200 hover:bg-red-50 hover:text-red-700 hover:shadow-red-100 shadow-sm focus:ring-red-500",
    
    // Ghost for minimal actions
    ghost: "text-slate-500 hover:bg-slate-100 hover:text-slate-900 active:scale-95",
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} disabled={isLoading || props.disabled} {...props}>
      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {!isLoading && icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

// --- Input ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode; // Added specifically for inline buttons
}

export const Input: React.FC<InputProps> = ({ label, error, icon, rightElement, className = '', ...props }) => (
  <div className="w-full">
    {label && (
      <div className="flex justify-between items-center mb-1.5">
        <label className="block text-sm font-semibold text-slate-700">{label}</label>
        {rightElement}
      </div>
    )}
    <div className="relative group">
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
          {icon}
        </div>
      )}
      <input
        className={`w-full ${icon ? 'pl-10' : 'px-4'} ${rightElement ? 'pr-3' : 'pr-3'} py-3 bg-white border rounded-xl text-sm shadow-sm placeholder-slate-400
        focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10
        disabled:bg-slate-50 disabled:text-slate-500 transition-all duration-200
        ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : 'border-slate-200 hover:border-slate-300'} ${className}`}
        {...props}
      />
    </div>
    {error && <p className="mt-1 text-xs text-red-600 font-medium animate-pulse">{error}</p>}
  </div>
);

// --- Textarea ---
interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    rightElement?: React.ReactNode;
}
  
export const TextArea: React.FC<TextAreaProps> = ({ label, error, rightElement, className = '', ...props }) => (
    <div className="w-full">
       {label && (
        <div className="flex justify-between items-center mb-1.5">
          <label className="block text-sm font-semibold text-slate-700">{label}</label>
          {rightElement}
        </div>
      )}
      <textarea
        className={`w-full px-4 py-3 bg-white border rounded-xl text-sm shadow-sm placeholder-slate-400
        focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10
        disabled:bg-slate-50 disabled:text-slate-500 transition-all duration-200
        ${error ? 'border-red-500' : 'border-slate-200 hover:border-slate-300'} ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
);

// --- Badge ---
export const Badge: React.FC<{ status: string }> = ({ status }) => {
  const styles = {
    active: "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20",
    draft: "bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20",
    paused: "bg-slate-100 text-slate-600 border-slate-200 ring-slate-500/20",
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const colorClass = (styles as any)[status] || styles.paused;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ring-1 ring-inset ${colorClass} shadow-sm`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${status === 'active' ? 'bg-emerald-500' : status === 'draft' ? 'bg-amber-500' : 'bg-slate-400'}`}></span>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};
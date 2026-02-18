import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Link2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useLogin, useRegister } from '@/hooks/useAuth';

type AuthType = 'login' | 'signup';

interface AuthPageProps {
  type: AuthType;
}

export function AuthPage({ type }: AuthPageProps) {
  const location = useLocation();
  const isLogin = type === 'login';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { mutate: login, isPending: loggingIn } = useLogin();
  const { mutate: register, isPending: registering } = useRegister();

  const isLoading = loggingIn || registering;

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!email) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Enter a valid email';

    if (!password) errs.password = 'Password is required';
    else if (!isLogin && password.length < 8) errs.password = 'Password must be at least 8 characters';
    else if (!isLogin && !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      errs.password = 'Include uppercase, lowercase, and a number';
    }

    if (!isLogin) {
      if (!username) errs.username = 'Username is required';
      else if (username.length < 3) errs.username = 'Username must be 3+ characters';
      else if (!/^[a-zA-Z0-9_-]+$/.test(username)) errs.username = 'Letters, numbers, hyphens, underscores only';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (isLogin) {
      login({ email, password });
    } else {
      register({ email, password, username, display_name: displayName || undefined });
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f3f1] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 w-fit mx-auto">
          <div className="w-9 h-9 bg-brand-500 rounded-xl flex items-center justify-center">
            <Link2 size={18} className="text-white" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-gray-900">OrangeLink</span>
        </Link>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8 space-y-6">
          {/* Heading */}
          <div className="text-center space-y-1">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
              {isLogin ? 'Welcome back' : 'Create account'}
            </h2>
            <p className="text-sm text-gray-500">
              {isLogin ? 'Sign in to your OrangeLink' : 'Start sharing your links today'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {!isLogin && (
              <>
                <Input
                  label="Username"
                  type="text"
                  placeholder="yourname"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase())}
                  error={errors.username}
                  hint="orangelink.io/yourname"
                  autoComplete="username"
                />
                <Input
                  label="Display name (optional)"
                  type="text"
                  placeholder="Your Name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  autoComplete="name"
                />
              </>
            )}

            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              autoComplete="email"
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                autoComplete={isLogin ? 'current-password' : 'new-password'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 bottom-[9px] text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={isLoading}
              className="w-full"
            >
              {isLogin ? 'Log in' : 'Create account'}
            </Button>
          </form>

          {/* Toggle */}
          <p className="text-center text-sm text-gray-500">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <Link
              to={isLogin ? '/signup' : '/login'}
              state={location.state}
              className="text-brand-600 font-semibold hover:underline"
            >
              {isLogin ? 'Sign up free' : 'Log in'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

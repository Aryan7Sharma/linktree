import { Link } from 'react-router-dom';
import { Link2 } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f3f3f1] text-center px-4">
      <div className="w-14 h-14 bg-brand-500 rounded-2xl flex items-center justify-center mb-6">
        <Link2 size={28} className="text-white" />
      </div>
      <h1 className="text-6xl font-black text-gray-900">404</h1>
      <p className="mt-4 text-lg text-gray-600">Page not found</p>
      <p className="mt-2 text-sm text-gray-400">The link you followed may be broken or doesn't exist.</p>
      <Link
        to="/"
        className="mt-8 px-6 py-3 bg-brand-500 text-white font-bold rounded-full hover:bg-brand-600 transition-colors text-sm"
      >
        Go home
      </Link>
    </div>
  );
}

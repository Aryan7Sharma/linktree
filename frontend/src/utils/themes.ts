import { ThemeType, ThemeConfig } from '@/types';

export const THEMES: Record<ThemeType, ThemeConfig> = {
  classic: {
    bg: 'bg-gray-100',
    button: 'bg-white border-2 border-gray-200 hover:bg-gray-50',
    text: 'text-gray-900',
    buttonText: 'text-gray-900',
    label: 'Classic',
  },
  dark: {
    bg: 'bg-gray-900',
    button: 'bg-gray-800 hover:bg-gray-700',
    text: 'text-white',
    buttonText: 'text-white',
    label: 'Dark',
  },
  nature: {
    bg: 'bg-[#354f43]',
    button: 'bg-[#f4f2eb] hover:bg-[#e6e3d8]',
    text: 'text-[#f4f2eb]',
    buttonText: 'text-[#354f43]',
    label: 'Nature',
  },
  sunset: {
    bg: 'bg-gradient-to-br from-orange-500 to-pink-600',
    button: 'bg-white/20 backdrop-blur-md hover:bg-white/30',
    text: 'text-white',
    buttonText: 'text-white',
    label: 'Sunset',
  },
  ocean: {
    bg: 'bg-gradient-to-b from-blue-400 to-emerald-400',
    button: 'bg-white shadow-lg hover:scale-[1.02] transition-transform',
    text: 'text-white',
    buttonText: 'text-blue-600',
    label: 'Ocean',
  },
  purple: {
    bg: 'bg-[#432c7a]',
    button: 'bg-[#ffbd12] border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all',
    text: 'text-white',
    buttonText: 'text-black font-bold',
    label: 'Purple',
  },
};

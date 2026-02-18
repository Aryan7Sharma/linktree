// import React, { useState, useEffect } from 'react';
// import { create } from 'zustand';
// import { 
//   Plus, 
//   Trash2, 
//   GripVertical, 
//   Image as ImageIcon, 
//   BarChart2, 
//   Settings, 
//   LogOut, 
//   Share2, 
//   Copy, 
//   ExternalLink, 
//   MoreHorizontal, 
//   Layout, 
//   Zap, 
//   Smartphone,
//   CheckCircle2,
//   X,
//   Menu,
//   Sparkles,
//   Loader2
// } from 'lucide-react';

// /**
//  * --- GEMINI API HELPER ---
//  */
// const generateGeminiContent = async (prompt: string): Promise<string> => {
//   const apiKey = ""; // Provided by runtime environment
//   try {
//     const response = await fetch(
//       `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
//       {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           contents: [{ parts: [{ text: prompt }] }]
//         })
//       }
//     );
//     const data = await response.json();
//     return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
//   } catch (error) {
//     console.error("Gemini API Error:", error);
//     return "";
//   }
// };

// /**
//  * --- ZUSTAND STATE MANAGEMENT ---
//  */

// // Types
// type LinkItem = {
//   id: string;
//   title: string;
//   url: string;
//   active: boolean;
//   clicks: number;
// };

// type Theme = 'classic' | 'dark' | 'nature' | 'sunset' | 'ocean' | 'purple';

// type UserProfile = {
//   username: string;
//   bio: string;
//   avatarUrl: string;
//   theme: Theme;
// };

// type AppState = {
//   // Navigation
//   currentRoute: string;
//   navigate: (route: string) => void;
  
//   // Auth
//   isAuthenticated: boolean;
//   login: () => void;
//   logout: () => void;
  
//   // Data
//   user: UserProfile;
//   links: LinkItem[];
  
//   // Actions
//   addLink: () => void;
//   updateLink: (id: string, data: Partial<LinkItem>) => void;
//   deleteLink: (id: string) => void;
//   toggleLink: (id: string) => void;
//   updateUser: (data: Partial<UserProfile>) => void;
//   setTheme: (theme: Theme) => void;
// };

// const INITIAL_LINKS: LinkItem[] = [
//   { id: '1', title: 'My Latest Video', url: 'https://youtube.com', active: true, clicks: 1245 },
//   { id: '2', title: 'Join my Newsletter', url: 'https://substack.com', active: true, clicks: 856 },
//   { id: '3', title: 'Follow on Twitter', url: 'https://twitter.com', active: true, clicks: 2341 },
// ];

// const INITIAL_USER: UserProfile = {
//   username: '@creative_spark',
//   bio: 'Digital Creator | Filmmaker | Coffee Lover ☕️',
//   avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
//   theme: 'nature',
// };

// const useStore = create<AppState>((set) => ({
//   currentRoute: '/',
//   navigate: (route) => set({ currentRoute: route }),
  
//   isAuthenticated: false,
//   login: () => set({ isAuthenticated: true, currentRoute: '/admin' }),
//   logout: () => set({ isAuthenticated: false, currentRoute: '/' }),
  
//   user: INITIAL_USER,
//   links: INITIAL_LINKS,
  
//   addLink: () => set((state) => ({
//     links: [
//       { 
//         id: crypto.randomUUID(), 
//         title: '', 
//         url: '', 
//         active: true, 
//         clicks: 0 
//       }, 
//       ...state.links
//     ]
//   })),
  
//   updateLink: (id, data) => set((state) => ({
//     links: state.links.map(l => l.id === id ? { ...l, ...data } : l)
//   })),
  
//   deleteLink: (id) => set((state) => ({
//     links: state.links.filter(l => l.id !== id)
//   })),
  
//   toggleLink: (id) => set((state) => ({
//     links: state.links.map(l => l.id === id ? { ...l, active: !l.active } : l)
//   })),
  
//   updateUser: (data) => set((state) => ({
//     user: { ...state.user, ...data }
//   })),
  
//   setTheme: (theme) => set((state) => ({
//     user: { ...state.user, theme }
//   })),
// }));

// /**
//  * --- THEME CONFIGURATIONS ---
//  */
// const THEMES: Record<Theme, { bg: string; button: string; text: string; buttonText: string }> = {
//   classic: { bg: 'bg-gray-100', button: 'bg-white border-2 border-gray-200 hover:bg-gray-50', text: 'text-gray-900', buttonText: 'text-gray-900' },
//   dark: { bg: 'bg-gray-900', button: 'bg-gray-800 hover:bg-gray-700', text: 'text-white', buttonText: 'text-white' },
//   nature: { bg: 'bg-[#354f43]', button: 'bg-[#f4f2eb] hover:bg-[#e6e3d8]', text: 'text-[#f4f2eb]', buttonText: 'text-[#354f43]' },
//   sunset: { bg: 'bg-gradient-to-br from-orange-500 to-pink-600', button: 'bg-white/20 backdrop-blur-md hover:bg-white/30', text: 'text-white', buttonText: 'text-white' },
//   ocean: { bg: 'bg-gradient-to-b from-blue-400 to-emerald-400', button: 'bg-white text-blue-600 shadow-lg hover:scale-[1.02] transition-transform', text: 'text-white', buttonText: 'text-blue-600' },
//   purple: { bg: 'bg-[#432c7a]', button: 'bg-[#ffbd12] border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all', text: 'text-white', buttonText: 'text-black font-bold' },
// };

// /**
//  * --- COMPONENT: PUBLIC PROFILE (The "Linktree") ---
//  */
// const PublicProfile = ({ isPreview = false }: { isPreview?: boolean }) => {
//   const { user, links } = useStore();
//   const theme = THEMES[user.theme];

//   return (
//     <div className={`min-h-full w-full flex flex-col items-center px-4 py-12 ${theme.bg} ${isPreview ? 'absolute inset-0 overflow-y-auto' : 'min-h-screen'}`}>
//       <div className="w-full max-w-[680px] flex flex-col items-center space-y-6">
//         {/* Avatar */}
//         <div className="relative group">
//           <img 
//             src={user.avatarUrl} 
//             alt={user.username} 
//             className="w-24 h-24 rounded-full object-cover border-4 border-white/20 shadow-xl"
//           />
//         </div>

//         {/* Bio */}
//         <div className={`text-center space-y-2 ${theme.text}`}>
//           <h1 className="text-xl font-bold tracking-tight">{user.username}</h1>
//           <p className="text-sm opacity-90 max-w-sm mx-auto whitespace-pre-wrap">{user.bio}</p>
//         </div>

//         {/* Links */}
//         <div className="w-full space-y-4 pt-4">
//           {links.filter(l => l.active).map(link => (
//             <a
//               key={link.id}
//               href={isPreview ? '#' : link.url}
//               target="_blank"
//               rel="noreferrer"
//               className={`block w-full p-4 rounded-full text-center transition-all duration-200 ${theme.button} ${theme.buttonText}`}
//               onClick={(e) => {
//                 if (isPreview) e.preventDefault();
//               }}
//             >
//               <span className="font-medium text-sm sm:text-base">{link.title || 'Untitled Link'}</span>
//             </a>
//           ))}
//           {links.filter(l => l.active).length === 0 && (
//             <div className={`text-center text-sm opacity-60 ${theme.text}`}>No links yet...</div>
//           )}
//         </div>

//         {/* Footer */}
//         <div className={`pt-8 flex flex-col items-center gap-2 ${theme.text}`}>
//           <div className="font-bold text-lg tracking-tight flex items-center gap-1">
//             <span className="opacity-70">linktr.ee</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// /**
//  * --- COMPONENT: DASHBOARD (ADMIN) ---
//  */
// const Dashboard = () => {
//   const { 
//     user, links, logout, navigate,
//     addLink, updateLink, deleteLink, toggleLink, 
//     updateUser, setTheme 
//   } = useStore();
  
//   const [activeTab, setActiveTab] = useState<'links' | 'appearance' | 'analytics'>('links');
//   const [copied, setCopied] = useState(false);
//   const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false);

//   // AI Loading States
//   const [generatingBio, setGeneratingBio] = useState(false);
//   const [generatingLinkId, setGeneratingLinkId] = useState<string | null>(null);

//   const copyToClipboard = () => {
//     navigator.clipboard.writeText(`https://linktr.ee/${user.username.replace('@', '')}`);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   /**
//    * AI ACTION: Generate Bio
//    */
//   const handleGenerateBio = async () => {
//     setGeneratingBio(true);
//     const prompt = `Write a short, engaging, and professional bio (max 100 characters) for a social media profile. The username is "${user.username}". Current bio context: "${user.bio || 'creator'}". Do not use hashtags.`;
//     const result = await generateGeminiContent(prompt);
//     if (result) {
//       updateUser({ bio: result.trim() });
//     }
//     setGeneratingBio(false);
//   };

//   /**
//    * AI ACTION: Optimize Link Title
//    */
//   const handleOptimizeLink = async (link: LinkItem) => {
//     setGeneratingLinkId(link.id);
//     const prompt = `Rewrite this link title to be catchy, short (max 40 chars), and click-worthy. The current title is "${link.title}" and the URL is "${link.url}". Return ONLY the new title text, no quotes or explanations.`;
//     const result = await generateGeminiContent(prompt);
//     if (result) {
//       updateLink(link.id, { title: result.trim().replace(/^"|"$/g, '') });
//     }
//     setGeneratingLinkId(null);
//   };

//   return (
//     <div className="flex h-screen bg-[#f3f3f1] font-sans">
//       {/* Sidebar Navigation */}
//       <aside className="w-16 md:w-64 bg-white border-r border-gray-200 flex flex-col justify-between hidden md:flex z-20">
//         <div>
//           <div className="p-6">
//             <h2 className="text-2xl font-bold tracking-tighter text-black hidden md:block">Linktree</h2>
//             <Layout className="md:hidden w-6 h-6" />
//           </div>
//           <nav className="space-y-1 px-3">
//             <button 
//               onClick={() => setActiveTab('links')}
//               className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'links' ? 'bg-gray-100 text-black' : 'text-gray-500 hover:bg-gray-50'}`}
//             >
//               <Layout size={18} />
//               <span className="hidden md:inline">Links</span>
//             </button>
//             <button 
//               onClick={() => setActiveTab('appearance')}
//               className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'appearance' ? 'bg-gray-100 text-black' : 'text-gray-500 hover:bg-gray-50'}`}
//             >
//               <ImageIcon size={18} />
//               <span className="hidden md:inline">Appearance</span>
//             </button>
//             <button 
//               onClick={() => setActiveTab('analytics')}
//               className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'analytics' ? 'bg-gray-100 text-black' : 'text-gray-500 hover:bg-gray-50'}`}
//             >
//               <BarChart2 size={18} />
//               <span className="hidden md:inline">Analytics</span>
//             </button>
//             <button 
//               className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-500 hover:bg-gray-50`}
//             >
//               <Settings size={18} />
//               <span className="hidden md:inline">Settings</span>
//             </button>
//           </nav>
//         </div>
//         <div className="p-4 border-t border-gray-100">
//           <button onClick={logout} className="flex items-center gap-3 text-gray-500 hover:text-black transition-colors w-full">
//             <LogOut size={18} />
//             <span className="hidden md:inline text-sm font-medium">Log out</span>
//           </button>
//         </div>
//       </aside>

//       {/* Main Content Area */}
//       <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        
//         {/* Top Header Mobile */}
//         <header className="md:hidden bg-white h-16 border-b border-gray-200 flex items-center justify-between px-4 z-30">
//           <div className="font-bold text-lg">Linktree</div>
//           <button onClick={() => setMobilePreviewOpen(!mobilePreviewOpen)} className="p-2 bg-gray-100 rounded-full">
//             {mobilePreviewOpen ? <X size={20} /> : <Smartphone size={20} />}
//           </button>
//         </header>

//         {/* Dashboard Header (Desktop) */}
//         <header className="hidden md:flex h-16 bg-white border-b border-gray-200 items-center justify-between px-8">
//           <div className="text-sm font-medium text-gray-500">My Linktree</div>
//           <div className="flex items-center gap-4">
//              <button 
//               onClick={copyToClipboard}
//               className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
//             >
//                {copied ? <CheckCircle2 size={14} className="text-green-600" /> : <Copy size={14} />}
//                <span>{copied ? 'Copied!' : 'Share'}</span>
//              </button>
//           </div>
//         </header>

//         {/* Scrollable Content */}
//         <div className="flex-1 overflow-y-auto">
//           <div className="max-w-3xl mx-auto p-4 md:p-8 pb-32">
            
//             {/* LINKS TAB */}
//             {activeTab === 'links' && (
//               <div className="space-y-6">
//                 <button 
//                   onClick={addLink}
//                   className="w-full py-3 bg-[#8129d9] hover:bg-[#6f23ba] text-white rounded-full font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform active:scale-[0.99]"
//                 >
//                   <Plus size={18} />
//                   Add Link
//                 </button>

//                 <div className="space-y-4">
//                   {links.length === 0 && (
//                     <div className="text-center py-12 text-gray-500 bg-white rounded-2xl border border-dashed border-gray-300">
//                       <p>You don't have any links yet.</p>
//                       <p className="text-sm">Click the button above to add one!</p>
//                     </div>
//                   )}

//                   {links.map((link) => (
//                     <div key={link.id} className="bg-white rounded-[20px] p-4 shadow-sm border border-gray-200 group hover:border-gray-300 transition-colors">
//                       <div className="flex items-start gap-4">
//                         <div className="mt-4 text-gray-300 cursor-grab active:cursor-grabbing">
//                           <GripVertical size={20} />
//                         </div>
//                         <div className="flex-1 space-y-3">
//                           <div className="flex items-center justify-between gap-2">
//                             <div className="relative w-full">
//                                 <input
//                                   type="text"
//                                   value={link.title}
//                                   onChange={(e) => updateLink(link.id, { title: e.target.value })}
//                                   placeholder="Title"
//                                   className="font-semibold text-gray-900 placeholder-gray-400 border-none p-0 focus:ring-0 w-full pr-8"
//                                 />
//                             </div>
                            
//                             <div className="flex items-center gap-2 shrink-0">
//                                 {/* AI Button: Optimize Link */}
//                                 <button 
//                                   onClick={() => handleOptimizeLink(link)}
//                                   disabled={generatingLinkId === link.id}
//                                   className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 p-1.5 rounded-full transition-colors disabled:opacity-50"
//                                   title="✨ Rewrite with AI"
//                                 >
//                                   {generatingLinkId === link.id ? (
//                                     <Loader2 size={16} className="animate-spin" />
//                                   ) : (
//                                     <Sparkles size={16} />
//                                   )}
//                                 </button>
                            
//                                 <button 
//                                   onClick={() => toggleLink(link.id)}
//                                   className={`w-10 h-6 rounded-full transition-colors relative ${link.active ? 'bg-green-500' : 'bg-gray-200'}`}
//                                 >
//                                   <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${link.active ? 'left-5' : 'left-1'}`} />
//                                 </button>
//                             </div>
//                           </div>
//                           <div className="flex items-center gap-2">
//                              <input
//                               type="text"
//                               value={link.url}
//                               onChange={(e) => updateLink(link.id, { url: e.target.value })}
//                               placeholder="URL"
//                               className="text-sm text-gray-600 placeholder-gray-400 border-none p-0 focus:ring-0 w-full"
//                             />
//                           </div>
                          
//                           <div className="pt-2 flex items-center justify-between border-t border-gray-100">
//                             <div className="flex gap-4">
//                                <button className="text-gray-400 hover:text-gray-600"><ImageIcon size={16} /></button>
//                                <button className="text-gray-400 hover:text-gray-600"><BarChart2 size={16} /></button>
//                             </div>
//                             <button 
//                               onClick={() => deleteLink(link.id)}
//                               className="text-gray-400 hover:text-red-500 transition-colors p-1"
//                             >
//                               <Trash2 size={16} />
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* APPEARANCE TAB */}
//             {activeTab === 'appearance' && (
//               <div className="space-y-8">
//                 <section className="space-y-4">
//                   <h3 className="text-lg font-bold text-gray-900">Profile</h3>
//                   <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-6 items-start">
//                     <div className="shrink-0">
//                        <img src={user.avatarUrl} alt="Avatar" className="w-24 h-24 rounded-full bg-gray-100 object-cover" />
//                        <button className="mt-3 w-full py-2 bg-gray-900 text-white rounded-full text-xs font-bold hover:bg-gray-800 transition-colors">Pick an image</button>
//                     </div>
//                     <div className="flex-1 w-full space-y-4">
//                        <div className="space-y-1">
//                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Profile Title</label>
//                          <input 
//                             type="text" 
//                             value={user.username}
//                             onChange={(e) => updateUser({ username: e.target.value })}
//                             className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
//                          />
//                        </div>
//                        <div className="space-y-1 relative">
//                          <div className="flex justify-between items-center mb-1">
//                             <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Bio</label>
                            
//                             {/* AI Button: Magic Rewrite Bio */}
//                             <button 
//                               onClick={handleGenerateBio}
//                               disabled={generatingBio}
//                               className="flex items-center gap-1.5 text-xs font-bold text-purple-600 hover:text-purple-800 disabled:opacity-50 transition-colors"
//                             >
//                                 {generatingBio ? (
//                                     <Loader2 size={12} className="animate-spin" />
//                                 ) : (
//                                     <Sparkles size={12} />
//                                 )}
//                                 ✨ Magic Rewrite
//                             </button>
//                          </div>
//                          <textarea 
//                             value={user.bio}
//                             onChange={(e) => updateUser({ bio: e.target.value })}
//                             rows={3}
//                             className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all resize-none"
//                          />
//                        </div>
//                     </div>
//                   </div>
//                 </section>

//                 <section className="space-y-4">
//                   <h3 className="text-lg font-bold text-gray-900">Themes</h3>
//                   <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//                     {Object.keys(THEMES).map((themeKey) => (
//                       <button
//                         key={themeKey}
//                         onClick={() => setTheme(themeKey as Theme)}
//                         className={`group relative aspect-[3/5] rounded-xl border-2 overflow-hidden transition-all ${user.theme === themeKey ? 'border-gray-900 ring-2 ring-gray-900 ring-offset-2' : 'border-transparent hover:border-gray-300'}`}
//                       >
//                          <div className={`absolute inset-0 ${THEMES[themeKey as Theme].bg}`}>
//                             <div className="flex flex-col items-center justify-center h-full gap-2 p-2">
//                                <div className={`w-8 h-8 rounded-full bg-current opacity-20`}></div>
//                                <div className={`w-16 h-2 rounded-full bg-current opacity-20`}></div>
//                                <div className={`w-12 h-2 rounded-full bg-current opacity-20`}></div>
//                             </div>
//                          </div>
//                          <div className="absolute inset-x-0 bottom-0 p-3 bg-white/90 backdrop-blur-sm">
//                             <span className="text-xs font-bold capitalize text-gray-900">{themeKey}</span>
//                          </div>
//                       </button>
//                     ))}
//                   </div>
//                 </section>
//               </div>
//             )}

//             {/* ANALYTICS TAB */}
//             {activeTab === 'analytics' && (
//               <div className="space-y-6">
//                 <h3 className="text-xl font-bold">Lifetime Analytics</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
//                       <div className="text-sm text-gray-500 font-medium">Views</div>
//                       <div className="text-3xl font-bold mt-2">12,845</div>
//                       <div className="text-xs text-green-600 font-bold mt-1">↑ 12% from last week</div>
//                    </div>
//                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
//                       <div className="text-sm text-gray-500 font-medium">Clicks</div>
//                       <div className="text-3xl font-bold mt-2">4,432</div>
//                       <div className="text-xs text-green-600 font-bold mt-1">↑ 8% from last week</div>
//                    </div>
//                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
//                       <div className="text-sm text-gray-500 font-medium">CTR</div>
//                       <div className="text-3xl font-bold mt-2">34.5%</div>
//                       <div className="text-xs text-gray-400 font-bold mt-1">Avg. performance</div>
//                    </div>
//                 </div>
                
//                 <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm h-64 flex items-center justify-center text-gray-400">
//                    <div className="text-center">
//                      <BarChart2 size={48} className="mx-auto mb-2 opacity-20" />
//                      <p>Detailed chart visualization would go here</p>
//                    </div>
//                 </div>
//               </div>
//             )}

//           </div>
//         </div>
//       </main>

//       {/* Right Preview Pane (Desktop) */}
//       <aside className="w-[400px] border-l border-gray-200 bg-white hidden lg:flex items-center justify-center p-8 relative">
//         <div className="relative w-[300px] h-[600px] border-[12px] border-gray-900 rounded-[3rem] overflow-hidden shadow-2xl bg-white ring-1 ring-gray-200">
//            {/* Phone Notch/Header */}
//            <div className="absolute top-0 inset-x-0 h-6 bg-gray-900 z-20 flex justify-center">
//               <div className="w-32 h-4 bg-gray-900 rounded-b-xl"></div>
//            </div>
           
//            {/* Preview Content */}
//            <PublicProfile isPreview={true} />
//         </div>
        
//         <div className="absolute top-4 right-4">
//            <button onClick={() => navigate(`/u/${user.username.replace('@', '')}`)} className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-black border border-gray-200 px-3 py-1.5 rounded-full hover:bg-gray-50">
//              <ExternalLink size={12} />
//              View live
//            </button>
//         </div>
//       </aside>

//       {/* Mobile Preview Overlay */}
//       {mobilePreviewOpen && (
//         <div className="fixed inset-0 z-50 bg-white md:hidden flex flex-col">
//           <div className="flex items-center justify-between p-4 border-b">
//             <span className="font-bold">Preview</span>
//             <button onClick={() => setMobilePreviewOpen(false)} className="p-2 bg-gray-100 rounded-full">
//                <X size={20} />
//             </button>
//           </div>
//           <div className="flex-1 overflow-hidden relative">
//             <PublicProfile isPreview={true} />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// /**
//  * --- COMPONENT: LANDING PAGE ---
//  */
// const LandingPage = () => {
//   const { navigate, login } = useStore();
//   const [username, setUsername] = useState('');

//   return (
//     <div className="min-h-screen bg-[#254f1a] text-[#d2e823] font-sans selection:bg-[#d2e823] selection:text-[#254f1a]">
//       <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
//         <div className="text-2xl font-bold tracking-tighter flex items-center gap-1">
//            Linktree <span className="text-white hidden sm:inline">Clone</span>
//         </div>
//         <div className="flex items-center gap-4">
//           <button 
//             onClick={login}
//             className="px-4 py-2 bg-[#e9c0e9] text-black rounded-lg font-semibold hover:bg-[#d8aed8] transition-colors"
//           >
//             Log in
//           </button>
//           <button 
//             onClick={() => navigate('/signup')}
//             className="px-5 py-2 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition-colors hidden sm:block"
//           >
//             Sign up free
//           </button>
//         </div>
//       </nav>

//       <main className="max-w-7xl mx-auto px-6 pt-20 pb-32 flex flex-col md:flex-row items-center gap-12">
//         <div className="flex-1 space-y-8">
//            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-[1.1]">
//              Everything you are. In one, simple link in bio.
//            </h1>
//            <p className="text-xl text-[#d2e823]/80 max-w-lg">
//              Join 50M+ people using Linktree for their link in bio. One link to help you share everything you create, curate and sell from your Instagram, TikTok, Twitter, YouTube and other social media profiles.
//            </p>
           
//            <div className="flex flex-col sm:flex-row gap-4 max-w-lg">
//               <div className="relative flex-1">
//                 <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">linktr.ee/</span>
//                 <input 
//                   type="text" 
//                   placeholder="yourname"
//                   value={username}
//                   onChange={(e) => setUsername(e.target.value)}
//                   className="w-full h-14 pl-24 pr-4 rounded-lg bg-white text-black font-semibold focus:outline-none focus:ring-4 focus:ring-[#d2e823]/50"
//                 />
//               </div>
//               <button 
//                 onClick={login} 
//                 className="h-14 px-8 bg-[#e9c0e9] text-black rounded-full font-bold hover:bg-[#d8aed8] transition-colors whitespace-nowrap"
//               >
//                 Claim your Linktree
//               </button>
//            </div>
//         </div>

//         <div className="flex-1 w-full flex justify-center relative">
//            <div className="w-[350px] h-[700px] bg-[#e9c0e9] rounded-[3rem] relative overflow-hidden flex items-center justify-center transform rotate-[-5deg] hover:rotate-0 transition-transform duration-500 shadow-2xl">
//               <div className="text-black text-center space-y-4 p-8">
//                  <div className="w-24 h-24 bg-purple-500 mx-auto rounded-full mb-6 border-4 border-black"></div>
//                  <div className="w-48 h-12 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-full mx-auto"></div>
//                  <div className="w-48 h-12 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-full mx-auto"></div>
//                  <div className="w-48 h-12 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-full mx-auto"></div>
//               </div>
//            </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// /**
//  * --- COMPONENT: AUTH MOCK ---
//  */
// const AuthPage = ({ type }: { type: 'login' | 'signup' }) => {
//   const { login, navigate } = useStore();
//   const [email, setEmail] = useState('');
  
//   const handleAuth = (e: React.FormEvent) => {
//     e.preventDefault();
//     // Simulate API call
//     setTimeout(() => {
//       login();
//     }, 500);
//   };

//   return (
//     <div className="min-h-screen bg-white flex flex-col p-8">
//       <div className="w-full max-w-md mx-auto space-y-8 mt-12">
//         <div className="cursor-pointer" onClick={() => navigate('/')}>
//           <h1 className="text-2xl font-bold tracking-tighter">Linktree Clone</h1>
//         </div>
        
//         <div className="text-center space-y-2">
//            <h2 className="text-4xl font-extrabold tracking-tight">
//              {type === 'login' ? 'Welcome back!' : 'Create your account'}
//            </h2>
//            <p className="text-gray-500">Sign in to continue to your Linktree</p>
//         </div>

//         <form onSubmit={handleAuth} className="space-y-4">
//            <div>
//              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//              <input 
//                type="email" 
//                required
//                value={email}
//                onChange={(e) => setEmail(e.target.value)}
//                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:bg-white focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition-all"
//                placeholder="example@email.com"
//              />
//            </div>
//            <div>
//              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
//              <input 
//                type="password" 
//                required
//                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:bg-white focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition-all"
//                placeholder="••••••••"
//              />
//            </div>
           
//            <button type="submit" className="w-full py-4 bg-purple-600 text-white font-bold rounded-full hover:bg-purple-700 transition-all">
//              {type === 'login' ? 'Log in' : 'Create account'}
//            </button>
//         </form>
        
//         <div className="text-center text-sm text-gray-500">
//            {type === 'login' ? "Don't have an account? " : "Already have an account? "}
//            <button onClick={() => navigate(type === 'login' ? '/signup' : '/login')} className="text-purple-600 underline">
//              {type === 'login' ? 'Sign up' : 'Log in'}
//            </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// /**
//  * --- MAIN APP ROUTER ---
//  */
// export default function App() {
//   const { currentRoute, isAuthenticated, navigate } = useStore();

//   // Simple custom router logic
//   const renderRoute = () => {
//     // Check for public profile routes (e.g., /u/username)
//     if (currentRoute.startsWith('/u/')) {
//        return <PublicProfile />;
//     }

//     switch (currentRoute) {
//       case '/':
//         return <LandingPage />;
//       case '/login':
//         return <AuthPage type="login" />;
//       case '/signup':
//         return <AuthPage type="signup" />;
//       case '/admin':
//         return isAuthenticated ? <Dashboard /> : <LandingPage />; // Protected route
//       default:
//         return <LandingPage />;
//     }
//   };

//   useEffect(() => {
//     // In a real app, this would sync with window.history
//     // For this single-file clone, we handle it in state
//     if (!isAuthenticated && currentRoute === '/admin') {
//       navigate('/');
//     }
//   }, [isAuthenticated, currentRoute, navigate]);

//   return (
//     <div className="antialiased text-gray-900 bg-white">
//       {renderRoute()}
//     </div>
//   );
// }
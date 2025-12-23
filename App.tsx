import React, { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { MOCK_PROPERTIES, AGENTS_LIST, TAGLINE, ROADMAP } from './constants';
import { Property, AppView, Lead } from './types';
import Scene3D from './components/Scene3D';
import PropertyCard from './components/PropertyCard';
import AIChat from './components/AIChat';
import EnquireModal from './components/EnquireModal';
import PropertyDetailsView from './components/PropertyDetailsView';
import AdminDashboard from './components/AdminDashboard';
import AdminLoginModal from './components/AdminLoginModal';
import InvestmentTool from './components/InvestmentTool';
import PathfinderTool from './components/PathfinderTool';
import { searchTopProperties } from './services/geminiService';
import { Search, Hexagon, ArrowRight, Loader2, X, ShieldCheck, Mail, Instagram, Twitter, Linkedin, Contact, UserRound, ArrowUp, Zap, Sparkles, TrendingUp, Crown, Key, MapPin, Plane, Building2, TrainFront, Eye, Cpu, Rocket, Globe, ZapOff, Fingerprint, Star, MousePointer2, Menu, Code2, GraduationCap, Github } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SCAN_MESSAGES = [
    "Analyzing Market Depth...",
    "Scanning Verified Inventory...",
    "Auditing Legal Compliance...",
    "Finalizing Elite Recommendations..."
];

const STRATEGIC_HOTSPOTS = [
    { name: "KIA Airport", dist: "15 Mins", icon: <Plane size={14}/>, color: "text-blue-400" },
    { name: "Manyata Tech Park", dist: "10 Mins", icon: <Building2 size={14}/>, color: "text-violet-400" },
    { name: "Blue Line Metro", dist: "2 Mins", icon: <TrainFront size={14}/>, color: "text-emerald-400" },
    { name: "NH 44 Corridor", dist: "1 Min", icon: <MapPin size={14}/>, color: "text-amber-400" }
];

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.HOME);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [properties, setProperties] = useState<Property[]>(MOCK_PROPERTIES);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [aiSearchInput, setAiSearchInput] = useState('');
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [scanIndex, setScanIndex] = useState(0);
  const [aiSearchResults, setAiSearchResults] = useState<Property[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalProperty, setModalProperty] = useState<string | undefined>(undefined);
  const [isEOI, setIsEOI] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [scrollDir, setScrollDir] = useState<'up' | 'down'>('up');
  const [hasApiKey, setHasApiKey] = useState(true);
  
  const lastScrollY = useRef(0);
  const lenisRef = useRef<Lenis | null>(null);

  // Scroll Lock for Mobile Menu
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
      if (lenisRef.current) lenisRef.current.stop();
    } else {
      document.body.style.overflow = '';
      if (lenisRef.current) lenisRef.current.start();
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const checkApiKey = async () => {
        if (typeof (window as any).aistudio !== 'undefined') {
            const selected = await (window as any).aistudio.hasSelectedApiKey();
            setHasApiKey(selected);
        }
    };
    checkApiKey();
  }, []);

  const handleOpenKeySelector = async () => {
    if (typeof (window as any).aistudio !== 'undefined') {
        await (window as any).aistudio.openSelectKey();
        setHasApiKey(true);
        window.location.reload();
    }
  };

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    let rafId: number;
    function raf(time: number) { 
      lenis.raf(time); 
      rafId = requestAnimationFrame(raf); 
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const scrollToTop = (immediate = false) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate });
    } else {
      window.scrollTo(0, 0);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) setScrollDir('down');
      else setScrollDir('up');
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let interval: any;
    if (isAiSearching) {
      interval = setInterval(() => { setScanIndex(prev => (prev + 1) % SCAN_MESSAGES.length); }, 1500);
    }
    return () => clearInterval(interval);
  }, [isAiSearching]);

  const handleDeepAiSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!aiSearchInput.trim()) return;
    
    if (!hasApiKey) {
        handleOpenKeySelector();
        return;
    }

    setIsAiSearching(true);
    try {
        const { properties: results } = await searchTopProperties(aiSearchInput);
        if (results && results.length > 0) {
            const mapped: Property[] = results.map(r => ({
                ...r,
                price: Number(r.price) || 10000000,
                beds: Number(r.beds) || 3,
                baths: Number(r.baths) || 3,
                sqft: Number(r.sqft) || 1500,
                type: (['Apartment', 'Villa', 'Condo', 'House'].includes(r.type) ? r.type : 'Apartment') as any,
                imageUrl: r.imageUrl || `https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200&sig=${Math.random()}`,
                gallery: [r.imageUrl].filter(Boolean),
                features: r.features || ['Premium Amenities', 'Verified Heritage', 'Smart Estate'],
                coordinates: { lat: 13.0, lng: 77.0 }
            }));
            setAiSearchResults(mapped);
            setView(AppView.LISTINGS);
            scrollToTop();
        } else {
            alert("We couldn't find an exact match for your request. Please try searching for a specific developer like 'Godrej' or 'Embassy'.");
        }
    } catch (err) {
        console.error(err);
        handleOpenKeySelector();
    } finally {
        setIsAiSearching(false);
    }
  };

  const handleEOIClick = (propertyName: string) => {
      setModalProperty(propertyName);
      setIsEOI(true);
      setIsModalOpen(true);
  };

  const handleAdminAccess = () => {
      if (isAdminAuthenticated) setIsAdminOpen(true);
      else setShowAdminLogin(true);
      setIsMenuOpen(false);
  };

  const selectedProperty = properties.find(p => p.id === selectedPropertyId) || aiSearchResults.find(p => p.id === selectedPropertyId) || null;

  const LogoBranding = () => (
    <div className="flex items-center gap-2 md:gap-3 cursor-pointer group" onClick={() => { setView(AppView.HOME); setAiSearchResults([]); scrollToTop(); setIsMenuOpen(false); }}>
        <div className="w-10 h-10 md:w-14 md:h-14 bg-white/5 backdrop-blur-3xl rounded-xl md:rounded-2xl flex items-center justify-center shadow-2xl border border-white/10 transform group-hover:scale-105 transition-all duration-500 overflow-hidden">
          <svg viewBox="0 0 100 100" className="w-8 h-8 md:w-10 md:h-10 transform -rotate-12 group-hover:rotate-0 transition-transform duration-700">
            <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                d="M30,20 Q45,55 35,85"
                fill="none"
                stroke="#fdba74"
                strokeWidth="5"
                strokeLinecap="round"
            />
            <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, delay: 0.3, ease: "easeInOut" }}
                d="M40,30 C75,10 90,55 45,60"
                fill="none"
                stroke="#fdba74"
                strokeWidth="5"
                strokeLinecap="round"
            />
            <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, delay: 0.6, ease: "easeInOut" }}
                d="M20,70 Q55,55 85,80"
                fill="none"
                stroke="#fdba74"
                strokeWidth="5"
                strokeLinecap="round"
            />
          </svg>
        </div>
        <div className="flex flex-col">
            <span className="text-xl md:text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 tracking-tighter uppercase leading-none">Propertyfie</span>
            <span className="text-[7px] md:text-[9px] font-black text-orange-300 uppercase tracking-[0.4em] mt-0.5 md:mt-1">ELITE INTEL UNIT</span>
        </div>
    </div>
  );

  const navItems = [
    { name: 'Portfolio', view: AppView.LISTINGS },
    { name: 'Strategists', view: AppView.AGENTS },
    { name: 'Our Vision', view: AppView.VISION }
  ];

  return (
    <div className="min-h-screen relative font-inter flex flex-col selection:bg-violet-500 selection:text-white bg-[#020617] overflow-x-clip">
      <div className="fixed inset-0 z-0"><Scene3D /></div>

      {/* STRATEGIC CONVERSION: FLOATING EOI CAPSULE */}
      <motion.div 
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="fixed bottom-24 right-6 z-[80] hidden lg:block"
      >
        <button 
            onClick={() => handleEOIClick("Embassy Verde - Phase Two")}
            className="group relative flex items-center gap-4 bg-slate-900/90 backdrop-blur-3xl border border-violet-500/40 p-3 pr-8 rounded-full shadow-[0_20px_60px_rgba(0,0,0,0.8)] hover:border-lime-400 transition-all overflow-hidden"
        >
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-14 h-14 bg-violet-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-violet-600/40 group-hover:scale-110 group-hover:bg-lime-400 group-hover:text-black transition-all">
                <Star size={24} className="fill-current" />
            </div>
            <div className="flex flex-col text-left">
                <span className="text-[10px] font-black text-violet-400 uppercase tracking-[0.2em]">Priority Access</span>
                <span className="text-sm font-bold text-white uppercase whitespace-nowrap group-hover:text-lime-400">Embassy Verde Phase 2</span>
            </div>
            <ArrowRight size={18} className="text-violet-500 group-hover:translate-x-1 group-hover:text-lime-400 transition-transform ml-2" />
        </button>
      </motion.div>

      {/* STICKY NAV BAR */}
      <nav className={`fixed top-0 left-0 right-0 z-[130] flex justify-center pt-4 md:pt-6 px-4 md:px-8 transition-all duration-500 transform ${scrollDir === 'down' && !isMenuOpen ? '-translate-y-40' : 'translate-y-0'}`}>
        <div className="w-full max-w-7xl">
            <motion.div 
                layout 
                className="bg-slate-900/80 backdrop-blur-3xl border border-white/10 rounded-full px-5 md:px-10 py-3 md:py-4 flex items-center justify-between shadow-[0_30px_60px_rgba(0,0,0,0.6)]"
            >
                <LogoBranding />
                <div className="hidden lg:flex items-center gap-10">
                    {navItems.map(item => (
                        <button key={item.name} onClick={() => { setView(item.view); scrollToTop(); setIsMenuOpen(false); }} className={`text-[11px] font-black uppercase tracking-[0.3em] transition-all hover:text-lime-400 relative group/nav ${view === item.view ? 'text-violet-500' : 'text-slate-400'}`}>
                            {item.name}
                            <span className={`absolute -bottom-2 left-0 w-0 h-0.5 bg-lime-400 transition-all group-hover/nav:w-full ${view === item.view ? 'w-full' : ''}`} />
                        </button>
                    ))}
                    <div className="w-px h-8 bg-slate-800" />
                    <button onClick={handleAdminAccess} className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-lime-400 flex items-center gap-2 transition-colors">
                        <ShieldCheck size={16} className="text-violet-500 group-hover:text-lime-400"/> Vault
                    </button>
                </div>
                
                {/* HAMBURGER TOGGLE BUTTON WITH RESPONSIVE BRIGHT PARTICLE EFFECT */}
                <div className="relative flex items-center justify-center">
                    <AnimatePresence>
                        {!isMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.2, 1] }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute inset-0 bg-violet-500/30 rounded-full blur-2xl pointer-events-none z-0"
                            />
                        )}
                    </AnimatePresence>
                    <button 
                        onClick={() => setIsMenuOpen(!isMenuOpen)} 
                        className={`w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full transition-all group relative z-[150] shadow-xl border ${isMenuOpen ? 'bg-lime-400 border-lime-300' : 'bg-slate-800/80 border-white/5 hover:bg-lime-400 hover:border-lime-300'}`}
                    >
                        <motion.div
                            animate={isMenuOpen ? { rotate: 180 } : { rotate: 0 }}
                            className="relative flex items-center justify-center"
                        >
                            <AnimatePresence mode="wait">
                                {isMenuOpen ? (
                                    <motion.div
                                        key="close-icon"
                                        initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                        exit={{ opacity: 0, scale: 0.5, rotate: 45 }}
                                    >
                                        <X size={24} className="text-black" />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="menu-icon"
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.5 }}
                                    >
                                        <Menu size={24} className="text-white group-hover:text-black transition-colors" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </button>
                </div>
            </motion.div>
        </div>
      </nav>

      {/* REFINED SLIDE-OUT DRAWER MENU */}
      <AnimatePresence>
        {isMenuOpen && (
            <>
                {/* Backdrop Overlay */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsMenuOpen(false)}
                    className="fixed inset-0 z-[115] bg-[#020617]/80 backdrop-blur-sm cursor-pointer"
                />
                {/* Side Drawer */}
                <motion.div 
                    initial={{ x: '100%' }} 
                    animate={{ x: 0 }} 
                    exit={{ x: '100%' }} 
                    transition={{ type: 'spring', damping: 30, stiffness: 300, mass: 0.8 }}
                    className="fixed top-0 right-0 bottom-0 z-[120] w-[85%] sm:w-[450px] bg-[#020617]/98 backdrop-blur-3xl border-l border-white/5 flex flex-col p-8 md:p-12 shadow-[-40px_0_80px_rgba(0,0,0,0.8)] overflow-y-auto"
                >
                    <div className="flex flex-col h-full min-h-full">
                        <div className="flex justify-between items-center mb-16 md:mb-24">
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em]">Intel Menu</span>
                            <button onClick={() => setIsMenuOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        
                        <div className="flex-1 space-y-4 md:space-y-6">
                            {navItems.map((item, i) => (
                                <motion.button 
                                    key={item.name} 
                                    initial={{ x: 50, opacity: 0 }} 
                                    animate={{ x: 0, opacity: 1 }} 
                                    transition={{ delay: 0.1 * i, type: 'spring' }}
                                    onClick={() => { setView(item.view); setIsMenuOpen(false); scrollToTop(); }} 
                                    className="text-4xl md:text-6xl font-black text-white hover:text-lime-400 transition-all text-left uppercase tracking-tighter flex items-center gap-4 group w-full"
                                >
                                    <span className="text-[8px] md:text-[10px] font-mono text-slate-800 group-hover:text-lime-500 transition-colors">0{i+1}</span> {item.name}
                                </motion.button>
                            ))}
                            
                            <motion.button 
                                initial={{ x: 50, opacity: 0 }} 
                                animate={{ x: 0, opacity: 1 }} 
                                transition={{ delay: 0.1 * navItems.length, type: 'spring' }}
                                onClick={handleAdminAccess}
                                className="text-4xl md:text-6xl font-black text-slate-400 hover:text-lime-400 transition-all text-left uppercase tracking-tighter flex items-center gap-4 group w-full"
                            >
                                <span className="text-[8px] md:text-[10px] font-mono text-slate-800 group-hover:text-lime-500 transition-colors">0{navItems.length + 1}</span> Vault
                            </motion.button>
                        </div>

                        <div className="pt-10 mt-auto border-t border-white/5 flex flex-col gap-8">
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black text-slate-700 uppercase tracking-[0.4em] mb-2">Private Concierge</span>
                                <a href="tel:+917970750727" className="text-xl md:text-2xl font-black text-white hover:text-lime-400 transition-colors tracking-tight">+91 79707 50727</a>
                            </div>
                            <div className="flex gap-4">
                                {[Instagram, Linkedin, Mail].map((Icon, i) => (
                                    <div key={i} className="w-12 h-12 rounded-2xl bg-slate-900/50 border border-white/5 flex items-center justify-center text-slate-500 hover:bg-lime-400 hover:text-black transition-all cursor-pointer">
                                        <Icon size={18} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </>
        )}
      </AnimatePresence>

      <main className="relative z-10 pt-28 md:pt-40 min-h-screen">
        <AnimatePresence mode="wait">
          {view === AppView.HOME && (
            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              
              <section className="min-h-[80vh] md:min-h-[85vh] flex flex-col items-center justify-center px-5 md:px-10 text-center pb-24 relative overflow-hidden">
                <motion.div 
                  initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
                  onClick={() => handleEOIClick("Embassy Verde - Phase Two")}
                  className="cursor-pointer mb-10 md:mb-14 relative group"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500 rounded-full blur-2xl opacity-40 group-hover:opacity-70 transition-opacity duration-1000 animate-pulse"></div>
                    <div className="relative px-8 md:px-14 py-2.5 md:py-4 bg-slate-900/90 backdrop-blur-3xl border border-violet-500/50 rounded-full flex items-center gap-3 md:gap-5 hover:scale-105 hover:bg-lime-400/20 hover:border-lime-400 transition-all">
                        <Star size={14} className="text-violet-400 fill-current animate-spin-slow group-hover:text-lime-400" />
                        <span className="text-[9px] md:text-xs font-black text-white uppercase tracking-[0.3em] group-hover:text-lime-400">
                             EMBASSY VERDE <span className="text-violet-400 group-hover:text-lime-400">ELITE PHASE II IS LIVE</span>
                        </span>
                        <ArrowRight size={12} className="text-violet-400 group-hover:text-lime-400" />
                    </div>
                </motion.div>

                <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
                    <h1 className="text-5xl md:text-[9rem] lg:text-[11rem] font-black text-white mb-8 md:mb-12 tracking-tighter leading-[0.8] uppercase drop-shadow-[0_15px_40px_rgba(0,0,0,0.5)]">
                        FIND YOUR <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-400 to-fuchsia-400">ELITE ESTATE</span>
                    </h1>
                    <p className="text-base md:text-3xl text-slate-400 font-medium tracking-tight mb-12 md:mb-20 max-w-4xl mx-auto italic px-4">
                        Curating North Bengaluru's finest residences with verified AI intelligence and zero-friction access.
                    </p>
                </motion.div>
                
                <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="w-full max-w-5xl mx-auto px-4 relative z-20">
                   <form onSubmit={handleDeepAiSearch} className="relative group">
                      <div className="absolute -inset-4 md:-inset-10 bg-gradient-to-r from-violet-600 via-indigo-600 to-fuchsia-600 rounded-[3rem] md:rounded-[5rem] blur-[80px] opacity-10 group-focus-within:opacity-30 transition duration-1000"></div>
                      <div className="relative flex flex-col bg-slate-900/80 backdrop-blur-3xl border border-white/20 p-2.5 md:p-5 rounded-[2.5rem] md:rounded-full shadow-[0_40px_120px_rgba(0,0,0,0.8)] border-t-white/30">
                          <div className="flex flex-col md:flex-row gap-3 md:gap-5">
                              <div className="flex-1 relative flex items-center">
                                  <Search className="absolute left-6 md:left-10 text-slate-500 group-focus-within:text-lime-400 transition-colors" size={24} />
                                  <input 
                                    type="text" 
                                    value={aiSearchInput} 
                                    onChange={(e) => setAiSearchInput(e.target.value)} 
                                    placeholder="Search Godrej, Prestige or Brigade..." 
                                    className="w-full bg-transparent border-none text-white pl-16 md:pl-24 pr-6 md:pr-10 py-5 md:py-8 outline-none text-lg md:text-2xl placeholder:text-slate-700 font-medium focus:placeholder:text-lime-900" 
                                  />
                              </div>
                              <button 
                                disabled={isAiSearching} 
                                type="submit" 
                                className="bg-violet-600 hover:bg-lime-400 hover:text-black disabled:opacity-50 text-white px-10 md:px-16 py-5 md:py-8 rounded-full font-black uppercase tracking-[0.2em] text-[10px] md:text-xs flex items-center justify-center gap-3 md:gap-5 transition-all active:scale-95 shadow-2xl shadow-violet-600/40 hover:shadow-lime-400/40"
                              >
                                 {isAiSearching ? <Loader2 size={18} className="animate-spin"/> : <Zap size={18}/>} 
                                 {isAiSearching ? 'AUDITING...' : 'SEARCH ASSETS'}
                              </button>
                          </div>
                      </div>
                      
                      <div className="flex flex-wrap justify-center items-center gap-4 md:gap-10 mt-8 md:mt-12">
                          <div className="flex items-center gap-2.5 text-[9px] md:text-[11px] font-black text-slate-500 uppercase tracking-widest bg-slate-900/50 px-5 md:px-6 py-2.5 md:py-3 rounded-full border border-white/5 hover:border-lime-400 transition-colors cursor-default">
                              <ZapOff size={12} className="text-emerald-500" /> INSTANT BROCHURE ACCESS
                          </div>
                          <div className="flex items-center gap-2.5 text-[9px] md:text-[11px] font-black text-violet-400 uppercase tracking-widest bg-violet-600/10 px-5 md:px-6 py-2.5 md:py-3 rounded-full border border-violet-600/20 shadow-lg hover:bg-lime-400/10 hover:border-lime-400 hover:text-lime-400 transition-all cursor-default">
                              <ShieldCheck size={12} /> NO OTP VERIFICATION REQUIRED
                          </div>
                          <div className="hidden md:flex items-center gap-2.5 text-[11px] font-black text-slate-500 uppercase tracking-widest bg-slate-900/50 px-6 py-3 rounded-full border border-white/5">
                              <MapPin size={14} className="text-blue-500" /> NORTH BENGALURU FOCUS
                          </div>
                      </div>
                   </form>
                </motion.div>
              </section>

              <section className="py-20 md:py-32 bg-gradient-to-b from-transparent via-violet-950/5 to-transparent border-y border-white/5 relative">
                  <div className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">
                      <motion.div whileInView={{ opacity: 1, x: 0 }} initial={{ opacity: 0, x: -50 }} viewport={{ once: true }}>
                          <div className="flex items-center gap-4 text-violet-500 font-black text-xs uppercase tracking-[0.5em] mb-8 md:mb-10">
                              <Star className="fill-current" size={16} /> ELITE RECOMMENDATION
                          </div>
                          <h2 className="text-5xl md:text-8xl lg:text-9xl font-black text-white uppercase tracking-tighter leading-[0.85] mb-10 md:mb-12">
                              EMBASSY VERDE <br/> <span className="text-violet-500">PHASE TWO</span>
                          </h2>
                          <div className="grid grid-cols-2 gap-4 md:gap-8 mb-12 md:mb-16">
                              {STRATEGIC_HOTSPOTS.map((spot, i) => (
                                  <motion.div key={spot.name} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="p-6 md:p-8 rounded-[2rem] bg-slate-900/60 border border-white/5 hover:border-lime-400 transition-all flex flex-col gap-3 group shadow-2xl">
                                      <div className={`flex items-center gap-2.5 ${spot.color} font-black text-[10px] uppercase tracking-widest group-hover:text-lime-400`}>
                                          {spot.icon} {spot.name}
                                      </div>
                                      <div className="text-white font-black text-2xl md:text-3xl group-hover:scale-105 group-hover:text-lime-400 transition-all origin-left">{spot.dist}</div>
                                  </motion.div>
                              ))}
                          </div>
                          <div className="flex flex-wrap gap-6 md:gap-8 items-center">
                              <button onClick={() => handleEOIClick("Embassy Verde - Phase Two")} className="bg-violet-600 text-white px-10 md:px-16 py-5 md:py-7 rounded-[2rem] font-black uppercase tracking-widest text-[10px] md:text-xs hover:bg-lime-400 hover:text-black transition-all shadow-2xl shadow-violet-600/40 hover:shadow-lime-400/40 flex items-center gap-4 group">
                                  Submit Priority EOI <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                              </button>
                              <div className="flex flex-col">
                                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-1 flex items-center gap-2">
                                    <Zap size={10} className="fill-current"/> Instant Submission
                                  </span>
                                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">No OTP Verification</span>
                              </div>
                          </div>
                      </motion.div>
                      <motion.div whileInView={{ opacity: 1, scale: 1 }} initial={{ opacity: 0, scale: 0.9 }} viewport={{ once: true }} className="relative group">
                          <div className="absolute -inset-6 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-[4rem] blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
                          <img src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1200" className="relative rounded-[3rem] md:rounded-[4.5rem] shadow-2xl border border-white/10 z-10 w-full aspect-[4/3] object-cover" alt="Embassy Verde" />
                          <div className="absolute -bottom-8 -right-4 md:-right-10 bg-slate-900 border border-violet-500/50 p-8 md:p-14 rounded-[2.5rem] md:rounded-[3.5rem] shadow-[0_40px_80px_rgba(0,0,0,0.8)] backdrop-blur-3xl z-20 flex flex-col items-center group-hover:border-lime-400 transition-all">
                              <div className="text-3xl md:text-6xl font-black text-white leading-none group-hover:text-lime-400">12.4%</div>
                              <div className="text-[10px] md:text-[12px] font-black text-violet-400 uppercase tracking-widest mt-2 md:mt-3 group-hover:text-lime-400">Projected CAGR</div>
                          </div>
                      </motion.div>
                  </div>
              </section>

              <section className="py-24 md:py-48 px-6 md:px-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-40">
                   <InvestmentTool />
                   <PathfinderTool />
              </section>

              <section className="py-24 md:py-48 px-6 md:px-10 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 md:mb-28 gap-10 md:gap-12">
                    <div>
                        <h2 className="text-5xl md:text-8xl lg:text-9xl font-black text-white uppercase tracking-tighter leading-none">Curated Portfolio</h2>
                        <p className="text-slate-500 mt-6 md:mt-8 text-xl md:text-3xl font-medium tracking-tight italic max-w-3xl">
                          Exclusively audited assets from Godrej, Prestige, and Brigade — designed for elite lifestyles.
                        </p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-20">
                    {MOCK_PROPERTIES.slice(0, 6).map((p, i) => (
                        <PropertyCard 
                            key={p.id} property={p} index={i} 
                            onSelect={(p) => { setSelectedPropertyId(p.id); setView(AppView.DETAILS); scrollToTop(); }} 
                            onEnquire={(p) => { setModalProperty(p.title); setIsEOI(true); setIsModalOpen(true); }}
                            onBrochureDownload={(l) => setLeads([l, ...leads])}
                        />
                    ))}
                </div>
              </section>
            </motion.div>
          )}

          {view === AppView.LISTINGS && (
            <motion.div key="listings" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -40 }} className="max-w-7xl mx-auto px-6 md:px-10 py-24 md:py-32 min-h-screen">
              <div className="mb-20 md:mb-24">
                 <h2 className="text-6xl md:text-[10rem] font-black text-white tracking-tighter uppercase leading-none">The Realm</h2>
                 <p className="text-slate-500 font-bold uppercase tracking-[0.4em] text-[11px] md:text-sm mt-6 md:mt-8">Verified Assets | Updated Dec 21, 2025</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-20">
                  {(aiSearchResults.length > 0 ? aiSearchResults : properties).map((p, i) => (
                      <PropertyCard 
                          key={p.id} property={p} index={i} 
                          onSelect={(p) => { setSelectedPropertyId(p.id); setView(AppView.DETAILS); scrollToTop(); }} 
                          onEnquire={(p) => { setModalProperty(p.title); setIsEOI(true); setIsModalOpen(true); }}
                          onBrochureDownload={(l) => setLeads([l, ...leads])}
                      />
                  ))}
              </div>
            </motion.div>
          )}

          {view === AppView.VISION && (
            <motion.div key="vision" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-7xl mx-auto px-6 md:px-10 py-24 md:py-32 min-h-screen">
                <div className="flex flex-col items-center text-center mb-24 md:mb-44">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }} className="w-20 h-20 md:w-32 md:h-32 bg-violet-600 rounded-[2rem] md:rounded-[3rem] flex items-center justify-center mb-10 md:mb-14 shadow-2xl shadow-violet-600/40 hover:bg-lime-400 hover:shadow-lime-400/40 transition-all cursor-default group">
                        <Eye className="text-white w-10 h-10 md:w-16 md:h-16 group-hover:text-black transition-colors" />
                    </motion.div>
                    <h2 className="text-6xl md:text-[12rem] font-black text-white uppercase tracking-tighter leading-none mb-8 md:mb-10">THE <span className="text-violet-500">VISION</span></h2>
                    <p className="text-xl md:text-5xl text-slate-400 font-medium max-w-5xl leading-relaxed italic">
                      "Pioneering the intelligence layer of modern real estate for the most discerning families."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 mb-24 md:mb-56">
                    <div className="bg-slate-900/40 border border-white/5 rounded-[3rem] md:rounded-[4.5rem] p-10 md:p-24 hover:border-lime-400 transition-all group shadow-2xl">
                        <div className="w-16 h-16 md:w-24 md:h-24 bg-slate-800 rounded-2xl md:rounded-[2.5rem] flex items-center justify-center mb-8 md:mb-14 group-hover:scale-110 group-hover:bg-lime-400 transition-all"><Cpu className="text-violet-400 w-10 h-10 md:w-12 md:h-12 group-hover:text-black" /></div>
                        <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-6 md:mb-8 group-hover:text-lime-400">Elite Auditing</h3>
                        <p className="text-slate-400 leading-relaxed text-lg md:text-2xl font-medium">
                          We defend your investment. Our AI meticulously audits titles, RERA filings, and infrastructure progress to ensure every project in our grid is truly superior.
                        </p>
                    </div>
                    <div className="bg-slate-900/40 border border-white/5 rounded-[3rem] md:rounded-[4.5rem] p-10 md:p-24 hover:border-lime-400 transition-all group shadow-2xl">
                        <div className="w-16 h-16 md:w-24 md:h-24 bg-slate-800 rounded-2xl md:rounded-[2.5rem] flex items-center justify-center mb-8 md:mb-14 group-hover:scale-110 group-hover:bg-lime-400 transition-all"><Globe className="text-emerald-400 w-10 h-10 md:w-12 md:h-12 group-hover:text-black" /></div>
                        <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-6 md:mb-8 group-hover:text-lime-400">Future Connectivity</h3>
                        <p className="text-slate-400 leading-relaxed text-lg md:text-2xl font-medium">
                          We map the future. From airport line metro expansions to upcoming tech corridors, we provide the intel you need to own the next high-growth zone.
                        </p>
                    </div>
                </div>

                {/* VISIONARY FOUNDER SECTION */}
                <div className="mb-24 md:mb-56 relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />
                    <div className="flex flex-col lg:flex-row gap-16 md:gap-32 items-center">
                        <motion.div 
                            initial={{ x: -50, opacity: 0 }} 
                            whileInView={{ x: 0, opacity: 1 }} 
                            viewport={{ once: true }}
                            className="w-full lg:w-1/2 relative"
                        >
                            <div className="absolute -inset-4 bg-gradient-to-tr from-violet-600/20 to-lime-400/10 blur-3xl opacity-50 rounded-[4rem]" />
                            <div className="relative bg-slate-900/60 border border-white/5 p-12 md:p-20 rounded-[3rem] md:rounded-[4.5rem] shadow-2xl hover:border-lime-400 transition-all group">
                                <div className="flex items-center gap-5 mb-10">
                                    <div className="w-16 h-16 md:w-20 md:h-20 bg-violet-600 rounded-2xl md:rounded-[2rem] flex items-center justify-center shadow-lg group-hover:bg-lime-400 group-hover:scale-110 transition-all">
                                        <UserRound className="text-white w-8 h-8 md:w-10 md:h-10 group-hover:text-black transition-colors" />
                                    </div>
                                    <div>
                                        <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter group-hover:text-lime-400 transition-colors">Aman Singh</h3>
                                        <p className="text-[10px] md:text-xs font-black text-violet-400 uppercase tracking-[0.4em] mt-1 group-hover:text-lime-600">The Nexus Architect</p>
                                    </div>
                                </div>
                                <p className="text-slate-400 leading-relaxed text-lg md:text-2xl font-medium mb-10 italic">
                                    "We aren't just selling properties; we're auditing the future. Every line of code in our neural grid is a defensive perimeter around your capital."
                                </p>
                                <div className="grid grid-cols-2 gap-6 md:gap-10">
                                    <div className="space-y-2">
                                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                            <TrendingUp size={12} className="text-violet-500" /> Investment Alpha
                                        </div>
                                        <div className="text-white font-bold text-sm md:text-lg">Disrupting Operations</div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                            <Code2 size={12} className="text-emerald-500" /> Engineering Edge
                                        </div>
                                        <div className="text-white font-bold text-sm md:text-lg">Simplifying Complexity</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                        
                        <motion.div 
                            initial={{ x: 50, opacity: 0 }} 
                            whileInView={{ x: 0, opacity: 1 }} 
                            viewport={{ once: true }}
                            className="w-full lg:w-1/2 space-y-12"
                        >
                            <div className="space-y-8">
                                <div className="flex items-center gap-4 text-lime-400 font-black text-xs uppercase tracking-[0.5em]">
                                    <GraduationCap className="w-5 h-5" /> CURIOUSMINDS NEXUS
                                </div>
                                <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none">THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">EDTECH DISRUPTION</span></h2>
                                <p className="text-slate-400 text-lg md:text-2xl leading-relaxed font-medium italic">
                                    Aman's visionary reach extends into e-modern learning through <span className="text-lime-400 font-black">Curiousminds</span>. By democratizing high-fidelity engineering knowledge, he ensures the next generation of builders is equipped with zero-friction tools.
                                </p>
                            </div>
                            
                            <div className="p-8 md:p-12 bg-slate-900/40 border border-white/5 rounded-[2.5rem] hover:border-lime-400 transition-all group">
                                <div className="flex items-center gap-6 mb-8">
                                    <Github className="w-8 h-8 md:w-12 md:h-12 text-white group-hover:text-lime-400 transition-colors" />
                                    <div>
                                        <h4 className="text-xl md:text-3xl font-black text-white uppercase tracking-tighter group-hover:text-lime-400 transition-colors">One Release, One Tool</h4>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Open Source Commitment</p>
                                    </div>
                                </div>
                                <p className="text-slate-500 text-sm md:text-lg leading-relaxed font-medium group-hover:text-slate-300 transition-colors">
                                    With every major deployment, our core team releases a high-utility open-source tool. We believe in complexity-free engineering for all, removing friction from the web.
                                </p>
                                <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <a href="https://ipmeteic.xyz" target="_blank" rel="noopener noreferrer" className="px-4 py-4 bg-white/5 hover:bg-lime-400 hover:text-black text-white border border-white/10 rounded-2xl font-black uppercase tracking-widest text-[9px] transition-all flex items-center justify-center gap-2 text-center">
                                        IPMETEIC.XYZ <ArrowRight size={12} />
                                    </a>
                                    <a href="https://curiousminds.online" target="_blank" rel="noopener noreferrer" className="px-4 py-4 bg-white/5 hover:bg-lime-400 hover:text-black text-white border border-white/10 rounded-2xl font-black uppercase tracking-widest text-[9px] transition-all flex items-center justify-center gap-2 text-center">
                                        CURIOUSMINDS.ONLINE <ArrowRight size={12} />
                                    </a>
                                    <a href="https://propertyfie.vercel.app/" target="_blank" rel="noopener noreferrer" className="px-4 py-4 bg-white/5 hover:bg-lime-400 hover:text-black text-white border border-white/10 rounded-2xl font-black uppercase tracking-widest text-[9px] transition-all flex items-center justify-center gap-2 text-center">
                                        PROPERTYFIE <ArrowRight size={12} />
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                <div className="mb-24 md:mb-56">
                    <div className="flex items-center gap-6 md:gap-8 mb-16 md:mb-24">
                        <Rocket className="text-violet-500 w-8 h-8 md:w-14 md:h-14" />
                        <h3 className="text-3xl md:text-6xl font-black text-white uppercase tracking-tighter">Strategic Roadmap</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                        {ROADMAP.map((item, i) => (
                            <motion.div key={item.quarter} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="relative group">
                                <div className="text-5xl md:text-7xl font-black text-slate-800 mb-6 md:mb-8 group-hover:text-lime-900 transition-colors">{item.quarter}</div>
                                <div className="p-8 md:p-12 bg-slate-900/60 border border-white/5 rounded-[2rem] md:rounded-[3rem] h-full shadow-2xl group-hover:border-lime-400 transition-all">
                                    <h4 className="text-xl md:text-3xl font-black text-white uppercase tracking-tighter mb-3 md:mb-5 group-hover:text-lime-400 transition-colors" style={{ color: item.color }}>{item.title}</h4>
                                    <p className="text-[11px] md:text-base text-slate-500 leading-relaxed font-medium">{item.detail}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>
          )}

          {view === AppView.AGENTS && (
            <motion.div key="agents" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="max-w-7xl mx-auto px-6 md:px-10 py-24 md:py-32 min-h-screen">
               <div className="mb-20 md:mb-40">
                  <h2 className="text-6xl md:text-[12rem] font-black text-white uppercase tracking-tighter leading-[0.75]">THE <br/><span className="text-violet-500">STRATEGISTS</span></h2>
                  <p className="text-slate-500 font-bold uppercase tracking-[0.4em] text-[11px] md:text-sm mt-8 md:mt-10 italic">Expert Advisors at Your Command</p>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-16">
                  {AGENTS_LIST.map((agent, i) => (
                    <motion.div key={agent.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="group bg-slate-900/40 backdrop-blur-2xl border border-white/5 rounded-[3rem] md:rounded-[4.5rem] p-10 md:p-14 flex flex-col items-center text-center hover:border-lime-400 transition-all shadow-2xl relative overflow-hidden">
                      <div className={`w-32 h-32 md:w-48 md:h-48 rounded-[2rem] md:rounded-[3.5rem] flex items-center justify-center mb-8 md:mb-12 relative z-10 transition-all duration-700 group-hover:scale-110 group-hover:rotate-6 group-hover:bg-lime-400 ${agent.gender === 'female' ? 'bg-gradient-to-br from-violet-600 to-fuchsia-600' : 'bg-gradient-to-br from-indigo-600 to-blue-600'} shadow-[0_25px_60px_rgba(0,0,0,0.5)]`}>
                        {agent.gender === 'female' ? <Contact size={48} md:size={72} className="text-white group-hover:text-black transition-colors" /> : <UserRound size={48} md:size={72} className="text-white group-hover:text-black transition-colors" />}
                      </div>
                      <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-3 md:mb-4 group-hover:text-lime-400 transition-colors">{agent.name}</h3>
                      <p className="text-violet-400 font-black text-[10px] md:text-sm uppercase tracking-[0.5em] mb-8 md:mb-12">{agent.role}</p>
                      <a href={`tel:${agent.phone}`} className="w-full mt-6 md:mt-10 py-5 md:py-6 bg-slate-800 text-white font-black rounded-2xl md:rounded-3xl uppercase tracking-[0.3em] text-[10px] md:text-xs hover:bg-lime-400 hover:text-black transition-all shadow-xl text-center">Connect Direct</a>
                    </motion.div>
                  ))}
               </div>
            </motion.div>
          )}

          {view === AppView.DETAILS && selectedProperty && (
            <PropertyDetailsView property={selectedProperty} onBack={() => { setView(AppView.LISTINGS); scrollToTop(); }} onEnquire={(p) => { setModalProperty(p.title); setIsEOI(true); setIsModalOpen(true); }} />
          )}
        </AnimatePresence>

        <footer className="relative mt-24 md:mt-64 pt-24 md:pt-48 pb-20 md:pb-40 border-t border-white/5 bg-[#020617] overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-24">
            <div className="md:col-span-7 space-y-10 md:space-y-16">
               <LogoBranding />
               <p className="text-slate-500 leading-relaxed text-xl md:text-3xl max-w-3xl font-medium italic">
                "Redefining real estate through the lens of accuracy and verified intelligence. Your future begins here."
               </p>
               <div className="flex gap-6 md:gap-10">
                  {[Instagram, Linkedin, Mail].map((Icon, i) => (
                    <motion.div key={i} whileHover={{ y: -10, scale: 1.1 }} className="w-14 h-14 md:w-18 md:h-18 rounded-2xl md:rounded-3xl border border-slate-800 flex items-center justify-center text-slate-500 hover:bg-lime-400 hover:text-black cursor-pointer transition-all bg-slate-900/50 shadow-2xl"><Icon size={24} className="md:size-8" /></motion.div>
                  ))}
               </div>
            </div>
            <div className="md:col-span-5 flex flex-col justify-end items-start md:items-end">
                <div className="text-left md:text-right space-y-4 md:space-y-6">
                    <p className="text-[10px] md:text-[12px] font-black text-slate-700 uppercase tracking-[0.5em]">Direct Access</p>
                    <a href="mailto:info@propertyfie.com" className="text-xl md:text-3xl font-black text-white hover:text-lime-400 transition-colors block">info@propertyfie.com</a>
                    <a href="tel:+917970750727" className="text-xl md:text-3xl font-black text-white hover:text-lime-400 transition-colors block tracking-tight">+91 79707 50727</a>
                </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto mt-24 md:mt-40 pt-12 md:pt-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10 md:gap-12 px-6">
             <div className="text-[10px] md:text-[12px] font-black text-slate-800 uppercase tracking-[0.5em] text-center md:text-left">
                © 2025 PROPERTYFIE INTEL UNIT • REDEFINING INNOVATIONS, WE'RE <span onClick={handleAdminAccess} className="cursor-pointer hover:text-lime-400 transition-all duration-300">CURIOUSMINDS</span>
             </div>
             <div className="flex gap-10 md:gap-16 text-[10px] md:text-[12px] font-black text-slate-500 uppercase tracking-[0.3em]">
                <button onClick={() => scrollToTop()} className="flex items-center gap-3 md:gap-4 hover:text-lime-400 transition-colors group"><ArrowUp size={14} md:size={16} className="group-hover:-translate-y-1 transition-transform" /> Scroll to Zenith</button>
             </div>
          </div>
        </footer>
      </main>

      <AIChat properties={properties} />
      <EnquireModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setIsEOI(false); }} propertyName={modalProperty} isEOI={isEOI} onDataCapture={(l) => setLeads([l, ...leads])} />
      <AnimatePresence>{isAdminOpen && <AdminDashboard onClose={() => setIsAdminOpen(false)} leads={leads} />}</AnimatePresence>
      <AdminLoginModal isOpen={showAdminLogin} onClose={() => setShowAdminLogin(false)} onSuccess={() => { setIsAdminAuthenticated(true); setIsAdminOpen(true); }} />
    </div>
  );
};

export default App;
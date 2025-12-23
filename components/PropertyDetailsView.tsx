import React, { useState } from 'react';
import { Property } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle, Calendar, MessageCircle, MapPin, Grid, Maximize, Home, Layout, ChevronRight, ChevronLeft, Building, FileCheck, Layers, CalendarCheck, Zap, TrendingUp, Shield, Plane, Cpu, Briefcase, Baby, Coins, Box, Info, Sparkles } from 'lucide-react';
import { TAGLINE } from '../constants';
import Property3DViewer from './Property3DViewer';

interface PropertyDetailsViewProps {
  property: Property;
  onBack: () => void;
  onEnquire: (p: Property, isSchedule: boolean) => void;
}

type PersonaType = 'techie' | 'family' | 'investor';
type TabType = 'overview' | 'amenities' | 'infrastructure' | '3d';

const PropertyDetailsView: React.FC<PropertyDetailsViewProps> = ({ property, onBack, onEnquire }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activePersona, setActivePersona] = useState<PersonaType>('techie');
  const [is3DMode, setIs3DMode] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const allImages = [property.imageUrl, ...(property.gallery || [])];

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const matchScore = property.personas ? property.personas[activePersona] : 88;
  const infraTimeline = property.infrastructureTimeline || [
      { year: '2026', event: 'Blue Line Metro', impact: '+12% Value', icon: 'metro' },
      { year: '2027', event: 'Suburban Rail', impact: '+5% Value', icon: 'road' }
  ];
  const fairValue = property.fairValue || { marketAverage: 8500, projectPremium: 10, fairPrice: property.price * 0.95 };

  const tabs: { id: TabType, label: string, icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <Info size={14} /> },
    { id: 'amenities', label: 'Amenities', icon: <Sparkles size={14} /> },
    { id: 'infrastructure', label: 'Infrastructure', icon: <Zap size={14} /> },
    { id: '3d', label: '3D Model', icon: <Box size={14} /> }
  ];

  const tabContentVariants = {
    initial: { opacity: 0, x: 10 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -10 },
    transition: { duration: 0.3, ease: "easeOut" }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="w-full bg-[#020617] pb-24"
    >
      {/* Navigation Header - Offset from the main app nav */}
      <div className="sticky top-20 md:top-24 z-40 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 px-5 md:px-8 py-4 flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-lime-400 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-black text-[10px] uppercase tracking-[0.3em]">Return to Realm</span>
        </button>
        <div className="flex flex-col items-center">
            <div className="text-white font-black uppercase text-xs tracking-tight hidden md:block">{property.title}</div>
            <div className="text-[8px] font-black text-violet-500 uppercase tracking-[0.4em] hidden md:block">{TAGLINE}</div>
        </div>
        <div className="w-20 md:w-32 hidden md:block"></div>
      </div>

      <div className="max-w-7xl mx-auto px-5 md:px-8 py-8 md:py-12">
        
        {/* Gallery Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6 mb-12 h-auto lg:h-[65vh]">
            <div className="lg:col-span-3 relative rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden group border border-white/5 aspect-[4/3] lg:aspect-auto shadow-2xl">
                <img 
                    src={allImages[activeImageIndex]} 
                    alt={property.title} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent pointer-events-none" />
                
                {allImages.length > 1 && (
                    <>
                        <button onClick={(e) => {e.stopPropagation(); prevImage();}} className="absolute left-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-black/40 text-white hover:bg-lime-400 hover:text-black backdrop-blur-xl transition-all opacity-0 group-hover:opacity-100 border border-white/10">
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button onClick={(e) => {e.stopPropagation(); nextImage();}} className="absolute right-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-black/40 text-white hover:bg-lime-400 hover:text-black backdrop-blur-xl transition-all opacity-0 group-hover:opacity-100 border border-white/10">
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </>
                )}
                
                <div className="absolute bottom-10 left-10 md:bottom-16 md:left-16">
                    <span className="px-4 py-2 rounded-lg bg-violet-600 text-white text-[10px] font-black uppercase tracking-[0.3em] mb-5 inline-block shadow-2xl group-hover:bg-lime-400 group-hover:text-black transition-all">
                        {property.type}
                    </span>
                    <h1 className="text-4xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none mb-4 group-hover:text-lime-400 transition-colors">{property.title}</h1>
                    <div className="flex items-center text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs">
                         <MapPin className="w-4 h-4 mr-2 text-violet-500 group-hover:text-lime-400" />
                         {property.address}
                    </div>
                </div>
            </div>

            <div className="hidden lg:grid grid-rows-3 gap-6">
                {allImages.slice(1, 4).map((img, idx) => (
                    <div 
                        key={idx} 
                        className="relative rounded-[2rem] overflow-hidden cursor-pointer border border-white/5 hover:border-lime-400 transition-all group"
                        onClick={() => setActiveImageIndex(idx + 1)}
                    >
                        <img src={img} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="Gallery" />
                        {activeImageIndex === idx + 1 && (
                            <div className="absolute inset-0 border-4 border-lime-400 rounded-[2rem] bg-lime-400/10" />
                        )}
                    </div>
                ))}
            </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center gap-2 mb-10 bg-slate-900/40 p-2 rounded-[2rem] border border-white/5 backdrop-blur-xl w-fit">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2.5 px-6 py-3.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-lime-400 text-black shadow-xl shadow-lime-400/20' : 'text-slate-500 hover:text-lime-400 hover:bg-lime-400/5'}`}
                >
                    {tab.icon}
                    {tab.label}
                </button>
            ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16">
            
            {/* Left Column: Tabbed Content */}
            <div className="lg:col-span-8">
                <AnimatePresence mode="wait">
                    {activeTab === 'overview' && (
                        <motion.div key="overview" {...tabContentVariants} className="space-y-16">
                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-4 md:gap-8">
                                <div className="p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] bg-slate-900/40 border border-white/5 flex flex-col items-center justify-center text-center group hover:border-lime-400 transition-all shadow-xl">
                                    <Home className="w-8 h-8 md:w-10 md:h-10 text-violet-500 mb-4 md:mb-5 group-hover:scale-110 group-hover:text-lime-400 transition-all" />
                                    <span className="text-2xl md:text-4xl font-black text-white group-hover:text-lime-400">{property.beds}</span>
                                    <span className="text-[8px] md:text-[10px] text-slate-500 uppercase font-black tracking-[0.3em] mt-2 group-hover:text-lime-600">Bedrooms</span>
                                </div>
                                <div className="p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] bg-slate-900/40 border border-white/5 flex flex-col items-center justify-center text-center group hover:border-lime-400 transition-all shadow-xl">
                                    <Grid className="w-8 h-8 md:w-10 md:h-10 text-violet-500 mb-4 md:mb-5 group-hover:scale-110 group-hover:text-lime-400 transition-all" />
                                    <span className="text-2xl md:text-4xl font-black text-white group-hover:text-lime-400">{property.baths}</span>
                                    <span className="text-[8px] md:text-[10px] text-slate-500 uppercase font-black tracking-[0.3em] mt-2 group-hover:text-lime-600">Bathrooms</span>
                                </div>
                                <div className="p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] bg-slate-900/40 border border-white/5 flex flex-col items-center justify-center text-center group hover:border-lime-400 transition-all shadow-xl">
                                    <Maximize className="w-8 h-8 md:w-10 md:h-10 text-violet-500 mb-4 md:mb-5 group-hover:scale-110 group-hover:text-lime-400 transition-all" />
                                    <span className="text-2xl md:text-4xl font-black text-white group-hover:text-lime-400">{property.sqft}</span>
                                    <span className="text-[8px] md:text-[10px] text-slate-500 uppercase font-black tracking-[0.3em] mt-2 group-hover:text-lime-600">Sq. Ft</span>
                                </div>
                            </div>

                            {/* Vibe Match */}
                            <div className="bg-slate-900/40 border border-white/5 rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 relative overflow-hidden shadow-2xl hover:border-lime-400 transition-all group">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 md:mb-12 gap-8 relative z-10">
                                    <div>
                                        <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter flex items-center gap-4 group-hover:text-lime-400 transition-colors">
                                            <Cpu className="text-violet-500 group-hover:text-lime-400 w-8 h-8" /> Neural Vibe-Match
                                        </h3>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-2">Lifestyle AI Alignment Analysis</p>
                                    </div>
                                    <div className="flex bg-slate-950/80 p-1.5 md:p-2 rounded-full border border-white/10 w-full md:w-auto overflow-x-auto">
                                        {[
                                            { id: 'techie', icon: <Briefcase size={12}/>, label: 'Techie' },
                                            { id: 'family', icon: <Baby size={12}/>, label: 'Family' },
                                            { id: 'investor', icon: <TrendingUp size={12}/>, label: 'Investor' }
                                        ].map((p) => (
                                            <button
                                                key={p.id}
                                                onClick={() => setActivePersona(p.id as PersonaType)}
                                                className={`flex-1 md:flex-none px-4 md:px-6 py-2.5 md:py-3.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 md:gap-2.5 transition-all whitespace-nowrap ${activePersona === p.id ? 'bg-lime-400 text-black shadow-xl' : 'text-slate-500 hover:text-lime-400'}`}
                                            >
                                                {p.icon} {p.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row items-center justify-between gap-10 md:gap-12 relative z-10">
                                    <div className="space-y-6 md:space-y-8 flex-1">
                                        <AnimatePresence mode="wait">
                                            <motion.p 
                                                key={activePersona}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="text-lg md:text-xl text-slate-300 leading-relaxed font-medium italic"
                                            >
                                                {activePersona === 'techie' && <>Optimized for <span className="text-violet-400 font-black group-hover:text-lime-400">Silicon North</span> lifestyles. Proximity to major tech clusters ensures minimal latency in commute and maximum efficiency.</>}
                                                {activePersona === 'family' && <>Engineered for <span className="text-emerald-400 font-black group-hover:text-lime-400">Generational Comfort</span>. Safe-zones, verified pedagogy within reach, and multi-generational amenity clusters.</>}
                                                {activePersona === 'investor' && <>High-yield <span className="text-violet-400 font-black group-hover:text-lime-400">Strategic Asset</span>. Market data confirms strong rental demand and capital appreciation in this specific grid quadrant.</>}
                                            </motion.p>
                                        </AnimatePresence>
                                        <div className="h-2 md:h-2.5 w-full bg-slate-800/50 rounded-full overflow-hidden border border-white/5">
                                            <motion.div 
                                                initial={{ width: 0 }} 
                                                animate={{ width: `${matchScore}%` }} 
                                                transition={{ duration: 1, ease: "easeOut" }}
                                                className="h-full bg-gradient-to-r from-violet-600 via-indigo-500 to-fuchsia-500 group-hover:from-lime-400 group-hover:to-lime-600 shadow-[0_0_20px_rgba(124,58,237,0.5)] group-hover:shadow-lime-400/50 transition-all"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="relative w-40 h-40 md:w-48 md:h-48 flex items-center justify-center shrink-0">
                                        <svg className="w-full h-full -rotate-90">
                                            <circle cx="50%" cy="50%" r="42%" stroke="#1e293b" strokeWidth="10" fill="none" className="opacity-30" />
                                            <motion.circle 
                                                initial={{ pathLength: 0 }}
                                                animate={{ pathLength: matchScore / 100 }}
                                                transition={{ duration: 1.5, ease: "easeOut" }}
                                                cx="50%" cy="50%" r="42%" 
                                                stroke={activeTab === 'overview' ? '#8b5cf6' : '#a3e635'} strokeWidth={10} fill="none" strokeLinecap="round" 
                                                className="transition-colors duration-500"
                                            />
                                        </svg>
                                        <div className="absolute text-center">
                                            <span className="text-4xl md:text-5xl font-black text-white group-hover:text-lime-400 transition-colors">{matchScore}%</span>
                                            <div className="text-[8px] md:text-[10px] text-slate-500 uppercase font-black tracking-[0.3em] mt-1 group-hover:text-lime-600">Match</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute top-0 right-0 w-[300px] h-[300px] md:w-[400px] md:h-[400px] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none group-hover:bg-lime-400/5 transition-colors" />
                            </div>

                            {/* Description */}
                            <div className="px-2">
                                <h3 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter mb-6 md:mb-8 group-hover:text-lime-400 transition-colors">Asset Brief</h3>
                                <p className="text-slate-400 leading-relaxed text-xl md:text-2xl font-medium italic group-hover:text-slate-200 transition-colors">
                                    {property.description}
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'amenities' && (
                        <motion.div key="amenities" {...tabContentVariants}>
                            <h3 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter mb-10 md:mb-12 group-hover:text-lime-400 transition-colors">Elite Provisions</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 md:gap-6">
                                {property.features.map(feature => (
                                    <motion.div 
                                        whileHover={{ y: -5, borderColor: '#a3e635' }}
                                        key={feature} 
                                        className="flex items-center gap-4 md:gap-5 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] bg-slate-900/60 border border-white/5 text-slate-300 transition-all group shadow-xl"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-violet-600/10 flex items-center justify-center shrink-0 group-hover:bg-lime-400/20 transition-colors">
                                            <CheckCircle className="w-5 h-5 text-emerald-500 group-hover:text-lime-400" />
                                        </div>
                                        <span className="font-black uppercase tracking-[0.2em] text-[10px] md:text-[11px] leading-tight group-hover:text-white">{feature}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'infrastructure' && (
                        <motion.div key="infrastructure" {...tabContentVariants}>
                            <h3 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter mb-10 md:mb-12 flex items-center gap-4 md:gap-5 group hover:text-lime-400 transition-colors">
                                <Zap className="text-yellow-500 fill-yellow-500 w-8 h-8 md:w-10 md:h-10 group-hover:text-lime-400 group-hover:fill-lime-400 transition-all" /> Infrastructure Alpha
                            </h3>
                            <div className="relative border-l-2 border-white/5 ml-4 md:ml-8 space-y-10 md:space-y-12 pl-8 md:pl-12 py-4">
                                {infraTimeline.map((item, idx) => (
                                    <div key={idx} className="relative group">
                                        <div className="absolute -left-[41px] md:-left-[61px] top-2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-950 border-2 border-violet-500 flex items-center justify-center z-10 group-hover:scale-110 group-hover:border-lime-400 transition-all shadow-[0_0_15px_rgba(124,58,237,0.4)] group-hover:shadow-lime-400/50">
                                            <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-violet-500 rounded-full animate-pulse group-hover:bg-lime-400" />
                                        </div>
                                        <div className="bg-slate-900/40 border border-white/5 p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] hover:border-lime-400 transition-all shadow-2xl">
                                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 md:mb-6 gap-4 md:gap-5">
                                                <span className="px-4 py-1.5 md:px-5 md:py-2 bg-slate-800 text-white text-[9px] md:text-[10px] font-black tracking-[0.3em] rounded-lg uppercase group-hover:bg-lime-400 group-hover:text-black transition-all">{item.year}</span>
                                                <span className="text-emerald-400 text-[10px] md:text-xs font-black uppercase tracking-widest flex items-center gap-2 md:gap-2.5 group-hover:text-lime-400">
                                                    <TrendingUp size={14} md:size={16}/> {item.impact}
                                                </span>
                                            </div>
                                            <h4 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight mb-4 group-hover:text-lime-400 transition-colors">{item.event}</h4>
                                            <div className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] flex items-center gap-3 md:gap-4">
                                                {item.icon === 'metro' && <><Grid size={12} md:size={14} className="text-violet-500 group-hover:text-lime-400"/> Connectivity Grid</>}
                                                {item.icon === 'road' && <><Layout size={12} md:size={14} className="text-blue-500 group-hover:text-lime-400"/> Logistics Tier</>}
                                                {item.icon === 'tech' && <><Briefcase size={12} md:size={14} className="text-fuchsia-500 group-hover:text-lime-400"/> Employment Core</>}
                                                {item.icon === 'airport' && <><Plane size={12} md:size={14} className="text-emerald-400 group-hover:text-lime-400"/> Aero Gateway</>}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === '3d' && (
                        <motion.div key="3d" {...tabContentVariants}>
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-10 gap-6 md:gap-8">
                                <h3 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter flex items-center gap-4 md:gap-5 group hover:text-lime-400 transition-colors">
                                    <Box className="w-8 h-8 md:w-10 md:h-10 text-violet-500 group-hover:text-lime-400 transition-colors" /> Immersive Twin
                                </h3>
                                <div className="flex bg-slate-900/80 rounded-2xl p-1.5 md:p-2 border border-white/10 w-full md:w-auto">
                                    <button 
                                        onClick={() => setIs3DMode(false)}
                                        className={`flex-1 md:flex-none px-6 md:px-8 py-2.5 md:py-3 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${!is3DMode ? 'bg-lime-400 text-black shadow-lg' : 'text-slate-500 hover:text-lime-400'}`}
                                    >
                                        2D Blueprint
                                    </button>
                                    <button 
                                        onClick={() => setIs3DMode(true)}
                                        className={`flex-1 md:flex-none px-6 md:px-8 py-2.5 md:py-3 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${is3DMode ? 'bg-lime-400 text-black shadow-lg shadow-lime-400/20' : 'text-slate-500 hover:text-lime-400'}`}
                                    >
                                        3D Model
                                    </button>
                                </div>
                            </div>
                            
                            <div className="h-[400px] md:h-[650px] w-full relative">
                                <AnimatePresence mode="wait">
                                    {is3DMode ? (
                                        <motion.div key="3dviewer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
                                            <Property3DViewer />
                                        </motion.div>
                                    ) : (
                                        <motion.div key="2dviewer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-white p-6 md:p-16 rounded-[2rem] md:rounded-[4rem] overflow-hidden h-full relative group cursor-zoom-in flex items-center justify-center border border-white/5 hover:border-lime-400 shadow-2xl transition-all">
                                            {property.floorPlanUrl ? (
                                                <img src={property.floorPlanUrl} alt="Floor Plan" className="max-w-full max-h-full opacity-90 group-hover:scale-105 transition-transform duration-1000 object-contain" />
                                            ) : (
                                                <div className="bg-slate-100 w-full h-full flex flex-col items-center justify-center text-slate-400 gap-5 md:gap-6">
                                                    <Layers className="w-12 h-12 md:w-16 md:h-16 opacity-20" />
                                                    <span className="font-black uppercase tracking-[0.4em] text-[9px] md:text-[10px]">Blueprint Not Injected</span>
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Right Column: Sticky Action Card */}
            <div className="lg:col-span-4">
                <div className="sticky top-40 space-y-8 md:space-y-10">
                    {/* Price Card */}
                    <div className="bg-slate-900/60 backdrop-blur-3xl border border-white/5 rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden group hover:border-lime-400 transition-all">
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-violet-600 via-indigo-500 to-fuchsia-500 group-hover:from-lime-400 group-hover:to-lime-600 transition-all" />
                        <div className="mb-8 md:mb-12">
                            <span className="text-slate-500 text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] group-hover:text-lime-600 transition-colors">Asset Capital Entry</span>
                            <div className="text-4xl md:text-6xl font-black text-white mt-3 md:mt-4 tracking-tighter leading-none group-hover:text-lime-400 transition-colors">
                                ₹{(property.price / 100000).toFixed(0)}L<span className="text-lg md:text-xl text-slate-500 ml-1.5">*</span>
                            </div>
                            <div className="text-violet-400 group-hover:text-lime-400 group-hover:bg-lime-400/10 group-hover:border-lime-400 text-[9px] md:text-[10px] mt-4 md:mt-6 font-black uppercase tracking-[0.3em] bg-violet-600/10 inline-block px-3 md:px-4 py-1.5 md:py-2 rounded-lg border border-violet-600/20 transition-all">
                                EST. EMI: ₹{(property.price * 0.008).toFixed(0)} / MO
                            </div>
                        </div>

                        <div className="space-y-3 md:space-y-4">
                            <motion.button 
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => onEnquire(property, true)}
                                className="w-full py-4 md:py-6 bg-violet-600 hover:bg-lime-400 hover:text-black text-white rounded-xl md:rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] md:text-[11px] shadow-2xl shadow-violet-600/30 hover:shadow-lime-400/40 transition-all transform flex items-center justify-center gap-3"
                            >
                                <Calendar className="w-4 h-4 md:w-5 md:h-5"/>
                                Confirm Visit
                            </motion.button>
                            <motion.button 
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => onEnquire(property, false)}
                                className="w-full py-4 md:py-6 bg-white/5 hover:bg-lime-400 hover:text-black text-white border border-white/10 rounded-xl md:rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] md:text-[11px] transition-all flex items-center justify-center gap-3 transform"
                            >
                                <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
                                Instant Details
                            </motion.button>
                        </div>
                    </div>

                    {/* Value Decoder */}
                    <div className="bg-slate-900/40 border border-white/5 rounded-[2rem] md:rounded-[3rem] p-8 md:p-10 shadow-2xl group hover:border-lime-400 transition-all">
                        <h4 className="text-white font-black uppercase tracking-tight flex items-center gap-3 md:gap-4 mb-6 md:mb-8 group-hover:text-lime-400 transition-colors">
                            <Coins className="text-emerald-500 group-hover:text-lime-400 w-5 h-5 md:w-6 md:h-6 transition-colors" />
                            Value Decoder
                        </h4>
                        <div className="space-y-4 md:space-y-6">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-500 font-bold uppercase tracking-widest text-[9px] md:text-[10px] group-hover:text-lime-600 transition-colors">Avg. Cluster Price</span>
                                <span className="text-white font-black text-xs md:text-sm group-hover:text-lime-400 transition-colors">₹{fairValue.marketAverage}/SQFT</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-500 font-bold uppercase tracking-widest text-[9px] md:text-[10px] group-hover:text-lime-600 transition-colors">Neural Premium</span>
                                <span className="text-violet-400 font-black text-xs md:text-sm group-hover:text-lime-400 transition-colors">+{fairValue.projectPremium}%</span>
                            </div>
                            <div className="h-px bg-white/5 my-3 md:my-4 group-hover:bg-lime-400/20 transition-all" />
                            <div className="flex justify-between items-center">
                                <span className="text-white font-black uppercase tracking-widest text-[10px] md:text-[11px] group-hover:text-lime-600 transition-colors">Audit Fair Val.</span>
                                <span className="text-emerald-500 font-black text-xl md:text-2xl group-hover:text-lime-400 transition-colors">₹{(fairValue.fairPrice / 100000).toFixed(0)} L</span>
                            </div>
                        </div>
                        <div className="mt-6 md:mt-8 p-4 md:p-5 bg-slate-950/50 rounded-xl md:rounded-2xl border border-white/5 group-hover:border-lime-400/30 transition-all">
                            <p className="text-[9px] md:text-[10px] text-slate-500 font-medium italic leading-relaxed group-hover:text-slate-300 transition-colors">
                                "Audit confirmed: {property.price > fairValue.fairPrice ? 'Premium positioning justified via infra delta.' : 'Asset currently undervalued for immediate entry.'}"
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyDetailsView;
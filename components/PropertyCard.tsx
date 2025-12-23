import React, { useState, useRef } from 'react';
import { Property, Lead } from '../types';
import { Bed, Bath, Move, MapPin, FileDown, Loader2, TrendingUp, TrendingDown, ShieldCheck, ArrowRight, X, Hexagon, Sparkles, Crown, Zap, Share2, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { generateKaagzaat } from '../services/kaagzaatService';
import { generateRouteSteps } from '../services/geminiService';

interface PropertyCardProps {
  property: Property;
  onSelect: (p: Property) => void;
  onEnquire: (p: Property) => void;
  onBrochureDownload?: (lead: Lead) => void;
  index: number;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onSelect, onEnquire, onBrochureDownload, index }) => {
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', area: '' });
  const [isGenerating, setIsGenerating] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 100 };
  const translateX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), springConfig);
  const translateY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-15, 15]), springConfig);

  const isEmbassyVerde = property.id === '9';
  const isPreLaunch = property.id === '9' || property.id === 'purva-aerospace';

  const fairPrice = property.fairValue?.fairPrice || property.price;
  const isUndervalued = property.price < fairPrice;
  const priceDiffPercent = Math.abs(((property.price - fairPrice) / fairPrice) * 100).toFixed(1);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleStartKaagzaat = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPromptOpen(true);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `Check out this elite property: ${property.title} in ${property.address}`,
        url: window.location.href,
      }).catch(() => setIsShareOpen(true));
    } else {
      setIsShareOpen(true);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => {
        setCopied(false);
        setIsShareOpen(false);
    }, 2000);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || isGenerating) return;
    setIsGenerating(true);
    try {
        let routeSteps: string[] = [];
        if (formData.area) {
            try { routeSteps = await generateRouteSteps(formData.area, property.address); } catch (err) {}
        }
        if (onBrochureDownload) {
            onBrochureDownload({ 
                id: `B-${Date.now()}`, 
                name: formData.name, 
                phone: formData.phone, 
                type: 'Brochure', 
                details: `Asset: ${property.title}`, 
                timestamp: new Date(), 
                status: 'New' 
            });
        }
        await generateKaagzaat({ property, userName: formData.name, userPhone: formData.phone, userArea: formData.area, routeSteps });
        setIsPromptOpen(false);
        setFormData({ name: '', phone: '', area: '' });
    } finally {
        setIsGenerating(false);
    }
  };

  return (
    <motion.div 
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        initial={{ opacity: 0, y: 30 }} 
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ delay: index * 0.05, duration: 0.6 }} 
        className={`group relative bg-slate-900/40 backdrop-blur-3xl border rounded-[2.5rem] overflow-hidden transition-all duration-500 flex flex-col h-full mx-auto w-full max-w-md md:max-w-none ${isEmbassyVerde ? 'border-violet-500/40 shadow-2xl shadow-violet-500/10' : 'border-white/5 hover:border-lime-400'}`}
    >
      {/* Visual Header / Media with Parallax */}
      <div className="aspect-[4/3] overflow-hidden relative cursor-pointer" onClick={() => onSelect(property)}>
        <motion.img 
            src={property.imageUrl} 
            alt={property.title} 
            style={{ x: translateX, y: translateY, scale: 1.15 }}
            className="w-full h-full object-cover transition-transform duration-100 ease-out" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-transparent to-transparent" />
        
        {/* Dynamic Badges */}
        <div className="absolute top-5 left-5 flex flex-col gap-2 z-10">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-violet-600 shadow-lg group-hover:bg-lime-400 transition-colors">
                  <Hexagon size={12} className="text-white fill-current group-hover:text-black" />
              </div>
              <span className="text-[10px] font-black text-white uppercase tracking-wider bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded border border-white/10 group-hover:text-lime-400 group-hover:border-lime-400 transition-all">Audit Unit</span>
            </div>
            
            {isUndervalued ? (
              <motion.div 
                animate={{ opacity: [0.8, 1, 0.8] }} 
                transition={{ duration: 2, repeat: Infinity }}
                className="flex items-center gap-1.5 bg-emerald-600 text-white px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-xl"
              >
                <TrendingUp size={10} /> {priceDiffPercent}% UNDERVALUED
              </motion.div>
            ) : (
                <div className="flex items-center gap-1.5 bg-fuchsia-600 text-white px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-xl">
                    <Crown size={10} /> PREMIUM ASSET
                </div>
            )}
        </div>

        <div className="absolute top-5 right-5 flex flex-col items-end gap-2 z-10">
            <span className="bg-emerald-500/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1 shadow-lg border border-white/10">
                <ShieldCheck size={10}/> VERIFIED DEC 2025
            </span>
        </div>
        
        <div className="absolute bottom-6 left-6 z-10">
            <div className="flex items-center gap-3 mb-1">
                <span className="text-3xl font-black text-white tracking-tighter">₹{(property.price / 100000).toFixed(0)}L<span className="text-sm font-bold text-slate-400 ml-0.5">*</span></span>
                <div className={`p-1 rounded-full border ${isUndervalued ? 'bg-emerald-500/20 border-emerald-500/30' : 'bg-fuchsia-500/20 border-fuchsia-500/30'}`}>
                    {isUndervalued ? <TrendingUp size={14} className="text-emerald-400" /> : <TrendingDown size={14} className="text-fuchsia-400" />}
                </div>
            </div>
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em] flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isUndervalued ? 'bg-emerald-500' : 'bg-fuchsia-500'}`}></span>
              {isUndervalued ? 'Positive Valuation Gap' : 'Market Premium Adjusted'}
            </p>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-7 md:p-8 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-6 gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-lg md:text-xl font-black text-white group-hover:text-lime-400 transition-colors cursor-pointer uppercase tracking-tight leading-tight truncate" onClick={() => onSelect(property)}>
                    {property.title}
                </h3>
                <button 
                    onClick={handleShare}
                    className="p-1.5 rounded-lg bg-slate-800/50 text-slate-400 hover:text-lime-400 hover:bg-slate-700/50 transition-all flex-shrink-0"
                    title="Share Asset"
                >
                    <Share2 size={14} />
                </button>
              </div>
              <div className="flex items-center text-slate-500 mt-2 text-[10px] font-bold uppercase tracking-widest group-hover:text-lime-400/70 transition-colors">
                <MapPin size={10} className="mr-1.5 text-violet-500 group-hover:text-lime-400" /> {property.address}
              </div>
            </div>
            <motion.button 
              whileHover={{ scale: 1.1 }} 
              whileTap={{ scale: 0.9 }}
              onClick={handleStartKaagzaat} 
              className="p-3.5 rounded-2xl bg-slate-800/80 text-violet-400 hover:bg-lime-400 hover:text-black transition-all shadow-xl flex-shrink-0 border border-white/5"
            >
                <FileDown size={18} />
            </motion.button>
        </div>

        {/* Dynamic Share Overlay */}
        <AnimatePresence>
            {isShareOpen && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute inset-x-6 top-48 z-40 bg-slate-900/95 backdrop-blur-3xl border border-lime-400/30 p-5 rounded-3xl shadow-2xl flex flex-col items-center gap-3"
                >
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Share Elite Asset</div>
                    <div className="flex gap-3 w-full">
                        <button 
                            onClick={copyToClipboard}
                            className="flex-1 py-3 bg-violet-600 rounded-xl flex items-center justify-center gap-2 text-white font-black text-[10px] uppercase tracking-widest hover:bg-lime-400 hover:text-black transition-all"
                        >
                            {copied ? <Check size={14}/> : <Copy size={14}/>}
                            {copied ? 'Copied' : 'Copy Link'}
                        </button>
                        <button onClick={() => setIsShareOpen(false)} className="p-3 bg-slate-800 rounded-xl text-slate-400 hover:bg-lime-400 hover:text-black transition-colors"><X size={14}/></button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        {/* Growth Specs */}
        <div className="grid grid-cols-3 gap-4 mb-8 border-y border-white/5 py-5">
            <div className="text-center">
                <div className="text-xs font-black text-white">{property.beds} BHK</div>
                <div className="text-[8px] text-slate-500 uppercase font-black tracking-widest mt-1">Config</div>
            </div>
            <div className="text-center border-x border-white/5">
                <div className="text-xs font-black text-white">{property.sqft}</div>
                <div className="text-[8px] text-slate-500 uppercase font-black tracking-widest mt-1">Sq.Ft</div>
            </div>
            <div className="text-center">
                <div className={`text-xs font-black ${isUndervalued ? 'text-emerald-400' : 'text-fuchsia-400'}`}>₹{(fairPrice / 100000).toFixed(0)}L</div>
                <div className="text-[8px] text-slate-500 uppercase font-black tracking-widest mt-1">Fair Val.</div>
            </div>
        </div>

        {/* Call to Actions */}
        <div className="mt-auto space-y-3">
            <button 
              onClick={() => onEnquire(property)}
              className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 transition-all group/btn ${isPreLaunch ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20 hover:bg-lime-400 hover:text-black' : 'bg-slate-800 text-white hover:bg-lime-400 hover:text-black'}`}
            >
                {isPreLaunch ? 'Submit Priority EOI' : 'Initiate Enquiry'}
                <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
            </button>
        </div>
      </div>

      {/* Kaagzaat Generation Overlay */}
      <AnimatePresence>
        {isPromptOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50 bg-slate-950/95 backdrop-blur-2xl p-8 flex flex-col justify-center">
            <button onClick={() => setIsPromptOpen(false)} className="absolute top-6 right-6 p-2 rounded-full hover:bg-lime-400 text-slate-400 hover:text-black transition-colors"><X size={20}/></button>
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center"><FileDown size={14} className="text-white"/></div>
                  <h4 className="text-lg font-black text-white uppercase tracking-tighter">KAAGZAAT_GEN_V4</h4>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed font-medium uppercase tracking-widest">Generating investment dossier for {property.developer}.</p>
            </div>
            <form onSubmit={handleGenerate} className="space-y-4">
                <div className="space-y-4">
                    <input required type="text" placeholder="Your Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-4 text-sm text-white focus:border-lime-400 outline-none" />
                    <input required type="tel" placeholder="Contact Line" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-4 text-sm text-white focus:border-lime-400 outline-none" />
                    <input type="text" placeholder="Current Area (optional)" value={formData.area} onChange={e => setFormData({...formData, area: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-4 text-sm text-white focus:border-lime-400 outline-none" />
                </div>
                <button disabled={isGenerating} type="submit" className="w-full py-4 bg-violet-600 hover:bg-lime-400 hover:text-black text-white font-black uppercase tracking-widest text-[10px] rounded-xl flex items-center justify-center gap-3 shadow-xl shadow-violet-600/20 disabled:opacity-50 transition-all">
                    {isGenerating ? <Loader2 className="animate-spin" size={16}/> : <Sparkles size={16}/>}
                    {isGenerating ? 'Synthesizing...' : 'Decrypt Dossier'}
                </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PropertyCard;
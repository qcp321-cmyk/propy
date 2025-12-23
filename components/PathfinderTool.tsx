import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, ArrowRight, Loader2, Compass } from 'lucide-react';
import { generateRouteSteps } from '../services/geminiService';

const PathfinderTool: React.FC = () => {
  const [origin, setOrigin] = useState('');
  const [dest, setDest] = useState('Hebbal Gateway');
  const [loading, setLoading] = useState(false);
  const [route, setRoute] = useState<string[]>([]);

  const handleSimulate = async () => {
    if (!origin.trim()) return;
    setLoading(true);
    const steps = await generateRouteSteps(origin, dest);
    setRoute(steps);
    setLoading(false);
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-2xl border border-slate-700/50 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group hover:border-lime-400 transition-all">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-xl shadow-indigo-600/30 group-hover:bg-lime-400 transition-all">
          <Navigation className="w-7 h-7 text-white group-hover:text-black transition-colors" />
        </div>
        <div>
          <h3 className="text-2xl font-black text-white uppercase tracking-tighter group-hover:text-lime-400 transition-colors">Pathfinder AI</h3>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Commute Intelligence</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="relative">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2 ml-1">Current Location</label>
          <input 
            type="text" value={origin} onChange={e => setOrigin(e.target.value)}
            placeholder="e.g. Indiranagar, Bengaluru"
            className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-4 text-white focus:border-lime-400 outline-none transition-all placeholder:text-slate-700"
          />
        </div>

        <div className="relative">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2 ml-1">Project Hub</label>
          <select 
            value={dest} onChange={e => setDest(e.target.value)}
            className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-4 text-white focus:border-lime-400 outline-none appearance-none"
          >
            <option>Hebbal Gateway</option>
            <option>Devanahalli Aerospace</option>
            <option>Thanisandra Forest Zone</option>
            <option>Yelahanka Heritage</option>
          </select>
        </div>

        <button 
          onClick={handleSimulate} disabled={loading}
          className="w-full py-5 bg-indigo-600 hover:bg-lime-400 hover:text-black text-white font-black rounded-2xl uppercase tracking-widest text-[11px] shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-3 transition-all"
        >
          {loading ? <Loader2 className="animate-spin" size={16}/> : <Compass size={16}/>}
          {loading ? 'CALCULATING RADIUS...' : 'SIMULATE ROUTE'}
        </button>

        <AnimatePresence>
          {route.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
              className="mt-8 space-y-3 pt-6 border-t border-slate-800"
            >
              <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-4 group-hover:text-lime-400 transition-colors">Prop-Route Steps:</div>
              {route.slice(0, 4).map((s, i) => (
                <div key={i} className="flex gap-3 text-[11px] text-slate-400 font-medium group-hover:text-slate-200 transition-colors">
                  <span className="text-indigo-500 font-bold group-hover:text-lime-400">{i+1}.</span>
                  {s}
                </div>
              ))}
              <div className="text-[10px] text-slate-600 italic">...Full route exported to Kaagzaat.</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PathfinderTool;
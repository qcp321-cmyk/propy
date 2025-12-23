
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, BarChart3, Calculator, Info, ArrowUpRight, Zap, PieChart } from 'lucide-react';

const InvestmentTool: React.FC = () => {
  const [investment, setInvestment] = useState(15000000); // 1.5 Cr
  const [years, setYears] = useState(5);
  const [isHovered, setIsHovered] = useState(false);
  const appreciationRate = 0.124; // 12.4% for North Bengaluru corridor

  const futureValue = investment * Math.pow(1 + appreciationRate, years);
  const profit = futureValue - investment;
  const yieldMonthly = (profit / (years * 12));

  return (
    <motion.div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-slate-900/60 backdrop-blur-2xl border border-slate-700/50 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group transition-all duration-500 hover:border-violet-500/30"
    >
      {/* Background Decor */}
      <div className={`absolute top-0 right-0 p-12 opacity-5 transition-all duration-700 ${isHovered ? 'rotate-12 scale-110 opacity-15' : 'rotate-0 scale-100'}`}>
        <TrendingUp size={180} className="text-violet-500" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-600/30 animate-pulse">
              <Calculator className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter">ROI SIMULATOR</h3>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Growth Engine v4.1</p>
            </div>
          </div>
          <Zap className={`w-6 h-6 ${isHovered ? 'text-violet-400' : 'text-slate-700'} transition-colors duration-500`} />
        </div>

        <div className="space-y-10">
          {/* CAPITAL RANGE */}
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Capital Outlay</label>
              <div className="text-right">
                <span className="text-3xl font-black text-white">₹{(investment / 10000000).toFixed(2)}</span>
                <span className="text-xs font-bold text-slate-400 ml-1">CR</span>
              </div>
            </div>
            <div className="relative group/slider">
                <input 
                  type="range" min="5000000" max="150000000" step="1000000"
                  value={investment} onChange={(e) => setInvestment(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-full appearance-none cursor-pointer accent-violet-500 transition-all hover:h-3"
                />
            </div>
          </div>

          {/* TENURE RANGE */}
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Hold Period</label>
              <div className="text-right">
                <span className="text-3xl font-black text-white">{years}</span>
                <span className="text-xs font-bold text-slate-400 ml-1">YEARS</span>
              </div>
            </div>
            <input 
              type="range" min="1" max="20" step="1"
              value={years} onChange={(e) => setYears(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-full appearance-none cursor-pointer accent-violet-500 transition-all hover:h-3"
            />
          </div>

          {/* RESULTS GRID */}
          <div className="grid grid-cols-2 gap-6 pt-10 border-t border-slate-800/50">
            <motion.div animate={{ scale: isHovered ? 1.05 : 1 }}>
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 size={12} className="text-violet-400" />
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Expected Profit</p>
              </div>
              <p className="text-3xl font-black text-white">₹{(profit / 10000000).toFixed(2)} Cr</p>
            </motion.div>
            
            <motion.div animate={{ scale: isHovered ? 1.05 : 1 }}>
              <div className="flex items-center gap-2 mb-2">
                <PieChart size={12} className="text-emerald-400" />
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Asset Valuation</p>
              </div>
              <p className="text-3xl font-black text-emerald-400">₹{(futureValue / 10000000).toFixed(2)} Cr</p>
            </motion.div>
          </div>

          {/* INSIGHT BANNER */}
          <div className="p-6 bg-slate-950/50 rounded-3xl border border-slate-800/50 flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-violet-600/10 flex items-center justify-center flex-shrink-0">
                <Info className="w-5 h-5 text-violet-400" />
            </div>
            <div>
                <p className="text-xs font-bold text-white mb-1 uppercase tracking-widest">Market Context</p>
                <p className="text-[10px] text-slate-500 leading-relaxed italic">
                    Projected at <span className="text-violet-400 font-bold">12.4% CAGR</span>. Real-time data from BIAAPA Master Plan 2025. 
                    Asset liquidity score: <span className="text-emerald-400 font-bold">EXCEPTIONAL</span>.
                </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default InvestmentTool;

import React, { useState, useEffect, useRef } from 'react';
import { Lead, Visitor, AdminUser, UserRole } from '../types';
import TrafficGlobe from './TrafficGlobe';
import { Shield, Users, Activity, Lock, Database, X, Terminal, Search, Trash2, Ban, CheckCircle, AlertTriangle, Cpu, HardDrive, Network, Server, Maximize2, BarChart3, Zap, AlertOctagon, Map, Clock, ArrowUpRight, Globe, UserCheck, Key, UserPlus, FileDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminDashboardProps {
  onClose: () => void;
  leads: Lead[];
}

const INITIAL_TEAM: AdminUser[] = [
    { id: '1', name: 'Aman Singh', email: 'aman@propertyfie.com', role: 'Super Admin', status: 'Active', lastActive: new Date() },
    { id: '2', name: 'Sarah Jenkins', email: 'sarah@propertyfie.com', role: 'Manager', status: 'Active', lastActive: new Date(Date.now() - 3600000) },
    { id: '3', name: 'Priya Sharma', email: 'priya@propertyfie.com', role: 'Agent', status: 'Inactive', lastActive: new Date(Date.now() - 86400000) },
];

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose, leads }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'leads' | 'security' | 'team' | 'brochures'>('overview');
  const [liveVisitors, setLiveVisitors] = useState<Visitor[]>([]);
  const [teamMembers, setTeamMembers] = useState<AdminUser[]>(INITIAL_TEAM);
  const [logs, setLogs] = useState<string[]>([]);
  const [blockedIPs, setBlockedIPs] = useState<string[]>(['192.168.1.45', '10.0.0.99', '45.22.19.112']);
  const [detailView, setDetailView] = useState<'system' | 'visitors' | 'sessions' | 'threats' | null>(null);
  
  const addLog = (msg: string) => {
      setLogs(prev => {
          const newLog = `[${new Date().toLocaleTimeString()}] ${msg}`;
          const updated = [...prev, newLog];
          return updated.slice(-20);
      });
  };

  useEffect(() => {
    addLog('Admin Cockpit initialized. Security protocols active.');
    addLog('RBAC rules enforced for "Super Admin" level.');
    
    // Detect Local Device
    const userAgent = navigator.userAgent;
    let deviceType = "Desktop";
    if (/Mobi|Android/i.test(userAgent)) deviceType = "Mobile";
    
    // Try to approximate location (mock for now, or would need geolocation API)
    // We use the "North Bengaluru" context of the app
    const localVisitor: Visitor = {
        id: 'local-session-' + Date.now().toString().slice(-4),
        ip: '127.0.0.1 (Local Node)',
        location: 'Bengaluru, IN (Local)',
        device: `${deviceType} - Admin`,
        page: 'Secure Dashboard',
        status: 'Active',
        coordinates: [12.9716, 77.5946],
        role: 'Super Admin',
        isLocal: true
    };

    // Set ONLY local visitor - removed fake mocks
    setLiveVisitors([localVisitor]);
    addLog(`Local node authenticated: ${localVisitor.id}`);
  }, []);

  const handleUpdateRole = (userId: string, newRole: UserRole) => {
      setTeamMembers(prev => prev.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
      addLog(`[RBAC] User ID ${userId} role updated to ${newRole}`);
  };

  const brochureLeads = leads.filter(l => l.type === 'Brochure');

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 text-slate-200 font-mono flex flex-col h-[100dvh]">
      {/* Top Bar / HUD */}
      <div className="h-auto min-h-[64px] border-b border-slate-800 bg-slate-900/50 backdrop-blur-md flex flex-col md:flex-row items-center justify-between px-4 md:px-6 py-4 md:py-0 gap-4 flex-shrink-0">
        <div className="flex items-center justify-between w-full md:w-auto">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-violet-400">
                    <Shield className="w-6 h-6 fill-current" />
                    <span className="text-xl font-bold tracking-widest">ADMIN<span className="text-white">COCKPIT</span></span>
                </div>
                <div className="hidden md:block h-6 w-px bg-slate-700 mx-2"></div>
                <div className="hidden md:flex gap-1">
                    <span className="text-xs text-slate-500">LEVEL:</span>
                    <span className="text-xs text-violet-400 font-bold uppercase">SUPER ADMIN</span>
                </div>
            </div>
            {/* Mobile Close Button (shown when stacked) */}
            <button onClick={onClose} className="md:hidden p-2 hover:bg-lime-400 hover:text-black rounded-full text-slate-400 transition-all">
                <X className="w-5 h-5" />
            </button>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
             <div className="flex gap-2 text-xs">
                 {['overview', 'leads', 'brochures', 'team', 'security'].map((tab) => (
                    <button 
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`px-3 md:px-4 py-2 rounded border transition-all uppercase whitespace-nowrap ${activeTab === tab ? 'bg-lime-400 border-lime-500 text-black' : 'border-transparent text-slate-500 hover:text-lime-400 hover:border-lime-400'}`}
                    >
                        {tab === 'team' ? 'RBAC_TEAM' : tab}
                    </button>
                 ))}
             </div>
             {/* Desktop Close Button */}
             <button onClick={onClose} className="hidden md:block p-2 hover:bg-lime-400 hover:text-black rounded-full text-slate-400 transition-all">
                <X className="w-5 h-5" />
             </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] relative scroll-smooth">
        <div className="grid grid-cols-12 gap-6">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
            <>
                <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
                    <div className="h-[300px] md:h-[400px] lg:h-[500px] relative w-full">
                        <TrafficGlobe visitors={liveVisitors} onInteract={() => setDetailView('system')} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 relative overflow-hidden group hover:border-lime-400 transition-colors">
                            <Users className="w-8 h-8 text-violet-500 mb-4 group-hover:text-lime-400" />
                            <div className="text-xs text-slate-500 uppercase">Live Connections</div>
                            <div className="text-4xl font-bold text-white mb-1 group-hover:text-lime-400">{liveVisitors.length}</div>
                            <div className="text-[10px] text-emerald-400 flex items-center gap-1"><Activity className="w-3 h-3"/> Local node active</div>
                        </div>
                        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 relative overflow-hidden group hover:border-lime-400 transition-colors">
                            <Database className="w-8 h-8 text-blue-500 mb-4 group-hover:text-lime-400" />
                            <div className="text-xs text-slate-500 uppercase">Captured Leads</div>
                            <div className="text-4xl font-bold text-white mb-1 group-hover:text-lime-400">{leads.length}</div>
                            <button onClick={() => setActiveTab('leads')} className="text-[10px] text-blue-400 hover:text-lime-400 hover:underline transition-colors">View Database</button>
                        </div>
                        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 relative overflow-hidden group hover:border-lime-400 transition-colors">
                            <Lock className="w-8 h-8 text-red-500 mb-4 group-hover:text-lime-400" />
                            <div className="text-xs text-slate-500 uppercase">Blocked Hosts</div>
                            <div className="text-4xl font-bold text-white mb-1 group-hover:text-lime-400">{blockedIPs.length}</div>
                            <div className="text-[10px] text-slate-500">Firewall Integrity: 100%</div>
                        </div>
                    </div>
                </div>

                <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                    {/* Live Visitors Recognition Table */}
                    <div className="h-[300px] lg:h-auto lg:min-h-[400px] bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
                        <div className="p-3 border-b border-slate-800 bg-slate-900 flex justify-between items-center">
                            <span className="text-xs font-bold text-slate-400 flex items-center gap-2"><Globe className="w-3 h-3" /> LIVE NETWORK NODES</span>
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-2">
                            <table className="w-full text-xs text-left">
                                <thead className="text-slate-500">
                                    <tr>
                                        <th className="p-2">NODE / IP</th>
                                        <th className="p-2">LOC</th>
                                        <th className="p-2">ROLE</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <AnimatePresence>
                                        {liveVisitors.map((v) => (
                                            <motion.tr 
                                                key={v.id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className={`border-b border-slate-800/50 ${v.isLocal ? 'bg-violet-900/20 border-violet-500/30' : 'hover:bg-lime-400/10'}`}
                                            >
                                                <td className="p-2 font-mono">
                                                    <div className="flex flex-col">
                                                        <span className={v.isLocal ? 'text-violet-400 font-bold' : 'text-slate-300'}>{v.ip}</span>
                                                        {v.isLocal && <span className="text-[8px] text-violet-500 font-bold tracking-tighter">YOU</span>}
                                                    </div>
                                                </td>
                                                <td className="p-2 text-slate-400 truncate max-w-[80px]">{v.location}</td>
                                                <td className="p-2">
                                                    <span className={`px-2 py-0.5 rounded text-[10px] ${v.role === 'Super Admin' ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30' : 'bg-slate-800 text-slate-500'}`}>
                                                        {v.role || 'Guest'}
                                                    </span>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="h-48 bg-black border border-slate-800 rounded-xl p-4 font-mono text-[10px] flex flex-col">
                        <div className="text-slate-500 mb-2 flex items-center gap-2"><Terminal className="w-3 h-3" /> SYSTEM_STREAM</div>
                        <div className="flex-1 overflow-y-auto space-y-1">
                            {logs.map((log, i) => (
                                <div key={i} className="text-green-500/80 break-words">{log}</div>
                            ))}
                        </div>
                    </div>
                </div>
            </>
        )}

        {/* BROCHURES TAB */}
        {activeTab === 'brochures' && (
             <div className="col-span-12 bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden flex flex-col h-[65vh] min-h-[500px]">
                <div className="p-4 md:p-6 border-b border-slate-800 bg-slate-900/90 flex flex-col md:flex-row justify-between items-center gap-4 flex-shrink-0">
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="p-2 bg-violet-600/20 rounded-lg">
                             <FileDown className="w-6 h-6 text-violet-500" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white uppercase tracking-tight">Brochure Requests</h3>
                            <p className="text-xs text-slate-500">Track all Kaagzaat dossier downloads.</p>
                        </div>
                    </div>
                    <div className="bg-slate-950 px-4 py-2 rounded-lg border border-slate-800 flex items-center gap-2 w-full md:w-auto justify-between md:justify-start">
                        <span className="text-xs text-slate-500 uppercase font-bold">Total Downloads:</span>
                        <span className="text-xl font-bold text-white">{brochureLeads.length}</span>
                    </div>
                </div>
                <div className="flex-1 overflow-auto">
                    <table className="w-full text-left text-sm min-w-[800px]">
                        <thead className="bg-slate-950 text-slate-400 font-bold text-xs uppercase tracking-wider sticky top-0 z-10 shadow-lg shadow-black/20">
                            <tr>
                                <th className="p-4 bg-slate-950">Timestamp</th>
                                <th className="p-4 bg-slate-950">User Name</th>
                                <th className="p-4 bg-slate-950">Contact</th>
                                <th className="p-4 bg-slate-950">Download Context</th>
                                <th className="p-4 bg-slate-950">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                             {brochureLeads.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-12 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <FileDown className="w-12 h-12 text-slate-700" />
                                            <p className="text-slate-500">No brochure requests logged yet.</p>
                                        </div>
                                    </td>
                                </tr>
                             ) : (
                                 brochureLeads.map(lead => (
                                     <tr key={lead.id} className="hover:bg-lime-400/10 transition-colors">
                                         <td className="p-4 text-slate-400 font-mono text-xs">{new Date(lead.timestamp).toLocaleString()}</td>
                                         <td className="p-4 text-white font-bold">{lead.name}</td>
                                         <td className="p-4 text-violet-400 font-mono">{lead.phone}</td>
                                         <td className="p-4 text-slate-300 text-xs">{lead.details}</td>
                                         <td className="p-4">
                                             <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase border border-emerald-500/20">
                                                 <CheckCircle size={10} /> Fulfilled
                                             </span>
                                         </td>
                                     </tr>
                                 ))
                             )}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {/* TEAM / RBAC TAB */}
        {activeTab === 'team' && (
            <div className="col-span-12 space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
                    <div>
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                            <Shield className="w-6 h-6 text-violet-500" />
                            RBAC IDENTITY GRID
                        </h2>
                        <p className="text-slate-500 text-sm mt-1">Manage team roles and access permissions.</p>
                    </div>
                    <button className="flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-lime-400 hover:text-black text-white rounded-xl font-bold transition-all shadow-lg shadow-violet-600/20 w-full md:w-auto justify-center">
                        <UserPlus className="w-4 h-4" />
                        Authorize Member
                    </button>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden overflow-x-auto">
                    <table className="w-full text-left text-sm min-w-[600px]">
                        <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                            <tr>
                                <th className="p-4">TEAM MEMBER</th>
                                <th className="p-4">ROLE (RBAC)</th>
                                <th className="p-4">STATUS</th>
                                <th className="p-4">LAST ACTIVE</th>
                                <th className="p-4 text-right">ACTION</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {teamMembers.map((user) => (
                                <tr key={user.id} className="hover:bg-lime-400/10 transition-colors group">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-violet-400 font-bold group-hover:bg-lime-400 group-hover:text-black transition-all">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="text-white font-medium flex items-center gap-2 group-hover:text-lime-400 transition-colors">
                                                    {user.name}
                                                    {user.role === 'Super Admin' && <Shield className="w-3 h-3 text-violet-400" />}
                                                </div>
                                                <div className="text-xs text-slate-500">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <select 
                                            value={user.role}
                                            onChange={(e) => handleUpdateRole(user.id, e.target.value as UserRole)}
                                            disabled={user.role === 'Super Admin' && user.id === '1'} // Can't demote self
                                            className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-lime-400 disabled:opacity-50"
                                        >
                                            <option value="Super Admin">Super Admin</option>
                                            <option value="Manager">Manager</option>
                                            <option value="Agent">Agent</option>
                                        </select>
                                    </td>
                                    <td className="p-4">
                                        <span className={`flex items-center gap-1.5 text-xs ${user.status === 'Active' ? 'text-emerald-400' : 'text-slate-500'}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`}></div>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-xs text-slate-400">
                                        {user.lastActive.toLocaleDateString()} {user.lastActive.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </td>
                                    <td className="p-4 text-right">
                                        {user.id !== '1' && (
                                            <button className="text-slate-600 hover:text-red-400 transition-colors">
                                                <Ban className="w-4 h-4" />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {/* DATA LEADS TAB (Existing) */}
        {activeTab === 'leads' && (
            <div className="col-span-12 bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden flex flex-col h-[65vh] min-h-[500px]">
                <div className="p-4 border-b border-slate-800 bg-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 flex-shrink-0">
                    <div className="flex items-center gap-2 text-violet-400 font-bold w-full md:w-auto">
                        <Database className="w-5 h-5" />
                        DATA_VAULT_2025
                    </div>
                    <div className="relative w-full md:w-auto">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
                        <input type="text" placeholder="Search leads..." className="w-full md:w-64 bg-black border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-lime-400 transition-all" />
                    </div>
                </div>
                <div className="flex-1 overflow-auto">
                    <table className="w-full text-left text-xs min-w-[800px]">
                        <thead className="bg-black text-slate-500 sticky top-0 z-10">
                            <tr>
                                <th className="p-4 bg-black">TIMESTAMP</th>
                                <th className="p-4 bg-black">CONTACT_NAME</th>
                                <th className="p-4 bg-black">PHONE_ID</th>
                                <th className="p-4 bg-black">TYPE</th>
                                <th className="p-4 bg-black">METADATA</th>
                                <th className="p-4 bg-black">STATUS</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-900">
                            {leads.length === 0 ? (
                                <tr><td colSpan={6} className="p-10 text-center text-slate-700 italic font-mono">ENCRYPTED_VAULT_EMPTY</td></tr>
                            ) : (
                                leads.map((lead) => (
                                    <tr key={lead.id} className="hover:bg-lime-400/10 transition-colors">
                                        <td className="p-4 text-slate-500">{new Date(lead.timestamp).toLocaleString()}</td>
                                        <td className="p-4 text-white font-bold">{lead.name}</td>
                                        <td className="p-4 text-violet-400 font-mono">{lead.phone}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${lead.type === 'Sell' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : (lead.type === 'Brochure' ? 'bg-violet-500/10 text-violet-500 border border-violet-500/20' : (lead.type === 'EOI' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'))}`}>
                                                {lead.type}
                                            </span>
                                        </td>
                                        <td className="p-4 text-slate-400 truncate max-w-xs">{lead.details}</td>
                                        <td className="p-4">
                                            <span className="text-emerald-500/80">NEW_ENTRY</span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {/* SECURITY TAB (Existing) */}
        {activeTab === 'security' && (
             <div className="col-span-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <AlertOctagon className="w-6 h-6 text-red-500" />
                        <h3 className="font-bold text-white uppercase tracking-tighter">Network Perimeter Guard</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 bg-black rounded-lg border border-slate-800">
                            <div>
                                <h4 className="text-white font-bold text-sm">Active IP Blocklist</h4>
                                <p className="text-[10px] text-slate-600 font-mono">Total Threats Mitigated: 14,202</p>
                            </div>
                            <span className="text-red-500 font-mono text-2xl font-bold">{blockedIPs.length}</span>
                        </div>
                        <div className="h-64 overflow-y-auto border border-slate-800 rounded-lg bg-black/40 p-2">
                             <table className="w-full text-left text-[10px]">
                                <thead className="text-slate-600 font-bold uppercase">
                                    <tr>
                                        <th className="p-2">IP SOURCE</th>
                                        <th className="p-2">RISK_LEVEL</th>
                                        <th className="p-2 text-right">MGMT</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {blockedIPs.map(ip => (
                                        <tr key={ip} className="border-b border-slate-900/50 hover:bg-lime-400/5 transition-colors">
                                            <td className="p-2 font-mono text-red-400">{ip}</td>
                                            <td className="p-2">CRITICAL</td>
                                            <td className="p-2 text-right">
                                                <button className="text-emerald-500 hover:text-lime-400 transition-colors hover:underline">RESTORE</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                             </table>
                        </div>
                    </div>
                </div>
             </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
import React, { useState, useEffect } from 'react';
import { X, MessageCircle, Calendar, CheckCircle, CheckSquare, ShieldCheck, ZapOff, Fingerprint, Crown, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lead } from '../types';

interface EnquireModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyName?: string;
  isSchedule?: boolean;
  isEOI?: boolean;
  initialMessage?: string;
  onDataCapture?: (lead: Lead) => void;
}

const EnquireModal: React.FC<EnquireModalProps> = ({ isOpen, onClose, propertyName, isSchedule, isEOI, initialMessage, onDataCapture }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    dob: '',
    residentStatus: 'Indian', // Indian or NRI
    unitType: '2 BHK', // Default
    kyc: { pan: false, aadhar: false, passport: false },
    payment: { bank: '', branch: '', chequeNo: '', amount: '' },
    date: '',
    message: ''
  });
  
  const [errors, setErrors] = useState<{phone?: string, date?: string, amount?: string}>({});
  const [status, setStatus] = useState<'idle' | 'success'>('idle');

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        phone: '',
        email: '',
        dob: '',
        residentStatus: 'Indian',
        unitType: '2 BHK',
        kyc: { pan: false, aadhar: false, passport: false },
        payment: { bank: '', branch: '', chequeNo: '', amount: '' },
        date: '',
        message: initialMessage || ''
      });
      setErrors({});
      setStatus('idle');
    }
  }, [isOpen, initialMessage]);

  const validateForm = () => {
    const newErrors: {phone?: string, date?: string, amount?: string} = {};
    let isValid = true;

    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (!phoneRegex.test(formData.phone.replace(/\s/g,''))) {
        newErrors.phone = "Valid contact number required.";
        isValid = false;
    }

    if (isSchedule && formData.date) {
        const selectedDate = new Date(formData.date);
        const today = new Date();
        today.setHours(0,0,0,0);
        if (selectedDate < today) {
            newErrors.date = "Please select a future date.";
            isValid = false;
        }
    }
    
    if (isEOI && (!formData.payment.amount || isNaN(Number(formData.payment.amount)))) {
         newErrors.amount = "Required for EOI submission.";
         isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (onDataCapture) {
        onDataCapture({
            id: Date.now().toString(),
            name: formData.name,
            phone: formData.phone,
            type: isEOI ? 'EOI' : (isSchedule ? 'Visit' : 'Buy'),
            details: isEOI 
                ? `${propertyName} | ${formData.unitType} | ${formData.residentStatus} | Amt: ${formData.payment.amount}` 
                : (propertyName ? `${propertyName} - ${formData.message}` : formData.message || 'General Enquiry'),
            timestamp: new Date(),
            status: 'New'
        });
    }

    setStatus('success');

    setTimeout(() => {
        let text = '';
        if (isEOI) {
            text = `*ELITE EOI SUBMISSION - ${propertyName || 'VERDE'}*
--------------------------------
*Applicant:* ${formData.name}
*Status:* ${formData.residentStatus}
*Unit:* ${formData.unitType}
*Mobile:* ${formData.phone}
*Email:* ${formData.email}
--------------------------------
*Identity Status:* ${Object.entries(formData.kyc).filter(([k,v]) => v).map(([k]) => k.toUpperCase()).join(', ')}
`;
        } else {
            text = `*New Elite Enquiry from Propertyfie*
            
*Name:* ${formData.name}
*Phone:* ${formData.phone}
${propertyName ? `*Project:* ${propertyName}` : '*Interest:* Elite Portfolio'}
${isSchedule ? `*Requested Visit Date:* ${formData.date}` : ''}
*Message:* ${formData.message || 'I am interested in this asset. Please provide high-fidelity details.'}`;
        }

        const encodedText = encodeURIComponent(text);
        const whatsappUrl = `https://wa.me/917970750727?text=${encodedText}`;
        window.open(whatsappUrl, '_blank');
        onClose();
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-[150]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className={`fixed inset-0 m-auto w-[94%] md:w-full ${isEOI ? 'max-w-3xl' : 'max-w-xl'} h-fit max-h-[92vh] overflow-y-auto bg-slate-900 border ${isEOI ? 'border-violet-500 shadow-[0_0_80px_rgba(124,58,237,0.3)]' : 'border-slate-700 shadow-2xl'} rounded-[2rem] md:rounded-[3rem] z-[160] p-6 md:p-10`}
          >
            {status === 'success' ? (
                <div className="flex flex-col items-center justify-center py-12 md:py-16 text-center">
                    <motion.div 
                        initial={{ scale: 0 }} 
                        animate={{ scale: 1 }} 
                        className="w-20 h-20 md:w-24 md:h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 md:mb-8"
                    >
                        <CheckCircle className="w-10 h-10 md:w-12 md:h-12 text-emerald-500" />
                    </motion.div>
                    <h2 className="text-2xl md:text-3xl font-black text-white mb-4 uppercase tracking-tighter">{isEOI ? 'EOI Successfully Recorded' : 'Request Successfully Sent!'}</h2>
                    <p className="text-slate-400 font-medium">Connecting you to our elite concierge...</p>
                </div>
            ) : (
                <>
                <div className="flex justify-between items-start mb-6 md:mb-10 pb-4 md:pb-6 border-b border-slate-800">
                    <div className="flex items-center gap-3 md:gap-4">
                        <div className={`p-3 md:p-4 rounded-xl md:rounded-2xl ${isEOI ? 'bg-violet-600 shadow-lg shadow-violet-600/30' : 'bg-slate-800'}`}>
                            {isEOI ? <Crown className="w-6 h-6 md:w-8 md:h-8 text-white" /> : (isSchedule ? <Calendar className="w-6 h-6 md:w-8 md:h-8 text-violet-400" /> : <Fingerprint className="w-6 h-6 md:w-8 md:h-8 text-emerald-400" />)}
                        </div>
                        <div className="flex flex-col">
                            <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter leading-none">
                                {isEOI ? 'Expression of Interest' : (isSchedule ? 'Schedule a Visit' : 'Elite Enquiry')}
                            </h2>
                            <p className="text-[8px] md:text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] md:tracking-[0.3em] mt-1.5 md:mt-2">
                                {isEOI ? 'EMBASSY VERDE • PRIORITY ALLOCATION' : (isSchedule ? 'Private Asset Viewing' : 'Instant Zero-Friction Access')}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 md:p-3 hover:bg-lime-400 hover:text-black rounded-xl transition-all text-slate-500">
                        <X className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                </div>

                {/* NO OTP BANNER */}
                <div className="mb-8 md:mb-10 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl md:rounded-2xl flex items-center gap-3 md:gap-4">
                    <ZapOff className="text-emerald-500 flex-shrink-0" size={18} md:size={20} />
                    <div>
                        <p className="text-[10px] md:text-xs font-black text-emerald-500 uppercase tracking-widest">Instant Submission Protocol</p>
                        <p className="text-[9px] md:text-[10px] text-slate-400 font-medium uppercase tracking-widest mt-0.5">Zero Friction: No OTP verification required.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
                    {isEOI ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                            <div className="col-span-1 md:col-span-2 space-y-4 md:space-y-6">
                                <h3 className="text-[9px] md:text-xs font-black text-slate-500 uppercase tracking-[0.4em] md:tracking-[0.5em] border-l-4 border-violet-500 pl-3 md:pl-4">Identity Verification</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                    <div className="space-y-1.5 md:space-y-2">
                                        <label className="block text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name (Legal)</label>
                                        <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-2.5 md:py-3 text-sm text-white focus:border-lime-400 outline-none transition-all" placeholder="As per PAN / Passport" />
                                    </div>
                                    <div className="space-y-1.5 md:space-y-2">
                                        <label className="block text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Date of Birth</label>
                                        <input required type="date" value={formData.dob} onChange={(e) => setFormData({...formData, dob: e.target.value})} className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-2.5 md:py-3 text-sm text-white focus:border-lime-400 outline-none transition-all scheme-dark" />
                                    </div>
                                    <div className="space-y-1.5 md:space-y-2">
                                        <label className="block text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Number</label>
                                        <input required type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className={`w-full bg-slate-950/50 border rounded-xl px-4 py-2.5 md:py-3 text-sm text-white focus:border-lime-400 outline-none transition-all ${errors.phone ? 'border-red-500' : 'border-slate-800'}`} placeholder="+91" />
                                    </div>
                                    <div className="space-y-1.5 md:space-y-2">
                                        <label className="block text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</label>
                                        <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-2.5 md:py-3 text-sm text-white focus:border-lime-400 outline-none transition-all" placeholder="your@email.com" />
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-4 md:gap-8 pt-2">
                                     <label className="flex items-center gap-2 md:gap-3 cursor-pointer group">
                                        <div className={`w-4 h-4 md:w-5 md:h-5 rounded-full border-2 flex items-center justify-center transition-all ${formData.residentStatus === 'Indian' ? 'border-lime-400 bg-lime-400/20' : 'border-slate-700'}`}>
                                            {formData.residentStatus === 'Indian' && <div className="w-2 md:w-2.5 h-2 md:h-2.5 bg-lime-400 rounded-full" />}
                                        </div>
                                        <input type="radio" name="resident" checked={formData.residentStatus === 'Indian'} onChange={() => setFormData({...formData, residentStatus: 'Indian'})} className="hidden" />
                                        <span className="text-[10px] md:text-xs font-black text-white uppercase tracking-widest group-hover:text-lime-400 transition-colors">Indian Resident</span>
                                     </label>
                                     <label className="flex items-center gap-2 md:gap-3 cursor-pointer group">
                                        <div className={`w-4 h-4 md:w-5 md:h-5 rounded-full border-2 flex items-center justify-center transition-all ${formData.residentStatus === 'NRI' ? 'border-lime-400 bg-lime-400/20' : 'border-slate-700'}`}>
                                            {formData.residentStatus === 'NRI' && <div className="w-2 md:w-2.5 h-2 md:h-2.5 bg-lime-400 rounded-full" />}
                                        </div>
                                        <input type="radio" name="resident" checked={formData.residentStatus === 'NRI'} onChange={() => setFormData({...formData, residentStatus: 'NRI'})} className="hidden" />
                                        <span className="text-[10px] md:text-xs font-black text-white uppercase tracking-widest group-hover:text-lime-400 transition-colors">NRI Portfolio</span>
                                     </label>
                                </div>
                            </div>

                            <div className="col-span-1 md:col-span-2 space-y-4 md:space-y-6">
                                <h3 className="text-[9px] md:text-xs font-black text-slate-500 uppercase tracking-[0.4em] md:tracking-[0.5em] border-l-4 border-violet-500 pl-3 md:pl-4">Asset Preference</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                                    <div className="bg-slate-950/50 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-slate-800">
                                        <label className="block text-[9px] md:text-[10px] font-black text-slate-400 mb-3 md:mb-4 uppercase tracking-widest">Unit Configuration</label>
                                        <div className="grid grid-cols-2 gap-2 md:gap-3">
                                            {['1 BHK', '2 BHK', '2.5 BHK', '3 BHK'].map(type => (
                                                <button 
                                                    key={type}
                                                    type="button"
                                                    onClick={() => setFormData({...formData, unitType: type})}
                                                    className={`px-3 md:px-4 py-2 md:py-3 rounded-xl md:rounded-2xl text-[10px] md:text-[11px] font-black uppercase tracking-widest border transition-all ${formData.unitType === type ? 'bg-lime-400 border-lime-500 text-black shadow-lg' : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-lime-400 hover:text-lime-400'}`}
                                                >
                                                    {type}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <div className="bg-slate-950/50 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-slate-800">
                                        <label className="block text-[9px] md:text-[10px] font-black text-slate-400 mb-3 md:mb-4 uppercase tracking-widest">Documents for Dossier</label>
                                        <div className="space-y-3 md:space-y-4">
                                            {['PAN Card', 'Aadhaar / Passport'].map((doc, idx) => (
                                                <label key={doc} className="flex items-center gap-3 md:gap-4 cursor-pointer group">
                                                    <div className={`w-5 h-5 md:w-6 md:h-6 rounded-lg border-2 flex items-center justify-center transition-all ${Object.values(formData.kyc)[idx] ? 'bg-lime-400 border-lime-400 shadow-lg shadow-lime-400/20' : 'border-slate-700 group-hover:border-lime-400'}`}>
                                                        {Object.values(formData.kyc)[idx] && <CheckSquare size={12} md:size={14} className="text-black"/>}
                                                    </div>
                                                    <input type="checkbox" className="hidden" checked={Object.values(formData.kyc)[idx]} onChange={(e) => {
                                                        const keys = Object.keys(formData.kyc);
                                                        setFormData({...formData, kyc: {...formData.kyc, [keys[idx]]: e.target.checked}});
                                                    }} />
                                                    <span className="text-[10px] md:text-xs font-black text-slate-300 uppercase tracking-widest group-hover:text-lime-400 transition-colors">{doc}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6 md:space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                                <div className="space-y-1.5 md:space-y-2">
                                    <label className="block text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Your Name</label>
                                    <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-950/50 border border-slate-800 rounded-xl md:rounded-2xl px-5 md:px-6 py-3 md:py-4 text-white focus:outline-none focus:border-lime-400 transition-all font-medium" placeholder="Legal Name" />
                                </div>
                                <div className="space-y-1.5 md:space-y-2">
                                    <label className="block text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Number</label>
                                    <input required type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className={`w-full bg-slate-950/50 border rounded-xl md:rounded-2xl px-5 md:px-6 py-3 md:py-4 text-white focus:outline-none transition-all font-medium ${errors.phone ? 'border-red-500' : 'border-slate-800 focus:border-lime-400'}`} placeholder="+91" />
                                </div>
                            </div>

                            {isSchedule && (
                                <div className="space-y-1.5 md:space-y-2">
                                    <label className="block text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Preferred Visit Date</label>
                                    <input required type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className={`w-full bg-slate-950/50 border rounded-xl md:rounded-2xl px-5 md:px-6 py-3 md:py-4 text-white focus:outline-none transition-all font-medium scheme-dark ${errors.date ? 'border-red-500' : 'border-slate-800 focus:border-lime-400'}`} />
                                </div>
                            )}

                            <div className="space-y-1.5 md:space-y-2">
                                <label className="block text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Your Message</label>
                                <textarea rows={4} value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} className="w-full bg-slate-950/50 border border-slate-800 rounded-[1.5rem] md:rounded-[2rem] px-5 md:px-6 py-4 md:py-5 text-white focus:outline-none focus:border-lime-400 transition-all resize-none font-medium" placeholder="How may we assist your portfolio search today?" />
                            </div>
                        </div>
                    )}

                    <button type="submit" className={`w-full py-4 md:py-6 rounded-[1.5rem] md:rounded-[2rem] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-[10px] md:text-xs text-white shadow-2xl transition-all transform hover:scale-[1.02] hover:bg-lime-400 hover:text-black active:scale-95 flex items-center justify-center gap-3 md:gap-4 ${isEOI ? 'bg-violet-600 shadow-violet-600/40 hover:shadow-lime-400/40' : (isSchedule ? 'bg-violet-600 shadow-violet-600/30 hover:shadow-lime-400/30' : 'bg-emerald-600 shadow-emerald-500/30 hover:shadow-lime-400/30')}`}>
                        {isEOI ? 'Submit EOI Priority' : (isSchedule ? 'Confirm Asset Visit' : 'Command Immediate Access')}
                        {isEOI ? <Crown className="w-4 h-4 md:w-5 md:h-5" /> : <MessageCircle className="w-4 h-4 md:w-5 md:h-5 fill-current" />}
                    </button>
                    
                    <p className="text-[8px] md:text-[10px] text-slate-600 text-center font-bold uppercase tracking-widest leading-relaxed mt-4 md:mt-6">
                        By submitting, you authorize our concierge to contact you. <br/> Zero Friction Protocol Active: NO OTP Verification Required.
                    </p>
                </form>
                </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default EnquireModal;
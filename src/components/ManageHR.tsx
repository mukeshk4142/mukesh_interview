import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Eye, 
  X, 
  Save, 
  ArrowLeft,
  Phone,
  Building2,
  MapPin,
  Mail,
  Calendar,
  Briefcase,
  AlertCircle,
  User,
  LogOut
} from "lucide-react";
import { Link } from "react-router-dom";
import { formatDateToDDMMYYYY, formatTimeTo12H } from "../utils/date";
import { db, auth } from "../firebase";
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  onSnapshot 
} from "firebase/firestore";

// Types
interface HRRecord {
  id: string;
  userId?: string;
  timestamp?: Date;
  hrName: string;
  contactNo: string;
  callingDate: string;
  companyName: string;
  location: string;
  package: string;
  jobRole: string;
  mailReceived: { status: "Yes" | "No"; date: string };
  mailRevert: { status: "Yes" | "No"; date: string };
  r1: "Process" | "Complete" | "Pass" | "Fail";
  r2: "Process" | "Complete" | "Pass" | "Fail";
  r3: "Process" | "Complete" | "Pass" | "Fail";
  interviewStatus: "Process" | "Complete" | "Pass" | "Fail";
  interviewDate: string;
  interviewTiming: string;
  finalStatus: string;
  remarkNote: string;
}

const STATUS_COLORS = {
  Process: "bg-amber-50 text-amber-600 border-amber-200",
  Complete: "bg-blue-50 text-blue-600 border-blue-200",
  Pass: "bg-emerald-50 text-emerald-600 border-emerald-200",
  Fail: "bg-red-50 text-red-600 border-red-200",
};

export const ManageHR = () => {
  const [hrRecords, setHrRecords] = useState<HRRecord[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<HRRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const currentUser = auth.currentUser;
  const [formData, setFormData] = useState<Partial<HRRecord>>({
    r1: "Process",
    r2: "Process",
    r3: "Process",
    interviewStatus: "Process",
    mailReceived: { status: "No", date: "" },
    mailRevert: { status: "No", date: "" }
  });

  // Real-time listener for Firestore
  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const q = query(
      collection(db, "hrRecords"),
      where("userId", "==", currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const records: HRRecord[] = [];
      snapshot.forEach((doc) => {
        records.push({
          ...doc.data() as HRRecord,
          id: doc.id
        });
      });
      setHrRecords(records);
      setLoading(false);
    }, (error) => {
      console.error("Error loading records:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData(prev => ({
        ...prev,
        [parent]: { ...((prev as any)[parent]), [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.contactNo && formData.contactNo.length > 10) {
      alert("Contact number cannot be more than 10 digits");
      return;
    }

    if (!currentUser) {
      alert("Please login first");
      return;
    }

    try {
      const recordData = {
        ...(formData as HRRecord),
        userId: currentUser.uid,
        timestamp: new Date()
      };

      if (selectedRecord) {
        await updateDoc(doc(db, "hrRecords", selectedRecord.id), recordData);
      } else {
        await addDoc(collection(db, "hrRecords"), recordData);
      }

      setIsModalOpen(false);
      setSelectedRecord(null);
      setFormData({
        r1: "Process",
        r2: "Process",
        r3: "Process",
        interviewStatus: "Process",
        mailReceived: { status: "No", date: "" },
        mailRevert: { status: "No", date: "" }
      });
    } catch (error: any) {
      console.error("Error saving record:", error);
      
      if (error?.code?.includes("permission")) {
        alert("Permission denied. Please check Firestore rules.");
      } else {
        alert("Error saving record. Please try again.");
      }
    }
  };

  const deleteRecord = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await deleteDoc(doc(db, "hrRecords", id));
      } catch (error) {
        console.error("Error deleting record:", error);
        alert("Error deleting record. Please try again.");
      }
    }
  };

  const openEditModal = (record: HRRecord) => {
    setSelectedRecord(record);
    setFormData(record);
    setIsModalOpen(true);
  };

  const openViewModal = (record: HRRecord) => {
    setSelectedRecord(record);
    setIsViewModalOpen(true);
  };

  useEffect(() => {
    if (isModalOpen || isViewModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen, isViewModalOpen]);

  const downloadExcel = () => {
    if (hrRecords.length === 0) {
      alert("No records to download");
      return;
    }

    const headers = [
      "S.No", "HR Name", "Contact No", "Calling Date", "Company Name", "Location", 
      "Package", "Job Role", "Mail Received Status", "Mail Received Date", 
      "Mail Revert Status", "Mail Revert Date", "R1", "R2", "R3", 
      "Interview Status", "Interview Date", "Interview Timing", "Final Status", "Remark"
    ];

    const csvContent = [
      headers.join(","),
      ...hrRecords.map((r, index) => [
        index + 1,
        `"${r.hrName}"`,
        `"${r.contactNo}"`,
        formatDateToDDMMYYYY(r.callingDate),
        `"${r.companyName}"`,
        `"${r.location}"`,
        `"${r.package}"`,
        `"${r.jobRole}"`,
        r.mailReceived.status,
        formatDateToDDMMYYYY(r.mailReceived.date),
        r.mailRevert.status,
        formatDateToDDMMYYYY(r.mailRevert.date),
        r.r1,
        r.r2,
        r.r3,
        r.interviewStatus,
        formatDateToDDMMYYYY(r.interviewDate),
        r.interviewTiming,
        `"${r.finalStatus}"`,
        `"${r.remarkNote?.replace(/\n/g, ' ')}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `HR_Database_Mukesh_Kumar_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredRecords = [...hrRecords].reverse().filter(r => {
    const query = searchQuery.toLowerCase();
    return (
      r.hrName.toLowerCase().includes(query) ||
      r.companyName.toLowerCase().includes(query) ||
      r.jobRole.toLowerCase().includes(query) ||
      r.contactNo.includes(query) ||
      (r.location && r.location.toLowerCase().includes(query)) ||
      (r.package && r.package.toLowerCase().includes(query))
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6 lg:p-12 selection:bg-indigo-100 selection:text-indigo-900">
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 shadow-2xl">
            <div className="animate-spin w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full mx-auto"></div>
            <p className="mt-4 text-slate-600 font-semibold text-center">Loading your records...</p>
          </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
          <div className="flex items-center space-x-6">
            <Link to="/admin" className="p-4 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all text-indigo-600 shadow-sm">
              <ArrowLeft size={24} />
            </Link>
            <div>
              <h1 className="text-3xl font-bold uppercase tracking-tight text-slate-900">Recruiter <span className="text-indigo-600">Hub.</span></h1>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2 italic">Global Candidate Tracking Interface</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={downloadExcel}
              className="flex items-center space-x-3 px-8 py-4 bg-white border border-slate-200 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:border-emerald-500 transition-all text-emerald-600 shadow-sm"
            >
              <Save size={16} />
              <span>Export CSV</span>
            </button>
            <button 
              onClick={() => {
                setSelectedRecord(null);
                setFormData({
                  r1: "Process",
                  r2: "Process",
                  r3: "Process",
                  interviewStatus: "Process",
                  mailReceived: { status: "No", date: "" },
                  mailRevert: { status: "No", date: "" }
                });
                setIsModalOpen(true);
              }}
              className="flex items-center space-x-3 px-10 py-4 bg-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-200 font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all"
            >
              <Plus size={16} />
              <span>Register HR</span>
            </button>
            <button 
              onClick={() => {
                localStorage.removeItem('isAuthenticated');
                window.location.href = '/';
              }}
              className="flex items-center space-x-3 px-8 py-4 bg-red-50 border border-red-100 rounded-2xl font-black text-[10px] uppercase tracking-widest text-red-600 hover:bg-red-100 transition-all shadow-sm"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Unified Search Engine */}
        <div className="grid md:grid-cols-4 gap-4">
          <div className="md:col-span-3 relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-indigo-400 group-focus-within:scale-110 transition-transform" size={20} />
            <input 
              type="text" 
              placeholder="GLOBAL SEARCH: RECRUITER, COMPANY, ROLE, PACKAGE, LOCATION..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl pl-16 pr-6 py-6 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 text-slate-900 text-sm font-black tracking-widest uppercase shadow-sm"
            />
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center space-y-1 shadow-sm">
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Record Density</span>
             <span className="text-3xl font-black text-indigo-600">{filteredRecords.length.toString().padStart(2, '0')}</span>
          </div>
        </div>

        {/* Enterprise Data Table */}
        <div className="bg-white border border-slate-200 rounded-none overflow-hidden shadow-xl shadow-slate-200/50">
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
            <table className="w-full text-left border-collapse min-w-[1100px]">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400 border-r border-slate-800/50">INDEX</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-sky-400 border-r border-slate-800/50">ORGANIZATION</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-yellow-400 border-r border-slate-800/50">RECRUITER</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-indigo-300 border-r border-slate-800/50">ROLE_SPEC</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-amber-400 text-center border-r border-slate-800/50">PIPELINE</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-purple-300 border-r border-slate-800/50">LOG_TIME</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-white text-right">PROTOCOL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecords.length > 0 ? filteredRecords.map((record, index) => (
                  <tr key={record.id} className="hover:bg-slate-50 transition-all group">
                    <td className="px-6 py-5">
                       <span className="text-[10px] font-black text-slate-400 group-hover:text-indigo-600 transition-colors">#{ (filteredRecords.length - index).toString().padStart(3, '0') }</span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 text-sm uppercase tracking-tight group-hover:text-indigo-600 transition-colors">{record.companyName}</span>
                        <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wide mt-1">{record.location || "OFFSITE"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-indigo-900 uppercase tracking-tight">{record.hrName}</span>
                        <span className="text-[10px] font-medium text-slate-600 tracking-wide mt-1">{record.contactNo}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-tighter truncate max-w-[150px]">{record.jobRole}</span>
                        <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mt-1">{record.package || "0.00 LPA"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center gap-4">
                         <div className="flex gap-1.5">
                          {["r1", "r2", "r3"].map((round) => {
                            const status = record[round as keyof HRRecord] as string;
                            const color = status === "Pass" ? "bg-emerald-500" : status === "Fail" ? "bg-red-500" : status === "Complete" ? "bg-sky-500" : "bg-amber-500";
                            return (
                                <div key={round} className={`w-2.5 h-2.5 rounded-full ${color} shadow-sm`} title={`${round.toUpperCase()}: ${status}`} />
                            )
                          })}
                         </div>
                         <div className={`px-3 py-1 rounded-lg text-[9px] font-black border uppercase tracking-widest ${STATUS_COLORS[record.interviewStatus]}`}>
                          {record.interviewStatus}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      {record.interviewDate ? (
                        <div className="flex flex-col">
                          <span className="font-black text-slate-700 text-[10px] tracking-widest uppercase">{formatDateToDDMMYYYY(record.interviewDate)}</span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">@ {formatTimeTo12H(record.interviewTiming)}</span>
                        </div>
                      ) : <span className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.2em] italic">QUEUE_AWAIT</span>}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button onClick={() => openViewModal(record)} className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm"><Eye size={14} /></button>
                        <button onClick={() => openEditModal(record)} className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-amber-500 hover:text-white transition-all shadow-sm"><Edit2 size={14} /></button>
                        <button onClick={() => deleteRecord(record.id)} className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-32 text-center">
                      <div className="flex flex-col items-center justify-center space-y-6">
                         <div className="p-10 bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200"><Search size={48} className="text-slate-300" /></div>
                         <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-xs">No matching telemetry data found in core.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>


      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-indigo-900/20 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white border border-slate-200 rounded-2xl md:rounded-[2.5rem] w-full max-w-4xl max-h-[95vh] md:max-h-[90vh] overflow-hidden relative z-10 flex flex-col mx-2 sm:mx-4 shadow-2xl"
            >
              <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50 sticky top-0 z-20">
                <h2 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tight">{selectedRecord ? "Update Recruitment Data" : "New Candidate Registration"}</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-900"><X size={24} /></button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 md:p-8 overflow-y-auto space-y-8 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                {/* Section 1: Basic Info */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-2 text-indigo-600 font-black uppercase tracking-widest text-[10px]">
                    <User size={14} /> <span>CORE IDENTIFICATION DATA</span>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">HR Name</label>
                      <input required name="hrName" value={formData.hrName || ""} onChange={handleInputChange} type="text" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 focus:border-indigo-500 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300" placeholder="FULL NAME" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Contact No. (10 DIGIT)</label>
                      <input required name="contactNo" value={formData.contactNo || ""} onChange={handleInputChange} type="tel" maxLength={10} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 focus:border-indigo-500 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300" placeholder="+91 XXXXX XXXXX" />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Calling Date</label>
                      <input name="callingDate" value={formData.callingDate || ""} onChange={handleInputChange} type="date" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 focus:border-indigo-500 outline-none transition-all font-bold text-slate-900" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Company Name</label>
                      <input required name="companyName" value={formData.companyName || ""} onChange={handleInputChange} type="text" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 focus:border-indigo-500 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300" placeholder="COMPANY NAME" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1"> Work Location</label>
                      <input name="location" value={formData.location || ""} onChange={handleInputChange} type="text" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 focus:border-indigo-500 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300" placeholder="City Name" />
                    </div>
                  </div>
                </div>

                {/* Section 2: Job Info */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-2 text-sky-600 font-black uppercase tracking-widest text-[10px]">
                    <Briefcase size={14} /> <span>ROLE & COMPENSATION METRICS</span>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Designation</label>
                      <input name="jobRole" value={formData.jobRole || ""} onChange={handleInputChange} type="text" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 focus:border-indigo-500 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300" placeholder="e.g. PYTHON LEAD" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Annual CTC (LPA)</label>
                      <input name="package" value={formData.package || ""} onChange={handleInputChange} type="text" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 focus:border-indigo-500 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300" placeholder="e.g. 18.5 LPA" />
                    </div>
                  </div>
                </div>

                {/* Section 3: Communication Status */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-2 text-purple-600 font-black uppercase tracking-widest text-[10px]">
                    <Mail size={14} /> <span>Mails Received & Revert</span>
                  </div>
                  <div className="grid md:grid-cols-2 gap-8 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Mail Received Status</label>
                      <div className="flex items-center gap-4">
                        <select name="mailReceived.status" value={formData.mailReceived?.status} onChange={handleInputChange} className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none flex-1">
                          <option value="No">NO</option>
                          <option value="Yes">YES</option>
                        </select>
                        <input name="mailReceived.date" value={formData.mailReceived?.date} onChange={handleInputChange} type="date" className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none flex-1" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Mail Revert Status</label>
                      <div className="flex items-center gap-4">
                        <select name="mailRevert.status" value={formData.mailRevert?.status} onChange={handleInputChange} className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none flex-1">
                          <option value="No">NO</option>
                          <option value="Yes">YES</option>
                        </select>
                        <input name="mailRevert.date" value={formData.mailRevert?.date} onChange={handleInputChange} type="date" className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none flex-1" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 4: Rounds & Status */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-2 text-amber-600 font-black uppercase tracking-widest text-[10px]">
                    <AlertCircle size={14} /> <span>INTERVIEW PHASE & STATUS</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: "ROUND_01", name: "r1" },
                      { label: "ROUND_02", name: "r2" },
                      { label: "ROUND_03", name: "r3" },
                      { label: "FINAL STATUS", name: "interviewStatus" }
                    ].map((item) => (
                      <div key={item.name} className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">{item.label}</label>
                        <select 
                          name={item.name} 
                          value={(formData as any)[item.name]} 
                          onChange={handleInputChange}
                          className={`w-full border rounded-xl px-3 py-3 text-xs font-black outline-none transition-all shadow-sm ${STATUS_COLORS[(formData as any)[item.name] as keyof typeof STATUS_COLORS]}`}
                        >
                          <option value="Process">IN_PROCESS</option>
                          <option value="Complete">COMPLETED</option>
                          <option value="Pass">SUCCESSFUL</option>
                          <option value="Fail">FAILED</option>
                        </select>
                      </div>
                    ))}
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Scheduled Interview Date</label>
                      <input name="interviewDate" value={formData.interviewDate || ""} onChange={handleInputChange} type="date" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 focus:border-indigo-500 outline-none transition-all font-bold text-slate-900" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Interview Time (12Hr)</label>
                      <input name="interviewTiming" value={formData.interviewTiming || ""} onChange={handleInputChange} type="time" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 focus:border-indigo-500 outline-none transition-all font-bold text-slate-900" />
                    </div>
                  </div>
                </div>

                {/* Section 5: Remarks */}
                <div className="space-y-6">
                  <div className="grid gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">FINAL RESOLUTION / DECISION</label>
                      <input name="finalStatus" value={formData.finalStatus || ""} onChange={handleInputChange} type="text" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 focus:border-indigo-500 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300" placeholder="e.g. OFFER GENERATED @ 20 LPA" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">REMARKS & Note</label>
                      <textarea name="remarkNote" value={formData.remarkNote || ""} onChange={handleInputChange} rows={4} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 focus:border-indigo-500 outline-none transition-all resize-none font-bold text-slate-900 placeholder:text-slate-300" placeholder="ADDITIONAL INTELLIGENCE DATA..."></textarea>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex justify-end gap-4 bg-white sticky bottom-0 z-20 pb-2">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-4 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-600 transition-all">ABORT</button>
                  <button type="submit" className="flex items-center space-x-2 px-10 py-4 bg-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-200 font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-transform active:scale-95">
                    <Save size={18} />
                    <span>SYNCHRONIZE DATA</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* View Detail Modal */}
      <AnimatePresence>
        {isViewModalOpen && selectedRecord && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsViewModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 rounded-2xl md:rounded-[3rem] w-full max-w-2xl max-h-[95vh] md:max-h-[90vh] overflow-hidden relative z-10 flex flex-col mx-2 sm:mx-4 shadow-2xl"
            >
              {/* Sticky Close Button for Mobile */}
              <button 
                onClick={() => setIsViewModalOpen(false)} 
                className="absolute top-4 right-4 z-30 p-2 bg-slate-900/10 hover:bg-slate-900/20 rounded-full transition-colors text-slate-900 md:hidden"
              >
                <X size={20} />
              </button>

              <div className="overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                <div className="h-24 md:h-32 bg-indigo-50 relative shrink-0">
                  <button onClick={() => setIsViewModalOpen(false)} className="absolute top-6 right-6 p-2 bg-white/50 hover:bg-white rounded-full transition-colors text-slate-900 hidden md:block border border-slate-200 shadow-sm"><X size={20} /></button>
                  <div className="absolute -bottom-10 left-8 p-1 bg-white rounded-3xl shadow-lg border border-slate-50">
                     <div className="w-16 h-16 md:w-20 md:h-20 bg-indigo-600 rounded-2xl flex items-center justify-center text-2xl md:text-3xl font-black text-white">
                        {selectedRecord.hrName.charAt(0)}
                     </div>
                  </div>
                </div>
                
                <div className="pt-14 p-6 md:p-8 space-y-6 md:space-y-8">
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-slate-900 uppercase tracking-tight break-words">{selectedRecord.hrName}</h2>
                    <p className="text-indigo-600 font-semibold flex items-center gap-2 mt-1 text-sm md:text-base uppercase tracking-wide"><Building2 size={16} className="shrink-0" /> {selectedRecord.companyName} • {selectedRecord.jobRole}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-slate-500 uppercase">Contact Protocol</p>
                      <p className="font-semibold flex items-center gap-2 text-slate-900 text-sm md:text-base"><Phone size={14} className="text-indigo-600 shrink-0" /> {selectedRecord.contactNo}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-slate-500 uppercase">Regional Sector</p>
                      <p className="font-semibold flex items-center gap-2 text-slate-900 text-sm md:text-base"><MapPin size={14} className="text-sky-600 shrink-0" /> {selectedRecord.location}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-slate-500 uppercase">Annual Yield (LPA)</p>
                      <p className="font-semibold text-emerald-600 text-sm md:text-base">{selectedRecord.package || "NOT_DISCLOSED"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-slate-500 uppercase">Interview Schedule</p>
                      <p className="font-semibold flex items-center gap-2 text-slate-900 text-sm md:text-base"><Calendar size={14} className="text-purple-600 shrink-0" /> {formatDateToDDMMYYYY(selectedRecord.interviewDate)} @ {formatTimeTo12H(selectedRecord.interviewTiming)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-slate-500 uppercase">First Connect Date</p>
                      <p className="font-semibold flex items-center gap-2 text-slate-900 text-sm md:text-base"><Calendar size={14} className="text-amber-600 shrink-0" /> {formatDateToDDMMYYYY(selectedRecord.callingDate)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-slate-500 uppercase">Mail Handshake Log</p>
                      <div className="flex flex-col gap-1 text-[10px] md:text-xs font-black uppercase">
                        <span className="flex items-center gap-1 text-emerald-600"><Mail size={12} /> RECV: {selectedRecord.mailReceived.status} ({formatDateToDDMMYYYY(selectedRecord.mailReceived.date)})</span>
                        <span className="flex items-center gap-1 text-indigo-600"><Mail size={12} /> RVRT: {selectedRecord.mailRevert.status} ({formatDateToDDMMYYYY(selectedRecord.mailRevert.date)})</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-slate-100 space-y-4">
                    <p className="text-xs font-semibold text-slate-500 uppercase\">Pipeline Velocity Summary</p>
                    <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2 scrollbar-none">
                      {["R1", "R2", "R3", "GLOBAL"].map((step, idx) => {
                        const val = idx === 0 ? selectedRecord.r1 : idx === 1 ? selectedRecord.r2 : idx === 2 ? selectedRecord.r3 : selectedRecord.interviewStatus;
                        return (
                          <div key={step} className="flex flex-col items-center gap-2 shrink-0 min-w-[70px]">
                             <span className="text-[9px] font-black text-slate-400 uppercase">{step}</span>
                             <div className={`w-12 md:w-16 h-2 rounded-full border-2 ${STATUS_COLORS[val as keyof typeof STATUS_COLORS]}`}></div>
                             <span className="text-[8px] md:text-[9px] uppercase font-black text-slate-900 truncate max-w-full tracking-tighter">{val}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {selectedRecord.finalStatus && (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-slate-500 uppercase">Final Resolution</p>
                      <p className="text-sm text-slate-700 font-bold bg-emerald-50 p-4 rounded-xl border-l-4 border-emerald-600 leading-relaxed break-words shadow-sm">
                        {selectedRecord.finalStatus}
                      </p>
                    </div>
                  )}

                  {selectedRecord.remarkNote && (
                     <div className="space-y-2">
                       <p className="text-xs font-semibold text-slate-500 uppercase">Internal Notes & Remarks</p>
                       <p className="text-sm text-slate-600 font-bold bg-slate-50 p-5 rounded-xl md:rounded-2xl border-l-4 border-indigo-600 leading-relaxed break-words italic shadow-sm">
                          "{selectedRecord.remarkNote}"
                       </p>
                     </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-4 sticky bottom-0 bg-white pb-4 z-20">
                    <button onClick={() => { setIsViewModalOpen(false); openEditModal(selectedRecord); }} className="flex-1 py-4 bg-slate-100 border border-slate-200 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-600 hover:bg-slate-200 transition-all flex items-center justify-center gap-2">
                      <Edit2 size={16} /> Update Record
                    </button>
                    <button onClick={() => setIsViewModalOpen(false)} className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all">
                      Terminate View
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

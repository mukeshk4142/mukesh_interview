import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  User,
  Calendar, 
  CheckCircle, 
  Clock, 
  Plus, 
  LogOut, 
  LayoutDashboard,
  Bell,
  Search,
  ChevronRight,
  History,
  TrendingUp,
  Zap,
  Target,
  Inbox,
  Trash2,
  Phone,
  Mail,
  MessageSquare
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { formatDateToDDMMYYYY, formatDateWithDayAndMonth, formatTimeTo12H } from "../utils/date";
import { db, auth } from "../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

const DashboardNavbar = () => {
  return (
    <nav className="h-20 border-b border-slate-200 bg-white/80 backdrop-blur-2xl fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-8">
      <div className="flex items-center space-x-4">
        <Link to="/" className="text-2xl font-bold text-slate-900">
          MK.<span className="text-indigo-600">admin</span>
        </Link>
      </div>
      
      <div className="flex-1 max-w-xl mx-8 hidden md:block">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search commands, data, interviews..." 
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-2.5 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 text-sm font-bold text-slate-900"
          />
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <button className="relative p-2.5 text-slate-400 hover:text-indigo-600 bg-slate-50 border border-slate-200 rounded-xl transition-all group">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-600 rounded-full border border-white group-hover:scale-125 transition-transform"></span>
        </button>
        <button 
          onClick={() => {
            localStorage.removeItem('isAuthenticated');
            window.location.href = '/';
          }}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-100 transition-all text-xs font-semibold text-red-600"
        >
          <LogOut size={14} />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
};

const StatCard = ({ title, value, icon, color, trend, delay = 0 }: { title: string, value: string, icon: React.ReactNode, color: string, trend?: string, delay?: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    whileHover={{ y: -5 }}
    className="p-8 rounded-[2.5rem] bg-white border border-slate-200 relative overflow-hidden group transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-slate-200"
  >
    <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity -mr-16 -mt-16 ${color}`} />
    <div className="flex items-start justify-between relative z-10">
      <div className="space-y-3">
        <p className="text-slate-500 text-xs font-semibold uppercase">{title}</p>
        <h3 className="text-3xl font-bold tracking-tight text-slate-900">{value}</h3>
        {trend && (
          <div className="flex items-center space-x-2 bg-slate-50 px-2 py-1 rounded-lg w-fit border border-slate-100">
            <TrendingUp size={12} className="text-indigo-600" />
            <span className="text-xs font-semibold text-indigo-600">{trend}</span>
          </div>
        )}
      </div>
      <div className={`p-4 rounded-2xl bg-slate-50 border border-slate-100 ${color.replace('bg-', 'text-')}`}>
        {icon}
      </div>
    </div>
  </motion.div>
);

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [hrRecords, setHrRecords] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [timeframe, setTimeframe] = useState<"thisWeek" | "nextWeek" | "history">("thisWeek");
  const [loading, setLoading] = useState(true);
  const currentUser = auth.currentUser;

  // Load HR records from Firestore in real-time
  useEffect(() => {
    // Wait for auth to be ready
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (!user) {
        setHrRecords([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      const q = query(
        collection(db, "hrRecords"),
        where("userId", "==", user.uid)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const records: any[] = [];
        snapshot.forEach((doc) => {
          records.push({
            ...doc.data(),
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
    });

    return () => unsubscribeAuth();
  }, []);

  // Load messages from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem("contact_messages");
    if (savedMessages) setMessages(JSON.parse(savedMessages));
  }, []);

  const newMessagesCount = messages.filter(m => m.isNew).length;

  const markMessagesAsRead = () => {
    const updatedMessages = messages.map(m => ({ ...m, isNew: false }));
    setMessages(updatedMessages);
    localStorage.setItem("contact_messages", JSON.stringify(updatedMessages));
  };

  const deleteMessage = (id: string) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      const updated = messages.filter(m => m.id !== id);
      setMessages(updated);
      localStorage.setItem("contact_messages", JSON.stringify(updated));
    }
  };

  // Date Filtering Logic
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getStartOfWeek = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); 
    return new Date(d.setDate(diff));
  };

  const startOfThisWeek = getStartOfWeek(today);
  const endOfThisWeek = new Date(startOfThisWeek);
  endOfThisWeek.setDate(startOfThisWeek.getDate() + 6);
  endOfThisWeek.setHours(23, 59, 59, 999);

  const startOfNextWeek = new Date(endOfThisWeek);
  startOfNextWeek.setDate(endOfThisWeek.getDate() + 1);
  startOfNextWeek.setHours(0, 0, 0, 0);

  const endOfNextWeek = new Date(startOfNextWeek);
  endOfNextWeek.setDate(startOfNextWeek.getDate() + 6);
  endOfNextWeek.setHours(23, 59, 59, 999);

  const filterInterviews = (records: any[], type: "thisWeek" | "nextWeek" | "history") => {
    return records.filter(record => {
      if (!record.interviewDate) return false;
      const interviewDate = new Date(record.interviewDate);
      if (isNaN(interviewDate.getTime())) return false;

      if (type === "history") {
        return interviewDate < today;
      }

      if (interviewDate < today) return false;

      if (type === "thisWeek") {
        return interviewDate >= today && interviewDate <= endOfThisWeek;
      } else {
        return interviewDate >= startOfNextWeek && interviewDate <= endOfNextWeek;
      }
    }).sort((a, b) => {
      const order = type === "history" ? -1 : 1;
      return (new Date(a.interviewDate).getTime() - new Date(b.interviewDate).getTime()) * order;
    });
  };

  const upcomingInterviews = filterInterviews(hrRecords, timeframe);
  const thisWeekCount = filterInterviews(hrRecords, "thisWeek").length;
  const nextWeekCount = filterInterviews(hrRecords, "nextWeek").length;
  
  const totalCleared = hrRecords.filter(r => r.interviewStatus === "Pass").length;
  const totalScheduled = hrRecords.filter(r => r.interviewDate && new Date(r.interviewDate) >= today).length;
  const pendingReview = hrRecords.filter(r => r.interviewStatus === "Process").length;

  const formatDateWithDay = (dateStr: string) => {
    return formatDateWithDayAndMonth(dateStr);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pt-20 selection:bg-indigo-100 selection:text-indigo-900">
      <DashboardNavbar />
      
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        <aside className="w-full lg:w-72 border-r border-slate-200 p-8 space-y-3 hidden lg:block h-[calc(100vh-80px)] sticky top-20 bg-white shadow-sm">
          {[
            { id: "overview", label: "Control Center", icon: <LayoutDashboard size={20} />, path: "/admin" },
            { id: "inbox", label: "Message Inbox", icon: <Inbox size={20} />, path: "#", showBadge: true },
            { id: "hr", label: "Recruiter Hub", icon: <Users size={20} />, path: "/admin/hr" },
            { id: "interviews", label: "Calendar", icon: <Calendar size={20} />, path: "/admin/hr" },
            { id: "history", label: "Archive", icon: <History size={20} />, path: "/admin/hr" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                if (item.path !== "#") {
                  navigate(item.path);
                }
                if (item.id === 'inbox') {
                  markMessagesAsRead();
                }
                setActiveTab(item.id);
              }}
              className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all font-semibold text-sm group ${
                activeTab === item.id 
                  ? "bg-indigo-600 text-white shadow-xl shadow-indigo-100" 
                  : "text-slate-400 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center space-x-4">
                <span className={`${activeTab === item.id ? 'text-white' : 'text-slate-300 group-hover:text-indigo-600'}`}>{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.showBadge && newMessagesCount > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${activeTab === item.id ? 'bg-white text-indigo-600' : 'bg-red-500 text-white'}`}>
                  {newMessagesCount}
                </span>
              )}
            </button>
          ))}
          
          <div className="pt-10 space-y-6">
             <div className="p-6 rounded-[2rem] bg-slate-50 border border-slate-200 relative overflow-hidden group">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-semibold text-slate-900">Resume Vault</h4>
                  <label className="cursor-pointer p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
                    <Plus size={14} />
                    <input 
                      type="file" 
                      className="hidden" 
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            localStorage.setItem("mukesh_resume", reader.result as string);
                            alert("Resume uploaded successfully! It is now live on your portfolio.");
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">UPLOAD YOUR LATEST CV TO SYNCHRONIZE WITH THE MAIN PORTFOLIO DOWNLOAD BUTTON.</p>
             </div>

             <div className="p-8 rounded-[2rem] bg-indigo-50 border border-indigo-100 relative overflow-hidden group cursor-pointer" onClick={() => navigate('/')}>
                <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-200/50 rounded-full blur-2xl -mr-10 -mt-10" />
                <Zap className="text-indigo-600 mb-4 group-hover:scale-110 transition-transform" size={24} />
                <h4 className="text-sm font-semibold mb-2 text-slate-900">View Portfolio</h4>
                <p className="text-xs text-slate-500 font-medium">Click to return to your public landing page.</p>
             </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 lg:p-12 overflow-x-hidden">
          <div className="max-w-7xl mx-auto space-y-12">
            
            {/* Mobile Menu */}
            <div className="lg:hidden mb-6 bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
              <div className="flex overflow-x-auto gap-2 pb-2">
                {[
                  { id: "overview", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
                  { id: "hr", label: "Recruiter Hub", icon: <Users size={16} /> },
                  { id: "inbox", label: "Messages", icon: <Inbox size={16} /> },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => item.id === "hr" ? navigate("/admin/hr") : setActiveTab(item.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap text-xs font-semibold transition-all ${
                      activeTab === item.id
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {activeTab === "overview" && (
              <>
                {/* Stats Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-2xl md:text-3xl font-bold mb-2 tracking-tight text-slate-900">Admin Dashboard</h1>
                    <p className="text-slate-500 font-semibold text-sm">Interview Pipeline Overview</p>
                  </motion.div>
                  <div className="flex items-center gap-4">
                    <Link to="/admin/hr" className="flex items-center space-x-3 px-8 py-4 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all text-xs font-semibold text-slate-600 shadow-sm">
                      <Plus size={16} />
                      <span>New Entry</span>
                    </Link>
                    <Link to="/admin/hr" className="flex items-center space-x-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all text-xs font-semibold">
                      <Target size={16} />
                      <span>Scheduler</span>
                    </Link>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-4 lg:gap-6">
                  {loading ? (
                    // Loading skeleton
                    <>
                      {[0, 1, 2, 3].map((idx) => (
                        <div key={idx} className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
                          <div className="h-4 bg-slate-200 rounded animate-pulse mb-3 w-1/2"></div>
                          <div className="h-8 bg-slate-200 rounded animate-pulse mb-2 w-3/4"></div>
                          <div className="h-3 bg-slate-100 rounded animate-pulse"></div>
                        </div>
                      ))}
                    </>
                  ) : (
                    <>
                      <StatCard title="Active Pipeline" value={totalScheduled.toString()} icon={<Calendar size={24} />} color="bg-indigo-500" trend={`${totalScheduled} Scheduled`} delay={0.1} />
                      <StatCard title="Successful Rounds" value={totalCleared.toString()} icon={<CheckCircle size={24} />} color="bg-emerald-500" trend={`${totalCleared} Pass Rate`} delay={0.2} />
                      <StatCard title="Awaiting Feedback" value={pendingReview.toString()} icon={<Clock size={24} />} color="bg-amber-500" delay={0.3} />
                      <StatCard title="Total Contacts" value={hrRecords.length.toString()} icon={<Users size={24} />} color="bg-sky-500" delay={0.4} />
                    </>
                  )}
                </div>

                <div className="grid lg:grid-cols-12 gap-10">
                  {/* Interviews Section - Full Width */}
                  <div className="lg:col-span-12 space-y-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                      <h2 className="text-xl md:text-3xl font-bold text-slate-900">Upcoming Interviews</h2>
                      <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
                        {[
                          { id: "thisWeek", label: "This Week" },
                          { id: "nextWeek", label: "Next Week" },
                          { id: "history", label: "History" }
                        ].map((btn) => (
                          <button 
                            key={btn.id}
                            onClick={() => setTimeframe(btn.id as any)}
                            className={`px-6 py-2.5 text-xs font-semibold rounded-xl transition-all ${timeframe === btn.id ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400 hover:text-slate-900"}`}
                          >
                            {btn.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Table Format Display */}
                    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                          <thead>
                            <tr className="bg-slate-700 text-white border-b border-slate-600">
                              <th className="px-2 md:px-4 py-2 md:py-3 font-semibold text-xs md:text-sm">Company</th>
                              <th className="px-2 md:px-4 py-2 md:py-3 font-semibold text-xs md:text-sm hidden sm:table-cell">Role</th>
                              <th className="px-2 md:px-4 py-2 md:py-3 font-semibold text-xs md:text-sm hidden md:table-cell">Recruiter</th>
                              <th className="px-2 md:px-4 py-2 md:py-3 font-semibold text-xs md:text-sm hidden lg:table-cell">Phone</th>
                              <th className="px-2 md:px-4 py-2 md:py-3 font-semibold text-xs md:text-sm">Package</th>
                              <th className="px-2 md:px-4 py-2 md:py-3 font-semibold text-xs md:text-sm hidden md:table-cell">Location</th>
                              <th className="px-2 md:px-4 py-2 md:py-3 font-semibold text-xs md:text-sm">Date</th>
                              <th className="px-2 md:px-4 py-2 md:py-3 font-semibold text-xs md:text-sm hidden sm:table-cell">Time</th>
                              <th className="px-2 md:px-4 py-2 md:py-3 font-semibold text-xs md:text-sm">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {loading ? (
                              <>
                                {[0, 1, 2].map((idx) => (
                                  <tr key={idx} className="hover:bg-slate-50">
                                    <td colSpan={9} className="px-2 md:px-4 py-2 md:py-3">
                                      <div className="h-3 bg-slate-200 rounded animate-pulse w-full"></div>
                                    </td>
                                  </tr>
                                ))}
                              </>
                            ) : upcomingInterviews.length > 0 ? (
                              upcomingInterviews.map((interview) => (
                                <tr key={interview.id} className="hover:bg-indigo-50 transition-colors group border-b border-slate-100">
                                  <td className="px-2 md:px-4 py-2 md:py-3 font-semibold text-slate-900 text-sm">{interview.companyName}</td>
                                  <td className="px-2 md:px-4 py-2 md:py-3 text-slate-600 hidden sm:table-cell text-sm">{interview.jobRole || "N/A"}</td>
                                  <td className="px-2 md:px-4 py-2 md:py-3 text-slate-600 hidden md:table-cell text-sm">{interview.hrName}</td>
                                  <td className="px-2 md:px-4 py-2 md:py-3 text-slate-600 hidden lg:table-cell text-sm font-mono">{interview.contactNo}</td>
                                  <td className="px-2 md:px-4 py-2 md:py-3 font-semibold text-green-600 text-sm">{interview.package || "N/A"}</td>
                                  <td className="px-2 md:px-4 py-2 md:py-3 text-slate-600 hidden md:table-cell text-sm">{interview.location || "Remote"}</td>
                                  <td className="px-2 md:px-4 py-2 md:py-3 text-slate-700 font-semibold text-sm">{formatDateToDDMMYYYY(interview.interviewDate)}</td>
                                  <td className="px-2 md:px-4 py-2 md:py-3 text-slate-600 hidden sm:table-cell font-semibold text-sm">{formatTimeTo12H(interview.interviewTiming)}</td>
                                  <td className="px-2 md:px-4 py-2 md:py-3">
                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                      interview.interviewStatus === "Pass" ? "bg-green-100 text-green-700" :
                                      interview.interviewStatus === "Fail" ? "bg-red-100 text-red-700" :
                                      interview.interviewStatus === "Complete" ? "bg-blue-100 text-blue-700" :
                                      "bg-amber-100 text-amber-700"
                                    }`}>
                                      {interview.interviewStatus}
                                    </span>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={9} className="px-4 py-8 text-center">
                                  <p className="text-slate-400 font-semibold text-sm">No interviews scheduled for this period</p>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === "inbox" && (
              <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-bold mb-2 tracking-tight uppercase text-slate-900">Message <span className="text-indigo-600 italic">Inbox.</span></h1>
                    <p className="text-slate-500 font-semibold text-xs">Client & Recruiter Submissions</p>
                  </motion.div>
                </div>

                <div className="grid gap-6">
                  {messages.length > 0 ? messages.map((msg, idx) => (
                    <motion.div 
                      key={msg.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className={`bg-white border ${msg.isNew ? 'border-indigo-500 ring-4 ring-indigo-500/5' : 'border-slate-200'} rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl hover:shadow-slate-200 transition-all duration-500 relative`}
                    >
                      {msg.isNew && (
                        <div className="absolute top-8 right-16 px-3 py-1 bg-indigo-600 text-white text-xs font-semibold rounded-full shadow-lg shadow-indigo-200">
                          NEW MESSAGE
                        </div>
                      )}
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
                        <div className="space-y-4 flex-1">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                              <User size={20} />
                            </div>
                            <div>
                              <h4 className="text-lg font-bold text-slate-900">{msg.name}</h4>
                              <p className="text-xs font-semibold text-slate-400">{new Date(msg.date).toLocaleString()}</p>
                            </div>
                          </div>
                          
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="flex items-center space-x-3 text-sm text-slate-600 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                              <Mail size={14} className="text-indigo-600" />
                              <span className="font-bold">{msg.email}</span>
                            </div>
                            <div className="flex items-center space-x-3 text-sm text-slate-600 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                              <Phone size={14} className="text-sky-600" />
                              <span className="font-bold">{msg.phone}</span>
                            </div>
                          </div>

                          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 relative overflow-hidden group">
                             <div className="absolute top-0 right-0 p-4 opacity-5">
                                <MessageSquare size={40} className="text-indigo-600" />
                             </div>
                             <p className="text-slate-700 text-sm font-medium leading-relaxed italic relative z-10">"{msg.message}"</p>
                          </div>
                        </div>

                        <div className="flex md:flex-col gap-2">
                           <button 
                             onClick={() => deleteMessage(msg.id)}
                             className="p-4 bg-red-50 text-red-600 border border-red-100 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-sm group"
                           >
                              <Trash2 size={18} className="group-active:scale-90 transition-transform" />
                           </button>
                        </div>
                      </div>
                    </motion.div>
                  )) : (
                    <div className="py-32 text-center bg-white border border-dashed border-slate-200 rounded-[3rem] shadow-sm">
                      <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                        <Inbox size={32} className="text-slate-300" />
                      </div>
                      <p className="text-slate-400 font-semibold text-xs">
                        Your communication matrix is currently quiet.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
};
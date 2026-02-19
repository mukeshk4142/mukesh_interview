import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  MessageSquare,
  Menu,
  X
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { formatDateToDDMMYYYY, formatDateWithDayAndMonth, formatTimeTo12H } from "../utils/date";
import { db, auth } from "../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

const DashboardNavbar = ({ onMenuClick, menuOpen }: { onMenuClick: () => void; menuOpen: boolean }) => {
  return (
    <nav className="h-20 border-b border-slate-200 bg-white/80 backdrop-blur-2xl fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 md:px-8">
      <div className="flex items-center space-x-4">
        <button 
          onClick={onMenuClick} 
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          {menuOpen ? (
            <X size={20} className="text-slate-700" />
          ) : (
            <Menu size={20} className="text-slate-700" />
          )}
        </button>
        <Link to="/" className="text-xl md:text-2xl font-bold text-slate-900">
          MK.<span className="text-indigo-600">admin</span>
        </Link>
      </div>
      
      <div className="flex-1 max-w-xl mx-4 md:mx-8 hidden md:block">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search interviews, companies..." 
            className="w-full bg-slate-100 border border-slate-200 rounded-lg pl-12 pr-4 py-2.5 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 text-sm text-slate-900"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button className="relative p-2 text-slate-400 hover:text-indigo-600 transition-colors">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-indigo-600 rounded-full"></span>
        </button>
        <button 
          onClick={() => {
            localStorage.removeItem('isAuthenticated');
            window.location.href = '/';
          }}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-50 hover:bg-red-100 border border-red-100 transition-all text-xs font-semibold text-red-600"
        >
          <LogOut size={14} />
          <span className="hidden sm:inline">Logout</span>
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
    className="p-6 md:p-8 rounded-xl bg-white border border-slate-200 relative overflow-hidden group transition-all duration-300 shadow-sm hover:shadow-lg"
  >
    <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity -mr-16 -mt-16 ${color}`} />
    <div className="flex items-start justify-between relative z-10">
      <div className="space-y-3">
        <p className="text-slate-500 text-sm font-semibold">{title}</p>
        <h3 className="text-3xl md:text-4xl font-bold text-slate-900">{value}</h3>
        {trend && (
          <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1 rounded-lg w-fit border border-slate-100">
            <TrendingUp size={12} className="text-indigo-600" />
            <span className="text-xs font-semibold text-indigo-600">{trend}</span>
          </div>
        )}
      </div>
      <div className={`p-4 rounded-xl bg-slate-50 border border-slate-100 ${color.replace('bg-', 'text-')}`}>
        {icon}
      </div>
    </div>
  </motion.div>
);

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [menuOpen, setMenuOpen] = useState(false);
  const [hrRecords, setHrRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: "0",
    completed: "0",
    inProgress: "0",
    pending: "0"
  });

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (!user) {
        window.location.href = "/";
        return;
      }

      const hrQuery = query(
        collection(db, "hrRecords"),
        where("userId", "==", user.uid)
      );

      const unsubscribeSnapshot = onSnapshot(hrQuery, (snapshot) => {
        const records = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setHrRecords(records);

        const completedCount = records.filter(
          (r: any) => r.finalStatus?.toLowerCase() === "complete" || r.finalStatus?.toLowerCase() === "pass"
        ).length;

        const inProgressCount = records.filter(
          (r: any) =>
            !r.finalStatus ||
            (r.finalStatus?.toLowerCase() !== "complete" &&
              r.finalStatus?.toLowerCase() !== "pass" &&
              r.finalStatus?.toLowerCase() !== "fail")
        ).length;

        const pendingCount = records.filter(
          (r: any) => r.finalStatus?.toLowerCase() === "fail"
        ).length;

        setStats({
          total: records.length.toString(),
          completed: completedCount.toString(),
          inProgress: inProgressCount.toString(),
          pending: pendingCount.toString(),
        });

        setLoading(false);
      });

      return () => unsubscribeSnapshot();
    });

    return () => unsubscribeAuth();
  }, []);

  const menuItems = [
    { label: "Dashboard", icon: <LayoutDashboard size={18} />, tab: "overview" },
    { label: "Interviews", icon: <Calendar size={18} />, tab: "interviews" },
    { label: "Messages", icon: <MessageSquare size={18} />, tab: "messages" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Navbar */}
      <DashboardNavbar onMenuClick={() => setMenuOpen(!menuOpen)} menuOpen={menuOpen} />

      {/* Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[99] mt-20"
          />
        )}
      </AnimatePresence>

      {/* Collapsible Sidebar Menu */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: menuOpen ? 0 : -300 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed left-0 top-20 h-[calc(100vh-80px)] w-64 bg-white border-r border-slate-200 z-[100] shadow-xl"
      >
        <div className="p-6 space-y-2">
          {menuItems.map((item, idx) => (
            <motion.button
              key={idx}
              onClick={() => {
                setActiveTab(item.tab);
                setMenuOpen(false);
              }}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.95 }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === item.tab
                  ? "bg-indigo-50 text-indigo-600 border-l-4 border-indigo-600"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {item.icon}
              <span className="font-semibold text-sm flex-1 text-left">{item.label}</span>
              {activeTab === item.tab && <ChevronRight size={16} />}
            </motion.button>
          ))}
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="pt-24 pb-12 px-4 md:px-8">
        <motion.div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
              Admin Dashboard
            </h1>
            <p className="text-slate-500 text-sm font-medium">
              Track interviews, manage candidates, monitor pipeline
            </p>
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Stats Cards */}
              {!loading && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
                >
                  <StatCard 
                    title="Total Records"
                    value={stats.total}
                    icon={<Users size={24} />}
                    color="bg-blue-600"
                    delay={0}
                  />
                  <StatCard 
                    title="Completed"
                    value={stats.completed}
                    icon={<CheckCircle size={24} />}
                    color="bg-green-600"
                    delay={0.1}
                  />
                  <StatCard 
                    title="In Progress"
                    value={stats.inProgress}
                    icon={<Clock size={24} />}
                    color="bg-yellow-600"
                    delay={0.2}
                  />
                  <StatCard 
                    title="Failed/Pending"
                    value={stats.pending}
                    icon={<Target size={24} />}
                    color="bg-red-600"
                    delay={0.3}
                  />
                </motion.div>
              )}

              {/* Upcoming Interviews Table */}
              {!loading && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm"
                >
                  <div className="px-6 md:px-8 py-6 border-b border-slate-200 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-slate-900">Upcoming Interviews</h2>
                    <Link to="/admin/hr">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold text-sm hover:bg-indigo-700 transition-all"
                      >
                        <Plus size={16} />
                        <span className="hidden sm:inline">Add Interview</span>
                      </motion.button>
                    </Link>
                  </div>

                  {hrRecords.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="px-6 md:px-8 py-4 text-left text-sm font-semibold text-slate-700">Candidate</th>
                            <th className="px-6 md:px-8 py-4 text-left text-sm font-semibold text-slate-700 hidden sm:table-cell">Company</th>
                            <th className="px-6 md:px-8 py-4 text-left text-sm font-semibold text-slate-700 hidden md:table-cell">Date & Time</th>
                            <th className="px-6 md:px-8 py-4 text-left text-sm font-semibold text-slate-700 hidden lg:table-cell">Status</th>
                            <th className="px-6 md:px-8 py-4 text-right text-sm font-semibold text-slate-700">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {hrRecords.slice(0, 10).reverse().map((record, idx) => (
                            <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                              <td className="px-6 md:px-8 py-4">
                                <div>
                                  <p className="font-semibold text-sm text-slate-900">{record.hrName}</p>
                                  <p className="text-xs text-slate-500">{record.contact}</p>
                                </div>
                              </td>
                              <td className="px-6 md:px-8 py-4 hidden sm:table-cell">
                                <p className="text-sm text-slate-600 font-medium">{record.company}</p>
                              </td>
                              <td className="px-6 md:px-8 py-4 hidden md:table-cell">
                                <p className="text-sm text-slate-600 font-medium">{formatDateWithDayAndMonth(record.interviewDate)}</p>
                                <p className="text-xs text-slate-400">{formatTimeTo12H(record.interviewTime)}</p>
                              </td>
                              <td className="px-6 md:px-8 py-4 hidden lg:table-cell">
                                <span className={`text-xs font-semibold px-3 py-1.5 rounded-full inline-block ${
                                  record.finalStatus?.toLowerCase() === "pass" || record.finalStatus?.toLowerCase() === "complete"
                                    ? "bg-green-100 text-green-700"
                                    : record.finalStatus?.toLowerCase() === "fail" || record.finalStatus?.toLowerCase() === "reject"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-yellow-100 text-yellow-700"
                                }`}>
                                  {record.finalStatus || "Pending"}
                                </span>
                              </td>
                              <td className="px-6 md:px-8 py-4 text-right">
                                <Link to={`/admin/hr?view=${record.id}`}>
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-semibold text-slate-700 transition-colors"
                                  >
                                    View
                                  </motion.button>
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="px-6 md:px-8 py-12 text-center">
                      <Inbox size={40} className="text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-500 font-medium">No interviews recorded yet</p>
                      <p className="text-slate-400 text-sm mt-2">Start adding interview records to see them here</p>
                    </div>
                  )}
                </motion.div>
              )}

              {loading && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-32 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded-xl animate-pulse"></div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Interviews Tab */}
          {activeTab === "interviews" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm"
            >
              <div className="px-6 md:px-8 py-6 border-b border-slate-200">
                <h2 className="text-lg font-bold text-slate-900">All Interviews</h2>
              </div>
              
              {!loading && hrRecords.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {hrRecords.reverse().map((record, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="p-6 md:p-8 hover:bg-slate-50/50 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                    >
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900 mb-1">{record.hrName}</h3>
                        <p className="text-sm text-slate-600 mb-3">{record.company} • {record.role}</p>
                        <div className="flex flex-wrap gap-3">
                          <div className="flex items-center space-x-1 text-xs text-slate-500">
                            <Calendar size={14} />
                            <span>{formatDateToDDMMYYYY(record.interviewDate)}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-xs text-slate-500">
                            <Clock size={14} />
                            <span>{formatTimeTo12H(record.interviewTime)}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-xs text-slate-500">
                            <Phone size={14} />
                            <span>{record.contact}</span>
                          </div>
                        </div>
                      </div>
                      <Link to={`/admin/hr?view=${record.id}`}>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg font-semibold text-sm transition-colors flex-shrink-0"
                        >
                          View Details
                        </motion.button>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              ) : !loading ? (
                <div className="px-6 md:px-8 py-12 text-center">
                  <Calendar size={40} className="text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 font-medium">No interviews scheduled</p>
                </div>
              ) : (
                <div className="space-y-4 p-6 md:p-8">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-24 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded-lg animate-pulse"></div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Messages Tab */}
          {activeTab === "messages" && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm p-6 md:p-8 text-center py-16"
            >
              <MessageSquare size={40} className="text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 font-medium">Messages feature coming soon</p>
              <p className="text-slate-400 text-sm mt-2">Track candidate communications and interview feedback</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
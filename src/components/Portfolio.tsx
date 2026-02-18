import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useSpring, useTransform, useInView, AnimatePresence } from "framer-motion";
import { 
  Github, 
  Linkedin, 
  Mail, 
  ExternalLink, 
  Cpu, 
  Database, 
  Layers, 
  MessageSquare,
  ChevronDown,
  Terminal,
  Briefcase,
  User,
  Download,
  Code2,
  Cloud,
  ShieldCheck,
  Zap,
  Layout,
  Globe,
  ArrowRight
} from "lucide-react";
import { Typewriter } from "react-simple-typewriter";
import { useNavigate } from "react-router-dom";

// --- Components ---

const Nav = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "About", href: "#about" },
    { name: "Skills", href: "#skills" },
    { name: "Experience", href: "#experience" },
    { name: "Projects", href: "#projects" },
    { name: "Contact", href: "#contact" }
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${scrolled ? "bg-white/80 backdrop-blur-2xl py-3 border-b border-slate-100 shadow-sm" : "bg-transparent py-6"}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="group cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-800 tracking-tight group-hover:tracking-normal transition-all duration-300">
            MUKESH.
          </span>
        </motion.div>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center space-x-10 text-[11px] uppercase tracking-[0.2em] font-black">
          {navLinks.map((item) => (
            <a key={item.name} href={item.href} className="text-slate-500 hover:text-indigo-600 transition-colors relative group">
              {item.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-4"
        >
          <div className="hidden sm:flex space-x-5 mr-4 border-r border-slate-200 pr-6">
            <a href="#" className="text-slate-400 hover:text-indigo-600 transition-all hover:-translate-y-1"><Github size={18} /></a>
            <a href="#" className="text-slate-400 hover:text-indigo-600 transition-all hover:-translate-y-1"><Linkedin size={18} /></a>
          </div>
          <div className="flex space-x-3">
            <motion.button
              onClick={() => {
                const resume = localStorage.getItem("mukesh_resume");
                if (resume) {
                  const link = document.createElement("a");
                  link.href = resume;
                  link.download = "Mukesh_Kumar_Resume.pdf";
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                } else {
                  alert("Resume not found. Please upload it from the Admin Dashboard.");
                }
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden md:flex items-center space-x-2 px-5 py-2.5 text-[10px] font-black uppercase tracking-widest border border-slate-200 text-slate-900 rounded-xl hover:bg-slate-50 transition-all"
            >
              <Download size={14} />
              <span>Resume</span>
            </motion.button>
            <motion.button
              onClick={() => navigate("/login")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest bg-indigo-600 text-white rounded-xl shadow-xl shadow-indigo-100 hover:bg-indigo-700"
            >
              Login
            </motion.button>
          </div>
          
          {/* Mobile Toggle */}
          <button className="lg:hidden text-slate-900 ml-4" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
             <div className="w-6 h-4 flex flex-col justify-between">
                <span className={`w-full h-0.5 bg-slate-900 transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                <span className={`w-full h-0.5 bg-slate-900 transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`} />
                <span className={`w-full h-0.5 bg-slate-900 transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
             </div>
          </button>
        </motion.div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-b border-slate-100 overflow-hidden shadow-xl"
          >
            <div className="container mx-auto px-6 py-8 flex flex-col space-y-6 text-center">
              {navLinks.map((item) => (
                <a 
                  key={item.name} 
                  href={item.href} 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg font-black uppercase tracking-widest text-slate-900 hover:text-indigo-600 transition-colors"
                >
                  {item.name}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const BackgroundEffects = () => (
  <div className="absolute inset-0 -z-10 pointer-events-none">
    {/* Animated Blobs */}
    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px] animate-blob" />
    <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-sky-500/10 rounded-full blur-[120px] animate-blob animation-delay-2000" />
    <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-indigo-600/10 rounded-full blur-[120px] animate-blob animation-delay-4000" />
    
    {/* Grid Pattern */}
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px]" />
  </div>
);

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-slate-50">
      <BackgroundEffects />
      
      <div className="container mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-indigo-200 bg-white text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] mb-8 shadow-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
            <span>Open for Strategic Partnerships</span>
          </motion.div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight leading-tight uppercase text-slate-900">
            Architecting <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-800">The Future.</span>
          </h1>
          
          <div className="text-lg md:text-xl font-semibold text-slate-500 mb-8 flex items-center justify-center space-x-3">
            <span>Specialized in</span>
            <span className="text-indigo-600 bg-white px-3 py-1 rounded-md border border-slate-200 shadow-sm">
              <Typewriter
                words={["Python Ecosystem", "Cloud Architecture", "Backend Excellence", "AI Integrations"]}
                loop={0}
                cursor
                cursorStyle='|'
                typeSpeed={80}
                deleteSpeed={40}
                delaySpeed={2000}
              />
            </span>
          </div>
          
          <p className="max-w-xl mx-auto text-slate-500 text-base mb-10 leading-relaxed font-medium">
            A Python veteran with 4+ years of experience engineering high-availability systems and scalable backend architectures. I transform complex business logic into elegant, performant code.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <motion.a
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(79, 70, 229, 0.2)" }}
              whileTap={{ scale: 0.95 }}
              href="#projects"
              className="group px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center space-x-3 transition-all"
            >
              <span>Explore My Work</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05, backgroundColor: "rgba(79, 70, 229, 0.05)" }}
              whileTap={{ scale: 0.95 }}
              href="#contact"
              className="px-10 py-5 bg-white border border-slate-200 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-900 shadow-sm transition-all"
            >
              Start A Conversation
            </motion.a>
          </div>
        </motion.div>
        
        <motion.div
          animate={{ y: [0, 15, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-slate-300 hover:text-indigo-600 transition-colors cursor-pointer"
          onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <ChevronDown size={40} strokeWidth={1} />
        </motion.div>
      </div>
    </section>
  );
};

const BentoCard = ({ children, className, title, icon: Icon, delay = 0 }: any) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay }}
      className={`relative overflow-hidden rounded-[2.5rem] bg-white border border-slate-100 p-8 group transition-all duration-500 shadow-sm hover:shadow-xl hover:shadow-indigo-100/50 hover:border-indigo-200 ${className}`}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-indigo-500/10 transition-colors" />
      {Icon && (
        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-indigo-50 transition-all">
          <Icon className="text-indigo-600" size={24} />
        </div>
      )}
      {title && <h3 className="text-xl font-black mb-4 text-slate-900 uppercase tracking-tight group-hover:text-indigo-600 transition-colors">{title}</h3>}
      {children}
    </motion.div>
  );
};

const About = () => {
  return (
    <section id="about" className="py-32 relative bg-white">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-8">
          <BentoCard className="lg:col-span-8 h-full" title="The Professional Persona" icon={User}>
            <p className="text-slate-500 text-lg leading-relaxed mb-6 font-medium">
              With over 4 years in the high-stakes world of software engineering, I've cultivated a philosophy centered on <span className="text-indigo-600 font-black">CLEAN ARCHITECTURE</span> and <span className="text-indigo-600 font-black">EXTREME PERFORMANCE.</span>
            </p>
            <p className="text-slate-500 text-lg leading-relaxed font-medium">
              My core expertise lies in Python, where I architect high-availability backends that power everything from FinTech platforms to AI-driven analytical tools. I believe that code is an asset only if it's maintainable, scalable, and solves real-world problems.
            </p>
            <div className="mt-12 flex flex-wrap gap-4">
               {[
                 { label: "Architecture", icon: Layout },
                 { label: "Security", icon: ShieldCheck },
                 { label: "Performance", icon: Zap },
                 { label: "Scalability", icon: Globe }
               ].map((tag) => (
                 <div key={tag.label} className="flex items-center space-x-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 text-xs font-black text-slate-600 uppercase tracking-widest">
                    <tag.icon size={14} className="text-indigo-600" />
                    <span>{tag.label}</span>
                 </div>
               ))}
            </div>
          </BentoCard>
          
          <BentoCard className="lg:col-span-4" delay={0.2} title="Metrics of Impact" icon={Layers}>
             <div className="grid grid-cols-1 gap-6 mt-4">
                {[
                  { label: "Years in Python", val: "4+", color: "text-indigo-600" },
                  { label: "System Uptime", val: "99.9%", color: "text-sky-600" },
                  { label: "Projects Delivered", val: "30+", color: "text-emerald-600" }
                ].map((stat) => (
                  <div key={stat.label} className="p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-indigo-100/50 transition-all">
                    <div className={`text-4xl font-black ${stat.color} mb-1`}>{stat.val}</div>
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{stat.label}</div>
                  </div>
                ))}
             </div>
          </BentoCard>

          <BentoCard className="lg:col-span-12" delay={0.3} title="My Development Creed" icon={Terminal}>
             <div className="grid md:grid-cols-3 gap-8 mt-4">
                <div className="space-y-4">
                   <div className="text-indigo-600 font-black text-[10px] uppercase tracking-[0.3em]">01. Precision</div>
                   <p className="text-slate-500 text-sm italic font-bold">"Don't just write code, craft experiences. Every line must serve a measurable purpose."</p>
                </div>
                <div className="space-y-4">
                   <div className="text-sky-600 font-black text-[10px] uppercase tracking-[0.3em]">02. Evolution</div>
                   <p className="text-slate-500 text-sm italic font-bold">"The tech stack is a tool, not a religion. Stay fluid, stay curious, and always keep evolving."</p>
                </div>
                <div className="space-y-4">
                   <div className="text-emerald-600 font-black text-[10px] uppercase tracking-[0.3em]">03. Scalability</div>
                   <p className="text-slate-500 text-sm italic font-bold">"Build for today, but architect for 10x growth. Scale should be built-in, not an afterthought."</p>
                </div>
             </div>
          </BentoCard>
        </div>
      </div>
    </section>
  );
};

const Skills = () => {
  const skillGroups = [
    {
      name: "Core Backend",
      icon: Cpu,
      items: ["Python 3.x", "Django / ORM", "FastAPI", "AsyncIO", "Flask"]
    },
    {
      name: "Cloud & Devops",
      icon: Cloud,
      items: ["AWS (EC2, S3, RDS)", "Docker / K8s", "CI/CD Pipelines", "Nginx", "Terraform"]
    },
    {
      name: "Data & Storage",
      icon: Database,
      items: ["PostgreSQL", "Redis / Cache", "MongoDB", "ElasticSearch", "RabbitMQ"]
    },
    {
      name: "Modern Web",
      icon: Code2,
      items: ["REST / GraphQL", "Microservices", "System Design", "Unit Testing", "Go Lang"]
    }
  ];

  return (
    <section id="skills" className="py-32 bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-20">
           <div>
              <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tight mb-4 text-slate-900">Technical <span className="text-indigo-600">Arsenal.</span></h2>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs max-w-xl">A curated stack of technologies I've mastered to deliver high-performance enterprise solutions.</p>
           </div>
           <div className="hidden md:block h-px flex-1 bg-slate-200 mx-10 mb-5" />
           <div className="text-right">
              <span className="text-3xl font-black text-slate-200 uppercase tracking-widest leading-none">Proficiency</span>
           </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skillGroups.map((group, idx) => (
            <motion.div
              key={group.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="p-10 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-100/50 transition-all duration-500 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mb-10 group-hover:scale-110 transition-transform border border-indigo-100">
                <group.icon className="text-indigo-600" size={28} />
              </div>
              <h3 className="text-2xl font-black mb-8 text-slate-900 uppercase tracking-tighter">{group.name}</h3>
              <div className="space-y-4">
                {group.items.map((item) => (
                  <div key={item} className="flex items-center group/item">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-100 mr-4 group-hover/item:bg-indigo-600 transition-colors shadow-inner" />
                    <span className="text-slate-400 font-black group-hover/item:text-slate-900 transition-colors uppercase text-[10px] tracking-widest">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Experience = () => {
  const experiences = [
    {
      company: "Enterprise Solutions",
      role: "Lead Python Developer",
      period: "2022 - Present",
      achievements: [
        "Orchestrated the migration of legacy monolith to FastAPI microservices, reducing latency by 60%.",
        "Implemented real-time data processing using Celery and Redis for 1M+ daily transactions.",
        "Designed a custom ETL pipeline processing 500GB of daily log data into actionable insights."
      ]
    },
    {
      company: "NextGen Systems",
      role: "Senior Backend Engineer",
      period: "2020 - 2022",
      achievements: [
        "Architected scalable REST APIs supporting 500k active users using Django and PostgreSQL.",
        "Optimized database queries and indexing strategies, improving application response time by 45%.",
        "Lead the adoption of Docker and Kubernetes for containerized deployment strategies."
      ]
    },
    {
      company: "SoftCore Tech",
      role: "Python Engineer",
      period: "2019 - 2020",
      achievements: [
        "Developed core business logic for an automated trading platform using Python 3 and AsyncIO.",
        "Integrated multiple third-party payment gateways and secured transaction handling protocols.",
        "Automated deployment workflows using GitHub Actions and AWS CodePipeline."
      ]
    }
  ];

  return (
    <section id="experience" className="py-32 relative overflow-hidden bg-white">
       <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
             <div className="text-center mb-24">
                <h2 className="text-5xl font-black mb-6 uppercase tracking-tighter text-slate-900">The Career <span className="text-indigo-600">Timeline.</span></h2>
                <div className="w-20 h-1.5 bg-indigo-600 mx-auto rounded-full" />
             </div>

             <div className="space-y-20 relative">
                <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-slate-100 -translate-x-1/2 hidden md:block" />
                
                {experiences.map((exp, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className={`flex flex-col md:flex-row items-center gap-12 ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                  >
                    <div className="md:w-1/2 text-left md:text-right px-0 md:px-12">
                       {idx % 2 !== 0 && <div className="text-indigo-600 font-black text-[10px] uppercase tracking-[0.3em] mb-2">{exp.period}</div>}
                       {idx % 2 !== 0 && <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-2">{exp.company}</h3>}
                       {idx % 2 !== 0 && <p className="text-slate-400 font-black uppercase tracking-widest text-[9px] mb-6">{exp.role}</p>}
                       
                       {idx % 2 === 0 && (
                         <div className="bg-slate-50 border border-slate-100 p-8 rounded-[2rem] shadow-sm hover:shadow-xl hover:shadow-indigo-100/50 transition-all group">
                            <ul className="space-y-4 text-left">
                               {exp.achievements.map((ach, i) => (
                                 <li key={i} className="text-slate-500 text-sm leading-relaxed font-bold">
                                    <span className="text-indigo-600 font-black mr-2">/</span> {ach}
                                 </li>
                               ))}
                            </ul>
                         </div>
                       )}
                    </div>

                    <div className="relative z-10 w-12 h-12 rounded-full bg-white border-2 border-indigo-600 flex items-center justify-center shadow-xl hidden md:flex">
                       <Briefcase size={20} className="text-indigo-600" />
                    </div>

                    <div className="md:w-1/2 text-left px-0 md:px-12">
                       {idx % 2 === 0 && <div className="text-indigo-600 font-black text-[10px] uppercase tracking-[0.3em] mb-2">{exp.period}</div>}
                       {idx % 2 === 0 && <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-2">{exp.company}</h3>}
                       {idx % 2 === 0 && <p className="text-slate-400 font-black uppercase tracking-widest text-[9px] mb-6">{exp.role}</p>}
                       
                       {idx % 2 !== 0 && (
                         <div className="bg-slate-50 border border-slate-100 p-8 rounded-[2rem] shadow-sm hover:shadow-xl hover:shadow-indigo-100/50 transition-all group">
                            <ul className="space-y-4">
                               {exp.achievements.map((ach, i) => (
                                 <li key={i} className="text-slate-500 text-sm leading-relaxed font-bold">
                                    <span className="text-indigo-600 font-black mr-2">/</span> {ach}
                                 </li>
                               ))}
                            </ul>
                         </div>
                       )}
                    </div>
                  </motion.div>
                ))}
             </div>
          </div>
       </div>
    </section>
  );
};

const ProjectCard = ({ project, index }: any) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.8 }}
      className="group relative rounded-[3rem] overflow-hidden bg-white border border-slate-100 flex flex-col h-full shadow-sm hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-500"
    >
      <div className="aspect-[16/10] overflow-hidden relative">
        <img 
          src={project.image} 
          alt={project.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-60" />
        
        <div className="absolute top-6 right-6 flex space-x-2">
           <div className="p-3 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-100 text-slate-600 hover:text-indigo-600 cursor-pointer transition-colors shadow-sm">
              <Github size={18} />
           </div>
           <div className="p-3 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-100 text-slate-600 hover:text-indigo-600 cursor-pointer transition-colors shadow-sm">
              <ExternalLink size={18} />
           </div>
        </div>
      </div>
      
      <div className="p-10 flex-1 flex flex-col">
        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 mb-4">{project.category}</div>
        <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-6 group-hover:text-indigo-600 transition-colors">{project.title}</h3>
        <p className="text-slate-500 mb-10 line-clamp-2 font-bold uppercase text-[11px] tracking-wide">
          {project.description || "A sophisticated solution built with Python and modern cloud technologies to solve complex architectural challenges."}
        </p>
        
        <div className="mt-auto pt-8 border-t border-slate-50 flex flex-wrap gap-2">
           {project.tags.map((tag: string) => (
             <span key={tag} className="px-4 py-1.5 rounded-full bg-slate-50 border border-slate-100 text-[9px] font-black uppercase tracking-widest text-slate-400">
               {tag}
             </span>
           ))}
        </div>
      </div>
    </motion.div>
  );
};

const Projects = () => {
  const projects = [
    {
      title: "FinStream Realtime",
      category: "FinTech / High Load",
      image: "https://images.unsplash.com/photo-1611974717483-36009c6096ed?auto=format&fit=crop&q=80&w=800",
      tags: ["FastAPI", "Redis", "Kafka", "PostgreSQL"],
      description: "Real-time market data streaming platform capable of handling 100k+ events per second with sub-millisecond latency."
    },
    {
      title: "DeepScan AI",
      category: "Cybersecurity / ML",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
      tags: ["Python", "PyTorch", "AWS Lambda", "S3"],
      description: "Automated vulnerability scanner using AI to detect anomalous patterns in cloud infrastructure logs."
    },
    {
      title: "CoreLogis API",
      category: "Logistics / SaaS",
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800",
      tags: ["Django", "Celery", "RabbitMQ", "Docker"],
      description: "Comprehensive logistics management system with automated route optimization and real-time fleet tracking."
    }
  ];

  return (
    <section id="projects" className="py-32 bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-24">
           <div>
              <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4 text-slate-900">Selected <span className="text-indigo-600 italic">Work.</span></h2>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs max-w-xl">Deep dives into the technical challenges I've solved and the impact they've made.</p>
           </div>
           <button className="px-8 py-4 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
              View All Repositories
           </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {projects.map((project, idx) => (
            <ProjectCard key={project.title} project={project} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const messages = JSON.parse(localStorage.getItem('contact_messages') || '[]');
      const newMessage = {
        id: Date.now().toString(),
        ...formData,
        date: new Date().toISOString(),
        isNew: true
      };
      localStorage.setItem('contact_messages', JSON.stringify([newMessage, ...messages]));
      
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
      
      setTimeout(() => setIsSuccess(false), 5000);
    }, 1500);
  };

  return (
    <section id="contact" className="py-32 relative overflow-hidden bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
           <div>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] mb-12 text-slate-900">
                   Let's start <br />
                   <span className="text-indigo-600">something</span> <br />
                   Great.
                </h2>
                
                <div className="space-y-12">
                   <div className="flex items-center space-x-8 group cursor-pointer">
                      <div className="w-16 h-16 rounded-[2rem] bg-indigo-50 flex items-center justify-center border border-indigo-100 group-hover:scale-110 transition-transform">
                        <Mail className="text-indigo-600" />
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">Direct Email</div>
                        <div className="text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">mukesh@python.dev</div>
                      </div>
                   </div>
                   
                   <div className="flex items-center space-x-8 group cursor-pointer">
                      <div className="w-16 h-16 rounded-[2rem] bg-sky-50 flex items-center justify-center border border-sky-100 group-hover:scale-110 transition-transform">
                        <MessageSquare className="text-sky-600" />
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">WhatsApp / Call</div>
                        <div className="text-2xl font-black text-slate-900 group-hover:text-sky-600 transition-colors">+91 9988776655</div>
                      </div>
                   </div>
                </div>
              </motion.div>
           </div>
           
           <motion.div
             initial={{ opacity: 0, scale: 0.95 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             className="bg-white border border-slate-100 p-10 md:p-16 rounded-[3.5rem] relative shadow-2xl shadow-indigo-100/50"
           >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-sky-50 -z-10 opacity-30" />
              
              <form className="space-y-8" onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Full Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-5 focus:border-indigo-600 focus:bg-white outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300" placeholder="MUKESH KUMAR" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-5 focus:border-indigo-600 focus:bg-white outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300" placeholder="MUKESH@DEV.COM" />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Phone Protocol</label>
                  <input 
                    type="tel" 
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-5 focus:border-indigo-600 focus:bg-white outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300" placeholder="10 DIGIT CONTACT" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">The Vision</label>
                  <textarea 
                    rows={5} 
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-5 focus:border-indigo-600 focus:bg-white outline-none transition-all resize-none font-bold text-slate-900 placeholder:text-slate-300" placeholder="DESCRIBE THE OPPORTUNITY..."></textarea>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting}
                  className={`w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-colors ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? 'Sending Message...' : isSuccess ? 'Message Sent Successfully!' : 'Initiate Connection'}
                </motion.button>
                {isSuccess && (
                  <p className="text-center text-emerald-600 font-bold text-xs uppercase tracking-widest mt-4">Thank you! I will get back to you soon.</p>
                )}
              </form>
           </motion.div>
        </div>
      </div>
    </section>
  );
};

export const Portfolio = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
      <motion.div 
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-800 z-[1000] origin-left shadow-sm"
      />
      
      <Nav />
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <Contact />
      
      <footer className="py-20 border-t border-slate-100 relative bg-white">
        <div className="container mx-auto px-6">
           <div className="flex flex-col md:flex-row justify-between items-center gap-10">
              <div className="text-3xl font-black text-indigo-600 tracking-tighter uppercase">
                MUKESH.
              </div>
              
              <div className="flex space-x-8 text-[10px] font-black uppercase tracking-widest text-slate-400">
                 <a href="#" className="hover:text-indigo-600 transition-colors">Github</a>
                 <a href="#" className="hover:text-indigo-600 transition-colors">Linkedin</a>
                 <a href="#" className="hover:text-indigo-600 transition-colors">Twitter</a>
              </div>
              
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-300">
                © 2024 / Engineered for Excellence
              </div>
           </div>
        </div>
      </footer>
    </div>
  );
};

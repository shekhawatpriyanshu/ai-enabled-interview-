import { FaGithub, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

const PortfolioHero = ({ personal, avatar, templateConfig }) => {
  if (!personal) return null;

  const accent = templateConfig?.accent || "from-indigo-500 to-cyan-400";

  return (
    <div className={`relative overflow-hidden rounded-3xl p-8 sm:p-12 shadow-2xl border ${
      templateConfig?.cardBg || "bg-slate-900/80 border-slate-800"
    }`}>
      <div className={`absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 rounded-full bg-gradient-to-tr ${accent} opacity-20 blur-3xl`} />

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
        <div className={`w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-gradient-to-tr ${accent} p-1 shadow-xl shrink-0`}>
          <div className="w-full h-full rounded-[22px] bg-slate-950 overflow-hidden flex items-center justify-center text-4xl font-black text-white">
            {avatar ? (
              <img src={avatar} alt={personal.name} className="w-full h-full object-cover" />
            ) : (
              personal.name?.charAt(0).toUpperCase() || "D"
            )}
          </div>
        </div>

        <div className="space-y-3 flex-1">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r ${accent} text-white shadow-sm`}>
            Available for Opportunities
          </span>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            {personal.name || "Developer Name"}
          </h1>

          <p className={`text-lg sm:text-xl font-bold bg-gradient-to-r ${accent} bg-clip-text text-transparent`}>
            {personal.title || "Software Engineer"}
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs pt-2 font-semibold">
            {personal.location && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
                <FaMapMarkerAlt /> {personal.location}
              </span>
            )}
            {personal.email && (
              <a href={`mailto:${personal.email}`} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition backdrop-blur-sm border border-white/10">
                <FaEnvelope /> {personal.email}
              </a>
            )}
            {personal.phone && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
                <FaPhone /> {personal.phone}
              </span>
            )}
          </div>

          <div className="flex items-center justify-center md:justify-start gap-3 pt-3">
            {personal.github && (
              <a
                href={personal.github}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-extrabold text-xs flex items-center gap-2 border border-slate-700 shadow-sm transition active:scale-95"
              >
                <FaGithub className="text-sm" /> GitHub
              </a>
            )}
            {personal.linkedin && (
              <a
                href={personal.linkedin}
                target="_blank"
                rel="noreferrer"
                className={`px-4 py-2 rounded-xl bg-gradient-to-r ${accent} text-white font-extrabold text-xs flex items-center gap-2 shadow-sm transition active:scale-95`}
              >
                <FaLinkedin className="text-sm" /> LinkedIn
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioHero;


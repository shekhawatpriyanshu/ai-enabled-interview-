import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";

const ProjectsSection = ({ projects, templateConfig, isLightMode }) => {
  if (!projects || projects.length === 0) return null;

  const accent = templateConfig?.accent || "from-purple-500 to-pink-500";

  return (
    <div className="space-y-6">
      <h2 className={`text-xl font-black tracking-tight flex items-center gap-2 ${isLightMode ? "text-slate-900" : "text-white"}`}>
        <span className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${accent}`} />
        Featured Projects
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((project, index) => (
          <div
            key={index}
            className={`group relative rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between border ${
              isLightMode ? "bg-white border-slate-200" : `${templateConfig?.cardBg || "bg-slate-900 border-slate-800"}`
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <h3 className={`text-lg font-black ${isLightMode ? "text-slate-900" : "text-white"}`}>
                  {project.title}
                </h3>
                <div className="flex items-center gap-2">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition border border-white/10"
                    >
                      <FaGithub className="text-xs" />
                    </a>
                  )}
                  {project.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noreferrer"
                      className={`p-2 rounded-xl bg-gradient-to-r ${accent} text-white transition`}
                    >
                      <FaExternalLinkAlt className="text-xs" />
                    </a>
                  )}
                </div>
              </div>

              <p className={`text-xs font-medium leading-relaxed ${isLightMode ? "text-slate-600" : "text-slate-300"}`}>
                {project.description}
              </p>
            </div>

            {project.technologies && project.technologies.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-4 border-t border-white/10 mt-4">
                {project.technologies.map((tech, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-lg bg-white/10 border border-white/10"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsSection;


import PortfolioHero from "../PortfolioHero";
import SkillsSection from "../SkillsSection";
import ExperienceSection from "../ExperienceSection";
import ProjectsSection from "../ProjectsSection";
import EducationSection from "../EducationSection";
import { PORTFOLIO_TEMPLATES } from "../templatesData";

const ModernTemplate = ({ portfolio }) => {
  if (!portfolio) return null;

  const currentTemplateId = portfolio.template || "modern";
  const templateConfig = PORTFOLIO_TEMPLATES.find((t) => t.id === currentTemplateId) || PORTFOLIO_TEMPLATES[0];

  const isLightMode = templateConfig.bg.includes("bg-white") || templateConfig.bg.includes("bg-slate-50") || templateConfig.bg.includes("bg-gray-50") || templateConfig.bg.includes("bg-zinc-50") || templateConfig.bg.includes("bg-stone-50") || templateConfig.bg.includes("bg-slate-100") || templateConfig.bg.includes("bg-pink-50");

  return (
    <div className={`space-y-12 p-6 sm:p-10 font-sans rounded-3xl transition-all duration-300 ${
      templateConfig.bg.startsWith("bg-") ? templateConfig.bg : `bg-gradient-to-br ${templateConfig.bg}`
    } ${templateConfig.text}`}>

      {/* Hero Header */}
      <PortfolioHero personal={portfolio.personal} templateConfig={templateConfig} />

      {/* Summary / Bio */}
      {portfolio.summary && (
        <div className="space-y-3 max-w-4xl">
          <h2 className={`text-xl font-black tracking-tight flex items-center gap-2 ${isLightMode ? "text-slate-900" : "text-white"}`}>
            <span className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${templateConfig.accent}`} />
            About Me
          </h2>
          <p className={`text-sm font-medium leading-relaxed p-6 rounded-3xl border shadow-xs ${
            isLightMode ? "bg-white/80 border-slate-200 text-slate-700" : `${templateConfig.cardBg} text-slate-300`
          }`}>
            {portfolio.summary}
          </p>
        </div>
      )}

      {/* Skills */}
      <SkillsSection skills={portfolio.skills} templateConfig={templateConfig} isLightMode={isLightMode} />

      {/* Projects */}
      <ProjectsSection projects={portfolio.projects} templateConfig={templateConfig} isLightMode={isLightMode} />

      {/* Work Experience */}
      <ExperienceSection experience={portfolio.experience} templateConfig={templateConfig} isLightMode={isLightMode} />

      {/* Education & Certifications */}
      <EducationSection education={portfolio.education} templateConfig={templateConfig} isLightMode={isLightMode} />
    </div>
  );
};

export default ModernTemplate;



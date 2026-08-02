import { useRef } from "react";
import { Gsap } from "../utils/gsapAnimate";
import { usePortfolioData } from "../hooks/usePortfolioData";

// Simple Icons (brand icons) from react-icons
import {
    SiPython,
    SiTensorflow,
    SiPytorch,
    SiKeras,
    SiScikitlearn,
    SiOpencv,
    SiStreamlit,
    SiNumpy,
    SiPandas,
    SiReact,
    SiNextdotjs,
    SiTailwindcss,
    SiGreensock,
    SiJavascript,
    SiHtml5,
    SiFastapi,
    SiExpress,
    SiPostgresql,
    SiMysql,
    SiSupabase,
    SiDocker,

    SiGit,
    SiLinux,
} from "react-icons/si";

// Lucide icons for generic concepts
import { Bot, BrainCircuit, Workflow, Globe, Cloud, Code2 } from "lucide-react";

// Resolve an icon for a skill name at render time so the tech stack stays
// fully editable via the admin while keeping brand icons where known.
const ICON_BY_NAME = {
    Python: SiPython,
    TensorFlow: SiTensorflow,
    PyTorch: SiPytorch,
    Keras: SiKeras,
    "Scikit-Learn": SiScikitlearn,
    OpenCV: SiOpencv,
    Streamlit: SiStreamlit,
    Numpy: SiNumpy,
    Pandas: SiPandas,
    React: SiReact,
    "Next.js": SiNextdotjs,
    "Tailwind CSS": SiTailwindcss,
    GSAP: SiGreensock,
    JavaScript: SiJavascript,
    "HTML/CSS": SiHtml5,
    FastAPI: SiFastapi,
    ExpressJS: SiExpress,
    PostgreSQL: SiPostgresql,
    MySQL: SiMysql,
    Supabase: SiSupabase,
    Docker: SiDocker,
    Git: SiGit,
    Linux: SiLinux,
    "Microsoft Azure": Cloud,
    MLOps: Workflow,
    RAG: BrainCircuit,
    LLM: Bot,
    "REST APIs": Globe,
};

const TechStack = () => {
    const containerRef = useRef(null);
    const [data] = usePortfolioData();
    const { techStack } = data;
    const stackCategories = techStack;

    return (
        <section id="tech-stack-section" ref={containerRef} className="pt-20 md:pt-24 pb-24 md:pb-32 w-full relative bg-[#0A0A0A] overflow-hidden">

            <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">

                {/* ── SECTION HEADER ── */}
                <Gsap.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-4 mb-20 md:mb-32"
                >
                    <div className="w-2 h-2 bg-lime-400 rounded-full" />
                    <span className="font-mono text-[10px] md:text-xs font-bold uppercase tracking-[0.18em] md:tracking-[0.26em] text-white/40">
                        04. Technical_Arsenal
                    </span>
                    <div className="flex-1 h-[1px] bg-white/10" />
                </Gsap.div>

                {/* Main Content Area */}
                <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-16 lg:gap-24 items-start">

                    {/* Left side: Sticky Title area */}
                    <div className="lg:sticky lg:top-36 flex flex-col pt-4">
                        <Gsap.h2
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="text-3xl sm:text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.98] sm:leading-[0.95] text-white"
                        >
                            Core <br />
                            <span className="text-lime-400">Stack.</span>
                        </Gsap.h2>

                        <Gsap.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="mt-6 md:mt-8 font-sans text-sm md:text-base text-white/55 leading-7 md:leading-8 max-w-sm"
                        >
                            <p>
                                An ecosystem of tools and architectures mastered for building scalable, intelligent, and high-performance digital solutions. Full engineering proficiency.
                            </p>
                        </Gsap.div>
                    </div>

                    {/* Right side: Table List */}
                    <div className="flex flex-col border-t border-white/10 min-w-0">
                        {stackCategories.length === 0 ? (
                            <div className="flex flex-col items-center justify-center text-center py-16 md:py-24 px-6 border-b border-white/10">
                                <span className="w-10 h-10 md:w-14 md:h-14 rounded-full border-2 border-white/15 flex items-center justify-center mb-5">
                                    <Code2 className="w-5 h-5 md:w-7 md:h-7 text-white/40" strokeWidth={2} />
                                </span>
                                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40 mb-2">
                                    Arsenal pending
                                </p>
                                <p className="text-sm font-light text-white/55 max-w-[320px] leading-6 text-center">
                                    Tech categories and skills will appear here once they are added through the admin.
                                </p>
                            </div>
                        ) : (
                        stackCategories.map((category, index) => (
                            <Gsap.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="group border-b border-white/10 py-8 md:py-12 flex flex-col md:flex-row gap-6 md:gap-12 transition-colors hover:bg-white/[0.02] -mx-4 px-4 sm:px-4 cursor-default"
                            >
                                <div className="md:w-1/3 shrink-0 flex flex-col gap-2">
                                    <h4 className="text-xl md:text-2xl font-bold uppercase text-white tracking-tight group-hover:text-lime-400 transition-colors">
                                        {category.title}
                                    </h4>
                                    <span className="font-mono text-xs text-white/40 uppercase tracking-[0.12em] md:tracking-[0.16em] hidden md:block">
                                        {'// '}{category.description}
                                    </span>
                                </div>

                                <ul className="md:w-2/3 flex flex-wrap gap-4 lg:gap-5 items-center list-none">
                                    {category.skills.map((skill, idx) => {
                                        const IconComponent = ICON_BY_NAME[skill.name] || Code2;
                                        return (
                                            <li
                                                key={idx}
                                                className="relative group/icon w-11 h-11 md:w-12 md:h-12 flex items-center justify-center border border-white/10 rounded-lg hover:border-lime-400/50 hover:bg-lime-400/10 transition-all duration-300 cursor-default focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-400"
                                                aria-label={skill.name}
                                                tabIndex={0}
                                            >
                                                <IconComponent className="w-5 h-5 md:w-6 md:h-6 text-white/60 group-hover:text-white/80 group-hover/icon:text-lime-400 transition-colors" aria-hidden="true" />
                                                {/* Tooltip */}
                                                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-white text-black text-[10px] font-mono font-bold uppercase tracking-wider rounded whitespace-nowrap opacity-0 group-hover/icon:opacity-100 group-focus/icon:opacity-100 focus-within:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                                                    {skill.name}
                                                </span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </Gsap.div>
                        ))
                        )}
                    </div>

                </div>
            </div>
        </section>
    );
};

export default TechStack;

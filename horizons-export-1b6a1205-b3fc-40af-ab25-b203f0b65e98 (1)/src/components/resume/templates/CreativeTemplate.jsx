import React from 'react';
    import { Phone, Mail, Linkedin, GitCommit as GitHub, Globe, MapPin, Briefcase, GraduationCap, Star, FileText, User, Zap } from 'lucide-react';

    const CreativeTemplate = ({ data }) => {
      const { personalInfo, summary, experience, education, skills, projects, settings } = data;
      const primaryColor = settings.primaryColor || '#8b5cf6'; // Violet-500
      const secondaryColor = settings.secondaryColor || '#ec4899'; // Pink-500 (accent)
      const textColor = '#374151'; // Gray-700

      const Section = ({ title, children, icon, titleClassName }) => (
        <section className="mb-6 relative">
          <div className="flex items-center mb-3">
            {icon && React.cloneElement(icon, { className: "h-6 w-6 mr-3", style: { color: primaryColor } })}
            <h2 className={`text-2xl font-bold tracking-tight ${titleClassName || ''}`} style={{ color: primaryColor }}>{title}</h2>
          </div>
          <div className="pl-9">{children}</div>
        </section>
      );
      
      const TimelineItem = ({ title, subtitle, date, children }) => (
        <div className="relative pl-8 pb-4 border-l-2" style={{ borderColor: secondaryColor }}>
          <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full" style={{ backgroundColor: primaryColor }}></div>
          <h3 className="text-lg font-semibold" style={{ color: primaryColor }}>{title}</h3>
          <p className="text-sm font-medium" style={{ color: textColor }}>{subtitle}</p>
          <p className="text-xs mb-1" style={{ color: secondaryColor }}>{date}</p>
          <div className="text-sm" style={{ color: textColor }}>{children}</div>
        </div>
      );


      return (
        <div className="p-8 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 text-sm" style={{ fontFamily: settings.fontFamily, color: textColor }}>
          <header className="text-center mb-10">
            {personalInfo.profilePicture && (
              <img-replace 
                src={personalInfo.profilePicture} 
                alt={`${personalInfo.name} profile`} 
                className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border-4 shadow-lg" 
                style={{ borderColor: primaryColor }}
              />
            )}
            <h1 className="text-5xl font-extrabold" style={{ color: primaryColor }}>{personalInfo.name}</h1>
            <p className="text-2xl font-light mt-1" style={{ color: secondaryColor }}>{personalInfo.title}</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-4 space-y-6 p-6 rounded-lg shadow-xl bg-white/70 backdrop-blur-md">
              <Section title="About Me" icon={<User />}>
                <p className="leading-relaxed">{summary}</p>
              </Section>

              <Section title="Contact" icon={<Zap />}>
                <ul className="space-y-2">
                  {personalInfo.phone && <li className="flex items-center"><Phone className="h-4 w-4 mr-2" style={{ color: primaryColor }} /><a href={`tel:${personalInfo.phone}`} className="hover:underline">{personalInfo.phone}</a></li>}
                  {personalInfo.email && <li className="flex items-center"><Mail className="h-4 w-4 mr-2" style={{ color: primaryColor }} /><a href={`mailto:${personalInfo.email}`} className="hover:underline">{personalInfo.email}</a></li>}
                  {personalInfo.address && <li className="flex items-center"><MapPin className="h-4 w-4 mr-2" style={{ color: primaryColor }} />{personalInfo.address}</li>}
                  {personalInfo.linkedin && <li className="flex items-center"><Linkedin className="h-4 w-4 mr-2" style={{ color: primaryColor }} /><a href={`https://${personalInfo.linkedin}`} target="_blank" rel="noopener noreferrer" className="hover:underline">{personalInfo.linkedin}</a></li>}
                  {personalInfo.github && <li className="flex items-center"><GitHub className="h-4 w-4 mr-2" style={{ color: primaryColor }} /><a href={`https://${personalInfo.github}`} target="_blank" rel="noopener noreferrer" className="hover:underline">{personalInfo.github}</a></li>}
                  {personalInfo.website && <li className="flex items-center"><Globe className="h-4 w-4 mr-2" style={{ color: primaryColor }} /><a href={`https://${personalInfo.website}`} target="_blank" rel="noopener noreferrer" className="hover:underline">{personalInfo.website}</a></li>}
                </ul>
              </Section>

              {skills && skills.length > 0 && (
                <Section title="Skills" icon={<Star />}>
                  <div className="flex flex-wrap gap-2">
                    {skills.map(skill => (
                      <span key={skill.id} className="px-3 py-1.5 text-xs rounded-lg shadow-md text-white" style={{ backgroundColor: secondaryColor }}>
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </Section>
              )}
            </div>

            <div className="md:col-span-8 p-6 rounded-lg shadow-xl bg-white/70 backdrop-blur-md">
              {experience && experience.length > 0 && (
                <Section title="Experience" icon={<Briefcase />}>
                  {experience.map(exp => (
                    <TimelineItem 
                      key={exp.id} 
                      title={exp.jobTitle} 
                      subtitle={`${exp.company} | ${exp.location}`}
                      date={`${exp.startDate} - ${exp.endDate || 'Present'}`}
                    >
                      {exp.responsibilities && exp.responsibilities.length > 0 && (
                        <ul className="list-disc list-inside space-y-1 mt-1">
                          {exp.responsibilities.map((resp, index) => resp && <li key={index}>{resp}</li>)}
                        </ul>
                      )}
                    </TimelineItem>
                  ))}
                </Section>
              )}

              {education && education.length > 0 && (
                <Section title="Education" icon={<GraduationCap />}>
                  {education.map(edu => (
                    <TimelineItem 
                      key={edu.id} 
                      title={edu.degree} 
                      subtitle={`${edu.institution} | ${edu.location}`}
                      date={edu.graduationDate}
                    >
                      {edu.details && <p className="mt-1">{edu.details}</p>}
                    </TimelineItem>
                  ))}
                </Section>
              )}

              {projects && projects.length > 0 && (
                <Section title="Projects" icon={<FileText />}>
                  {projects.map(proj => (
                    <div key={proj.id} className="mb-4 last:mb-0 p-3 rounded-md bg-primary/5 hover:bg-primary/10 transition-colors">
                      <h3 className="text-md font-semibold" style={{ color: primaryColor }}>{proj.name}</h3>
                      {proj.link && <a href={`https://${proj.link}`} target="_blank" rel="noopener noreferrer" className="text-xs hover:underline" style={{ color: secondaryColor }}>{proj.link}</a>}
                      <p className="my-1">{proj.description}</p>
                      {proj.technologies && proj.technologies.length > 0 && (
                         <p className="text-xs"><span className="font-semibold">Technologies:</span> {proj.technologies.join(', ')}</p>
                      )}
                    </div>
                  ))}
                </Section>
              )}
            </div>
          </div>
        </div>
      );
    };

    export default CreativeTemplate;
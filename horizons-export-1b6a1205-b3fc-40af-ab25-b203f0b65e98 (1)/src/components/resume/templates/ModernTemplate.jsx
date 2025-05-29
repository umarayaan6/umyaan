import React from 'react';
    import { Phone, Mail, Linkedin, GitCommit as GitHub, Globe, MapPin, Briefcase, GraduationCap, Star, FileText, User } from 'lucide-react';

    const ModernTemplate = ({ data }) => {
      const { personalInfo, summary, experience, education, skills, projects, settings } = data;
      const primaryColor = settings.primaryColor || '#0ea5e9'; // Sky-500
      const secondaryColor = settings.secondaryColor || '#475569'; // Slate-600 (for text)

      const IconWrapper = ({ icon: IconComponent, className }) => (
        <IconComponent className={`h-4 w-4 mr-2 ${className || ''}`} style={{ color: primaryColor }} />
      );
      
      const Section = ({ title, children, icon }) => (
        <section className="mb-6">
          <h2 className="text-xl font-bold mb-3 pb-1 border-b-2 flex items-center" style={{ borderColor: primaryColor, color: primaryColor }}>
            {icon && React.cloneElement(icon, { className: "h-5 w-5 mr-2" })}
            {title}
          </h2>
          {children}
        </section>
      );

      return (
        <div className="p-8 bg-white text-gray-800 text-sm leading-relaxed" style={{ fontFamily: settings.fontFamily }}>
          <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-4 border-b-2" style={{ borderColor: primaryColor }}>
            <div>
              <h1 className="text-4xl font-bold" style={{ color: primaryColor }}>{personalInfo.name}</h1>
              <p className="text-xl font-light" style={{ color: secondaryColor }}>{personalInfo.title}</p>
            </div>
            {personalInfo.profilePicture && (
              <img-replace 
                src={personalInfo.profilePicture} 
                alt={`${personalInfo.name} profile`} 
                className="w-28 h-28 rounded-full object-cover border-4 mt-4 md:mt-0" 
                style={{ borderColor: primaryColor }}
              />
            )}
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <aside className="md:col-span-1 space-y-6">
              <Section title="Contact" icon={<User />}>
                <ul className="space-y-2">
                  {personalInfo.phone && <li><IconWrapper icon={Phone} /><a href={`tel:${personalInfo.phone}`} className="hover:underline" style={{ color: secondaryColor }}>{personalInfo.phone}</a></li>}
                  {personalInfo.email && <li><IconWrapper icon={Mail} /><a href={`mailto:${personalInfo.email}`} className="hover:underline" style={{ color: secondaryColor }}>{personalInfo.email}</a></li>}
                  {personalInfo.address && <li><IconWrapper icon={MapPin} /><span style={{ color: secondaryColor }}>{personalInfo.address}</span></li>}
                  {personalInfo.linkedin && <li><IconWrapper icon={Linkedin} /><a href={`https://${personalInfo.linkedin}`} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: secondaryColor }}>{personalInfo.linkedin}</a></li>}
                  {personalInfo.github && <li><IconWrapper icon={GitHub} /><a href={`https://${personalInfo.github}`} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: secondaryColor }}>{personalInfo.github}</a></li>}
                  {personalInfo.website && <li><IconWrapper icon={Globe} /><a href={`https://${personalInfo.website}`} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: secondaryColor }}>{personalInfo.website}</a></li>}
                </ul>
              </Section>

              {skills && skills.length > 0 && (
                <Section title="Skills" icon={<Star />}>
                  <ul className="flex flex-wrap gap-2">
                    {skills.map(skill => (
                      <li key={skill.id} className="px-3 py-1 rounded-full text-xs text-white" style={{ backgroundColor: primaryColor }}>
                        {skill.name}
                      </li>
                    ))}
                  </ul>
                </Section>
              )}
            </aside>

            <main className="md:col-span-2">
              {summary && (
                <Section title="Summary" icon={<User />}>
                  <p className="text-gray-700">{summary}</p>
                </Section>
              )}

              {experience && experience.length > 0 && (
                <Section title="Experience" icon={<Briefcase />}>
                  {experience.map(exp => (
                    <div key={exp.id} className="mb-4 last:mb-0">
                      <h3 className="text-lg font-semibold" style={{ color: primaryColor }}>{exp.jobTitle}</h3>
                      <p className="font-medium text-gray-700">{exp.company} | {exp.location}</p>
                      <p className="text-xs text-gray-500 mb-1">{exp.startDate} - {exp.endDate || 'Present'}</p>
                      {exp.responsibilities && exp.responsibilities.length > 0 && (
                        <ul className="list-disc list-inside text-gray-700 space-y-1 pl-4">
                          {exp.responsibilities.map((resp, index) => resp && <li key={index}>{resp}</li>)}
                        </ul>
                      )}
                    </div>
                  ))}
                </Section>
              )}

              {education && education.length > 0 && (
                <Section title="Education" icon={<GraduationCap />}>
                  {education.map(edu => (
                    <div key={edu.id} className="mb-4 last:mb-0">
                      <h3 className="text-lg font-semibold" style={{ color: primaryColor }}>{edu.degree}</h3>
                      <p className="font-medium text-gray-700">{edu.institution} | {edu.location}</p>
                      <p className="text-xs text-gray-500 mb-1">{edu.graduationDate}</p>
                      {edu.details && <p className="text-gray-700 text-xs">{edu.details}</p>}
                    </div>
                  ))}
                </Section>
              )}

              {projects && projects.length > 0 && (
                <Section title="Projects" icon={<FileText />}>
                  {projects.map(proj => (
                    <div key={proj.id} className="mb-4 last:mb-0">
                      <h3 className="text-lg font-semibold" style={{ color: primaryColor }}>{proj.name}</h3>
                      {proj.link && <a href={`https://${proj.link}`} target="_blank" rel="noopener noreferrer" className="text-xs hover:underline" style={{ color: secondaryColor }}>{proj.link}</a>}
                      <p className="text-gray-700 my-1">{proj.description}</p>
                      {proj.technologies && proj.technologies.length > 0 && (
                         <p className="text-xs text-gray-600">
                           <span className="font-semibold">Technologies:</span> {proj.technologies.join(', ')}
                         </p>
                      )}
                    </div>
                  ))}
                </Section>
              )}
            </main>
          </div>
        </div>
      );
    };

    export default ModernTemplate;
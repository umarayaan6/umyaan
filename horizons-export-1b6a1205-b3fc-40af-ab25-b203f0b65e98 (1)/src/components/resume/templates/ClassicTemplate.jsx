import React from 'react';
    import { Phone, Mail, Linkedin, GitCommit as GitHub, Globe, MapPin, Briefcase, GraduationCap, Star, FileText, User } from 'lucide-react';

    const ClassicTemplate = ({ data }) => {
      const { personalInfo, summary, experience, education, skills, projects, settings } = data;
      const primaryColor = settings.primaryColor || '#334155'; // Slate-700
      const secondaryColor = settings.secondaryColor || '#4b5563'; // Gray-600

      const Section = ({ title, children, icon }) => (
        <section className="mb-5">
          <h2 className="text-lg font-semibold uppercase tracking-wider pb-1 mb-2 border-b-2 flex items-center" style={{ borderColor: primaryColor, color: primaryColor }}>
            {icon && React.cloneElement(icon, { className: "h-5 w-5 mr-2" })}
            {title}
          </h2>
          {children}
        </section>
      );

      return (
        <div className="p-8 bg-white text-gray-700 text-sm leading-normal" style={{ fontFamily: settings.fontFamily }}>
          <header className="text-center mb-6 pb-4 border-b" style={{ borderColor: secondaryColor }}>
            <h1 className="text-3xl font-bold" style={{ color: primaryColor }}>{personalInfo.name}</h1>
            <p className="text-md" style={{ color: secondaryColor }}>{personalInfo.title}</p>
            {personalInfo.profilePicture && (
              <div className="mt-4 flex justify-center">
                <img-replace 
                  src={personalInfo.profilePicture} 
                  alt={`${personalInfo.name} profile`} 
                  className="w-24 h-24 rounded-full object-cover border-2" 
                  style={{ borderColor: primaryColor }}
                />
              </div>
            )}
          </header>

          <div className="flex flex-wrap justify-center text-xs space-x-4 mb-6" style={{ color: secondaryColor }}>
            {personalInfo.phone && <span className="whitespace-nowrap"><Phone className="inline h-3 w-3 mr-1" style={{ color: primaryColor }} />{personalInfo.phone}</span>}
            {personalInfo.email && <span className="whitespace-nowrap"><Mail className="inline h-3 w-3 mr-1" style={{ color: primaryColor }} />{personalInfo.email}</span>}
            {personalInfo.address && <span className="whitespace-nowrap"><MapPin className="inline h-3 w-3 mr-1" style={{ color: primaryColor }} />{personalInfo.address}</span>}
          </div>
          <div className="flex flex-wrap justify-center text-xs space-x-4 mb-6" style={{ color: secondaryColor }}>
            {personalInfo.linkedin && <a href={`https://${personalInfo.linkedin}`} target="_blank" rel="noopener noreferrer" className="hover:underline whitespace-nowrap"><Linkedin className="inline h-3 w-3 mr-1" style={{ color: primaryColor }} />LinkedIn</a>}
            {personalInfo.github && <a href={`https://${personalInfo.github}`} target="_blank" rel="noopener noreferrer" className="hover:underline whitespace-nowrap"><GitHub className="inline h-3 w-3 mr-1" style={{ color: primaryColor }} />GitHub</a>}
            {personalInfo.website && <a href={`https://${personalInfo.website}`} target="_blank" rel="noopener noreferrer" className="hover:underline whitespace-nowrap"><Globe className="inline h-3 w-3 mr-1" style={{ color: primaryColor }} />Website</a>}
          </div>

          {summary && (
            <Section title="Summary" icon={<User />}>
              <p>{summary}</p>
            </Section>
          )}

          {experience && experience.length > 0 && (
            <Section title="Experience" icon={<Briefcase />}>
              {experience.map(exp => (
                <div key={exp.id} className="mb-3">
                  <h3 className="font-semibold text-md" style={{ color: primaryColor }}>{exp.jobTitle}</h3>
                  <div className="flex justify-between text-xs">
                    <span className="font-medium" style={{ color: secondaryColor }}>{exp.company} | {exp.location}</span>
                    <span style={{ color: secondaryColor }}>{exp.startDate} - {exp.endDate || 'Present'}</span>
                  </div>
                  {exp.responsibilities && exp.responsibilities.length > 0 && (
                    <ul className="list-disc list-inside pl-4 mt-1 space-y-0.5">
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
                <div key={edu.id} className="mb-3">
                  <h3 className="font-semibold text-md" style={{ color: primaryColor }}>{edu.degree}</h3>
                  <div className="flex justify-between text-xs">
                    <span className="font-medium" style={{ color: secondaryColor }}>{edu.institution} | {edu.location}</span>
                    <span style={{ color: secondaryColor }}>{edu.graduationDate}</span>
                  </div>
                  {edu.details && <p className="text-xs mt-1">{edu.details}</p>}
                </div>
              ))}
            </Section>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            {skills && skills.length > 0 && (
              <Section title="Skills" icon={<Star />}>
                <p>{skills.map(skill => skill.name).join(', ')}</p>
              </Section>
            )}

            {projects && projects.length > 0 && (
              <Section title="Projects" icon={<FileText />}>
                {projects.map(proj => (
                  <div key={proj.id} className="mb-3">
                    <h3 className="font-semibold text-md" style={{ color: primaryColor }}>{proj.name}</h3>
                    {proj.link && <a href={`https://${proj.link}`} target="_blank" rel="noopener noreferrer" className="text-xs hover:underline" style={{ color: secondaryColor }}>{proj.link}</a>}
                    <p className="my-0.5">{proj.description}</p>
                    {proj.technologies && proj.technologies.length > 0 && (
                      <p className="text-xs"><span className="font-medium">Technologies:</span> {proj.technologies.join(', ')}</p>
                    )}
                  </div>
                ))}
              </Section>
            )}
          </div>
        </div>
      );
    };

    export default ClassicTemplate;
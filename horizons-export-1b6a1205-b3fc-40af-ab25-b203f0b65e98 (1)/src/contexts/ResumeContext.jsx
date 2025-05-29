import React, { createContext, useContext, useState, useEffect } from 'react';
    import { v4 as uuidv4 } from 'uuid'; // For unique IDs

    const ResumeContext = createContext();

    export const useResume = () => useContext(ResumeContext);

    const initialResumeData = {
      personalInfo: {
        name: 'Your Name',
        title: 'Your Title/Profession',
        phone: '123-456-7890',
        email: 'your.email@example.com',
        linkedin: 'linkedin.com/in/yourprofile',
        github: 'github.com/yourusername',
        website: 'yourwebsite.com',
        address: 'Your City, State',
        profilePicture: '', // URL or base64
      },
      summary: 'A brief summary about yourself, your skills, and career objectives. Keep it concise and impactful.',
      experience: [
        {
          id: uuidv4(),
          jobTitle: 'Software Engineer',
          company: 'Tech Solutions Inc.',
          location: 'San Francisco, CA',
          startDate: '2020-01',
          endDate: 'Present',
          responsibilities: ['Developed and maintained web applications.', 'Collaborated with cross-functional teams.', 'Implemented new features and fixed bugs.'],
        },
      ],
      education: [
        {
          id: uuidv4(),
          degree: 'B.S. in Computer Science',
          institution: 'University of Example',
          location: 'City, State',
          graduationDate: '2019-12',
          details: 'Relevant coursework: Data Structures, Algorithms, Web Development.',
        },
      ],
      skills: [
        { id: uuidv4(), name: 'JavaScript' },
        { id: uuidv4(), name: 'React' },
        { id: uuidv4(), name: 'Node.js' },
        { id: uuidv4(), name: 'TailwindCSS' },
      ],
      projects: [
        {
          id: uuidv4(),
          name: 'Personal Portfolio Website',
          description: 'Developed a responsive personal portfolio to showcase projects and skills.',
          link: 'yourportfolio.com',
          technologies: ['React', 'TailwindCSS', 'Framer Motion']
        }
      ],
      customSections: [], // For users to add their own sections
      settings: {
        template: 'modern', // 'modern', 'classic', 'creative'
        primaryColor: '#0ea5e9', // Default: Sky 500
        secondaryColor: '#f43f5e', // Default: Rose 500
        fontFamily: "'Inter', sans-serif", // Default font
      },
    };
    
    // Helper to get initial state from localStorage or use default
    const getInitialState = () => {
      try {
        const storedData = localStorage.getItem('resumeData');
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          // Ensure all sections exist, merge with initial if some are missing
          return {
            ...initialResumeData,
            ...parsedData,
            personalInfo: { ...initialResumeData.personalInfo, ...parsedData.personalInfo },
            experience: parsedData.experience || initialResumeData.experience,
            education: parsedData.education || initialResumeData.education,
            skills: parsedData.skills || initialResumeData.skills,
            projects: parsedData.projects || initialResumeData.projects,
            customSections: parsedData.customSections || initialResumeData.customSections,
            settings: { ...initialResumeData.settings, ...parsedData.settings },
          };
        }
      } catch (error) {
        console.error("Failed to parse resume data from localStorage", error);
      }
      return initialResumeData;
    };


    export const ResumeProvider = ({ children }) => {
      const [resumeData, setResumeData] = useState(getInitialState);

      useEffect(() => {
        try {
          localStorage.setItem('resumeData', JSON.stringify(resumeData));
        } catch (error) {
          console.error("Failed to save resume data to localStorage", error);
        }
      }, [resumeData]);

      const updatePersonalInfo = (field, value) => {
        setResumeData((prev) => ({
          ...prev,
          personalInfo: { ...prev.personalInfo, [field]: value },
        }));
      };

      const updateSummary = (value) => {
        setResumeData((prev) => ({ ...prev, summary: value }));
      };
      
      const addListItem = (section) => {
        const newItem = section === 'experience' 
          ? { id: uuidv4(), jobTitle: '', company: '', location: '', startDate: '', endDate: '', responsibilities: [''] }
          : section === 'education'
          ? { id: uuidv4(), degree: '', institution: '', location: '', graduationDate: '', details: '' }
          : section === 'skills'
          ? { id: uuidv4(), name: '' }
          : section === 'projects'
          ? { id: uuidv4(), name: '', description: '', link: '', technologies: [''] }
          : { id: uuidv4(), title: 'New Section', content: '' }; // For custom sections
        
        setResumeData(prev => ({
          ...prev,
          [section]: [...prev[section], newItem]
        }));
      };

      const updateListItem = (section, id, field, value) => {
        setResumeData(prev => ({
          ...prev,
          [section]: prev[section].map(item => 
            item.id === id ? { ...item, [field]: value } : item
          )
        }));
      };
      
      const updateListItemSubField = (section, id, subField, index, value) => {
        setResumeData(prev => ({
          ...prev,
          [section]: prev[section].map(item => {
            if (item.id === id) {
              const updatedSubArray = [...item[subField]];
              updatedSubArray[index] = value;
              return { ...item, [subField]: updatedSubArray };
            }
            return item;
          })
        }));
      };

      const addListItemSubFieldEntry = (section, id, subField) => {
        setResumeData(prev => ({
          ...prev,
          [section]: prev[section].map(item => {
            if (item.id === id) {
              return { ...item, [subField]: [...item[subField], ''] };
            }
            return item;
          })
        }));
      };
      
      const removeListItemSubFieldEntry = (section, id, subField, index) => {
        setResumeData(prev => ({
          ...prev,
          [section]: prev[section].map(item => {
            if (item.id === id) {
              const updatedSubArray = item[subField].filter((_, i) => i !== index);
              return { ...item, [subField]: updatedSubArray };
            }
            return item;
          })
        }));
      };


      const removeListItem = (section, id) => {
        setResumeData(prev => ({
          ...prev,
          [section]: prev[section].filter(item => item.id !== id)
        }));
      };

      const updateSettings = (field, value) => {
        setResumeData((prev) => ({
          ...prev,
          settings: { ...prev.settings, [field]: value },
        }));
      };
      
      const resetResume = () => {
        setResumeData(initialResumeData);
        localStorage.removeItem('resumeData');
      };

      const value = {
        resumeData,
        updatePersonalInfo,
        updateSummary,
        addListItem,
        updateListItem,
        updateListItemSubField,
        addListItemSubFieldEntry,
        removeListItemSubFieldEntry,
        removeListItem,
        updateSettings,
        resetResume,
        initialResumeData // expose initial data for reset or comparison
      };

      return <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>;
    };
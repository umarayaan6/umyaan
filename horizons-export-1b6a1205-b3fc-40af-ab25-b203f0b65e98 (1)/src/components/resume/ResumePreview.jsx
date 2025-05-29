import React from 'react';
    import { useResume } from '@/contexts/ResumeContext';
    import ModernTemplate from '@/components/resume/templates/ModernTemplate';
    import ClassicTemplate from '@/components/resume/templates/ClassicTemplate';
    import CreativeTemplate from '@/components/resume/templates/CreativeTemplate';
    import { AnimatePresence, motion } from 'framer-motion';

    const ResumePreview = () => {
      const { resumeData } = useResume();
      const { settings } = resumeData;

      const SelectedTemplate = () => {
        switch (settings.template) {
          case 'classic':
            return <ClassicTemplate data={resumeData} />;
          case 'creative':
            return <CreativeTemplate data={resumeData} />;
          case 'modern':
          default:
            return <ModernTemplate data={resumeData} />;
        }
      };
      
      const cssVariables = {
        '--resume-primary-color': settings.primaryColor,
        '--resume-secondary-color': settings.secondaryColor,
        'fontFamily': settings.fontFamily,
      };

      return (
        <div id="resume-preview-content-wrapper" className="h-full w-full overflow-auto bg-gray-100 p-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={settings.template}
              id="resume-preview-content"
              className="bg-white shadow-lg w-full h-full"
              style={cssVariables}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <SelectedTemplate />
            </motion.div>
          </AnimatePresence>
        </div>
      );
    };

    export default ResumePreview;
import React from 'react';
    import { motion } from 'framer-motion';
    import ResumeEditor from '@/components/resume/ResumeEditor';
    import ResumePreview from '@/components/resume/ResumePreview';
    import { Card, CardContent } from '@/components/ui/card';

    const HomePage = () => {
      return (
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Card className="shadow-xl bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <ResumeEditor />
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div 
            className="sticky top-24" // Make preview sticky on larger screens
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          >
             <Card className="shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
              <CardContent className="p-2 sm:p-4">
                <div className="resume-preview-container bg-white">
                  <ResumePreview />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      );
    };

    export default HomePage;
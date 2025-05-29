import React from 'react';
    import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
    import { Toaster } from '@/components/ui/toaster';
    import Layout from '@/components/Layout';
    import HomePage from '@/pages/HomePage';
    import { ResumeProvider } from '@/contexts/ResumeContext';

    function App() {
      return (
        <ResumeProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
              </Routes>
            </Layout>
            <Toaster />
          </Router>
        </ResumeProvider>
      );
    }

    export default App;
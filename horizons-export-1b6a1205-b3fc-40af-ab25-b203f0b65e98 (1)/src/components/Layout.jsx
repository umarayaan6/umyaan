import React from 'react';
    import { Link } from 'react-router-dom';
    import { motion } from 'framer-motion';
    import { FileText } from 'lucide-react';

    const Layout = ({ children }) => {
      return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-sky-100 via-rose-50 to-emerald-100">
          <motion.header 
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md shadow-sm"
          >
            <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
              <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-primary hover:text-primary/90 transition-colors">
                <FileText className="h-8 w-8" />
                <span>ResumeCraft</span>
              </Link>
              <nav className="flex items-center space-x-4">
                {/* Future navigation links can go here */}
              </nav>
            </div>
          </motion.header>
          
          <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            >
              {children}
            </motion.div>
          </main>

          <motion.footer 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="py-6 text-center bg-background/80 backdrop-blur-md border-t"
          >
            <div className="container mx-auto">
              <p className="text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} ResumeCraft. Built with 💖 by Hostinger Horizons.
              </p>
            </div>
          </motion.footer>
        </div>
      );
    };

    export default Layout;
import React, { useState } from 'react';
    import { motion, AnimatePresence } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
    import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Textarea } from '@/components/ui/textarea';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
    import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
    import { useToast } from '@/components/ui/use-toast';
    import { useResume } from '@/contexts/ResumeContext';
    import { User, Briefcase, GraduationCap, Star, Settings, Palette, Download, Trash2, PlusCircle, MinusCircle, FileText, Image as ImageIcon } from 'lucide-react';
    import jsPDF from 'jspdf';
    import html2canvas from 'html2canvas';

    const SectionWrapper = ({ title, icon, children }) => (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <Card className="overflow-hidden shadow-lg border border-primary/20 bg-gradient-to-br from-sky-50 via-white to-rose-50">
          <CardHeader className="bg-primary/10 p-4 border-b border-primary/20">
            <CardTitle className="text-xl font-semibold text-primary flex items-center">
              {React.cloneElement(icon, { className: "mr-3 h-6 w-6" })}
              {title}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {children}
          </CardContent>
        </Card>
      </motion.div>
    );
    
    const ArrayField = ({ items, sectionKey, updateItem, removeItem, addItem, fieldsConfig, itemTitleField, subFieldConfig }) => {
      const { updateListItemSubField, addListItemSubFieldEntry, removeListItemSubFieldEntry } = useResume();
    
      return (
        <div className="space-y-4">
          {items.map((item, index) => (
            <Card key={item.id} className="p-4 bg-white/50 border border-primary/10 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium text-primary">{item[itemTitleField] || `Item ${index + 1}`}</h4>
                <Button variant="ghost" size="icon" onClick={() => removeItem(sectionKey, item.id)} className="text-destructive hover:text-destructive/80">
                  <MinusCircle className="h-5 w-5" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fieldsConfig.map(field => (
                  <div key={field.name} className={field.fullWidth ? "md:col-span-2" : ""}>
                    <Label htmlFor={`${sectionKey}-${item.id}-${field.name}`} className="text-sm font-medium text-gray-700">{field.label}</Label>
                    {field.type === 'textarea' ? (
                      <Textarea
                        id={`${sectionKey}-${item.id}-${field.name}`}
                        value={item[field.name]}
                        onChange={(e) => updateItem(sectionKey, item.id, field.name, e.target.value)}
                        placeholder={field.placeholder}
                        className="mt-1"
                      />
                    ) : (
                      <Input
                        id={`${sectionKey}-${item.id}-${field.name}`}
                        type={field.type || 'text'}
                        value={item[field.name]}
                        onChange={(e) => updateItem(sectionKey, item.id, field.name, e.target.value)}
                        placeholder={field.placeholder}
                        className="mt-1"
                      />
                    )}
                  </div>
                ))}
              </div>
              {subFieldConfig && item[subFieldConfig.key] && (
                <div className="mt-4">
                  <Label className="text-sm font-medium text-gray-700">{subFieldConfig.label}</Label>
                  {item[subFieldConfig.key].map((subItem, subIndex) => (
                    <div key={subIndex} className="flex items-center gap-2 mt-1">
                      <Input
                        type="text"
                        value={subItem}
                        onChange={(e) => updateListItemSubField(sectionKey, item.id, subFieldConfig.key, subIndex, e.target.value)}
                        placeholder={subFieldConfig.placeholder}
                        className="flex-grow"
                      />
                      <Button variant="ghost" size="icon" onClick={() => removeListItemSubFieldEntry(sectionKey, item.id, subFieldConfig.key, subIndex)} className="text-destructive hover:text-destructive/80">
                        <MinusCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={() => addListItemSubFieldEntry(sectionKey, item.id, subFieldConfig.key)} className="mt-2 text-primary border-primary hover:bg-primary/10">
                    <PlusCircle className="h-4 w-4 mr-2" /> Add {subFieldConfig.entryName || 'Entry'}
                  </Button>
                </div>
              )}
            </Card>
          ))}
          <Button variant="outline" onClick={() => addItem(sectionKey)} className="w-full text-primary border-primary hover:bg-primary/10">
            <PlusCircle className="h-5 w-5 mr-2" /> Add {sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1, -1)}
          </Button>
        </div>
      );
    };
    

    const ResumeEditor = () => {
      const { resumeData, updatePersonalInfo, updateSummary, addListItem, updateListItem, removeListItem, updateSettings, resetResume } = useResume();
      const { toast } = useToast();
      const [activeTab, setActiveTab] = useState("personal");

      const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
          if (file.size > 2 * 1024 * 1024) { // 2MB limit
            toast({
              title: "Image too large",
              description: "Please upload an image smaller than 2MB.",
              variant: "destructive",
            });
            return;
          }
          const reader = new FileReader();
          reader.onloadend = () => {
            updatePersonalInfo('profilePicture', reader.result);
            toast({ title: "Profile picture updated!", description: "Looking good! ✨" });
          };
          reader.readAsDataURL(file);
        }
      };

      const exportToPDF = () => {
        toast({ title: "Generating PDF...", description: "Please wait a moment. 📄" });
        const resumePreviewElement = document.getElementById('resume-preview-content');
        if (!resumePreviewElement) {
          toast({ title: "Error", description: "Resume preview element not found.", variant: "destructive" });
          return;
        }
      
        // Temporarily increase scale for better quality, then revert
        const originalTransform = resumePreviewElement.style.transform;
        resumePreviewElement.style.transform = 'scale(2)'; // Scale up for higher resolution capture
      
        html2canvas(resumePreviewElement, { 
          scale: 2, // Capture at higher resolution
          useCORS: true, // For external images if any
          logging: true,
          onclone: (document) => {
            // This is where you might need to re-apply styles if they are dynamic or complex
            // For example, if using web fonts that might not render immediately
            const clonedPreview = document.getElementById('resume-preview-content');
            if (clonedPreview) {
              clonedPreview.style.transform = 'scale(2)'; // Ensure scale is applied in cloned document
            }
          }
        }).then(canvas => {
          resumePreviewElement.style.transform = originalTransform; // Revert scale
          const imgData = canvas.toDataURL('image/png', 1.0); // Use PNG for better quality
          const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
          });
      
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();
          const canvasWidth = canvas.width;
          const canvasHeight = canvas.height;
          const ratio = canvasWidth / canvasHeight;
      
          let imgWidth = pdfWidth;
          let imgHeight = pdfWidth / ratio;
      
          // If image height is greater than pdf height, scale by height instead
          if (imgHeight > pdfHeight) {
            imgHeight = pdfHeight;
            imgWidth = pdfHeight * ratio;
          }
      
          const x = (pdfWidth - imgWidth) / 2; // Center image
          const y = 0; // Start from top
      
          pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
          pdf.save(`${resumeData.personalInfo.name.replace(/\s+/g, '_') || 'resume'}_${resumeData.settings.template}.pdf`);
          toast({ title: "PDF Exported!", description: "Your resume is ready. 🎉" });
        }).catch(err => {
          resumePreviewElement.style.transform = originalTransform; // Revert scale on error
          console.error("Error generating PDF:", err);
          toast({ title: "PDF Export Failed", description: "Something went wrong. Please try again.", variant: "destructive" });
        });
      };
      

      const colorOptions = [
        { name: 'Sky', value: '#0ea5e9' }, { name: 'Rose', value: '#f43f5e' }, { name: 'Emerald', value: '#10b981' },
        { name: 'Indigo', value: '#6366f1' }, { name: 'Amber', value: '#f59e0b' }, { name: 'Violet', value: '#8b5cf6' },
        { name: 'Teal', value: '#14b8a6' }, { name: 'Slate Gray', value: '#64748b' }
      ];

      const fontOptions = [
        { name: 'Inter', value: "'Inter', sans-serif" },
        { name: 'Roboto', value: "'Roboto', sans-serif" },
        { name: 'Lato', value: "'Lato', sans-serif" },
        { name: 'Montserrat', value: "'Montserrat', sans-serif" },
        { name: 'Open Sans', value: "'Open Sans', sans-serif" },
        { name: 'Merriweather', value: "'Merriweather', serif" },
      ];

      const experienceFields = [
        { name: 'jobTitle', label: 'Job Title', placeholder: 'e.g., Senior Developer' },
        { name: 'company', label: 'Company', placeholder: 'e.g., Google' },
        { name: 'location', label: 'Location', placeholder: 'e.g., Mountain View, CA' },
        { name: 'startDate', label: 'Start Date', type: 'month', placeholder: 'YYYY-MM' },
        { name: 'endDate', label: 'End Date', type: 'month', placeholder: 'YYYY-MM or Present' },
      ];
      const experienceSubFieldConfig = { key: 'responsibilities', label: 'Responsibilities', placeholder: 'e.g., Developed new features', entryName: 'Responsibility' };


      const educationFields = [
        { name: 'degree', label: 'Degree/Certificate', placeholder: 'e.g., B.S. in Computer Science' },
        { name: 'institution', label: 'Institution', placeholder: 'e.g., Stanford University' },
        { name: 'location', label: 'Location', placeholder: 'e.g., Stanford, CA' },
        { name: 'graduationDate', label: 'Graduation Date', type: 'month', placeholder: 'YYYY-MM' },
        { name: 'details', label: 'Details/GPA (Optional)', type: 'textarea', placeholder: 'e.g., Relevant coursework, GPA: 3.8/4.0', fullWidth: true },
      ];

      const skillFields = [
        { name: 'name', label: 'Skill Name', placeholder: 'e.g., Python' },
      ];

      const projectFields = [
        { name: 'name', label: 'Project Name', placeholder: 'e.g., E-commerce Platform' },
        { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Briefly describe the project', fullWidth: true },
        { name: 'link', label: 'Project Link (Optional)', placeholder: 'e.g., github.com/user/project' },
      ];
      const projectSubFieldConfig = { key: 'technologies', label: 'Technologies Used', placeholder: 'e.g., React', entryName: 'Technology' };


      return (
        <div className="space-y-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 gap-2 bg-primary/5 p-1 rounded-lg">
              <TabsTrigger value="personal" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><User className="h-4 w-4 mr-2 inline-block"/>Personal</TabsTrigger>
              <TabsTrigger value="experience" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><Briefcase className="h-4 w-4 mr-2 inline-block"/>Experience</TabsTrigger>
              <TabsTrigger value="education" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><GraduationCap className="h-4 w-4 mr-2 inline-block"/>Education</TabsTrigger>
              <TabsTrigger value="skills" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><Star className="h-4 w-4 mr-2 inline-block"/>Skills</TabsTrigger>
              <TabsTrigger value="projects" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><FileText className="h-4 w-4 mr-2 inline-block"/>Projects</TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="mt-6"
              >
                <TabsContent value="personal">
                  <SectionWrapper title="Personal Information" icon={<User />}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" value={resumeData.personalInfo.name} onChange={(e) => updatePersonalInfo('name', e.target.value)} placeholder="e.g., Jane Doe" />
                      </div>
                      <div>
                        <Label htmlFor="title">Title/Profession</Label>
                        <Input id="title" value={resumeData.personalInfo.title} onChange={(e) => updatePersonalInfo('title', e.target.value)} placeholder="e.g., Software Engineer" />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" type="tel" value={resumeData.personalInfo.phone} onChange={(e) => updatePersonalInfo('phone', e.target.value)} placeholder="e.g., (123) 456-7890" />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={resumeData.personalInfo.email} onChange={(e) => updatePersonalInfo('email', e.target.value)} placeholder="e.g., jane.doe@example.com" />
                      </div>
                      <div>
                        <Label htmlFor="linkedin">LinkedIn Profile URL</Label>
                        <Input id="linkedin" value={resumeData.personalInfo.linkedin} onChange={(e) => updatePersonalInfo('linkedin', e.target.value)} placeholder="e.g., linkedin.com/in/janedoe" />
                      </div>
                       <div>
                        <Label htmlFor="github">GitHub Profile URL</Label>
                        <Input id="github" value={resumeData.personalInfo.github} onChange={(e) => updatePersonalInfo('github', e.target.value)} placeholder="e.g., github.com/janedoe" />
                      </div>
                      <div>
                        <Label htmlFor="website">Personal Website/Portfolio</Label>
                        <Input id="website" value={resumeData.personalInfo.website} onChange={(e) => updatePersonalInfo('website', e.target.value)} placeholder="e.g., janedoe.com" />
                      </div>
                      <div>
                        <Label htmlFor="address">Address</Label>
                        <Input id="address" value={resumeData.personalInfo.address} onChange={(e) => updatePersonalInfo('address', e.target.value)} placeholder="e.g., City, State" />
                      </div>
                       <div className="md:col-span-2">
                        <Label htmlFor="profilePicture">Profile Picture</Label>
                        <div className="flex items-center gap-4 mt-1">
                          {resumeData.personalInfo.profilePicture && (
                            <img-replace src={resumeData.personalInfo.profilePicture} alt="Profile Preview" className="h-16 w-16 rounded-full object-cover border-2 border-primary" />
                          )}
                          <Input id="profilePicture" type="file" accept="image/*" onChange={handleProfilePictureChange} className="flex-grow" />
                          {resumeData.personalInfo.profilePicture && (
                            <Button variant="ghost" size="icon" onClick={() => updatePersonalInfo('profilePicture', '')} className="text-destructive">
                              <Trash2 className="h-5 w-5" />
                            </Button>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Recommended: Square image, &lt;2MB.</p>
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="summary">Summary/Objective</Label>
                        <Textarea id="summary" value={resumeData.summary} onChange={(e) => updateSummary(e.target.value)} placeholder="A brief professional summary..." rows={4} />
                      </div>
                    </div>
                  </SectionWrapper>
                </TabsContent>

                <TabsContent value="experience">
                  <SectionWrapper title="Work Experience" icon={<Briefcase />}>
                    <ArrayField 
                      items={resumeData.experience} 
                      sectionKey="experience" 
                      updateItem={updateListItem} 
                      removeItem={removeListItem} 
                      addItem={addListItem}
                      fieldsConfig={experienceFields}
                      itemTitleField="jobTitle"
                      subFieldConfig={experienceSubFieldConfig}
                    />
                  </SectionWrapper>
                </TabsContent>

                <TabsContent value="education">
                  <SectionWrapper title="Education" icon={<GraduationCap />}>
                     <ArrayField 
                      items={resumeData.education} 
                      sectionKey="education" 
                      updateItem={updateListItem} 
                      removeItem={removeListItem} 
                      addItem={addListItem}
                      fieldsConfig={educationFields}
                      itemTitleField="degree"
                    />
                  </SectionWrapper>
                </TabsContent>

                <TabsContent value="skills">
                  <SectionWrapper title="Skills" icon={<Star />}>
                    <ArrayField 
                      items={resumeData.skills} 
                      sectionKey="skills" 
                      updateItem={updateListItem} 
                      removeItem={removeListItem} 
                      addItem={addListItem}
                      fieldsConfig={skillFields}
                      itemTitleField="name"
                    />
                  </SectionWrapper>
                </TabsContent>
                
                <TabsContent value="projects">
                  <SectionWrapper title="Projects" icon={<FileText />}>
                    <ArrayField 
                      items={resumeData.projects} 
                      sectionKey="projects" 
                      updateItem={updateListItem} 
                      removeItem={removeListItem} 
                      addItem={addListItem}
                      fieldsConfig={projectFields}
                      itemTitleField="name"
                      subFieldConfig={projectSubFieldConfig}
                    />
                  </SectionWrapper>
                </TabsContent>

              </motion.div>
            </AnimatePresence>
          </Tabs>

          <SectionWrapper title="Appearance & Settings" icon={<Settings />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="template">Resume Template</Label>
                <Select value={resumeData.settings.template} onValueChange={(value) => updateSettings('template', value)}>
                  <SelectTrigger id="template">
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="modern">Modern</SelectItem>
                    <SelectItem value="classic">Classic</SelectItem>
                    <SelectItem value="creative">Creative</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="fontFamily">Font Family</Label>
                <Select value={resumeData.settings.fontFamily} onValueChange={(value) => updateSettings('fontFamily', value)}>
                  <SelectTrigger id="fontFamily">
                    <SelectValue placeholder="Select font" />
                  </SelectTrigger>
                  <SelectContent>
                    {fontOptions.map(font => (
                      <SelectItem key={font.value} value={font.value} style={{ fontFamily: font.value }}>{font.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Primary Color</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: resumeData.settings.primaryColor }} />
                      {colorOptions.find(c => c.value === resumeData.settings.primaryColor)?.name || resumeData.settings.primaryColor}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <div className="grid grid-cols-4 gap-2 p-4">
                      {colorOptions.map(color => (
                        <Button key={color.value} variant="outline" size="icon" onClick={() => updateSettings('primaryColor', color.value)} className={`border-2 ${resumeData.settings.primaryColor === color.value ? 'border-ring' : 'border-transparent'}`}>
                          <div className="w-6 h-6 rounded-full" style={{ backgroundColor: color.value }} />
                        </Button>
                      ))}
                       <Input type="color" value={resumeData.settings.primaryColor} onChange={(e) => updateSettings('primaryColor', e.target.value)} className="col-span-4 h-10 p-1" />
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label>Secondary/Accent Color</Label>
                 <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: resumeData.settings.secondaryColor }} />
                      {colorOptions.find(c => c.value === resumeData.settings.secondaryColor)?.name || resumeData.settings.secondaryColor}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <div className="grid grid-cols-4 gap-2 p-4">
                      {colorOptions.map(color => (
                        <Button key={color.value} variant="outline" size="icon" onClick={() => updateSettings('secondaryColor', color.value)} className={`border-2 ${resumeData.settings.secondaryColor === color.value ? 'border-ring' : 'border-transparent'}`}>
                          <div className="w-6 h-6 rounded-full" style={{ backgroundColor: color.value }} />
                        </Button>
                      ))}
                      <Input type="color" value={resumeData.settings.secondaryColor} onChange={(e) => updateSettings('secondaryColor', e.target.value)} className="col-span-4 h-10 p-1" />
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </SectionWrapper>

          <Card className="shadow-lg border border-primary/20 bg-gradient-to-br from-sky-50 via-white to-rose-50">
            <CardHeader className="bg-primary/10 p-4 border-b border-primary/20">
              <CardTitle className="text-xl font-semibold text-primary flex items-center">
                <Download className="mr-3 h-6 w-6" />
                Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={exportToPDF} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white">
                  <Download className="mr-2 h-5 w-5" /> Export to PDF
                </Button>
                <Button variant="destructive" onClick={() => {
                  if (window.confirm("Are you sure you want to reset all resume data? This cannot be undone.")) {
                    resetResume();
                    toast({ title: "Resume Reset", description: "All data has been cleared." });
                  }
                }} className="flex-1">
                  <Trash2 className="mr-2 h-5 w-5" /> Reset All Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    };

    export default ResumeEditor;
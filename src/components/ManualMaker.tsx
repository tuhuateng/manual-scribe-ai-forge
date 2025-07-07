import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, Globe, Wand2 } from 'lucide-react';
import { marked } from 'marked';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ManualMaker = () => {
  const [content, setContent] = useState('# Welcome to Manual Maker\n\nStart creating your documentation here...\n\n## Features\n\n- AI-powered content generation\n- Real-time translation\n- Live preview\n- PDF export\n\n## Getting Started\n\n1. Write your content in the AI textbox\n2. Use the translator for multi-language support\n3. Preview your manual in real-time\n4. Export to PDF when ready');
  const [translatedContent, setTranslatedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);

  const generateContent = async () => {
    setIsGenerating(true);
    // Simulate AI content generation
    setTimeout(() => {
      const sampleContent = `# ${new Date().toLocaleDateString()} Manual

## Overview
This manual provides comprehensive guidance for your project.

## Key Sections

### 1. Introduction
Welcome to this comprehensive manual created with AI assistance.

### 2. Getting Started
Follow these steps to begin:
- Review the requirements
- Set up your environment
- Configure the necessary settings

### 3. Best Practices
- Always follow the established guidelines
- Test your implementations thoroughly
- Document your changes

### 4. Troubleshooting
Common issues and their solutions will be listed here.

## Conclusion
This manual serves as your complete reference guide.`;
      
      setContent(sampleContent);
      setIsGenerating(false);
    }, 2000);
  };

  const translateContent = async () => {
    setIsTranslating(true);
    // Simulate translation
    setTimeout(() => {
      const translatedSample = `# Manual del ${new Date().toLocaleDateString()}

## Descripción General
Este manual proporciona una guía completa para su proyecto.

## Secciones Clave

### 1. Introducción
Bienvenido a este manual completo creado con asistencia de IA.

### 2. Comenzando
Siga estos pasos para comenzar:
- Revise los requisitos
- Configure su entorno
- Configure los ajustes necesarios

### 3. Mejores Prácticas
- Siempre siga las pautas establecidas
- Pruebe sus implementaciones a fondo
- Documente sus cambios

### 4. Solución de Problemas
Los problemas comunes y sus soluciones se enumerarán aquí.

## Conclusión
Este manual sirve como su guía de referencia completa.`;
      
      setTranslatedContent(translatedSample);
      setIsTranslating(false);
    }, 1500);
  };

  const exportToPDF = async () => {
    const element = document.getElementById('preview-content');
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('manual.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const currentContent = translatedContent || content;
  
  const htmlContent = useMemo(() => {
    try {
      return marked(currentContent, { async: false }) as string;
    } catch (error) {
      console.error('Error parsing markdown:', error);
      return '<p>Error parsing markdown content</p>';
    }
  }, [currentContent]);

  return (
    <div className="min-h-screen bg-gradient-surface">
      {/* Header */}
      <header className="bg-card border-b border-material-outline shadow-material-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Manual Maker</h1>
                <p className="text-sm text-muted-foreground">AI-Powered Documentation Tool</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-material-surface">
                Material Design
              </Badge>
              <Button 
                onClick={exportToPDF}
                variant="material"
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                Export PDF
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
          
          {/* AI Textbox Area */}
          <Card className="lg:col-span-1 shadow-material-md border-material-outline">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Wand2 className="w-5 h-5 text-primary" />
                AI Content Generator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button 
                  onClick={generateContent}
                  disabled={isGenerating}
                  className="flex-1"
                  size="sm"
                >
                  {isGenerating ? 'Generating...' : 'Generate Content'}
                </Button>
              </div>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your manual content here or use AI generation..."
                className="min-h-[400px] resize-none border-material-outline focus:ring-primary"
              />
            </CardContent>
          </Card>

          {/* AI Translator Area */}
          <Card className="lg:col-span-1 shadow-material-md border-material-outline">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Globe className="w-5 h-5 text-primary" />
                AI Translator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button 
                  onClick={translateContent}
                  disabled={isTranslating}
                  variant="outline"
                  className="flex-1"
                  size="sm"
                >
                  {isTranslating ? 'Translating...' : 'Translate to Spanish'}
                </Button>
                <Button 
                  onClick={() => setTranslatedContent('')}
                  variant="ghost"
                  size="sm"
                >
                  Clear
                </Button>
              </div>
              <Textarea
                value={translatedContent}
                onChange={(e) => setTranslatedContent(e.target.value)}
                placeholder="Translated content will appear here..."
                className="min-h-[400px] resize-none border-material-outline focus:ring-primary"
              />
            </CardContent>
          </Card>

          {/* Preview Area */}
          <Card className="lg:col-span-1 shadow-material-md border-material-outline">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="w-5 h-5 text-primary" />
                Live Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div 
                id="preview-content"
                className="prose prose-sm max-w-none p-6 h-[460px] overflow-y-auto bg-card"
                dangerouslySetInnerHTML={{ 
                  __html: htmlContent 
                }}
              />
            </CardContent>
          </Card>
        </div>

        {/* Bottom Info Bar */}
        <div className="mt-6 flex items-center justify-between text-sm text-muted-foreground bg-card rounded-lg p-4 shadow-material-sm border border-material-outline">
          <div className="flex items-center gap-4">
            <span>Characters: {currentContent.length}</span>
            <span>Words: {currentContent.split(/\s+/).filter(word => word.length > 0).length}</span>
            <span>Lines: {currentContent.split('\n').length}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Ready to export</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManualMaker;
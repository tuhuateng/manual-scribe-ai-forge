import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, Globe, Wand2, Bold, Italic, Code, Link, List, Hash, Pen, Eraser, Palette } from 'lucide-react';
import { marked } from 'marked';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ManualMaker = () => {
  const [content, setContent] = useState('# Welcome to Manual Maker\n\nStart creating your documentation here...\n\n## Features\n\n- AI-powered content generation\n- Real-time translation\n- Live preview\n- PDF export\n\n## Getting Started\n\n1. Write your content in the AI textbox\n2. Use the translator for multi-language support\n3. Preview your manual in real-time\n4. Export to PDF when ready');
  const [translations, setTranslations] = useState({
    spanish: '',
    french: '',
    german: '',
    italian: '',
    portuguese: '',
    chinese: '',
    japanese: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  
  // Drawing area state
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingMode, setDrawingMode] = useState<'pen' | 'eraser'>('pen');
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(2);

  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = document.getElementById('markdown-editor') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const replacement = before + selectedText + after;
    
    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);
    
    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 0);
  };

  const formatBold = () => insertMarkdown('**', '**');
  const formatItalic = () => insertMarkdown('*', '*');
  const formatCode = () => insertMarkdown('`', '`');
  const formatLink = () => insertMarkdown('[', '](url)');
  const formatList = () => insertMarkdown('- ');
  const formatHeading = () => insertMarkdown('# ');

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
    // Simulate translation for all languages
    setTimeout(() => {
      setTranslations({
        spanish: '# Manual en Español\n\nContenido traducido al español...',
        french: '# Manuel en Français\n\nContenu traduit en français...',
        german: '# Handbuch auf Deutsch\n\nAuf Deutsch übersetzter Inhalt...',
        italian: '# Manuale in Italiano\n\nContenuto tradotto in italiano...',
        portuguese: '# Manual em Português\n\nConteúdo traduzido para português...',
        chinese: '# 中文手册\n\n翻译成中文的内容...',
        japanese: '# 日本語マニュアル\n\n日本語に翻訳された内容...'
      });
      setIsTranslating(false);
    }, 1500);
  };

  const clearTranslations = () => {
    setTranslations({
      spanish: '',
      french: '',
      german: '',
      italian: '',
      portuguese: '',
      chinese: '',
      japanese: ''
    });
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

  // Drawing functions
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineWidth = strokeWidth;
      ctx.lineCap = 'round';
      
      if (drawingMode === 'pen') {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = strokeColor;
      } else {
        ctx.globalCompositeOperation = 'destination-out';
      }
      
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const saveDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = 'manual-drawing.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const htmlContent = useMemo(() => {
    try {
      return marked(content, { async: false }) as string;
    } catch (error) {
      console.error('Error parsing markdown:', error);
      return '<p>Error parsing markdown content</p>';
    }
  }, [content]);

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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[calc(100vh-12rem)]">
          
          {/* Markdown Editor Area */}
          <Card className="md:col-span-1 shadow-material-md border-material-outline">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Wand2 className="w-5 h-5 text-primary" />
                Markdown Editor
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
              
              {/* Markdown Toolbar */}
              <div className="flex flex-wrap gap-1 p-2 bg-material-surface rounded-md border border-material-outline">
                <Button variant="ghost" size="sm" onClick={formatBold} title="Bold">
                  <Bold className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={formatItalic} title="Italic">
                  <Italic className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={formatCode} title="Code">
                  <Code className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={formatLink} title="Link">
                  <Link className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={formatList} title="List">
                  <List className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={formatHeading} title="Heading">
                  <Hash className="w-4 h-4" />
                </Button>
              </div>

              <Textarea
                id="markdown-editor"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="# Write your markdown content here\n\nUse the toolbar above for formatting or type markdown directly..."
                className="min-h-[350px] resize-none border-material-outline focus:ring-primary font-mono text-sm"
              />
            </CardContent>
          </Card>

          {/* AI Translator Area */}
          <Card className="md:col-span-1 shadow-material-md border-material-outline">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Globe className="w-5 h-5 text-primary" />
                AI Translator (7 Languages)
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
                  {isTranslating ? 'Translating...' : 'Translate All'}
                </Button>
                <Button 
                  onClick={clearTranslations}
                  variant="ghost"
                  size="sm"
                >
                  Clear
                </Button>
              </div>
              <Tabs defaultValue="spanish" className="w-full">
                <TabsList className="grid w-full grid-cols-7 text-xs">
                  <TabsTrigger value="spanish">ES</TabsTrigger>
                  <TabsTrigger value="french">FR</TabsTrigger>
                  <TabsTrigger value="german">DE</TabsTrigger>
                  <TabsTrigger value="italian">IT</TabsTrigger>
                  <TabsTrigger value="portuguese">PT</TabsTrigger>
                  <TabsTrigger value="chinese">中文</TabsTrigger>
                  <TabsTrigger value="japanese">日本語</TabsTrigger>
                </TabsList>
                <TabsContent value="spanish">
                  <Textarea
                    value={translations.spanish}
                    onChange={(e) => setTranslations(prev => ({ ...prev, spanish: e.target.value }))}
                    placeholder="Spanish translation..."
                    className="min-h-[350px] resize-none border-material-outline focus:ring-primary"
                  />
                </TabsContent>
                <TabsContent value="french">
                  <Textarea
                    value={translations.french}
                    onChange={(e) => setTranslations(prev => ({ ...prev, french: e.target.value }))}
                    placeholder="French translation..."
                    className="min-h-[350px] resize-none border-material-outline focus:ring-primary"
                  />
                </TabsContent>
                <TabsContent value="german">
                  <Textarea
                    value={translations.german}
                    onChange={(e) => setTranslations(prev => ({ ...prev, german: e.target.value }))}
                    placeholder="German translation..."
                    className="min-h-[350px] resize-none border-material-outline focus:ring-primary"
                  />
                </TabsContent>
                <TabsContent value="italian">
                  <Textarea
                    value={translations.italian}
                    onChange={(e) => setTranslations(prev => ({ ...prev, italian: e.target.value }))}
                    placeholder="Italian translation..."
                    className="min-h-[350px] resize-none border-material-outline focus:ring-primary"
                  />
                </TabsContent>
                <TabsContent value="portuguese">
                  <Textarea
                    value={translations.portuguese}
                    onChange={(e) => setTranslations(prev => ({ ...prev, portuguese: e.target.value }))}
                    placeholder="Portuguese translation..."
                    className="min-h-[350px] resize-none border-material-outline focus:ring-primary"
                  />
                </TabsContent>
                <TabsContent value="chinese">
                  <Textarea
                    value={translations.chinese}
                    onChange={(e) => setTranslations(prev => ({ ...prev, chinese: e.target.value }))}
                    placeholder="Chinese translation..."
                    className="min-h-[350px] resize-none border-material-outline focus:ring-primary"
                  />
                </TabsContent>
                <TabsContent value="japanese">
                  <Textarea
                    value={translations.japanese}
                    onChange={(e) => setTranslations(prev => ({ ...prev, japanese: e.target.value }))}
                    placeholder="Japanese translation..."
                    className="min-h-[350px] resize-none border-material-outline focus:ring-primary"
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Preview Area */}
          <Card className="md:col-span-1 shadow-material-md border-material-outline">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="w-5 h-5 text-primary" />
                Live Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex h-[460px]">
                {/* Left Sidebar Menu */}
                <div className="w-48 bg-material-surface border-r border-material-outline p-4 overflow-y-auto">
                  <h3 className="text-sm font-semibold mb-3 text-foreground">Table of Contents</h3>
                  <div className="space-y-1">
                    {content.split('\n').map((line, index) => {
                      const match = line.match(/^(#{1,6})\s+(.+)$/);
                      if (match) {
                        const level = match[1].length;
                        const title = match[2];
                        const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                        return (
                          <button
                            key={index}
                            onClick={() => {
                              const element = document.getElementById(`heading-${id}`);
                              if (element) {
                                element.scrollIntoView({ behavior: 'smooth' });
                              }
                            }}
                            className={`block w-full text-left text-xs hover:bg-material-accent hover:text-accent-foreground rounded px-2 py-1 transition-colors ${
                              level === 1 ? 'font-semibold' : 
                              level === 2 ? 'font-medium pl-3' : 
                              level === 3 ? 'pl-5' : 
                              level === 4 ? 'pl-7' : 
                              level === 5 ? 'pl-9' : 'pl-11'
                            }`}
                          >
                            {title}
                          </button>
                        );
                      }
                      return null;
                    }).filter(Boolean)}
                  </div>
                </div>
                
                {/* Preview Content */}
                <div className="flex-1 overflow-y-auto">
                  <div 
                    id="preview-content"
                    className="prose prose-sm max-w-none p-6 bg-card"
                    dangerouslySetInnerHTML={{ 
                      __html: htmlContent.replace(
                        /<h([1-6])>/g, 
                        (match, level) => {
                          const nextContent = htmlContent.slice(htmlContent.indexOf(match) + match.length);
                          const endTag = nextContent.indexOf(`</h${level}>`);
                          const title = nextContent.slice(0, endTag);
                          const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                          return `<h${level} id="heading-${id}">`;
                        }
                      )
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Line Drawing Area */}
          <Card className="md:col-span-1 shadow-material-md border-material-outline">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Pen className="w-5 h-5 text-primary" />
                Line Drawing Area
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Drawing Tools */}
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={drawingMode === 'pen' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDrawingMode('pen')}
                >
                  <Pen className="w-4 h-4 mr-1" />
                  Pen
                </Button>
                <Button
                  variant={drawingMode === 'eraser' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDrawingMode('eraser')}
                >
                  <Eraser className="w-4 h-4 mr-1" />
                  Eraser
                </Button>
                <input
                  type="color"
                  value={strokeColor}
                  onChange={(e) => setStrokeColor(e.target.value)}
                  className="w-8 h-8 rounded border border-material-outline cursor-pointer"
                  title="Choose color"
                />
              </div>

              {/* Stroke Width */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Width:</span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={strokeWidth}
                  onChange={(e) => setStrokeWidth(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm w-6">{strokeWidth}px</span>
              </div>

              {/* Canvas */}
              <div className="border border-material-outline rounded-md overflow-hidden bg-white">
                <canvas
                  ref={canvasRef}
                  width={300}
                  height={300}
                  className="cursor-crosshair block w-full"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                />
              </div>

              {/* Canvas Controls */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearCanvas}
                  className="flex-1"
                >
                  Clear
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={saveDrawing}
                  className="flex-1"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Save
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Info Bar */}
        <div className="mt-6 flex items-center justify-between text-sm text-muted-foreground bg-card rounded-lg p-4 shadow-material-sm border border-material-outline">
          <div className="flex items-center gap-4">
            <span>Characters: {content.length}</span>
            <span>Words: {content.split(/\s+/).filter(word => word.length > 0).length}</span>
            <span>Lines: {content.split('\n').length}</span>
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
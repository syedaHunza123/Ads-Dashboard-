import React, { useState, useEffect, useRef } from 'react';
import { Ad, AdFormData } from '../types';
import { Button, Input, TextArea } from '../components/UIComponents';
import * as GeminiService from '../services/geminiService';
import * as StorageService from '../services/storageService';
import { ArrowLeft, Sparkles, ImagePlus, Upload, X, Wand2, Zap } from 'lucide-react';

interface AdEditorProps {
  existingAd: Ad | null;
  onBack: () => void;
  onSaved: () => void;
}

export const AdEditor: React.FC<AdEditorProps> = ({ existingAd, onBack, onSaved }) => {
  const [formData, setFormData] = useState<AdFormData>({
    title: '',
    description: '',
    imageUrl: '',
  });
  
  // AI State
  const [isGeneratingText, setIsGeneratingText] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  
  // AI Inputs
  const [textPromptTone, setTextPromptTone] = useState('Exciting');
  const [textPromptTarget, setTextPromptTarget] = useState('General Public');
  const [imagePrompt, setImagePrompt] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (existingAd) {
      // Edit Mode
      setFormData({
        title: existingAd.title,
        description: existingAd.description,
        imageUrl: existingAd.imageUrl,
      });
      setImagePrompt(`A high quality promotional image for ${existingAd.title}`);
    } else {
        // Create Mode - Explicit Reset
        setFormData({
            title: '',
            description: '',
            imageUrl: '',
        });
        setImagePrompt('');
        setTextPromptTarget('General Public');
        setTextPromptTone('Exciting');
    }
  }, [existingAd]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert("Please enter a campaign title.");
      return;
    }

    try {
      if (existingAd && existingAd.id) {
        // Update
        StorageService.updateAd(existingAd.id, formData);
      } else {
        // Create
        StorageService.createAd({ ...formData, status: 'active' });
      }
      onSaved();
    } catch (error) {
      console.error("Failed to save ad:", error);
      alert("An error occurred while saving. Please try again.");
    }
  };

  const handleGenerateCopy = async () => {
    if (!formData.title) {
      alert("Please enter a Product Name/Title first.");
      return;
    }
    setIsGeneratingText(true);
    try {
      const copy = await GeminiService.generateAdCopy(formData.title, textPromptTarget, textPromptTone);
      setFormData(prev => ({ ...prev, description: copy }));
    } catch (error) {
      alert("Failed to generate text. Check console.");
    } finally {
      setIsGeneratingText(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!imagePrompt) {
      alert("Please describe the image you want to generate.");
      return;
    }
    setIsGeneratingImage(true);
    try {
      const base64Image = await GeminiService.generateAdImage(imagePrompt);
      setFormData(prev => ({ ...prev, imageUrl: base64Image }));
    } catch (error) {
      alert("Failed to generate image. Ensure API Key is valid and supports this model.");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-16 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <button onClick={onBack} className="p-2.5 hover:bg-white hover:shadow-sm bg-transparent rounded-full transition-all duration-200 group border border-transparent hover:border-slate-200">
          <ArrowLeft className="w-5 h-5 text-slate-600 group-hover:text-indigo-600" />
        </button>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {existingAd ? 'Edit Campaign' : 'Create New Campaign'}
          </h1>
          <p className="text-slate-500 mt-1">Design your advertisement with AI assistance.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 1. Basic Info */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-purple-600"></div>
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
              <span className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center text-sm font-bold mr-3 ring-1 ring-indigo-100">1</span>
              Product Details
            </h3>
            <div className="space-y-4">
              <Input 
                label="Product / Campaign Title" 
                placeholder="e.g. UltraGlid Wireless Mouse"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="text-lg font-medium"
              />
            </div>
          </div>

          {/* 2. Ad Copy with AI Trigger */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden group hover:border-indigo-300 transition-colors duration-300">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-500 to-pink-500"></div>
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center justify-between">
              <div className="flex items-center">
                <span className="w-8 h-8 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center text-sm font-bold mr-3 ring-1 ring-purple-100">2</span>
                Ad Copy
              </div>
            </h3>
            
            {/* AI Controls */}
            <div className="grid grid-cols-2 gap-4 mb-6 bg-slate-50/80 p-4 rounded-xl border border-slate-100">
              <Input 
                label="Target Audience"
                placeholder="e.g. Tech Enthusiasts"
                value={textPromptTarget}
                onChange={(e) => setTextPromptTarget(e.target.value)}
                className="bg-white"
              />
               <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tone of Voice</label>
                <select 
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all hover:border-slate-300"
                  value={textPromptTone}
                  onChange={(e) => setTextPromptTone(e.target.value)}
                >
                  <option>Exciting</option>
                  <option>Professional</option>
                  <option>Persuasive</option>
                  <option>Humorous</option>
                  <option>Luxury</option>
                </select>
              </div>
            </div>

            {/* Text Area with integrated button in label */}
            <TextArea 
              label="Description" 
              rows={5}
              placeholder="Enter your ad copy here..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rightElement={
                 <button 
                    type="button"
                    onClick={handleGenerateCopy}
                    disabled={isGeneratingText}
                    className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs font-bold hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 disabled:opacity-50 transform hover:-translate-y-0.5"
                 >
                    {isGeneratingText ? <Zap className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                    <span>Auto-Write</span>
                 </button>
              }
            />
            <p className="text-xs text-slate-400 mt-2 flex items-center">
               <Sparkles className="w-3 h-3 mr-1 text-purple-500" />
               AI Suggestions based on Gemini 2.5 Flash
            </p>
          </div>

          {/* 3. Creative Asset */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-pink-500 to-rose-500"></div>
             <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
              <span className="w-8 h-8 bg-pink-50 text-pink-600 rounded-lg flex items-center justify-center text-sm font-bold mr-3 ring-1 ring-pink-100">3</span>
              Creative Asset
            </h3>

            {formData.imageUrl ? (
              <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50 mb-6 group shadow-sm">
                <img src={formData.imageUrl} alt="Ad Asset" className="w-full h-72 object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button 
                        type="button"
                        onClick={() => setFormData({...formData, imageUrl: ''})}
                        className="px-4 py-2 bg-white text-red-600 rounded-lg font-medium shadow-lg hover:bg-red-50 transform hover:scale-105 transition-all"
                    >
                        Remove Image
                    </button>
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-10 text-center mb-6 hover:border-indigo-400 hover:bg-slate-50/50 transition-all duration-300 group">
                <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <ImagePlus className="w-8 h-8" />
                </div>
                <p className="text-base font-medium text-slate-700 mb-1">Upload or Generate Art</p>
                <p className="text-sm text-slate-400 mb-6">Support for JPG, PNG up to 5MB</p>
                <div className="flex justify-center gap-3">
                    <Button type="button" variant="secondary" onClick={() => fileInputRef.current?.click()} icon={<Upload className="w-4 h-4"/>}>
                        Upload File
                    </Button>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
                </div>
              </div>
            )}
          </div>

          {/* Action Bar */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-slate-200">
            <Button type="button" variant="ghost" onClick={onBack} className="text-base">Cancel</Button>
            <Button onClick={handleSave} disabled={!formData.title || !formData.description} className="px-8 py-3 text-base shadow-xl shadow-indigo-500/20">
              {existingAd ? 'Update Campaign' : 'Launch Campaign'}
            </Button>
          </div>
        </div>

        {/* Right Column: Preview */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Live Preview</h3>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full">MOBILE FEED</span>
            </div>
            
            <div className="bg-white rounded-[2rem] border-[6px] border-slate-900 shadow-2xl overflow-hidden mx-auto max-w-[320px]">
               {/* Mock Mobile Header */}
               <div className="bg-slate-900 h-6 w-full flex items-center justify-center">
                  <div className="w-20 h-4 bg-black rounded-b-xl"></div>
               </div>
               
               {/* Feed Item */}
               <div className="pb-4">
                   <div className="p-3 flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-md">AG</div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-900 leading-none">AdGenius</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">Sponsored · <span className="text-blue-500">Follow</span></p>
                      </div>
                   </div>

                   {/* Preview Image */}
                   <div className="w-full aspect-square bg-slate-100 flex items-center justify-center overflow-hidden relative">
                     {formData.imageUrl ? (
                        <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                     ) : (
                        <div className="text-center p-6">
                             <div className="w-12 h-12 bg-slate-200 rounded-full mx-auto mb-2 animate-pulse"></div>
                             <span className="text-slate-400 text-xs font-medium">Image Placeholder</span>
                        </div>
                     )}
                   </div>

                   {/* Preview Content */}
                   <div className="p-3">
                     <div className="flex justify-between items-center mb-2">
                        <p className="text-xs text-indigo-600 font-bold tracking-wide">SHOP NOW</p>
                        <div className="flex space-x-1">
                            <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                            <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                            <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                        </div>
                     </div>
                     <h4 className="font-bold text-slate-900 text-base leading-snug mb-1">
                        {formData.title || "Your Product Title"}
                     </h4>
                     <p className="text-sm text-slate-600 leading-relaxed">
                        {formData.description || "Your engaging ad copy will appear here. Create something amazing with AI."}
                     </p>
                   </div>

                   {/* Preview Action */}
                   <div className="px-3 mt-2">
                      <button className="w-full py-2.5 bg-slate-900 text-white text-sm font-bold rounded-lg shadow-lg">
                        Learn More
                      </button>
                   </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
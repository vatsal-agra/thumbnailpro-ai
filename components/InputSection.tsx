import React, { useState, useRef, useEffect } from 'react';
import { Upload, Youtube, Link, Image as ImageIcon, X } from 'lucide-react';
import { GenerationConfig } from '../types';
import { fileToBase64, urlToBase64, resizeImage } from '../utils';
import { DEFAULT_CHEF_PATHS } from '../chefDefaults';

interface InputSectionProps {
  onStart: (config: GenerationConfig) => void;
  isProcessing: boolean;
}

export const InputSection: React.FC<InputSectionProps> = ({ onStart, isProcessing }) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [additionalContext, setAdditionalContext] = useState('');
  const [referenceImages, setReferenceImages] = useState<string[]>([]);
  const [loadingDefaults, setLoadingDefaults] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load default images on mount
  useEffect(() => {
    const loadDefaults = async () => {
      if (DEFAULT_CHEF_PATHS.length === 0) return;
      
      setLoadingDefaults(true);
      const loadedImages: string[] = [];
      
      for (const path of DEFAULT_CHEF_PATHS) {
        const rawBase64 = await urlToBase64(path);
        if (rawBase64) {
          // Resize to prevent breaking the AI model with huge payloads
          const optimizedBase64 = await resizeImage(rawBase64, 800);
          loadedImages.push(optimizedBase64);
        }
      }
      
      if (loadedImages.length > 0) {
        setReferenceImages(prev => [...prev, ...loadedImages]);
      }
      setLoadingDefaults(false);
    };

    loadDefaults();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl) {
      alert("Please provide a video URL.");
      return;
    }
    onStart({ videoUrl, additionalContext, referenceImages });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const base64Promises = files.map(async (file) => {
          const raw = await fileToBase64(file);
          return await resizeImage(raw, 800); // Optimize user uploads too
      });
      try {
        const newImages = await Promise.all(base64Promises);
        setReferenceImages(prev => [...prev, ...newImages]);
      } catch (error) {
        console.error("Error processing images", error);
        alert("Could not process some images.");
      }
    }
  };

  const removeImage = (index: number) => {
    setReferenceImages(prev => prev.filter((_, i) => i !== index));
  };

  const isButtonDisabled = isProcessing || !videoUrl || loadingDefaults;

  return (
    <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-xl p-8 shadow-2xl">
      <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
        <Youtube className="text-red-600" /> Start New Project
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Video URL Input */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            YouTube Video URL
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Link className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="text"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full bg-black border border-zinc-700 rounded-lg py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        {/* Reference Images Section */}
        <div>
           <label className="block text-sm font-medium text-gray-400 mb-2 flex justify-between">
            <span>Reference Photos (Chef's Face)</span>
            {loadingDefaults && <span className="text-xs text-yellow-500 animate-pulse">Loading defaults...</span>}
           </label>
           
           <div className="grid grid-cols-4 gap-2 mb-2">
              {referenceImages.map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-zinc-700 group">
                    <img src={`data:image/jpeg;base64,${img}`} alt="ref" className="w-full h-full object-cover" />
                    <button 
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 bg-black/70 rounded-full p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <X className="w-3 h-3" />
                    </button>
                </div>
              ))}
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square rounded-lg border-2 border-dashed border-zinc-700 hover:border-zinc-500 flex flex-col items-center justify-center text-zinc-500 hover:text-zinc-300 transition-colors bg-black/30"
              >
                <ImageIcon className="w-6 h-6 mb-1" />
                <span className="text-[10px]">Add Photo</span>
              </button>
           </div>
           
           {referenceImages.length > 0 && (
             <p className="text-xs text-zinc-500 mt-1">
               {referenceImages.length} images ready. The AI will use these for both Normal and Clickbait modes.
             </p>
           )}

           <input 
             type="file" 
             ref={fileInputRef} 
             className="hidden" 
             accept="image/*" 
             multiple 
             onChange={handleFileSelect} 
           />
        </div>

        {/* Context Input */}
        <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
                Video Description / User Notes
            </label>
            <textarea
                value={additionalContext}
                onChange={(e) => setAdditionalContext(e.target.value)}
                placeholder="Describe the video or specific instructions for this thumbnail..."
                className="w-full bg-black border border-zinc-700 rounded-lg py-3 px-4 text-white focus:ring-2 focus:ring-red-600 outline-none h-24 resize-none"
            />
        </div>

        <button
          type="submit"
          disabled={isButtonDisabled}
          className="w-full bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white font-bold py-4 rounded-lg shadow-lg transform transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>Processing...</>
          ) : loadingDefaults ? (
            <>Loading Chef Images...</>
          ) : (
            <>
              Generate Thumbnails <Upload className="w-5 h-5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};
import React, { useState } from 'react';
import { AppStep, GenerationConfig } from './types';
import { analyzeVideo, generateThumbnail, editThumbnail } from './services/geminiService';
import { StepIndicator } from './components/StepIndicator';
import { InputSection } from './components/InputSection';
import { ResultStudio } from './components/ResultStudio';
import { Loader2, Clapperboard } from 'lucide-react';

const App = () => {
  const [step, setStep] = useState<AppStep>(AppStep.INPUT);
  const [summary, setSummary] = useState<string>('');
  
  // Now stores both images
  const [generatedImages, setGeneratedImages] = useState<{ NORMAL: string; CLICKBAIT: string }>({
    NORMAL: '',
    CLICKBAIT: ''
  });
  
  const [error, setError] = useState<string | null>(null);

  const handleStart = async (config: GenerationConfig) => {
    if (!config.videoUrl) return;

    setError(null);
    setStep(AppStep.ANALYZING);

    try {
      // 1. Analyze Video
      const videoSummary = await analyzeVideo(config.videoUrl, config.additionalContext);
      setSummary(videoSummary);

      setStep(AppStep.GENERATING);

      // 2. Generate BOTH Thumbnails in Parallel
      const [normalImage, clickbaitImage] = await Promise.all([
        generateThumbnail(videoSummary, config.additionalContext, config.referenceImages, 'NORMAL'),
        generateThumbnail(videoSummary, config.additionalContext, config.referenceImages, 'CLICKBAIT')
      ]);

      setGeneratedImages({
        NORMAL: normalImage,
        CLICKBAIT: clickbaitImage
      });

      setStep(AppStep.RESULT);

    } catch (err: any) {
      console.error(err);
      const errorMessage = err.message || "An unexpected error occurred during generation.";
      setError(errorMessage);
      setStep(AppStep.INPUT);
    }
  };

  // Improved to accept the specific image being edited
  const handleEdit = async (imageToEdit: string, prompt: string): Promise<string> => {
    return await editThumbnail(imageToEdit, prompt);
  };

  const handleReset = () => {
    setStep(AppStep.INPUT);
    setSummary('');
    setGeneratedImages({ NORMAL: '', CLICKBAIT: '' });
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col font-sans selection:bg-red-500/30">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center transform -rotate-3">
               <Clapperboard className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Thumbnail<span className="text-red-500">Pro</span> AI</h1>
          </div>
          <div className="text-xs font-mono text-zinc-500 hidden sm:block">
            Powered by Gemini 3 Flash & 2.5 Flash
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center p-4 sm:p-8">
        <div className="w-full max-w-4xl mb-8">
            <StepIndicator currentStep={step} />
        </div>

        {error && (
            <div className="bg-red-900/20 border border-red-500/50 text-red-200 px-6 py-4 rounded-lg mb-8 max-w-2xl w-full text-center">
                {error}
            </div>
        )}

        {step === AppStep.INPUT && (
          <InputSection onStart={handleStart} isProcessing={false} />
        )}

        {(step === AppStep.ANALYZING || step === AppStep.GENERATING) && (
          <div className="flex flex-col items-center justify-center py-20 animate-pulse">
            <Loader2 className="w-16 h-16 text-red-500 animate-spin mb-6" />
            <h2 className="text-2xl font-bold text-white mb-2">
              {step === AppStep.ANALYZING ? "Analyzing Video..." : "Designing your masterpieces..."}
            </h2>
            <p className="text-zinc-400">
               {step === AppStep.ANALYZING 
                 ? "Gemini 3 Flash is scanning video metadata and context." 
                 : "Generating both Normal and Clickbait versions simultaneously..."}
            </p>
          </div>
        )}

        {step === AppStep.RESULT && (
          <ResultStudio 
            initialImages={generatedImages} 
            summary={summary}
            onEdit={handleEdit}
            onReset={handleReset}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-zinc-600 text-sm">
            &copy; {new Date().getFullYear()} ThumbnailPro AI. Built for the future of content creation.
        </div>
      </footer>
    </div>
  );
};

export default App;
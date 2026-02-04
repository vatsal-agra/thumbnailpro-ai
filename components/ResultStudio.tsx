import React, { useState } from 'react';
import { Download, RefreshCw, Sparkles, Send, LayoutTemplate, Flame } from 'lucide-react';
import { downloadImage } from '../utils';
import { ThumbnailMode } from '../types';

interface ResultStudioProps {
  initialImages: { NORMAL: string; CLICKBAIT: string; NORMAL_VERTICAL: string; CLICKBAIT_VERTICAL: string };
  summary: string;
  onEdit: (image: string, prompt: string, aspectRatio: '16:9' | '9:16') => Promise<string>;
  onReset: () => void;
}

export const ResultStudio: React.FC<ResultStudioProps> = ({ initialImages, summary, onEdit, onReset }) => {
  const [activeMode, setActiveMode] = useState<ThumbnailMode>('NORMAL');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');

  // Store current images for all modes
  const [images, setImages] = useState(initialImages);

  // Store history for all modes
  const [history, setHistory] = useState<{ NORMAL: string[]; CLICKBAIT: string[]; NORMAL_VERTICAL: string[]; CLICKBAIT_VERTICAL: string[] }>({
    NORMAL: [initialImages.NORMAL],
    CLICKBAIT: [initialImages.CLICKBAIT],
    NORMAL_VERTICAL: [initialImages.NORMAL_VERTICAL],
    CLICKBAIT_VERTICAL: [initialImages.CLICKBAIT_VERTICAL]
  });

  const [editPrompt, setEditPrompt] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Determine which image to show based on mode and aspect ratio
  // Type assertion needed for dynamic key access
  const currentKey = (aspectRatio === '9:16' ? `${activeMode}_VERTICAL` : activeMode) as keyof typeof initialImages;

  const currentImage = images[currentKey];
  const currentHistory = history[currentKey];

  const handleDownload = () => {
    downloadImage(currentImage, `thumbnail-pro-${activeMode.toLowerCase()}-${aspectRatio.replace(':', '-')}-${Date.now()}.png`);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editPrompt.trim() || isEditing) return;

    setIsEditing(true);
    try {
      // Edit the CURRENT visible image
      const newImage = await onEdit(currentImage, editPrompt, aspectRatio);

      setImages(prev => ({
        ...prev,
        [currentKey]: newImage
      }));

      setHistory(prev => ({
        ...prev,
        [currentKey]: [...prev[currentKey], newImage]
      }));

      setEditPrompt('');
    } catch (error) {
      alert("Failed to edit image. Please try again.");
    } finally {
      setIsEditing(false);
    }
  };

  const handleUndo = () => {
    if (currentHistory.length > 1) {
      const newHistoryList = [...currentHistory];
      newHistoryList.pop(); // Remove current
      const previousImage = newHistoryList[newHistoryList.length - 1];

      setHistory(prev => ({
        ...prev,
        [currentKey]: newHistoryList
      }));

      setImages(prev => ({
        ...prev,
        [currentKey]: previousImage
      }));
    }
  };

  return (
    <div className="w-full max-w-6xl flex flex-col gap-6 animate-fade-in">

      {/* Mode Toggle Tabs */}
      <div className="flex items-center justify-center gap-4 mb-2">
        <button
          onClick={() => setActiveMode('NORMAL')}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg border-2 transition-all ${activeMode === 'NORMAL'
            ? 'border-red-600 bg-red-600 text-white shadow-red-900/50 shadow-lg'
            : 'border-zinc-700 bg-zinc-900 text-gray-400 hover:border-zinc-500'
            }`}
        >
          <LayoutTemplate className="w-5 h-5" />
          <span className="font-bold">Normal Mode</span>
        </button>

        <button
          onClick={() => setActiveMode('CLICKBAIT')}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg border-2 transition-all ${activeMode === 'CLICKBAIT'
            ? 'border-yellow-500 bg-yellow-500 text-black shadow-yellow-900/50 shadow-lg'
            : 'border-zinc-700 bg-zinc-900 text-gray-400 hover:border-zinc-500'
            }`}
        >
          <Flame className="w-5 h-5" />
          <span className="font-bold">Clickbait Mode</span>
        </button>
      </div>

      {/* Aspect Ratio Toggle */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <button
          onClick={() => setAspectRatio('16:9')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${aspectRatio === '16:9'
            ? 'bg-zinc-700 text-white'
            : 'bg-zinc-900 text-zinc-500 hover:text-white'
            }`}
        >
          16:9 Horizontal
        </button>
        <button
          onClick={() => setAspectRatio('9:16')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${aspectRatio === '9:16'
            ? 'bg-zinc-700 text-white'
            : 'bg-zinc-900 text-zinc-500 hover:text-white'
            }`}
        >
          9:16 Vertical
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: Image Display */}
        <div className="flex-1 flex flex-col gap-4">
          <div className={`relative group rounded-xl overflow-hidden shadow-2xl border border-zinc-800 bg-black ${aspectRatio === '9:16' ? 'aspect-[9/16] h-[600px] mx-auto w-auto' : 'aspect-video w-full'
            }`}>
            {currentImage ? (
              <img
                src={currentImage}
                alt={`${activeMode} Thumbnail`}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-700 bg-zinc-900/50">
                <p className="font-bold animate-pulse">Rendering {activeMode}...</p>
              </div>
            )}
            {isEditing && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                <div className="flex flex-col items-center">
                  <RefreshCw className="w-12 h-12 text-red-500 animate-spin mb-4" />
                  <p className="text-xl font-bold text-white">Applying Edits to {activeMode} ({aspectRatio}) thumbnail...</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleDownload}
              className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Download className="w-5 h-5" /> Download {activeMode}
            </button>
            <button
              onClick={handleUndo}
              disabled={currentHistory.length <= 1}
              className="px-6 bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700 rounded-lg font-semibold disabled:opacity-50 transition-colors"
            >
              Undo
            </button>
          </div>
        </div>

        {/* Right Column: Editor & Info */}
        <div className="w-full lg:w-96 flex flex-col gap-6">
          {/* Magic Editor */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Sparkles className="text-yellow-500" /> Magic Editor
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Editing the <strong>{activeMode} ({aspectRatio})</strong> thumbnail. Ask for changes like "Make the text bigger" or "Add fire effects".
            </p>
            <form onSubmit={handleEditSubmit} className="relative">
              <input
                type="text"
                value={editPrompt}
                onChange={(e) => setEditPrompt(e.target.value)}
                placeholder={`Edit ${activeMode.toLowerCase()} version...`}
                className="w-full bg-black border border-zinc-700 rounded-lg py-3 pl-4 pr-12 text-white focus:ring-2 focus:ring-red-600 outline-none"
                disabled={isEditing}
              />
              <button
                type="submit"
                disabled={!editPrompt.trim() || isEditing}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-red-500 hover:text-red-400 disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>

          {/* Video Summary */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-xl flex-1">
            <h3 className="text-lg font-semibold text-white mb-3">Video Insight</h3>
            <div className="text-gray-300 text-sm leading-relaxed overflow-y-auto max-h-48 pr-2 scrollbar-thin">
              {summary}
            </div>
          </div>

          <button
            onClick={onReset}
            className="text-gray-500 hover:text-white text-sm font-medium underline decoration-zinc-700 underline-offset-4"
          >
            Start New Project
          </button>
        </div>
      </div>
    </div>
  );
};
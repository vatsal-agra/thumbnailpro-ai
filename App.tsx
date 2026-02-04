import { useState, useEffect } from 'react';
import { AppStep, GenerationConfig, HistoryItem } from './types';
import { analyzeVideo, generateThumbnail, editThumbnail, generateVerticalFromHorizontal } from './services/geminiService';
import { resizeImage } from './utils';
import { StepIndicator } from './components/StepIndicator';
import { InputSection } from './components/InputSection';
import { ResultStudio } from './components/ResultStudio';
import { LandingPage } from './components/LandingPage';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AdBanner } from './components/AdBanner';
import { PaymentModal } from './components/PaymentModal';
import { CookieConsent } from './components/CookieConsent';
import { Loader2, PlusCircle, Trash2 } from 'lucide-react';

const App = () => {
  // Lazy initialize persistent state to prevent overwrite on reload
  const [page, setPage] = useState<'home' | 'app'>(() => {
    return (localStorage.getItem('current_page') as 'home' | 'app') || 'home';
  });

  const [generatorTab, setGeneratorTab] = useState<'create' | 'history'>(() => {
    return (localStorage.getItem('generator_tab') as 'create' | 'history') || 'create';
  });

  const [step, setStep] = useState<AppStep>(AppStep.INPUT);
  const [summary, setSummary] = useState<string>('');

  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('thumbnail_history');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to parse history", e);
      return [];
    }
  });

  // Payment States
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const [hasUsedFree, setHasUsedFree] = useState(false); // Reset to false for unlimited testing

  const [pendingConfig, setPendingConfig] = useState<GenerationConfig | null>(null);

  const [generatedImages, setGeneratedImages] = useState<{ NORMAL: string; CLICKBAIT: string; NORMAL_VERTICAL: string; CLICKBAIT_VERTICAL: string }>({
    NORMAL: '',
    CLICKBAIT: '',
    NORMAL_VERTICAL: '',
    CLICKBAIT_VERTICAL: ''
  });

  const [error, setError] = useState<string | null>(null);

  // Persistence Effects (Only save when state changes)
  useEffect(() => {
    try {
      // Limit history to 20 items (Safe now that we compress images)
      const limitedHistory = history.slice(0, 20);
      localStorage.setItem('thumbnail_history', JSON.stringify(limitedHistory));
    } catch (e) {
      console.error("CRITICAL: Failed to save history to localStorage. Storage is full.", e);
    }
  }, [history]);

  useEffect(() => {
    try {
      if (hasUsedFree) {
        localStorage.setItem('has_used_free_trial', 'true');
      }
    } catch (e) { }
  }, [hasUsedFree]);

  useEffect(() => {
    try {
      localStorage.setItem('current_page', page);
    } catch (e) { }
  }, [page]);

  useEffect(() => {
    try {
      localStorage.setItem('generator_tab', generatorTab);
    } catch (e) { }
  }, [generatorTab]);

  // Smooth scroll to top when changing page
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  const handleStart = (config: GenerationConfig) => {
    if (!config.videoUrl) return;

    // Intercept with Payment Modal
    setPendingConfig(config);
    setIsPaymentModalOpen(true);
  };

  const proceedWithGeneration = async () => {
    if (!pendingConfig) return;

    setIsPaymentModalOpen(false);
    // setHasUsedFree(true); // Temporarily disabled for testing - unlimited free generations

    setError(null);
    setStep(AppStep.ANALYZING);

    try {
      const videoSummary = await analyzeVideo(pendingConfig.videoUrl, pendingConfig.additionalContext);
      setSummary(videoSummary);

      setStep(AppStep.GENERATING);

      // Step 1: Generate Horizontal (16:9) versions first
      const [normalImage, clickbaitImage] = await Promise.all([
        generateThumbnail(videoSummary, pendingConfig.additionalContext, pendingConfig.referenceImages, 'NORMAL', '16:9'),
        generateThumbnail(videoSummary, pendingConfig.additionalContext, pendingConfig.referenceImages, 'CLICKBAIT', '16:9')
      ]);

      // Step 2: Generate Vertical (9:16) versions BASED on the horizontal ones to ensure consistency
      const [normalVertical, clickbaitVertical] = await Promise.all([
        generateVerticalFromHorizontal(normalImage, 'NORMAL'),
        generateVerticalFromHorizontal(clickbaitImage, 'CLICKBAIT')
      ]);

      const newImages = {
        NORMAL: normalImage,
        CLICKBAIT: clickbaitImage,
        NORMAL_VERTICAL: normalVertical,
        CLICKBAIT_VERTICAL: clickbaitVertical
      };

      setGeneratedImages(newImages);

      // --- COMPRESSION FOR PERSISTENCE ---
      // localStorage has a strict 5MB limit. Storing 4 high-res thumbnails per project 
      // will crash the storage. We resize they to JPEGs for the history list.
      const [compNormal, compClickbait, compNormalV, compClickbaitV] = await Promise.all([
        resizeImage(normalImage.split(',')[1] || normalImage, 800),
        resizeImage(clickbaitImage.split(',')[1] || clickbaitImage, 800),
        resizeImage(normalVertical.split(',')[1] || normalVertical, 600),
        resizeImage(clickbaitVertical.split(',')[1] || clickbaitVertical, 600)
      ]);

      const storedImages = {
        NORMAL: `data:image/jpeg;base64,${compNormal}`,
        CLICKBAIT: `data:image/jpeg;base64,${compClickbait}`,
        NORMAL_VERTICAL: `data:image/jpeg;base64,${compNormalV}`,
        CLICKBAIT_VERTICAL: `data:image/jpeg;base64,${compClickbaitV}`
      };

      // Save to history with COMPRESSED images
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        title: videoSummary.split('.')[0] || "New Project",
        date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
        summary: videoSummary,
        images: storedImages
      };
      setHistory(prev => [newItem, ...prev]);

      setStep(AppStep.RESULT);

    } catch (err: any) {
      console.error(err);
      const errorMessage = err.message || "An unexpected error occurred during generation.";
      setError(errorMessage);
      setStep(AppStep.INPUT);
    }
  };

  const handleEdit = async (imageToEdit: string, prompt: string, aspectRatio: '16:9' | '9:16' = '16:9'): Promise<string> => {
    return await editThumbnail(imageToEdit, prompt, aspectRatio);
  };

  const handleReset = () => {
    setStep(AppStep.INPUT);
    setSummary('');
    setGeneratedImages({ NORMAL: '', CLICKBAIT: '', NORMAL_VERTICAL: '', CLICKBAIT_VERTICAL: '' });
    setError(null);
  };

  const openProject = (item: HistoryItem) => {
    setSummary(item.summary);
    setGeneratedImages(item.images);
    setStep(AppStep.RESULT);
    setGeneratorTab('create');
  };

  const deleteProject = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans selection:bg-red-500/30 overflow-x-hidden">
      <Navbar currentPage={page} onNavigate={setPage} />

      {page === 'home' ? (
        <LandingPage onStartApp={() => setPage('app')} />
      ) : (
        <main className="flex-1 flex flex-col items-center p-4 sm:p-8 max-w-[1600px] mx-auto w-full animate-fade-in text-zinc-100">

          {/* Sub-Tabs for Generator */}
          <div className="flex items-center gap-8 border-b border-zinc-900 w-full max-w-4xl mb-12">
            <button
              onClick={() => setGeneratorTab('create')}
              className={`pb-4 px-2 text-sm font-bold transition-all relative ${generatorTab === 'create' ? 'text-red-500' : 'text-zinc-500 hover:text-white'}`}
            >
              Masterpiece Creator
              {generatorTab === 'create' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />}
            </button>
            <button
              onClick={() => setGeneratorTab('history')}
              className={`pb-4 px-2 text-sm font-bold transition-all relative ${generatorTab === 'history' ? 'text-red-500' : 'text-zinc-500 hover:text-white'}`}
            >
              Recent Projects ({history.length})
              {generatorTab === 'history' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />}
            </button>
          </div>

          <div className="w-full grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">

            {/* Left Side: Main Content */}
            <div className="flex flex-col items-center">

              {generatorTab === 'create' ? (
                <>
                  <div className="w-full max-w-4xl mb-8">
                    <StepIndicator currentStep={step} />
                  </div>

                  {error && (
                    <div className="bg-red-900/20 border border-red-500/50 text-red-100 px-6 py-4 rounded-lg mb-8 max-w-2xl w-full text-center animate-fade-in glass">
                      {error}
                    </div>
                  )}

                  {step === AppStep.INPUT && (
                    <div className="w-full max-w-4xl animate-fade-in">
                      <div className="mb-10 text-center">
                        <h2 className="text-4xl font-extrabold mb-3 tracking-tight text-white">Create Your Masterpiece</h2>
                        <p className="text-zinc-500 text-lg">Paste your video link below and let Gemini's creative engine take over.</p>
                      </div>
                      <InputSection onStart={handleStart} isProcessing={false} />
                    </div>
                  )}

                  {(step === AppStep.ANALYZING || step === AppStep.GENERATING) && (
                    <div className="flex flex-col items-center justify-center py-24">
                      <div className="relative">
                        <div className="absolute inset-0 bg-red-500/10 blur-3xl rounded-full animate-pulse" />
                        <Loader2 className="w-20 h-20 text-red-500 animate-spin mb-8 relative z-10" />
                      </div>
                      <h2 className="text-3xl font-bold text-white mb-3">
                        {step === AppStep.ANALYZING ? "Decoding Your Video..." : "Painting Every Pixel..."}
                      </h2>
                      <p className="text-zinc-400 text-lg max-w-md text-center">
                        {step === AppStep.ANALYZING
                          ? "Scanning metadata and frame data to understand your story."
                          : "Crafting twin variations focused on engagement and brand."}
                      </p>
                    </div>
                  )}

                  {step === AppStep.RESULT && (
                    <div className="w-full animate-fade-in">
                      <ResultStudio
                        key={summary} // Unique key ensures state resets for each new generation
                        initialImages={generatedImages}
                        summary={summary}
                        onEdit={handleEdit}
                        onReset={handleReset}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full max-w-5xl animate-fade-in">
                  {history.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-zinc-900/40 border border-zinc-800 rounded-2xl border-dashed">
                      <PlusCircle className="w-12 h-12 text-zinc-700 mb-4" />
                      <p className="text-zinc-500">No projects yet. Start creating to see them here!</p>
                      <button
                        onClick={() => setGeneratorTab('create')}
                        className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors"
                      >
                        Create Your First
                      </button>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-3 gap-6 w-full">
                      {history.map((item) => (
                        <div key={item.id} className="group cursor-pointer relative">
                          <div className="aspect-video rounded-xl overflow-hidden border border-zinc-800 mb-4 bg-zinc-900 relative">
                            <img src={item.images.NORMAL} alt={item.title} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                              <button
                                onClick={() => openProject(item)}
                                className="px-4 py-2 bg-white text-black font-bold rounded-lg text-sm hover:bg-zinc-200 transition-colors"
                              >
                                Open Studio
                              </button>
                              <button
                                onClick={(e) => deleteProject(e, item.id)}
                                className="p-2 bg-red-600/80 text-white rounded-lg hover:bg-red-600 transition-colors"
                                title="Delete Project"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <h4 className="font-bold mb-1 text-white group-hover:text-red-500 transition-colors line-clamp-1">{item.title}</h4>
                          <p className="text-xs text-zinc-500">{item.date} &bull; Pro Resolution</p>
                        </div>
                      ))}
                      <div className="aspect-video rounded-xl border-2 border-dashed border-zinc-800 flex flex-col items-center justify-center text-zinc-600 hover:text-zinc-400 hover:border-zinc-600 transition-all cursor-pointer bg-zinc-900/20" onClick={() => setGeneratorTab('create')}>
                        <PlusCircle className="w-10 h-10 mb-2" />
                        <span className="font-bold">Start New Project</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Side: Ads & Extra info */}
            <div className="hidden lg:flex flex-col gap-6">
              <AdBanner position="sidebar" />

              <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 glass">
                <h4 className="font-bold mb-4 flex items-center gap-2 text-white">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Pro Insight
                </h4>
                <ul className="space-y-4 text-sm text-zinc-400 leading-relaxed">
                  <li className="flex gap-3">
                    <span className="text-red-500 font-bold shrink-0">01</span>
                    High-contrast faces increase click-through rates by up to 38% for food content.
                  </li>
                  <li className="flex gap-3">
                    <span className="text-red-500 font-bold shrink-0">02</span>
                    The 'Clickbait' mode uses aggressive color grading and emotional emphasis.
                  </li>
                  <li className="flex gap-3">
                    <span className="text-red-500 font-bold shrink-0">03</span>
                    Try adding "Cyberpunk style" in the Magic Editor for a modern tech look.
                  </li>
                </ul>
              </div>

              <AdBanner position="bottom" className="!min-h-[250px]" />
            </div>
          </div>

          {/* Bottom Ad Banner */}
          <div className="w-full max-w-4xl mt-12 lg:hidden">
            <AdBanner position="bottom" />
          </div>
        </main>
      )}

      <Footer />

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSuccess={proceedWithGeneration}
        isFirstTime={!hasUsedFree}
      />
      <CookieConsent />
    </div>
  );
};

export default App;

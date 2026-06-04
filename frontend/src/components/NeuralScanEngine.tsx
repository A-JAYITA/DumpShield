import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Brain,
  AlertTriangle,
  Trash2,
  ShieldCheck,
  DollarSign,
  Leaf,
  Activity,
  CheckCircle2,
  Camera,
  ChevronDown,
  Zap,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import { hyderabadAreas, simulateAnalysis } from '../data/areaLocations';
import type { ScanResult, Hotspot } from '../types';

type ScanStage = 'upload' | 'analyzing' | 'results';

interface Props {
  onAddToMap: (hotspot: Hotspot) => void;
}

const severityColors: Record<string, string> = {
  Low: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  Medium: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  High: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  Critical: 'text-red-400 bg-red-500/10 border-red-500/20',
};

const riskColors: Record<string, string> = {
  Low: 'text-emerald-400',
  Medium: 'text-amber-400',
  High: 'text-orange-400',
};

const NeuralScanEngine: React.FC<Props> = ({ onAddToMap }) => {
  const [stage, setStage] = useState<ScanStage>('upload');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [selectedArea, setSelectedArea] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisStep, setAnalysisStep] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const analysisSteps = [
    'Initializing neural network...',
    'Processing image data...',
    'Classifying waste type...',
    'Assessing severity level...',
    'Calculating risk score...',
    'Generating recommendations...',
    'Analysis complete',
  ];

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleAreaSelect = useCallback((areaName: string) => {
    setSelectedArea(areaName);
    setIsDropdownOpen(false);
  }, []);

  const startAnalysis = useCallback(() => {
    if (!selectedArea || !imagePreview) return;
    setStage('analyzing');
    setAnalysisProgress(0);
    setAnalysisStep(0);

    const interval = setInterval(() => {
      setAnalysisProgress((prev) => {
        const newProgress = prev + Math.random() * 15 + 5;
        if (newProgress >= 100) {
          clearInterval(interval);
          const area = hyderabadAreas.find((a) => a.name === selectedArea);
          const analysis = simulateAnalysis(selectedArea);
          const result: ScanResult = {
            id: `scan-${Date.now()}`,
            image_url: imagePreview,
            image_file: imageFile,
            area_name: selectedArea,
            area_lat: area?.lat || 17.385,
            area_lng: area?.lng || 78.4867,
            ...analysis,
            scan_date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
          };
          setScanResult(result);
          setTimeout(() => setStage('results'), 500);
          return 100;
        }
        const stepIdx = Math.min(Math.floor((newProgress / 100) * analysisSteps.length), analysisSteps.length - 1);
        setAnalysisStep(stepIdx);
        return newProgress;
      });
    }, 300);

    return () => clearInterval(interval);
  }, [selectedArea, imagePreview, imageFile]);

  const handleAddToMap = useCallback(() => {
    if (!scanResult) return;
    const hotspot: Hotspot = {
      id: Date.now(),
      lat: scanResult.area_lat,
      lng: scanResult.area_lng,
      name: scanResult.area_name,
      risk_score: scanResult.risk_score / 100,
      garbage_percentage: Math.round(scanResult.risk_score * 0.9),
      status: 'active',
      severity: scanResult.severity.toLowerCase(),
      cleanliness_score: Math.round(100 - scanResult.risk_score * 0.9),
      active_dump_sites: 1,
      dominant_waste_type: scanResult.waste_type,
      last_updated: 'Just now',
    };
    onAddToMap(hotspot);
  }, [scanResult, onAddToMap]);

  const handleReset = useCallback(() => {
    setStage('upload');
    setImagePreview(null);
    setImageFile(null);
    setSelectedArea('');
    setScanResult(null);
    setAnalysisProgress(0);
    setAnalysisStep(0);
  }, []);

  const selectedAreaData = hyderabadAreas.find((a) => a.name === selectedArea);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-6 py-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center">
              <Brain className="w-5 h-5 text-emerald-500" />
            </div>
            <h2 className="text-3xl font-black italic text-white uppercase tracking-tighter">Neural Scan Engine</h2>
          </div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">AI-Powered Dump Detection & Risk Assessment</p>
        </div>
        {stage === 'results' && (
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:bg-white/10 hover:text-white transition-all rounded-lg"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            New Scan
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {/* STAGE: Upload */}
        {stage === 'upload' && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Upload Area */}
            <div className="glass-card p-6">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Upload Dump Image</p>
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
                className={`relative aspect-video rounded-xl border-2 border-dashed transition-all duration-300 cursor-pointer overflow-hidden ${
                  imagePreview
                    ? 'border-emerald-500/30 bg-emerald-500/5'
                    : 'border-white/10 bg-slate-900/30 hover:border-emerald-500/30 hover:bg-emerald-500/5'
                }`}
              >
                {imagePreview ? (
                  <>
                    <img src={imagePreview} alt="Uploaded dump" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span className="text-[10px] font-black text-white uppercase">Image Loaded</span>
                      </div>
                      <span className="text-[9px] font-black text-slate-400">{imageFile?.name}</span>
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4">
                      <Camera className="w-8 h-8 text-slate-600" />
                    </div>
                    <p className="text-sm font-black text-slate-400 uppercase tracking-wider mb-1">Drop satellite image here</p>
                    <p className="text-[10px] text-slate-600">or click to browse files</p>
                    <p className="text-[9px] text-slate-700 mt-3">Supports: JPG, PNG, WEBP</p>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect(file);
                }}
              />
            </div>

            {/* Area Selection & Analysis */}
            <div className="space-y-6">
              {/* Area Selector */}
              <div className="glass-card p-6">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Select Location</p>
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full flex items-center justify-between p-3 bg-slate-800/50 border border-white/10 rounded-lg hover:border-emerald-500/30 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-emerald-500" />
                      <span className={`text-sm font-black uppercase ${selectedArea ? 'text-white' : 'text-slate-500'}`}>
                        {selectedArea || 'Choose area...'}
                      </span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-lg overflow-hidden z-50 max-h-64 overflow-y-auto custom-scrollbar"
                      >
                        {hyderabadAreas.map((area) => (
                          <button
                            key={area.name}
                            onClick={() => handleAreaSelect(area.name)}
                            className="w-full flex items-center gap-3 p-3 hover:bg-emerald-500/10 transition-all text-left"
                          >
                            <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <div>
                              <p className="text-[11px] font-black text-white uppercase">{area.name}</p>
                              <p className="text-[9px] text-slate-500">{area.zone}</p>
                            </div>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {selectedAreaData && (
                  <div className="mt-3 p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-lg">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3 text-emerald-500" />
                      <span className="text-[9px] font-black text-emerald-500 uppercase">{selectedAreaData.zone}</span>
                    </div>
                    <p className="text-[9px] text-slate-500 mt-1">
                      Lat: {selectedAreaData.lat} | Lng: {selectedAreaData.lng}
                    </p>
                  </div>
                )}
              </div>

              {/* Analyze Button */}
              <button
                onClick={startAnalysis}
                disabled={!selectedArea || !imagePreview}
                className={`w-full py-4 rounded-xl font-black text-[11px] uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 ${
                  selectedArea && imagePreview
                    ? 'bg-emerald-500 text-black hover:bg-emerald-400 shadow-[0_10px_30px_rgba(16,185,129,0.3)]'
                    : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                }`}
              >
                <Brain className="w-4 h-4" />
                Execute Neural Scan
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* STAGE: Analyzing */}
        {stage === 'analyzing' && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-2xl mx-auto"
          >
            <div className="glass-card p-8 text-center">
              {/* Animated Brain Icon */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-8"
              >
                <Brain className="w-10 h-10 text-emerald-500" />
              </motion.div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-6">
                <motion.div
                  className="h-full bg-emerald-500"
                  initial={{ width: '0%' }}
                  animate={{ width: `${analysisProgress}%` }}
                  transition={{ duration: 0.3 }}
                  style={{ boxShadow: '0 0 20px rgba(16,185,129,0.5)' }}
                />
              </div>

              {/* Current Step */}
              <motion.p
                key={analysisStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm font-black text-emerald-500 uppercase tracking-wider mb-2"
              >
                {analysisSteps[analysisStep]}
              </motion.p>
              <p className="text-[10px] text-slate-500">{Math.round(analysisProgress)}% Complete</p>

              {/* Step Indicators */}
              <div className="flex justify-center gap-2 mt-8">
                {analysisSteps.slice(0, -1).map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      i < analysisStep
                        ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                        : i === analysisStep
                        ? 'bg-emerald-500 animate-pulse'
                        : 'bg-slate-700'
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* STAGE: Results */}
        {stage === 'results' && scanResult && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Top Row: Image + Quick Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Uploaded Image */}
              <div className="glass-card overflow-hidden">
                <div className="p-3 border-b border-white/5">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Scanned Image</p>
                </div>
                <div className="aspect-video relative">
                  <img src={scanResult.image_url} alt="Scanned dump" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="w-3 h-3 text-emerald-500" />
                      <span className="text-[10px] font-black text-white uppercase">{scanResult.area_name}</span>
                    </div>
                    <span className="text-[9px] text-slate-400">{scanResult.scan_date}</span>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                {/* Waste Type */}
                <div className="glass-card p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-center justify-center">
                      <Trash2 className="w-4 h-4 text-amber-500" />
                    </div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Waste Type</p>
                  </div>
                  <p className="text-lg font-black text-white italic">{scanResult.waste_type}</p>
                </div>

                {/* Severity */}
                <div className="glass-card p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${severityColors[scanResult.severity]}`}>
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Severity</p>
                  </div>
                  <p className={`text-lg font-black italic ${severityColors[scanResult.severity].split(' ')[0]}`}>
                    {scanResult.severity}
                  </p>
                </div>

                {/* Confidence */}
                <div className="glass-card p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-center">
                      <Brain className="w-4 h-4 text-blue-500" />
                    </div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Confidence</p>
                  </div>
                  <p className="text-lg font-black text-blue-400 italic">{scanResult.confidence}%</p>
                </div>

                {/* Estimated Volume */}
                <div className="glass-card p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-purple-500/10 border border-purple-500/20 rounded-lg flex items-center justify-center">
                      <Activity className="w-4 h-4 text-purple-500" />
                    </div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Est. Volume</p>
                  </div>
                  <p className="text-lg font-black text-purple-400 italic">{scanResult.estimated_volume}</p>
                </div>
              </div>
            </div>

            {/* Risk Assessment */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div className="glass-card p-5">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Risk Score</p>
                </div>
                <p className={`text-2xl font-black italic ${riskColors[scanResult.risk_category] || 'text-white'}`}>
                  {scanResult.risk_score}%
                </p>
                <p className={`text-[10px] font-black uppercase mt-1 ${riskColors[scanResult.risk_category] || 'text-slate-500'}`}>
                  {scanResult.risk_category} Risk
                </p>
              </div>

              <div className="glass-card p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Leaf className="w-4 h-4 text-green-500" />
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Environmental</p>
                </div>
                <p className="text-lg font-black text-white italic">{scanResult.environmental_impact}</p>
                <p className="text-[10px] text-slate-500 mt-1">Impact Level</p>
              </div>

              <div className="glass-card p-5">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-blue-500" />
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Est. Cost</p>
                </div>
                <p className="text-lg font-black text-blue-400 italic">₹{scanResult.estimated_cost.toLocaleString()}</p>
                <p className="text-[10px] text-slate-500 mt-1">Cleanup Budget</p>
              </div>

              <div className="glass-card p-5 border border-emerald-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-emerald-500" />
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Location</p>
                </div>
                <p className="text-sm font-black text-white italic">{scanResult.area_name}</p>
                <p className="text-[9px] text-slate-500 mt-1">
                  {scanResult.area_lat.toFixed(4)}, {scanResult.area_lng.toFixed(4)}
                </p>
              </div>
            </div>

            {/* Recommended Actions */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-emerald-500" />
                </div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Recommended Actions</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {scanResult.recommended_actions.map((action, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg border border-white/5"
                  >
                    <div className="w-6 h-6 bg-emerald-500/10 border border-emerald-500/20 rounded-md flex items-center justify-center shrink-0">
                      <span className="text-[9px] font-black text-emerald-500">{i + 1}</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">{action}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Add to Access Hub */}
            <div className="glass-card p-6 border border-emerald-500/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-white uppercase">Add to Access Hub</p>
                    <p className="text-[10px] text-slate-500">Create hotspot on satellite map and update area statistics</p>
                  </div>
                </div>
                <button
                  onClick={handleAddToMap}
                  className="px-8 py-3 bg-emerald-500 text-black font-black text-[10px] uppercase tracking-[0.3em] hover:bg-emerald-400 transition-all shadow-[0_10px_30px_rgba(16,185,129,0.3)] rounded-lg flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Deploy to Map
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default NeuralScanEngine;

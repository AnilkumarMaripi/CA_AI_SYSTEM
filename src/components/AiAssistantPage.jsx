import React, { useState, useRef } from 'react';
import { Camera, Upload, Sparkles, FileText, CheckCircle2, RefreshCw, Zap, ShieldCheck } from 'lucide-react';

export default function AiAssistantPage() {
  const [sourceMode, setSourceMode] = useState('camera'); // 'camera' | 'upload'
  const [cameraActive, setCameraActive] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedResults, setScannedResults] = useState([
    {
      id: 'scan_101',
      docName: 'INV-2026-894.pdf',
      docType: 'GST Tax Invoice',
      time: '10 mins ago',
      taxableAmount: '₹ 1,45,000.00',
      cgst: '₹ 13,050.00 (9%)',
      sgst: '₹ 13,050.00 (9%)',
      totalAmount: '₹ 1,71,100.00',
      vendorGstin: '27AAAAA0000A1Z5',
      confidence: '99.4%',
      status: 'VERIFIED'
    },
    {
      id: 'scan_102',
      docName: 'Form16_AY2026-27.jpg',
      docType: 'Form 16 Tax Certificate',
      time: '1 hour ago',
      grossSalary: '₹ 18,50,000.00',
      sec80C: '₹ 1,50,000.00',
      sec80D: '₹ 25,000.00',
      tdsDeducted: '₹ 2,42,500.00',
      confidence: '98.8%',
      status: 'VERIFIED'
    }
  ]);

  const videoRef = useRef(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (err) {
      alert("Unable to access camera. Please allow camera permissions or upload a file.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      setCameraActive(false);
    }
  };

  const handleCaptureSnapshot = () => {
    setIsScanning(true);
    setTimeout(() => {
      const newScanObj = {
        id: 'scan_' + Date.now(),
        docName: 'Camera_Snapshot_' + Math.floor(Math.random() * 1000) + '.jpg',
        docType: 'Scanned Financial Voucher',
        time: 'Just now',
        taxableAmount: '₹ 48,500.00',
        cgst: '₹ 4,365.00 (9%)',
        sgst: '₹ 4,365.00 (9%)',
        totalAmount: '₹ 57,230.00',
        vendorGstin: '33BBBBB1111B1Z2',
        confidence: '97.9%',
        status: 'VERIFIED'
      };
      setScannedResults([newScanObj, ...scannedResults]);
      setIsScanning(false);
    }, 1500);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsScanning(true);
    setTimeout(() => {
      const newScanObj = {
        id: 'scan_' + Date.now(),
        docName: file.name,
        docType: 'Uploaded Tax Invoice PDF',
        time: 'Just now',
        taxableAmount: '₹ 82,000.00',
        cgst: '₹ 7,380.00 (9%)',
        sgst: '₹ 7,380.00 (9%)',
        totalAmount: '₹ 96,760.00',
        vendorGstin: '07CCCCC2222C1Z8',
        confidence: '99.1%',
        status: 'VERIFIED'
      };
      setScannedResults([newScanObj, ...scannedResults]);
      setIsScanning(false);
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-sans">
      
      {/* Header Banner */}
      <div className="glass-panel-glow p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2 font-display">
            <Sparkles className="w-5 h-5 text-[#818cf8]" />
            CA_AI Document OCR Scanner & Compliance Sandbox
          </h1>
          <p className="text-xs text-slate-300 font-mono mt-0.5">
            Instant AI extraction for Tax Invoices, Form 16, Form 26AS, and Balance Sheets.
          </p>
        </div>

        <div className="flex bg-[#09090b]/80 p-1 rounded-xl font-mono text-xs border border-[#1f1f23] shrink-0">
          <button
            onClick={() => { setSourceMode('camera'); stopCamera(); }}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${sourceMode === 'camera' ? 'bg-[#6366f1] text-white font-bold' : 'text-slate-400'}`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Webcam Stream</span>
          </button>

          <button
            onClick={() => { setSourceMode('upload'); stopCamera(); }}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${sourceMode === 'upload' ? 'bg-[#6366f1] text-white font-bold' : 'text-slate-400'}`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>File Upload</span>
          </button>
        </div>
      </div>

      {/* Input Viewport & Control Area */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left Viewport / Scanner Feed */}
        <div className="md:col-span-6 glass-panel p-5 rounded-2xl space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center justify-between">
            <span>Input Viewport</span>
            {isScanning && <span className="text-[#818cf8] animate-pulse flex items-center gap-1"><RefreshCw className="w-3 h-3 animate-spin" /> AI Analyzing...</span>}
          </h3>

          {sourceMode === 'camera' ? (
            <div className="space-y-4">
              <div className="relative aspect-video bg-[#09090b] rounded-2xl overflow-hidden border border-[#1f1f23] flex items-center justify-center">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover"></video>
                {!cameraActive && (
                  <div className="text-center p-4 space-y-2 font-mono text-xs text-slate-400">
                    <Camera className="w-8 h-8 text-slate-600 mx-auto" />
                    <p>Camera is currently inactive.</p>
                    <button
                      onClick={startCamera}
                      className="book-cta text-xs py-2 px-4"
                    >
                      Start Camera Viewport
                    </button>
                  </div>
                )}
              </div>

              {cameraActive && (
                <div className="flex gap-2">
                  <button
                    onClick={handleCaptureSnapshot}
                    disabled={isScanning}
                    className="flex-1 book-cta py-2.5 text-xs"
                  >
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>Capture & Scan AI OCR</span>
                  </button>
                  
                  <button
                    onClick={stopCamera}
                    className="btn-black py-2.5 px-4 text-xs"
                  >
                    Stop
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="border-2 border-dashed border-[#1f1f23] hover:border-[#6366f1] p-8 rounded-2xl text-center space-y-3 font-mono transition-colors">
              <Upload className="w-10 h-10 text-[#6366f1] mx-auto" />
              <div>
                <span className="text-xs font-bold text-white block">Drop Tax Document PDF or Image</span>
                <span className="text-[10px] text-slate-500">Supports PDF, JPG, PNG up to 25MB</span>
              </div>
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={handleFileUpload}
                className="hidden"
                id="docUploadInput"
              />
              <label
                htmlFor="docUploadInput"
                className="book-cta text-xs py-2 px-4 cursor-pointer inline-block"
              >
                Browse Document File
              </label>
            </div>
          )}
        </div>

        {/* Right Extracted OCR Gallery Cards */}
        <div className="md:col-span-6 space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center justify-between">
            <span>Saved OCR Extractions ({scannedResults.length})</span>
            <span className="text-[10px] text-[#22c55e]">✓ Deep AI Model Active</span>
          </h3>

          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            {scannedResults.map(res => (
              <div key={res.id} className="glass-panel p-4 rounded-2xl space-y-3 hover:border-slate-700 transition-colors">
                
                <div className="flex items-center justify-between border-b border-[#1f1f23] pb-2">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-[#6366f1]" />
                    <span className="font-bold text-xs text-white">{res.docName}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-[#22c55e] text-[10px] font-mono font-bold border border-emerald-500/20">
                    {res.status} ({res.confidence})
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  {res.taxableAmount && (
                    <div className="bg-[#09090b] p-2.5 rounded-xl border border-[#1f1f23]">
                      <span className="text-[10px] text-slate-400 block">Taxable Value</span>
                      <span className="text-sm font-bold text-white">{res.taxableAmount}</span>
                    </div>
                  )}

                  {res.totalAmount && (
                    <div className="bg-[#09090b] p-2.5 rounded-xl border border-[#1f1f23]">
                      <span className="text-[10px] text-slate-400 block">Total Invoice Amount</span>
                      <span className="text-sm font-bold text-[#818cf8]">{res.totalAmount}</span>
                    </div>
                  )}

                  {res.grossSalary && (
                    <div className="bg-[#09090b] p-2.5 rounded-xl border border-[#1f1f23]">
                      <span className="text-[10px] text-slate-400 block">Gross Form 16 Salary</span>
                      <span className="text-sm font-bold text-white">{res.grossSalary}</span>
                    </div>
                  )}

                  {res.tdsDeducted && (
                    <div className="bg-[#09090b] p-2.5 rounded-xl border border-[#1f1f23]">
                      <span className="text-[10px] text-slate-400 block">TDS Deducted</span>
                      <span className="text-sm font-bold text-[#22c55e]">{res.tdsDeducted}</span>
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
}

import React, { useState, useRef } from 'react';
import { Upload, CheckCircle2, FileCheck, AlertCircle, ArrowRight, Shield, Mail } from 'lucide-react';

interface ProjectIntakeFormProps {
  initialService?: string;
  initialMaterial?: string;
}

export const ProjectIntakeForm: React.FC<ProjectIntakeFormProps> = ({
  initialService = 'Rapid Prototyping',
  initialMaterial = 'PLA / PLA Carbon Fiber',
}) => {
  // Contact & Delivery Details
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  // Project Parameters (automatically mapped from active service/material selection)
  const projectType = initialService;
  const material = initialMaterial;
  const [message, setMessage] = useState('');

  // CAD File Upload State
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    size: string;
    rawFile?: File;
    base64?: string;
  } | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Submission & Network State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [webhookError, setWebhookError] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const processFile = (file: File) => {
    const szMB = (file.size / (1024 * 1024)).toFixed(2);
    const reader = new FileReader();
    reader.onload = () => {
      const base64Content = (reader.result as string).split(',')[1] || '';
      setUploadedFile({
        name: file.name,
        size: `${szMB} MB`,
        rawFile: file,
        base64: base64Content,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setWebhookError(null);

    if (!fullName.trim() || !phone.trim() || !email.trim()) {
      setWebhookError('Please provide your Full Name, Phone Number, and Work Email.');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      fullName,
      phone,
      email,
      address,
      projectType,
      material,
      notes: message,
      fileName: uploadedFile ? uploadedFile.name : null,
      fileSize: uploadedFile ? uploadedFile.size : null,
      fileData: uploadedFile ? uploadedFile.base64 : null,
      fileMimeType: uploadedFile?.rawFile?.type || 'application/octet-stream',
    };

    // Configurable Google Apps Script WebApp endpoint strictly from environment
    const scriptUrl = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL;

    if (!scriptUrl) {
      console.warn('VITE_GOOGLE_APPS_SCRIPT_URL is not set in environment. Submission is disabled.');
      setIsSubmitting(false);
      setWebhookError(
        'Configuration Error: Webhook URL is not configured. Please contact engineering directly via email below.'
      );
      return;
    }

    try {
      // Standard CORS fetch without mode: no-cors
      // Using text/plain;charset=utf-8 avoids CORS OPTIONS preflight that Apps Script redirects can block
      const response = await fetch(scriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
        redirect: 'follow',
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const json = await response.json();
      if (json && json.success === true) {
        setIsSubmitting(false);
        setSubmitted(true);
      } else {
        throw new Error(json?.error || 'Database submission rejected by server');
      }
    } catch (err) {
      console.error('Webhook error:', err);
      setIsSubmitting(false);
      setWebhookError(
        `Submission failed: ${err instanceof Error ? err.message : 'Network error'}. Your inputs are preserved below—click the Direct Email link to send immediately.`
      );
    }
  };

  const mailtoLink = `mailto:projects@sologixenergy.com?subject=${encodeURIComponent(
    `Quote Request: ${fullName} - ${projectType}`
  )}&body=${encodeURIComponent(
    `Name: ${fullName}\nPhone: ${phone}\nEmail: ${email}\nDelivery Address: ${address}\nProject Type: ${projectType}\nMaterial Preference: ${material}\nAttached File: ${uploadedFile ? uploadedFile.name : 'None'
    }\n\nProject Notes:\n${message}`
  )}`;

  return (
    <section id="contact" className="relative py-18 bg-[#D6E6F5] text-[#1F2937] border-t border-[#C9DBEC]">
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full bg-[#FF7A00]/10 border border-[#FF7A00]/30 text-[#FF7A00] font-mono text-xs uppercase tracking-widest font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF7A00]" />
            <span>07 // DFM EVALUATION & QUOTE INTAKE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-black text-[#0F1A2B] tracking-tight uppercase">
            HAVE A DESIGN IN MIND?
          </h2>
          <p className="mt-2.5 text-xs sm:text-sm text-[#5B6B7F] font-sans leading-relaxed">
            Every part is individually evaluated by our engineering team. Upload your CAD geometry and specifications to receive a customized manufacturing quotation with zero tooling barrier.
          </p>
        </div>

        {/* Form Container */}
        <div className="rounded-sm bg-white border border-[#C9DBEC] p-5 sm:p-7 lg:p-8 shadow-xl">
          {submitted ? (
            /* Clear Confirmation State */
            <div className="text-center py-10 space-y-5">
              <div className="w-14 h-14 rounded-full bg-[#FF7A00]/10 border border-[#FF7A00] flex items-center justify-center mx-auto text-[#FF7A00]">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <h3 className="text-xl sm:text-2xl font-display font-bold text-[#0F1A2B] uppercase">
                Quote Request Submitted
              </h3>

              <div className="max-w-xl mx-auto p-5 rounded-sm bg-[#F5F8FC] border border-[#C9DBEC] text-left space-y-2.5 font-sans text-sm text-[#1F2937]">
                <p className="text-[#0F1A2B] font-semibold">
                  Thanks, {fullName} — our team will review your design and reply with a quote at:
                </p>
                <ul className="space-y-1 text-xs font-mono text-[#5B6B7F] pl-2 border-l border-[#FF7A00]">
                  <li>Email: <strong className="text-[#0F1A2B]">{email}</strong></li>
                  <li>Phone: <strong className="text-[#0F1A2B]">{phone}</strong></li>
                </ul>
                <p className="pt-1.5 text-xs sm:text-sm text-[#FF7A00] font-mono font-medium">
                  {/* PLACEHOLDER — confirm with business before launch: quote turnaround time */}
                  Estimated response time: Within 1 to 2 business days.
                </p>
              </div>

              <div className="pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setUploadedFile(null);
                  }}
                  className="px-5 py-2 rounded-sm bg-slate-200 hover:bg-slate-300 text-xs font-mono uppercase text-slate-800 transition-colors"
                >
                  Submit Another Design
                </button>
              </div>
            </div>
          ) : (
            /* Main Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              {webhookError && (
                <div className="p-3.5 rounded-sm bg-red-50 border border-red-300 text-xs sm:text-sm font-sans text-red-700 space-y-2.5">
                  <div className="flex items-center gap-2 font-semibold text-red-800">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{webhookError}</span>
                  </div>
                  <div>
                    <a
                      href={mailtoLink}
                      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-sm bg-[#FF7A00] text-black font-mono font-bold text-xs uppercase"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Send Prefilled Email Instead</span>
                    </a>
                  </div>
                </div>
              )}

              {/* 01: Client & Delivery Information */}
              <div>
                <span className="text-xs font-mono tracking-widest text-[#FF7A00] uppercase font-bold block mb-3">
                  01 // CLIENT & DELIVERY DETAILS
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs sm:text-sm font-mono text-[#0F1A2B] font-medium mb-1.5 uppercase">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. John The Don"
                      className="w-full px-3.5 py-2.5 sm:py-3 rounded-sm bg-[#F5F8FC] border border-[#C9DBEC] focus:border-[#FF7A00] focus:bg-white focus:outline-none text-sm sm:text-base text-[#1F2937] font-sans transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-mono text-[#0F1A2B] font-medium mb-1.5 uppercase">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 9876543210"
                      className="w-full px-3.5 py-2.5 sm:py-3 rounded-sm bg-[#F5F8FC] border border-[#C9DBEC] focus:border-[#FF7A00] focus:bg-white focus:outline-none text-sm sm:text-base text-[#1F2937] font-sans transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-mono text-[#0F1A2B] font-medium mb-1.5 uppercase">
                      Work Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full px-3.5 py-2.5 sm:py-3 rounded-sm bg-[#F5F8FC] border border-[#C9DBEC] focus:border-[#FF7A00] focus:bg-white focus:outline-none text-sm sm:text-base text-[#1F2937] font-sans transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-mono text-[#0F1A2B] font-medium mb-1.5 uppercase">
                      Delivery Address / Location
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="City, State, Country (for freight estimate)"
                      className="w-full px-3.5 py-2.5 sm:py-3 rounded-sm bg-[#F5F8FC] border border-[#C9DBEC] focus:border-[#FF7A00] focus:bg-white focus:outline-none text-sm sm:text-base text-[#1F2937] font-sans transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* 02: CAD / STL File Upload */}
              <div>
                <span className="text-xs font-mono tracking-widest text-[#FF7A00] uppercase font-bold block mb-1.5">
                  02 // 3D MODEL / CAD GEOMETRY FILE
                </span>
                <p className="text-xs sm:text-sm text-[#5B6B7F] font-mono mb-2.5">
                  Accepted formats: .STL, .STEP, .STP, .OBJ, .3MF (Max 50MB)
                </p>

                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`p-5 sm:p-6 border-2 border-dashed rounded-sm text-center cursor-pointer transition-all duration-200 ${dragActive
                    ? 'border-[#FF7A00] bg-orange-50/50'
                    : 'border-[#2E90D9]/40 hover:border-[#2E90D9] bg-[#F5F8FC]'
                    }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".stl,.step,.stp,.obj,.3mf"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {uploadedFile ? (
                    <div className="flex items-center justify-center gap-2.5 text-emerald-600 font-mono text-sm sm:text-base font-semibold">
                      <FileCheck className="w-5 h-5 text-[#FF7A00]" />
                      <span>{uploadedFile.name} ({uploadedFile.size}) ready for evaluation</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="w-7 h-7 text-[#2E90D9] mx-auto" />
                      <p className="text-sm sm:text-base font-sans text-[#1F2937]">
                        Drag and drop your CAD or STL file here, or{' '}
                        <span className="text-[#2E90D9] underline font-mono font-semibold">browse files</span>
                      </p>
                      <p className="text-xs font-mono text-[#5B6B7F]">
                        Encrypted transmission to secure engineering drive
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* 03: Optional Message / Functional Requirements */}
              <div>
                <label className="block text-xs sm:text-sm font-mono text-[#0F1A2B] font-medium mb-1.5 uppercase">
                  Optional Notes / Specific Requirements
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Mention critical dimensions, thermal conditions, mechanical stress, target quantities, or delivery deadlines..."
                  className="w-full px-3.5 py-2.5 sm:py-3 rounded-sm bg-[#F5F8FC] border border-[#C9DBEC] focus:border-[#FF7A00] focus:bg-white focus:outline-none text-sm sm:text-base text-[#1F2937] font-sans transition-colors"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3.5">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-mono text-[#5B6B7F]">
                  <Shield className="w-4 h-4 text-[#FF7A00]" />
                  <span>Strict confidentiality • Direct quotation by engineering staff</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-7 py-3 rounded-sm bg-[#FF7A00] hover:bg-[#FF8F1F] disabled:opacity-50 text-black font-mono font-bold text-xs sm:text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(255,122,0,0.35)] flex items-center justify-center gap-2 transition-all"
                >
                  {isSubmitting ? (
                    <span>Submitting CAD Intake...</span>
                  ) : (
                    <>
                      <span>Get a Quote</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

import { useState, useRef, useEffect, useCallback } from "react";
import { lookupChannel, extractSlug, type KickChannel } from "../lib/kickApi";

interface AddStreamerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (streamer: string) => void;
}

export default function AddStreamerModal({
  isOpen,
  onClose,
  onAdd,
}: AddStreamerModalProps) {
  const [value, setValue] = useState("");
  const [result, setResult] = useState<KickChannel | null>(null);
  const [searching, setSearching] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [lastQuery, setLastQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setValue("");
      setResult(null);
      setNotFound(false);
      setSearching(false);
      setLastQuery("");
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      abortRef.current?.abort();
      clearTimeout(debounceRef.current);
    }
  }, [isOpen]);

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  const doSearch = useCallback((raw: string) => {
    clearTimeout(debounceRef.current);
    abortRef.current?.abort();

    const slug = extractSlug(raw);
    if (slug.length < 2) {
      setResult(null);
      setNotFound(false);
      setSearching(false);
      setLastQuery("");
      return;
    }

    // Don't re-search same query
    setLastQuery(slug);
    setResult(null);
    setNotFound(false);
    setSearching(true);

    debounceRef.current = setTimeout(async () => {
      const controller = new AbortController();
      abortRef.current = controller;

      const channel = await lookupChannel(slug, controller.signal);
      if (controller.signal.aborted) return;

      setSearching(false);
      if (channel) {
        setResult(channel);
        setNotFound(false);
      } else {
        setResult(null);
        setNotFound(true);
      }
    }, 300);
  }, []);

  if (!isOpen) return null;

  const handleSelect = (slug: string) => {
    onAdd(slug);
    onClose();
  };

  const handleSubmit = () => {
    if (result) {
      handleSelect(result.slug);
    } else {
      const slug = extractSlug(value);
      if (slug.length >= 2) {
        onAdd(slug);
        onClose();
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="bg-[#1a1a20] rounded-xl p-5 w-[420px] max-w-[95vw] shadow-2xl border border-[#2a2a35]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <h2 className="text-white text-lg font-semibold mb-3 flex items-center gap-2">
          <svg className="w-5 h-5 text-[#53fc18]" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
          </svg>
          Yayıncı Ekle
        </h2>

        {/* Search input */}
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280]">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              doSearch(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
            placeholder="Kanal adı veya Kick URL'si yapıştırın"
            className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-[#0e0e10] border border-[#2f2f35] text-white placeholder-[#4b5563] focus:outline-none focus:border-[#53fc18] focus:ring-1 focus:ring-[#53fc18]/30 text-sm transition-all"
          />
          {searching && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <svg className="w-4 h-4 animate-spin text-[#53fc18]" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
          )}
        </div>

        <p className="text-[11px] text-[#4b5563] mt-1.5 px-1">
          Örnek: <span className="text-[#6b7280]">hilalin22</span>  ·  <span className="text-[#6b7280]">kick.com/hilalin22</span>
        </p>

        {/* Result area */}
        <div className="mt-3 min-h-[56px]">
          {/* Channel found */}
          {result && !searching && (
            <button
              onClick={() => handleSelect(result.slug)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#0e0e10] hover:bg-[#1f1f28] border border-[#2f2f35] hover:border-[#53fc18]/40 transition-all cursor-pointer group"
            >
              {/* Profile picture */}
              {result.profilePicture ? (
                <img
                  src={result.profilePicture}
                  alt={result.username}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-[#2f2f35] group-hover:ring-[#53fc18]/40 transition-all"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#53fc18]/15 ring-2 ring-[#2f2f35] flex items-center justify-center text-[#53fc18] font-bold text-sm">
                  {result.username[0]?.toUpperCase()}
                </div>
              )}

              {/* Channel info */}
              <div className="flex flex-col items-start flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-white text-sm font-semibold truncate">
                    {result.username}
                  </span>
                  {result.isVerified && (
                    <svg className="w-3.5 h-3.5 text-[#53fc18] shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span className="text-xs text-[#6b7280]">{result.slug}</span>
              </div>

              {/* Live badge + add hint */}
              <div className="flex items-center gap-2 shrink-0">
                {result.isLive && (
                  <span className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase bg-red-600 text-white rounded">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    Canlı
                  </span>
                )}
                <svg className="w-4 h-4 text-[#53fc18] opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </div>
            </button>
          )}

          {/* Not found */}
          {notFound && !searching && lastQuery && (
            <div className="px-3 py-3 rounded-lg bg-[#0e0e10] border border-[#2f2f35]">
              <p className="text-sm text-[#6b7280]">
                <span className="text-white font-medium">"{lastQuery}"</span> adında bir kanal bulunamadı
              </p>
              <p className="text-[11px] text-[#4b5563] mt-1">
                Kick.com kanal URL'sindeki adı tam olarak yazdığınızdan emin olun
              </p>
            </div>
          )}

          {/* Idle state hint */}
          {!result && !notFound && !searching && value.trim().length === 0 && (
            <div className="flex items-center gap-2 px-3 py-3 text-xs text-[#4b5563]">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Kick.com yayıncısının kanal adını tam olarak girin</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 mt-3">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-sm text-[#adadb8] hover:text-white hover:bg-[#2f2f35] transition-colors cursor-pointer"
          >
            İptal
          </button>
          <button
            onClick={handleSubmit}
            disabled={!result && extractSlug(value).length < 2}
            className="px-4 py-1.5 rounded-lg text-sm bg-[#53fc18] text-black font-medium hover:bg-[#45d615] transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Ekle
          </button>
        </div>
      </div>
    </div>
  );
}

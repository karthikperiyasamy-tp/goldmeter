"use client";

type SharePrintButtonsProps = {
  title: string;
  text: string;
  className?: string;
};

export default function SharePrintButtons({
  title,
  text,
  className = "",
}: SharePrintButtonsProps) {
  const handleShare = async () => {
    const shareData = {
      title,
      text,
      url: window.location.href,
    };
    
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        // User cancelled or error occurred
        console.log('Share cancelled or failed');
      }
    } else {
      navigator.clipboard.writeText(`${text} ${window.location.href}`);
      alert('Link copied to clipboard!');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={`flex gap-2 print:hidden ${className}`}>
      <button
        onClick={handleShare}
        className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        aria-label="Share this page"
      >
        📤 Share
      </button>
      <button
        onClick={handlePrint}
        className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        aria-label="Print this page"
      >
        🖨️ Print
      </button>
    </div>
  );
}


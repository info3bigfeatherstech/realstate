import { useEffect, useRef, useState } from "react";
import { Heart, Share2, Loader2, Check } from "lucide-react";
import { useGetPropertyShareUrlsQuery } from "../../../../REDUX_FEATURES/REDUX_SLICES/userSocialApi/userSocialApi";
import { getSocialIconSvg } from "../../../Shared/SocialIcons";
import { toast } from "../../../Shared/ToastConfig";

const PLATFORM_BG = {
  whatsapp: "bg-[#25D366]",
  facebook: "bg-[#1877F2]",
  instagram: "bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF]",
  telegram: "bg-[#29B6F6]",
  youtube: "bg-[#FF0000]",
  linkedin: "bg-[#0A66C2]",
  twitter: "bg-[#111]",
};

const DISPLAY_ORDER = ["whatsapp", "facebook", "instagram", "telegram"];

function buildShareLinks(apiLinks, propertyUrl, propertyTitle) {
  if (!propertyUrl) return apiLinks || [];

  const title = propertyTitle || "Check out this property";
  const encodedUrl = encodeURIComponent(propertyUrl);
  const encodedTitle = encodeURIComponent(title);

  const defaults = {
    whatsapp: {
      platform: "whatsapp",
      label: "WhatsApp",
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${title} ${propertyUrl}`)}`,
    },
    facebook: {
      platform: "facebook",
      label: "Facebook",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    telegram: {
      platform: "telegram",
      label: "Telegram",
      url: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    },
    instagram: {
      platform: "instagram",
      label: "Instagram",
      url: propertyUrl,
      copyOnly: true,
    },
  };

  const apiMap = Object.fromEntries((apiLinks || []).map((link) => [link.platform, link]));

  return DISPLAY_ORDER.map((platform) => apiMap[platform] || defaults[platform]).filter(Boolean);
}

function CopyLinkIcon() {
  return (
    <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="8" width="12" height="12" rx="2" stroke="white" strokeWidth="2" />
      <path d="M6 16V6a2 2 0 0 1 2-2h10" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function PropertyShareModal({ propertyId, liked, onWishlistToggle }) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const wrapperRef = useRef(null);

  const { data, isLoading } = useGetPropertyShareUrlsQuery(propertyId, {
    skip: !propertyId,
  });

  const shareLinks = data?.shareLinks || [];
  const propertyUrl = data?.propertyUrl || "";
  const propertyTitle = data?.propertyTitle || "";

  const sortedLinks = buildShareLinks(shareLinks, propertyUrl, propertyTitle);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleCopyLink = async (url = propertyUrl) => {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied!");
      setTimeout(() => {
        setCopied(false);
        setIsOpen(false);
      }, 1200);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  return (
    <div ref={wrapperRef} className="relative flex items-center gap-3">
      <button
        type="button"
        onClick={onWishlistToggle}
        className="flex flex-1 items-center justify-center gap-2 rounded-full border border-[#E5E5E5] bg-white py-3.5 text-[14px] font-semibold text-[#666] transition hover:border-[#CCC] hover:text-[#111]"
      >
        <Heart
          size={16}
          strokeWidth={2}
          color={liked ? "#E53E3E" : "#888"}
          fill={liked ? "#E53E3E" : "none"}
        />
        Wishlist
      </button>

      <div className="relative flex-1">
        {isOpen && (
          <div className="absolute bottom-[calc(100%+10px)] right-0 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-center gap-2.5 rounded-full border border-[#EBEBEB] bg-white px-3 py-2.5 shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin text-[#888]" />
              ) : (
                <>
                  {sortedLinks.map((link) => {
                    const icon = getSocialIconSvg(link.platform);
                    const bg = PLATFORM_BG[link.platform] || "bg-[#555]";

                    if (link.copyOnly) {
                      return (
                        <button
                          key={link.platform}
                          type="button"
                          title={link.label}
                          onClick={() => handleCopyLink(link.url)}
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white transition-transform hover:scale-105 active:scale-95 ${bg}`}
                        >
                          <span className="flex h-[18px] w-[18px] items-center justify-center">
                            {icon}
                          </span>
                        </button>
                      );
                    }

                    return (
                      <a
                        key={link.platform}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={link.label}
                        onClick={() => setIsOpen(false)}
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white transition-transform hover:scale-105 active:scale-95 ${bg}`}
                      >
                        <span className="flex h-[18px] w-[18px] items-center justify-center">
                          {icon}
                        </span>
                      </a>
                    );
                  })}
                  {propertyUrl && (
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      title="Copy link"
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#374151] text-white transition-transform hover:scale-105 active:scale-95"
                    >
                      {copied ? <Check size={18} strokeWidth={2.5} /> : <CopyLinkIcon />}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-[#1B2537] py-3.5 text-[14px] font-bold text-white transition hover:bg-[#2a3548] active:scale-[0.99]"
        >
          <Share2 size={16} strokeWidth={2.5} />
          Share
        </button>
      </div>
    </div>
  );
}

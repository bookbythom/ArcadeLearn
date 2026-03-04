import { useState, useEffect, useRef } from "react";
import { beginnerThemes, type KeywordDefinition } from "@/app/data/beginnerthemes";
import { intermediateThemes } from "@/app/data/intermediatethemes";
import { professionalThemes } from "@/app/data/professionalthemes";
import { LoadingSpinner } from "@/app/components/ui/LoadingSpinner";
import { Pencil, Upload } from "lucide-react";

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

const validateImageFile = (file: File): string | null => {
  if (!file.type.startsWith("image/")) {
    return "Please select an image file";
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return "Image must be smaller than 5MB";
  }

  return null;
};

// Funkcia pre preloading obrazku
const preloadImage = (url: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = url;
  });
};

// Interface pre keyword popup properties
interface KeywordPopupProps {
  keyword: string;
  explanation: string;
  imageUrl?: string | null;
  keywordIndex?: number;
  isAdmin?: boolean;
  level?: string;
  theme?: number;
  accessToken?: string;
  onImageUpdate?: () => void;
  onClose: () => void;
  position: { x: number; y: number };
}

// Komponent pre keyword popup
function KeywordPopup(props: KeywordPopupProps) {
  const [showActionModal, setShowActionModal] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const [adjustedPosition, setAdjustedPosition] = useState({
    x: props.position.x,
    y: props.position.y,
    transform: "translate(10px, -50%)",
  });
  
  // Effect pre nastavenie pozicie popupu
  useEffect(() => {
    if (popupRef.current) {
      const popup = popupRef.current;
      const rect = popup.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      let x = props.position.x;
      let y = props.position.y;
      let transform = "translate(10px, -50%)";
      
      // Kontrola ci popup preleze cez pravu hranu
      if (props.position.x + rect.width + 20 > viewportWidth) {
        // Umiestnime na lavu stranu keywordu
        x = props.position.x;
        transform = "translate(calc(-100% - 10px), -50%)";
      }
      
      // Kontrola ci popup preleze cez lavu hranu (ked je umiestneny nalavo)
      if (transform.includes("-100%") && x - rect.width - 10 < 0) {
        // Vycentrujeme ho horizontalne
        x = viewportWidth / 2;
        transform = "translate(-50%, -50%)";
      }
      
      // Kontrola prelezienia cez hornu hranu
      if (y - rect.height / 2 < 20) {
        y = rect.height / 2 + 20;
      }
      
      // Kontrola prelezienia cez dolnu hranu
      if (y + rect.height / 2 > viewportHeight - 20) {
        y = viewportHeight - rect.height / 2 - 20;
      }
      
      setAdjustedPosition({ x, y, transform });
    }
  }, [props.position.x, props.position.y, props.imageUrl]);

  // Funkcia pre pridanie alebo zmenu obrazku
  const handleUploadKeywordImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const validationError = validateImageFile(file);
      if (validationError) {
        alert(validationError);
        return;
      }

      try {
        const { adminAPI } = await import("@/app/utils/api");
        await adminAPI.uploadKeywordImage(
          props.accessToken!,
          props.level!,
          props.theme!.toString(),
          props.keywordIndex!.toString(),
          file
        );
        
        props.onImageUpdate?.();
        alert("Image uploaded successfully!");
      } catch (error: any) {
        alert(error.message || "Failed to upload image");
      }
    };
    input.click();
  };

  // Funkcia pre vymazanie obrazku
  const handleRemoveImage = async () => {
    setShowActionModal(false);
    
    if (!confirm("Are you sure you want to remove this image?")) {
      return;
    }

    try {
      const { adminAPI } = await import("@/app/utils/api");
      await adminAPI.deleteKeywordImage(
        props.accessToken!,
        props.level!,
        props.theme!.toString(),
        props.keywordIndex!.toString()
      );
      
      props.onImageUpdate?.();
      alert("Image removed successfully!");
    } catch (error: any) {
      alert(error.message || "Failed to remove image");
    }
  };
  
  return (
    <>
      <div 
        className="fixed inset-0 z-[110]"
        onClick={props.onClose}
      />
      <div 
        ref={popupRef}
        className="fixed z-[111] bg-[#2c2c2e] rounded-[27px] p-[32px] w-[452px] max-w-[92vw] shadow-xl"
        style={{
          left: `${adjustedPosition.x}px`,
          top: `${adjustedPosition.y}px`,
          transform: adjustedPosition.transform,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sekcia s obrazkom */}
        {props.imageUrl ? (
          <div className="mb-4 relative group">
            <img 
              src={props.imageUrl} 
              alt={props.keyword}
              className="w-full h-auto max-h-[360px] rounded-lg object-contain bg-[#1c1c1e]"
            />
            {props.isAdmin && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowActionModal(true);
                }}
                className="absolute top-2 right-2 bg-[#4cb025]/90 hover:bg-[#3d9d1e] backdrop-blur-[4.2px] rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Pencil className="w-4 h-4 text-white" />
              </button>
            )}
          </div>
        ) : props.isAdmin ? (
          <div className="mb-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleUploadKeywordImage();
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-[#4cb025] hover:bg-[#3d9d1e] text-white rounded-lg transition-colors text-sm"
            >
              <Upload className="w-4 h-4" />
              Add Image
            </button>
          </div>
        ) : null}
        
        <p className="text-[clamp(14px,2vw,20px)] font-bold text-white leading-normal">
          <span className="text-white">{props.keyword} - </span>
          <span className="font-normal">{props.explanation}</span>
        </p>
      </div>
      
      {/* Action Modal - Remove alebo Change Image */}
      {showActionModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] flex items-center justify-center p-4"
          onClick={() => setShowActionModal(false)}
        >
          <div
            className="bg-[#2a2a2c] rounded-3xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-white mb-6 text-center">
              Manage Keyword Image
            </h3>
            
            <div className="flex flex-col gap-3">
              {/* Tlacidlo pre vymazanie obrazku */}
              <button
                onClick={handleRemoveImage}
                className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
              >
                Remove Image
              </button>
              
              {/* Tlacidlo pre zmenu obrazku */}
              <button
                onClick={handleUploadKeywordImage}
                className="w-full bg-[#4cb025] hover:bg-[#3d9d1e] text-white px-6 py-3 rounded-xl font-medium transition-colors"
              >
                Change Image
              </button>
              
              {/* Tlacidlo pre zrusenie */}
              <button
                onClick={() => setShowActionModal(false)}
                className="w-full bg-[#3a3a3c] hover:bg-[#4a4a4c] text-white px-6 py-3 rounded-xl font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Interface pre properties learn page mechanics komponentu
interface LearnPageMechanicsProps {
  level: "beginner" | "intermediate" | "professional";
  theme: number;
  onNext: () => void;
  isAdmin?: boolean;
  accessToken?: string;
  onLoadingComplete?: () => void;
}

// Hlavny komponent pre learn page mechanics
export default function LearnPageMechanics(props: LearnPageMechanicsProps) {
  const [activeKeyword, setActiveKeyword] = useState<{ 
    keyword: string; 
    explanation: string; 
    imageUrl: string | null;
    keywordIndex: number;
    position: { x: number; y: number } 
  } | null>(null);
  const [customImages, setCustomImages] = useState<(string | null)[]>([null, null, null, null]);
  const [loadedImageStates, setLoadedImageStates] = useState<boolean[]>([false, false, false, false]);
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [keywordImages, setKeywordImages] = useState<Map<number, string | null>>(new Map());
  const [keywordImagesReady, setKeywordImagesReady] = useState(false);
  const [descriptionFontSize, setDescriptionFontSize] = useState(20);
  
  const textContainerRef = useRef<HTMLDivElement>(null);
  const imagesContainerRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);

  // Effect pre nacitanie custom obrazkov
  useEffect(() => {
    const loadCustomImages = async () => {
      try {
        setAllImagesLoaded(false);
        setInitialLoadComplete(false);
        setKeywordImagesReady(false);
        setLoadedImageStates([false, false, false, false]);
        const { adminAPI } = await import("@/app/utils/api");
        
        const imagePromises = [0, 1, 2, 3].map(async (index) => {
          try {
            const result = await adminAPI.getContentImage(props.level, props.theme.toString(), index.toString());
            return result.hasCustomImage ? result.imageUrl : null;
          } catch (error) {
            return null;
          }
        });
        
        const images = await Promise.all(imagePromises);
        setCustomImages(images);
        setInitialLoadComplete(true);
      } catch (error) {
        setInitialLoadComplete(true);
      }
    };

    loadCustomImages();
  }, [props.level, props.theme]);

  // Effect pre kontrolu ci su vsetky obrazky nacitane
  useEffect(() => {
    if (!initialLoadComplete || !keywordImagesReady) {
      return;
    }

    const imagesToLoad = customImages.filter(img => img !== null);
    
    if (imagesToLoad.length === 0) {
      // Pridaj delay aj ked nie su ziadne obrazky pre stabilitu layoutu
      setTimeout(() => {
        setAllImagesLoaded(true);
      }, 300);
      return;
    }
    
    const allLoaded = customImages.every((img, index) => {
      if (img === null) return true;
      return loadedImageStates[index];
    });
    
    if (allLoaded) {
      // Pridaj delay aby boli vsetky obrazky plne renderovane
      setTimeout(() => {
        setAllImagesLoaded(true);
      }, 400);
    }
  }, [loadedImageStates, customImages, initialLoadComplete, keywordImagesReady]);

  // Effect pre preloadovanie obrazkov
  useEffect(() => {
    const imagesToPreload = customImages.filter((img): img is string => img !== null);
    
    if (imagesToPreload.length === 0) return;
    
    const preloadPromises = imagesToPreload.map(imageUrl => 
      preloadImage(imageUrl).catch(() => {})
    );
    
    Promise.all(preloadPromises);
  }, [customImages]);

  // Funkcia pre kliknutie na obrazok
  const handleImageClick = (imageIndex: number) => {
    if (!props.isAdmin) return;
    if (!props.accessToken || props.accessToken === "DEMO_TOKEN") {
      return;
    }
    
    // Vytvor skryty file input a trigger ho
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const validationError = validateImageFile(file);
      if (validationError) {
        alert(validationError);
        return;
      }

      try {
        const { adminAPI } = await import("@/app/utils/api");
        await adminAPI.uploadContentImage(
          props.accessToken!,
          props.level,
          props.theme.toString(),
          imageIndex.toString(),
          file
        );
        
        // Reload obrazky po uspesnom uploade
        reloadCustomImages();
        alert("Image uploaded successfully!");
      } catch (error: any) {
        alert(error.message || "Failed to upload image");
      }
    };
    input.click();
  };

  // Funkcia pre reload custom obrazkov
  const reloadCustomImages = async () => {
    try {
      const { adminAPI } = await import("@/app/utils/api");
      
      const imagePromises = [0, 1, 2, 3].map(async (index) => {
        try {
          const result = await adminAPI.getContentImage(props.level, props.theme.toString(), index.toString());
          return result.hasCustomImage ? result.imageUrl : null;
        } catch (error) {
          return null;
        }
      });
      
      const images = await Promise.all(imagePromises);
      setCustomImages(images);
    } catch (error) {}
  };

  // Funkcia pre ziskanie theme dat
  const getThemeData = () => {
    if (props.level === "beginner") {
      if (props.theme === 0) {
        return beginnerThemes[0];
      }
      return beginnerThemes[props.theme - 1] || beginnerThemes[0];
    } else if (props.level === "intermediate") {
      if (props.theme === 0) {
        return intermediateThemes[0];
      }
      return intermediateThemes[props.theme - 1] || intermediateThemes[0];
    } else if (props.level === "professional") {
      if (props.theme === 0) {
        return professionalThemes[0];
      }
      return professionalThemes[props.theme - 1] || professionalThemes[0];
    }
    return beginnerThemes[0];
  };

  const themeData = getThemeData();

  // Effect pre nacitanie keyword obrazkov
  useEffect(() => {
    const loadKeywordImages = async () => {
      try {
        setKeywordImagesReady(false);
        const { adminAPI } = await import("@/app/utils/api");
        const imageMap = new Map<number, string | null>();
        
        // Nacitaj obrazky pre vsetky keywords v tejto theme
        const imagePromises = themeData.keywords.map(async (_, index) => {
          try {
            const result = await adminAPI.getKeywordImage(props.level, props.theme.toString(), index.toString());
            return { index, imageUrl: result.hasCustomImage ? result.imageUrl : null };
          } catch (error) {
            return { index, imageUrl: null };
          }
        });
        
        const results = await Promise.all(imagePromises);
        results.forEach(({ index, imageUrl }) => {
          imageMap.set(index, imageUrl);
        });

        const keywordUrlsToPreload = results
          .map((item) => item.imageUrl)
          .filter((url): url is string => url !== null);

        if (keywordUrlsToPreload.length > 0) {
          await Promise.all(
            keywordUrlsToPreload.map((url) => preloadImage(url).catch(() => {}))
          );
        }
        
        setKeywordImages(imageMap);
        setKeywordImagesReady(true);
      } catch (error) {
        // Chyba pri nacitavani keyword obrazkov
        setKeywordImagesReady(true);
      }
    };
    
    loadKeywordImages();
  }, [props.level, props.theme, themeData.keywords.length]);

  // Funkcia pre reload keyword obrazkov
  const reloadKeywordImages = async () => {
    try {
      setKeywordImagesReady(false);
      const { adminAPI } = await import("@/app/utils/api");
      const imageMap = new Map<number, string | null>();
      
      const imagePromises = themeData.keywords.map(async (_, index) => {
        try {
          const result = await adminAPI.getKeywordImage(props.level, props.theme.toString(), index.toString());
          return { index, imageUrl: result.hasCustomImage ? result.imageUrl : null };
        } catch (error) {
          return { index, imageUrl: null };
        }
      });
      
      const results = await Promise.all(imagePromises);
      results.forEach(({ index, imageUrl }) => {
        imageMap.set(index, imageUrl);
      });

      const keywordUrlsToPreload = results
        .map((item) => item.imageUrl)
        .filter((url): url is string => url !== null);

      if (keywordUrlsToPreload.length > 0) {
        await Promise.all(
          keywordUrlsToPreload.map((url) => preloadImage(url).catch(() => {}))
        );
      }
      
      setKeywordImages(imageMap);
      setKeywordImagesReady(true);
    } catch (error) {}
  };

  // Funkcia pre kliknutie na keyword
  const handleKeywordClick = (keywordDef: KeywordDefinition, keywordIndex: number, event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    
    // Ziskaj poziciu kliknuteho keywordu
    const rect = event.currentTarget.getBoundingClientRect();
    const imageUrl = keywordImages.get(keywordIndex) || null;
    
    setActiveKeyword({ 
      keyword: keywordDef.displayName || keywordDef.text, 
      explanation: keywordDef.explanation, 
      imageUrl,
      keywordIndex,
      position: { 
        x: rect.right, 
        y: rect.top + rect.height / 2 
      } 
    });
  };

  // Funkcia pre drag and drop na keywords
  const handleKeywordDrop = async (keywordIndex: number, event: React.DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (!props.isAdmin || !props.accessToken) return;
    
    const files = event.dataTransfer.files;
    if (files.length === 0) return;
    
    const file = files[0];
    
    if (!file.type.startsWith('image/')) {
      alert("Please drop an image file");
      return;
    }
    
    const validationError = validateImageFile(file);
    if (validationError) {
      alert(validationError);
      return;
    }
    
    try {
      const { adminAPI } = await import("@/app/utils/api");
      await adminAPI.uploadKeywordImage(
        props.accessToken,
        props.level,
        props.theme.toString(),
        keywordIndex.toString(),
        file
      );
      
      await reloadKeywordImages();
      alert("Image uploaded successfully!");
    } catch (error: any) {
      alert(error.message || "Failed to upload image");
    }
  };
  
  // Funkcia pre drag over na keywords
  const handleKeywordDragOver = (event: React.DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  // Funkcia pre renderovanie textu s keywords
  const renderTextWithKeywords = () => {
    const fullText = themeData.content;
    
    // Vytvor mapu keywords pre rychle vyhladavanie s ich indexom
    const keywordMap = new Map<string, { def: KeywordDefinition; index: number }>();
    themeData.keywords.forEach((kw, idx) => {
      keywordMap.set(kw.text.toLowerCase(), { def: kw, index: idx });
    });
    
    // Rozdelenie podla **keyword** patternu
    const regex = /\*\*([^*]+)\*\*/g;
    const parts: (string | JSX.Element)[] = [];
    let lastIndex = 0;
    let match;
    let buttonKeyIndex = 0;
    
    while ((match = regex.exec(fullText)) !== null) {
      // Pridaj text pred matchom
      if (match.index > lastIndex) {
        parts.push(fullText.substring(lastIndex, match.index));
      }
      
      const keywordText = match[1];
      const keywordData = keywordMap.get(keywordText.toLowerCase());
      
      if (keywordData) {
        // Ak keyword existuje v nasom keywords poli, sprav ho klikatelnym
        parts.push(
          <button
            key={`keyword-${buttonKeyIndex++}`}
            onClick={(event) => handleKeywordClick(keywordData.def, keywordData.index, event)}
            onDrop={(event) => handleKeywordDrop(keywordData.index, event)}
            onDragOver={handleKeywordDragOver}
            className="text-[#4cb025] underline decoration-solid hover:text-[#3d9d1e] transition-colors cursor-pointer font-normal leading-normal"
            style={{ fontSize: `${descriptionFontSize}px` }}
          >
            {keywordText}
          </button>
        );
      } else {
        // Ak nie je matching keyword definition, renderuj ako normalny text (bez podciarknuta)
        parts.push(keywordText);
      }
      
      lastIndex = regex.lastIndex;
    }
    
    // Pridaj zostatok textu
    if (lastIndex < fullText.length) {
      parts.push(fullText.substring(lastIndex));
    }
    
    return parts;
  };

  // Effect pre dynamicku upravu velkosti fontu podla vysky images containeru
  useEffect(() => {
    const adjustFontSize = () => {
      if (!textContainerRef.current || !imagesContainerRef.current || !descriptionRef.current) return;
      
      // Upravuj len na desktope (lg breakpoint a vyssie)
      if (window.innerWidth < 1024) {
        setDescriptionFontSize(20);
        return;
      }
      
      const imagesHeight = imagesContainerRef.current.offsetHeight;
      const titleElement = textContainerRef.current.querySelector('h1');
      const lineElement = textContainerRef.current.querySelector('div.h-\\[4px\\]') as HTMLElement | null;
      
      if (!titleElement || !lineElement || imagesHeight === 0) return;
      
      const titleHeight = titleElement.offsetHeight;
      const lineHeight = lineElement.offsetHeight;
      const gap = 16; // gap medzi elementami (4 * 4px z gap-4)
      
      // Dostupna vyska pre description = vyska obrazkov - title - line - gaps
      const availableHeight = imagesHeight - titleHeight - lineHeight - (gap * 2);
      
      if (availableHeight <= 0) return;
      
      // Binarny search pre optimalnu velkost fontu
      let minSize = 10;
      let maxSize = 26;
      let optimalSize = 20;
      
      for (let i = 0; i < 15; i++) {
        const testSize = Math.floor((minSize + maxSize) / 2);
        descriptionRef.current.style.fontSize = `${testSize}px`;
        descriptionRef.current.style.lineHeight = '1.6';
        
        const descriptionHeight = descriptionRef.current.scrollHeight;
        
        if (descriptionHeight <= availableHeight) {
          optimalSize = testSize;
          minSize = testSize + 1;
        } else {
          maxSize = testSize - 1;
        }
      }
      
      setDescriptionFontSize(optimalSize);
    };

    // Spusti adjustment len ked su obrazky plne nacitane
    if (!allImagesLoaded) return;

    // Maly delay aby bol DOM plne renderovany
    const timeout = setTimeout(() => {
      adjustFontSize();
    }, 100);
    
    // Vytvor resize observer pre images container
    const resizeObserver = new ResizeObserver(() => {
      adjustFontSize();
    });
    
    if (imagesContainerRef.current) {
      resizeObserver.observe(imagesContainerRef.current);
    }
    
    // Pocuvaj aj window resize
    window.addEventListener('resize', adjustFontSize);
    
    return () => {
      clearTimeout(timeout);
      resizeObserver.disconnect();
      window.removeEventListener('resize', adjustFontSize);
    };
  }, [themeData.content, allImagesLoaded]);

  // Effect pre callback ked su obrazky nacitane
  useEffect(() => {
    if (allImagesLoaded && props.onLoadingComplete) {
      props.onLoadingComplete();
    }
  }, [allImagesLoaded, props.onLoadingComplete]);

  return (
    <>
      {/* Fullscreen loading animacia */}
      {!allImagesLoaded && (
        <LoadingSpinner className="z-[200]" />
      )}

      <div className="w-full flex items-center justify-center overflow-visible px-8 xl:px-12 2xl:px-16">
        <div className="w-full max-w-[1600px] overflow-visible">
          <div className="bg-[#1c1c1e] rounded-[46px] w-full p-14 xl:p-20 2xl:p-24 overflow-visible">
            <div className="flex flex-col lg:flex-row gap-24 xl:gap-32 items-start overflow-visible">
              <div ref={textContainerRef} className="flex flex-col gap-4 w-full max-w-[640px]">
                {/* Sekcia s nadpisom */}
                <h1 className="font-bold text-[clamp(16px,2.5vw,32px)] text-white leading-tight">
                  {themeData.title}
                </h1>
                
                <div className="w-full h-[4px]">
                  <svg className="w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 498 5">
                    <line stroke="white" strokeLinecap="round" strokeWidth="5" x1="2.5" x2="495.5" y1="2.5" y2="2.5" />
                  </svg>
                </div>

                {/* Sekcia s opisom */}
                <div 
                  ref={descriptionRef}
                  className="font-normal text-white leading-normal"
                  style={{ fontSize: `${descriptionFontSize}px` }}
                >
                  {renderTextWithKeywords()}
                </div>
              </div>

              <div ref={imagesContainerRef} className="w-full max-w-[700px]">
                <div className="grid grid-cols-2 gap-5">
                  {[1, 2, 3, 4].map((num) => {
                    const displayImage = customImages[num - 1];
                    const isLoaded = loadedImageStates[num - 1];
                    
                    return (
                      <div 
                        key={num}
                        className="relative bg-[#d9d9d9] rounded-[24px] flex items-center justify-center group cursor-pointer overflow-hidden"
                        style={{ aspectRatio: "336/330" }}
                        onClick={() => handleImageClick(num - 1)}
                      >
                        {displayImage ? (
                          <>
                            {/* Loading skeleton - zobrazuje sa kym sa nacitava obrazok */}
                            {!isLoaded && (
                              <div className="absolute inset-0">
                                <div 
                                  className="absolute inset-0 bg-[#d9d9d9]"
                                  style={{
                                    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                                  }}
                                />
                                <div 
                                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                  style={{
                                    animation: 'shimmer 2s ease-in-out infinite'
                                  }}
                                />
                              </div>
                            )}
                            {/* Skutocny obrazok s fade-in tranziziou */}
                            <img
                              src={displayImage}
                              alt={`Obrázok ${num}`}
                              className={`w-full h-full object-cover transition-opacity duration-300 ${
                                isLoaded ? 'opacity-100' : 'opacity-0'
                              }`}
                              loading="eager"
                              decoding="async"
                              onLoad={() => {
                                setLoadedImageStates(prev => {
                                  const nextStates = [...prev];
                                  nextStates[num - 1] = true;
                                  return nextStates;
                                });
                              }}
                            />
                          </>
                        ) : (
                          <div className="absolute inset-0 bg-[#d9d9d9]"></div>
                        )}
                        {props.isAdmin && (
                          <div className="absolute top-2 right-2 bg-[#525252]/90 backdrop-blur-[4.2px] rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Pencil className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {activeKeyword && (
        <KeywordPopup
          keyword={activeKeyword.keyword}
          explanation={activeKeyword.explanation}
          imageUrl={activeKeyword.imageUrl}
          keywordIndex={activeKeyword.keywordIndex}
          isAdmin={props.isAdmin}
          level={props.level}
          theme={props.theme}
          accessToken={props.accessToken}
          onImageUpdate={reloadKeywordImages}
          onClose={() => setActiveKeyword(null)}
          position={activeKeyword.position}
        />
      )}
    </>
  );
}
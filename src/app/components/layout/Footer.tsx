// Footer komponent
export function Footer() {
  const bgColor = '#222224';
  const textColor = '#7f7f7f';
  const footerYear = 2025;
  const appName = 'ArcadeLearn';
  
  return (
    <footer 
      className="py-4 sm:py-5 mt-auto" 
      style={{ backgroundColor: bgColor }}
    >
      <div className="w-full px-3 sm:px-6 lg:px-8 text-center">
        <p 
          className="text-sm sm:text-base" 
          style={{ color: textColor }}
        >
          ©{footerYear} {appName} — All Rights Reserved
        </p>
      </div>
    </footer>
  );
}

// Footer komponent
export function Footer() {
  const bgColor = '#222224';
  const textColor = '#7f7f7f';
  const currentYear = 2025;
  const appName = 'ArcadeLearn';
  
  return (
    <footer 
      className="py-5 mt-auto" 
      style={{ backgroundColor: bgColor }}
    >
      <div className="w-full px-8 text-center">
        <p 
          className="text-base" 
          style={{ color: textColor }}
        >
          ©{currentYear} {appName} — All Rights Reserved
        </p>
      </div>
    </footer>
  );
}

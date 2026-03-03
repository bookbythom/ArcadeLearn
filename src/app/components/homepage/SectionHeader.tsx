// Properties pre SectionHeader komponent
interface SectionHeaderProps {
  level: 'beginner' | 'intermediate' | 'professional';
}

// Komponent pre hlavicku sekcie s nazvom urovne a ciarami
export function SectionHeader(props: SectionHeaderProps) {
  // Urcime farbu a nazov podla urovne
  let levelColor = '#C69C6D';
  let levelDisplayName = 'Beginner';
  
  if (props.level === 'beginner') {
    levelColor = '#C69C6D';
    levelDisplayName = 'Beginner';
  } else if (props.level === 'intermediate') {
    levelColor = '#EC4545';
    levelDisplayName = 'Intermediate';
  } else if (props.level === 'professional') {
    levelColor = '#6E44FF';
    levelDisplayName = 'Professional';
  }
  
  // Vytvorime gradient pre lavu ciaru (transparent -> farba)
  const leftLineGradient = 'linear-gradient(to right, transparent, ' + levelColor + ', ' + levelColor + ')';
  
  // Vytvorime gradient pre pravu ciaru (farba -> transparent)
  const rightLineGradient = 'linear-gradient(to right, ' + levelColor + ', ' + levelColor + ', transparent)';
  
  return (
    <div className="flex items-center justify-center mb-16">
      {/* Lava ciara */}
      <div 
        className="flex-1 max-w-md h-[2px]" 
        style={{ background: leftLineGradient }} 
      />
      
      {/* Nazov urovne */}
      <h2 
        className="px-8 text-3xl font-bold whitespace-nowrap" 
        style={{ color: levelColor }}
      >
        {levelDisplayName}
      </h2>
      
      {/* Prava ciara */}
      <div 
        className="flex-1 max-w-md h-[2px]" 
        style={{ background: rightLineGradient }} 
      />
    </div>
  );
}
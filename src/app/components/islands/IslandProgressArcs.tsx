// Properties pre IslandProgressArcs komponent
interface IslandProgressArcsProps {
  correctCount: number; // Pocet spravnych cviceni (0-5 pre normalne ostrovy, 0-10 pre testy)
  totalCount?: number; // Celkovy pocet cviceni (default 5)
  level: "beginner" | "intermediate" | "professional";
  status: "locked" | "unlocked" | "completed-perfect" | "completed-mistakes";
}

// Komponent pre zobrazenie progress kruhu okolo ostrova
export default function IslandProgressArcs(props: IslandProgressArcsProps) {
  // Nastavime default hodnotu pre totalCount
  const totalExercises = props.totalCount || 5;
  
  // Funkcia na ziskanie farby podla stavu ostrova
  const getColorForStatus = () => {
    if (props.status === "unlocked") {
      // Sivy pre odomknute ostrovy
      return "#4a4a4c";
    }
    
    if (props.status === "completed-perfect") {
      // Zlaty/oranzovy pre perfektne dokoncenie
      return "#FCAF2B";
    }
    
    if (props.status === "completed-mistakes") {
      // Zeleny pre dokoncenie s chybami
      return "#62BB46";
    }
    
    // Default sivy
    return "#4a4a4c";
  };

  // Ziskame farbu
  const activeSegmentColor = getColorForStatus();
  const inactiveSegmentColor = "#2a2a2c"; // Tmavo sivy pre nedokoncene segmenty

  // Parametre pre elipticku cestu ktora sa prispôsobuje tvaru ostrova
  // Ostrovy su elipticke (sirsie ako vysoke) podla viewBox="0 0 123 93"
  const ellipseCenterX = 50;
  const ellipseCenterY = 50;
  const ellipseRadiusX = 45.5; // Horizontalny polomer
  const ellipseRadiusY = 40; // Vertikalny polomer
  const arcStrokeWidth = 8;
  const gapBetweenSegmentsDegrees = 18; // Velke medzery medzi segmentami
  const segmentSizeDegrees = (360 / totalExercises) - gapBetweenSegmentsDegrees;

  // Funkcia na vytvorenie eliptickej cesty pre segment
  const createEllipticalArcPath = (startAngleDeg: number, endAngleDeg: number) => {
    // Konvertujeme stupne na radiany a upravime o -90 stupnov pre spravne smerovanie
    const startAngleRad = (startAngleDeg - 90) * (Math.PI / 180);
    const endAngleRad = (endAngleDeg - 90) * (Math.PI / 180);
    
    // Vypocitame x,y suradnice zaciatku a konca obluka
    const startX = ellipseCenterX + ellipseRadiusX * Math.cos(startAngleRad);
    const startY = ellipseCenterY + ellipseRadiusY * Math.sin(startAngleRad);
    const endX = ellipseCenterX + ellipseRadiusX * Math.cos(endAngleRad);
    const endY = ellipseCenterY + ellipseRadiusY * Math.sin(endAngleRad);
    
    // Urcime ci je to velky obluk (viac ako 180 stupnov)
    let largeArcFlag = 0;
    if ((endAngleDeg - startAngleDeg) > 180) {
      largeArcFlag = 1;
    }
    
    // Vytvorime SVG path string pre elipticky obluk
    const pathString = 'M ' + startX + ' ' + startY + ' A ' + ellipseRadiusX + ' ' + ellipseRadiusY + ' 0 ' + largeArcFlag + ' 1 ' + endX + ' ' + endY;
    
    return pathString;
  };

  // Vytvorime pole segmentov
  // Kazdy segment je sfarbeny ak je jeho index mensi ako correctCount
  // Priklad: ak correctCount=3, segmenty 0,1,2 su sfarbene; segmenty 3,4 su sive
  // Ak correctCount=5, vsetky segmenty 0,1,2,3,4 su sfarbene
  const segmentsArray = [];
  let segmentIndex = 0;
  while (segmentIndex < totalExercises) {
    // Urcime ci je tento segment aktivny
    let isSegmentActive = false;
    if (segmentIndex < props.correctCount) {
      isSegmentActive = true;
    }
    
    // Vypocitame uhly pre tento segment
    const startAngle = segmentIndex * (360 / totalExercises);
    const endAngle = startAngle + segmentSizeDegrees;
    
    // Vytvorime cestu pre tento segment
    const segmentPath = createEllipticalArcPath(startAngle, endAngle);
    
    // Pridame segment do pola
    segmentsArray.push({
      isActive: isSegmentActive,
      path: segmentPath,
      index: segmentIndex
    });
    
    segmentIndex = segmentIndex + 1;
  }

  // Render SVG s progress segmentami
  return (
    <div 
      className="absolute inset-0 pointer-events-none" 
      style={{ 
        transform: 'scale(1.5) translateY(-2px)' 
      }}
    >
      <svg 
        className="block size-full" 
        fill="none" 
        preserveAspectRatio="xMidYMid meet" 
        viewBox="0 0 100 100"
      >
        {/* Vykreslime vsetky segmenty pomocou manualne loop */}
        {segmentsArray.map((segmentData) => {
          // Urcime farbu segmentu
          let segmentColor = inactiveSegmentColor;
          if (segmentData.isActive === true) {
            segmentColor = activeSegmentColor;
          }
          
          return (
            <path
              key={'segment-' + segmentData.index}
              d={segmentData.path}
              stroke={segmentColor}
              strokeWidth={arcStrokeWidth}
              strokeLinecap="round"
              fill="none"
              style={{
                transition: 'stroke 0.3s ease',
                filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.4))'
              }}
            />
          );
        })}
      </svg>
    </div>
  );
}
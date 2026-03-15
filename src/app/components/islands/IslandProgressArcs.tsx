interface IslandProgressArcsProps {
  correctCount: number; // Pocet spravnych cviceni (0-5 pre normalne ostrovy, 0-10 pre testy)
  totalCount?: number; // Celkovy pocet cviceni (default 5)
  level: "beginner" | "intermediate" | "professional";
  status: "locked" | "unlocked" | "completed-perfect" | "completed-mistakes";
}

function getColorForStatus(status: IslandProgressArcsProps['status']): string {
  if (status === "unlocked") {
    return "#4a4a4c";
  }
  if (status === "completed-perfect") {
    return "#FCAF2B";
  }
  if (status === "completed-mistakes") {
    return "#62BB46";
  }
  return "#4a4a4c";
}

function buildEllipticalArcPath(startAngleDeg: number, endAngleDeg: number, centerX: number, centerY: number, radiusX: number, radiusY: number): string {
  const startAngleRad = (startAngleDeg - 90) * (Math.PI / 180);
  const endAngleRad = (endAngleDeg - 90) * (Math.PI / 180);

  const startX = centerX + radiusX * Math.cos(startAngleRad);
  const startY = centerY + radiusY * Math.sin(startAngleRad);
  const endX = centerX + radiusX * Math.cos(endAngleRad);
  const endY = centerY + radiusY * Math.sin(endAngleRad);

  const largeArcFlag = (endAngleDeg - startAngleDeg) > 180 ? 1 : 0;
  return 'M ' + startX + ' ' + startY + ' A ' + radiusX + ' ' + radiusY + ' 0 ' + largeArcFlag + ' 1 ' + endX + ' ' + endY;
}

export default function IslandProgressArcs(props: IslandProgressArcsProps) {
  const { correctCount, level, status } = props;
  void level;

  // Nastavime default hodnotu pre totalCount
  const totalExercises = props.totalCount ?? 5;

  // Ziskame farbu
  const activeSegmentColor = getColorForStatus(status);
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

  // Vytvorime pole segmentov
  // Kazdy segment je sfarbeny ak je jeho index mensi ako correctCount
  // Priklad: ak correctCount=3, segmenty 0,1,2 su sfarbene; segmenty 3,4 su sive
  // Ak correctCount=5, vsetky segmenty 0,1,2,3,4 su sfarbene
  const segmentsArray = [];

  for (let segmentIndex = 0; segmentIndex < totalExercises; segmentIndex++) {
    // Urcime ci je tento segment aktivny
    const isSegmentActive = segmentIndex < correctCount;
    
    // Vypocitame uhly pre tento segment
    const startAngle = segmentIndex * (360 / totalExercises);
    const endAngle = startAngle + segmentSizeDegrees;
    
    // Vytvorime cestu pre tento segment
    const segmentPath = buildEllipticalArcPath(
      startAngle,
      endAngle,
      ellipseCenterX,
      ellipseCenterY,
      ellipseRadiusX,
      ellipseRadiusY
    );
    
    // Pridame segment do pola
    segmentsArray.push({
      isActive: isSegmentActive,
      path: segmentPath,
      index: segmentIndex
    });
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
          const segmentColor = segmentData.isActive ? activeSegmentColor : inactiveSegmentColor;
          
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
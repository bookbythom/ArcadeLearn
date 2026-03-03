import svgPathsIllustrations from "@/imports/homepage-illustrations";

// Komponent pre beginner ilustracie na mape
export function BeginnerIllustrations() {
  return (
    <>
      {/* Prva ilustracia - vpravo hore */}
      <div className="absolute" style={{ left: '67%', top: '12%', width: '22%', height: 'auto' }}>
        <div className="relative transition-transform hover:scale-110 cursor-default">
          <svg className="block w-full h-auto" fill="none" viewBox="-2.5 -2.5 285.09 279.61">
            <g>
              <path d={svgPathsIllustrations.p2d7633f0} stroke="#C69C6D" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5" />
              <path d={svgPathsIllustrations.p3ac86200} stroke="#C69C6D" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5" />
              <path d={svgPathsIllustrations.p2d1605f0} stroke="#C69C6D" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5" />
              <path d={svgPathsIllustrations.p1806d0f0} fill="#8C6239" />
              <path d={svgPathsIllustrations.p37026df0} fill="#8C6239" />
              <path d={svgPathsIllustrations.p3e32a00} fill="#8C6239" />
              <path d={svgPathsIllustrations.p33e58f80} fill="#8C6239" />
              <path d={svgPathsIllustrations.p16d3da00} fill="#8C6239" />
              <path d={svgPathsIllustrations.p866e280} fill="#8C6239" />
              <path d={svgPathsIllustrations.p2c9d7400} fill="#8C6239" />
            </g>
          </svg>
          {/* Tien pod ilustraciou */}
          <div className="absolute bottom-0 left-[15%] right-[15%] h-[3px] bg-gradient-to-r from-transparent via-[#8C6239] to-transparent opacity-40" style={{ transform: 'translateY(8px)' }} />
        </div>
      </div>

      {/* Druha ilustracia - vlavo dole */}
      <div className="absolute" style={{ left: '15%', bottom: '18%', width: '14%', height: 'auto' }}>
        <div className="relative transition-transform hover:scale-110 cursor-default">
          <svg className="block w-full h-auto" fill="none" viewBox="0 0 190.42 123.02">
            <g>
              <path d={svgPathsIllustrations.p579db00} fill="#8C6239" />
              <path d={svgPathsIllustrations.p2d6b5d80} fill="#8C6239" />
            </g>
          </svg>
          {/* Tien pod ilustraciou */}
          <div className="absolute bottom-0 left-[15%] right-[15%] h-[3px] bg-gradient-to-r from-transparent via-[#8C6239] to-transparent opacity-40" style={{ transform: 'translateY(8px)' }} />
        </div>
      </div>
    </>
  );
}

export interface KeywordDefinition {
  text: string;
  displayName?: string;
  explanation: string;
}

export interface Exercise {
  type: 'multiple-choice' | 'true-false' | 'choose-correct' | 'sort' | 'single-choice';
  question: string;
  options: string[];
  correctAnswer: any;
  categories?: string[];
}

export interface Theme {
  id: number;
  title: string;
  content: string;
  keywords: KeywordDefinition[];
  exercises: Exercise[];
  useTextExercise: boolean;
}

export const professionalThemes: Theme[] = [
  {
    id: 1,
    title: "Blend Modes a miešanie vrstiev",
    content: "**Blend Modes** sú kľúčové pri profesionálnych kompozíciách, farebných úpravách a špeciálnych efektoch, pretože menia spôsob miešania vrstiev bez trvalých zásahov do obsahu. V **Layers Panel dropdown** vyberáme vhodný režim z kategórií podľa typu efektu. Na prirodzené tiene a stmavenie často používame **Multiply**, naopak pre svetelné efekty, lesky alebo lens flare je praktický **Screen**. Režim **Overlay** sa hodí na aplikovanie textúr pri zachovaní svetiel a tieňov. Ak potrebujeme meniť farbu bez zásahu do jasov, pomáhajú **Color** a **Hue** módy. Na prácu s tonalitou používame **Darken**, **Lighten** a **Contrast** režimy podľa toho, či chceme obraz stmaviť, rozjasniť alebo zvýrazniť detail. Pri selektívnych farebných zmenách využijeme aj **Composite** módy. Finálnu silu efektu potom jemne doladíme cez **Opacity**.",
    keywords: [
      {
        text: "Blend Modes",
        displayName: "režimy miešania",
        explanation: "Blend Modes sú matematické algoritmy určujúce, ako sa farby vrstvy miešajú s vrstvami pod ňou. Dropdown je v Layers Paneli (default: Normal). Klávesová skratka: Shift++ (ďalší mode), Shift+- (predchádzajúci). Vo Photoshope je 27+ režimov. Fungujú aj na nástroje. Sú nedeštruktívne - možno kedykoľvek zmeniť. Používajú sa na kompozície, farebné úpravy, textúry a špeciálne efekty."
      },
      {
        text: "Layers Panel dropdown",
        displayName: "blend mode dropdown",
        explanation: "Layers Panel dropdown je dropdown menu v Layers Paneli nad zoznamom vrstiev zobrazujúce všetky blend modes. Default je Normal (žiadne miešanie). Sú organizované do kategórií pre ľahšiu orientáciu. Shift++ cykluje cez módy. Shift+Alt+N resetuje na Normal. Preview blend modes je umiestnením myši nad nimi (niektoré verzie PS). Používa sa na experimentovanie a výber správneho blend mode."
      },
      {
        text: "Darken",
        displayName: "stmavujúce režimy",
        explanation: "Darken je kategória blend modes stmavujúca obraz porovnávaním a zachovávaním tmavších pixelov. Darken zachová tmavší pixel z oboch vrstiev. Multiply násobí farby (vždy tmavší výsledok než obe vrstvy, biela zmizne). Color Burn zvýrazňuje farby stmavením. Používajú sa na tiene, tónovanie, vignettes a pridanie hĺbky."
      },
      {
        text: "Lighten",
        displayName: "rozjasňujúce režimy",
        explanation: "Lighten je kategória blend modes rozjasňujúca obraz porovnávaním a zachovávaním svetlejších pixelov. Lighten zachová svetlejší pixel. Screen je inverz Multiply (vždy svetlejší výsledok, čierna zmizne). Color Dodge zvýrazňuje farby rozjasnením. Linear Dodge (Add) pridáva farby. Používajú sa na svetelné efekty, lesky, hviezdičky, osvetlenie scén."
      },
      {
        text: "Contrast",
        displayName: "kontrastné režimy",
        explanation: "Contrast je kategória blend modes zvyšujúca kontrast kombináciou stmavovanie a rozjasňovanie. Overlay znamená Multiply na tmavé, Screen na svetlé oblasti (50% šedá zmizne). Soft Light je jemnejšia verzia Overlay. Hard Light je ostrejšia verzia Overlay. Vivid/Linear/Pin Light sú rôzne variácie. Používajú sa na textúry, dodanie 'punch' efektu, zvýraznenie detailov."
      },
      {
        text: "Comparative",
        displayName: "porovnávacie režimy",
        explanation: "Comparative je kategória blend modes vytvárajúca inverzné a rozdielové efekty porovnávaním farieb medzi vrstvami. Difference odčítava svetlejšiu farbu od tmavšej (identické farby znamenajú čiernu). Exclusion je jemnejšia verzia Difference (identické farby znamenajú šedú). Používajú sa na zarovnávanie vrstiev, vytvorenie psychedelických efektov alebo detekciu rozdielov medzi obrázkami."
      },
      {
        text: "Composite",
        displayName: "kompozitné režimy",
        explanation: "Composite je kategória blend modes ovplyvňujúca konkrétne farebné vlastnosti (HSL komponenty). Hue používa odtieň hornej vrstvy, sýtosť a jas spodnej. Saturation používa sýtosť hornej, odtieň a jas spodnej. Color používa odtieň a sýtosť hornej, jas spodnej. Luminosity používa jas hornej, odtieň a sýtosť spodnej. Používajú sa na selektívnu farebnú úpravu, kolorovanie čiernobielych fotografií."
      },
      {
        text: "Opacity",
        explanation: "Opacity je priehľadnosť celej vrstvy vrátane jej efektov a blend mode (0-100%). Ovláda sa sliderom v Layers Paneli alebo číslicami (5 znamená 50%, 0 znamená 100%). V kombinácii s blend mode umožňuje jemné ladenie efektu miešania. Opacity 100% znamená plný efekt blend mode, 50% polovičný efekt. Používa sa na jemné prelínanie blend mode efektov."
      },
      {
        text: "Fill",
        explanation: "Fill je priehľadnosť len obsahu vrstvy bez Layer Styles (0-100%). Na rozdiel od Opacity neovplyvňuje blend mode aplikovaný na vrstvu - blend mode sa počíta pred aplikovaním Fill. Fill 0% s blend mode môže vytvoriť zaujímavé efekty kde sú viditeľné len Layer Styles prelínané cez blend mode. Používa sa na pokročilé blend mode techniky a efekty."
      }
    ],
    exercises: [
      {
        type: 'single-choice',
        question: 'Ktorý blend mode používa farby hornej vrstvy ale jas spodnej?',
        options: ['Hue', 'Color', 'Luminosity', 'Saturation'],
        correctAnswer: 1
      },
      {
        type: 'true-false',
        question: 'Multiply blend mode vždy vytvorí svetlejší výsledok než pôvodné vrstvy.',
        options: ['True', 'False'],
        correctAnswer: false
      },
      {
        type: 'single-choice',
        question: 'Ktorá kategória blend modes sa používa na zvýšenie kontrastu?',
        options: ['Darken', 'Lighten', 'Contrast', 'Composite'],
        correctAnswer: 2
      },
      {
        type: 'single-choice',
        question: 'Čo sa stane s bielou farbou pri použití Multiply blend mode?',
        options: ['Stane sa čiernou', 'Zostane biela', 'Zmizne (stane sa priehľadná)', 'Stane sa šedou'],
        correctAnswer: 2
      },
      {
        type: 'true-false',
        question: 'Fill opacity ovplyvňuje aj Layer Styles aplikované na vrstvu.',
        options: ['True', 'False'],
        correctAnswer: false
      }
    ],
    useTextExercise: true
  },
  {
    id: 2,
    title: "Compound Paths vo vektorovej grafike",
    content: "Pri tvorbe lôg, ikon a komplexných vektorov sú **Compound Paths** ideálne na vytváranie transparentných „výrezov“ vo vnútri tvarov. Cez **Object > Compound Path > Make** spojíme viacero Path Objects do jedného objektu, ktorý sa správa ako celok. O tom, ktoré oblasti ostanú vyplnené a ktoré budú prázdne, rozhoduje **Fill Rule**. Pre pravidelné a symetrické tvary býva vhodné **Even-Odd Fill Rule**, zatiaľ čo pri zložitejších formách poskytuje lepšiu kontrolu **Non-Zero Winding Rule**. Ak potrebujeme pracovať s kombináciami tvarov mimo compound paths, využívame **Pathfinder Panel**. Režimy **Shape Modes** (Unite, Minus Front, Intersect, Exclude) sú vhodné na nedeštruktívny workflow, kým **Pathfinders** (Divide, Trim, Merge, Crop) používame na finálne, trvalé rozdelenie a úpravu objektov.",
    keywords: [
      {
        text: "Compound Paths",
        displayName: "zložené cesty",
        explanation: "Compound Paths sú viaceré Path Objects kombinované do jedného objektu s možnosťou vytvorenia transparentných oblastí. Vytvárajú sa cez Object > Compound Path > Make (Cmd/Ctrl+8). Používajú Fill Rule na určenie, ktoré oblasti sú plné a ktoré prázdne. Možno na ne aplikovať jedinú výplň/stroke na celý compound. Release (Cmd/Ctrl+Alt+8) ich rozdelí späť. Využívajú sa pri tvorbe lôg s 'dierou' v strede (napríklad písmeno O), ikonách s vykrojenými časťami a komplexných grafických prvkoch."
      },
      {
        text: "Even-Odd Fill Rule",
        displayName: "even-odd pravidlo",
        explanation: "Even-Odd Fill Rule je algoritmus určujúci, či je oblasť vo vnútri alebo vonku compound path. Počíta počet paths prekrížených lúčom z bodu: nepárny znamená vnútri (fill), párny vonku (transparent). Je jednoduchšie než Non-Zero, ale menej flexibilné. Nastavuje sa v Attributes Panel. Používa sa pri symetrických tvaroch s pravidelným striedaním plných/prázdnych oblastí a jednoduchých ikonách."
      },
      {
        text: "Non-Zero Winding Rule",
        displayName: "non-zero pravidlo",
        explanation: "Non-Zero Winding Rule je algoritmus berúci do úvahy direction paths (clockwise/counterclockwise). Počíta 'winding number': +1 pre clockwise crossing, -1 pre counterclockwise. Nula znamená transparent, non-zero fill. Umožňuje sofistikovanejšiu kontrolu než Even-Odd. Je default v Illustrátore. Využíva sa pri komplexných prekrývajúcich sa tvaroch, kde direction určuje výplň, a kaligrafických fontoch s prekrytými ťahmi."
      },
      {
        text: "Shape Modes",
        displayName: "režimy tvarov",
        explanation: "Shape Modes sú nedeštruktívne kombinácie tvarov v Pathfinderi vytvárajúce Compound Shapes. Unite spojí všetky tvary. Minus Front odčíta vrchné od spodných. Intersect zachová len prekryvy. Exclude odstráni prekryvy. Zachováva pôvodné paths editovateľné. Alt+klik znamená deštruktívny efekt. Využívajú sa pri logách vyžadujúcich neskoršie úpravy, experimentovaní s tvarmi pred finalizáciou a modulárnom dizajne."
      },
      {
        text: "Pathfinders",
        displayName: "pathfinder operácie",
        explanation: "Deštruktívne operácie na delenie a modifikáciu tvarov, ktoré nájdete v Pathfinder Paneli. Divide rozdelí prekrývajúce sa objekty na samostatné segmenty. Trim odstráni skryté časti objektov. Merge spojí objekty s rovnakou farbou do jedného. Crop orezáva všetky objekty podľa tvaru vrchného objektu. Outline konvertuje výplne na obrysy. Minus Back odčíta spodné objekty od vrchného. Po aplikácii už nie je možné vrátiť sa k pôvodným tvarom. Využívajú sa pri finálnych deštruktívnych kombináciách pred exportom, vytvorení outline fontov a precíznom rezaní tvarov."
      },
      {
        text: "Compound Shapes",
        displayName: "zložené tvary",
        explanation: "Compound Shapes sú nedeštruktívne kombinácie vytvorené Shape Modes v Pathfinderi. Zachováva originálne paths editovateľné v Layers Paneli. Možno meniť Shape Mode kedykoľvek. Expand button v Pathfinderi konvertuje na bežné paths (deštruktívne). Appearance Panel umožňuje vrstviť viacero Shape Modes. Využívajú sa pri komplexných logách vyžadujúcich flexibilitu úprav a design systémoch s modulárnymi komponentami."
      },
      {
        text: "Direction",
        displayName: "smer cesty",
        explanation: "Direction je clockwise alebo counterclockwise orientácia path v Illustrátore, ktorá určuje, ako path interaguje v Compound Path pri Non-Zero Winding Rule. Zobrazuje sa pomocou Object > Path > Show Direction (šípky). Reverse (Object > Path > Reverse Path Direction) mení smer. Využíva sa na kontrolu fill/transparency v compound paths, opravu problémov s vykrojenými oblasťami a typografiu s prekrývajúcimi sa ťahmi."
      }
    ],
    exercises: [
      {
        type: 'single-choice',
        question: 'Ktorý Pathfinder režim vytvorí nedeštruktívnu kombináciu tvarov?',
        options: ['Unite (Shape Mode)', 'Divide (Pathfinder)', 'Trim (Pathfinder)', 'Outline (Pathfinder)'],
        correctAnswer: 0
      },
      {
        type: 'true-false',
        question: 'Even-Odd Fill Rule berie do úvahy direction (smer) paths pri určovaní fill oblastí.',
        options: ['True', 'False'],
        correctAnswer: false
      },
      {
        type: 'single-choice',
        question: 'Aký je rozdiel medzi Shape Modes a Pathfinders?',
        options: ['Shape Modes sú deštruktívne, Pathfinders nedeštruktívne', 'Shape Modes sú nedeštruktívne, Pathfinders deštruktívne', 'Nie je medzi nimi rozdiel', 'Shape Modes fungujú len vo Photoshope'],
        correctAnswer: 1
      },
      {
        type: 'single-choice',
        question: 'Ktorá klávesová skratka vytvorí Compound Path v Illustrátore?',
        options: ['Cmd/Ctrl+7', 'Cmd/Ctrl+8', 'Cmd/Ctrl+9', 'Cmd/Ctrl+G'],
        correctAnswer: 1
      },
      {
        type: 'true-false',
        question: 'Non-Zero Winding Rule je default Fill Rule v Illustrátore.',
        options: ['True', 'False'],
        correctAnswer: true
      }
    ],
    useTextExercise: true
  },
  {
    id: 3,
    title: "Select and Mask pre pokročilé výbery",
    content: "Nástroj **Select and Mask** používame vtedy, keď potrebujeme kvalitný výstrih objektov s náročnými hranami, napríklad pri vlasoch, kožušine, dyme alebo priehľadných materiáloch. Po základnom výbere otvoríme **Select > Select and Mask** a výber postupne spresňujeme. Pre kontrolu kvality prepíname **View Modes**, aby sme okraje videli na rôznych pozadiach. V problematických miestach pracujeme s **Refine Edge Brush Tool**, ktorý dokáže inteligentne zachytiť jemné vlákna. Presnosť hrán ďalej zvyšuje **Edge Detection** s **Radius** nastavením a pri kombinácii tvrdých aj mäkkých obrysov sa osvedčí **Smart Radius**. Na konci workflow použijeme **Global Refinements** (Smooth, Feather, Contrast, Shift Edge), ktorými výber finálne vyhladíme, zjemníme alebo posunieme podľa potreby kompozície.",
    keywords: [
      {
        text: "Select and Mask",
        displayName: "select and mask",
        explanation: "Select and Mask je pokročilý workspace vo Photoshope na zjemňovanie výberov s komplexnými hranami. Nachádza sa v Select > Select and Mask (Alt+Cmd/Ctrl+R). Poskytuje real-time preview, view modes, refine tools. Je to non-destructive workflow. Používa sa na výstrih osoby s vlasmi z pozadia, výber objektov s jemnou srsťou/chlpkami a extrakciu objektov s priehľadnými časťami (sklo, dym)."
      },
      {
        text: "View Modes",
        displayName: "zobrazenia",
        explanation: "Rôzne spôsoby vizualizácie výberu v Select and Mask workspace. Onion Skin zobrazuje prekrývanie originálu a výsledku. Marching Ants sú tradičné 'mravčeky' okolo výberu. Overlay zobrazuje červenú masku. On Black/White/Layers umožňuje náhľad na rôznych pozadiach. Black & White režim zobrazuje alfa kanál. Klávesová skratka F cykluje cez jednotlivé režimy. Používajú sa na kontrolu jemných detailov výberu na kontrastnom pozadí, verifikáciu priehľadnosti a porovnanie pred a po úprave."
      },
      {
        text: "Refine Edge Brush Tool",
        displayName: "refine edge nástroj",
        explanation: "Inteligentný štetec (klávesa R) v Select and Mask workspace, ktorý automaticky zachytáva jemné detaily na hranách. Maľovaním cez problémové oblasti ako vlasy alebo srsť aktivujete algoritmus, ktorý analyzuje detaily hrán. Alt+ťahanie odstraňuje refinement. Veľkosť štetca meníte klávesmi [ a ]. Funguje najlepšie so zapnutým Edge Detection. Používa sa na precízny výber vlasov, zvieracích chlpov, vetiev stromov, krajky a transparentných materiálov."
      },
      {
        text: "Refine Edge Brush",
        displayName: "refine edge štetec",
        explanation: "Inteligentný štetec (klávesa R) v Select and Mask workspace, ktorý detekuje a zjemňuje hrany v označených oblastiach. Maľovaním cez problémové oblasti ako vlasy alebo srsť aktivujete algoritmus, ktorý automaticky analyzuje detaily hrán. Alt+ťahanie odstraňuje refinement. Veľkosť štetca meníte klávesmi [ a ]. Používa sa na precízny výber vlasov, zvieracích chlpov, vetiev stromov, krajky a jemných textúr."
      },
      {
        text: "Edge Detection",
        displayName: "detekcia hrán",
        explanation: "Algoritmus v Select and Mask workspace automaticky detekujúci jemné detaily na hranách výberu. Radius posúvač (0-250px) určuje šírku oblasti analýzy. Smart Radius checkbox aktivuje adaptívne aplikovanie rôznych radiusov. Vyšší radius znamená lepšiu detekciu komplexných hrán, ale pomalšie spracovanie. Používa sa na automatické zachytenie vlasov bez manuálneho maľovania, rýchle zjemnenie komplexných objektov a adaptívnu detekciu hrán pri varírujúcej komplexnosti."
      },
      {
        text: "Smart Radius",
        displayName: "inteligentný radius",
        explanation: "Adaptívny algoritmus v Edge Detection, ktorý aplikuje rôzne radiusy na rôzne časti hrany výberu. Automaticky detekuje oblasti s ostrými a mäkkými hranami a prispôsobuje radius. Je to checkbox v Select and Mask workspace. Obvykle poskytuje lepšie výsledky než pevne nastavený radius. Používa sa pri objektoch s kombináciou ostrých hrán (tvár) a mäkkých hrán (vlasy), nerovnomerných kontúrach a zmiešaných textúrach."
      },
      {
        text: "Global Refinements",
        displayName: "globálne úpravy",
        explanation: "Posúvače ovplyvňujúce celý výber naraz. Smooth (0-100) vyhladzuje zubatosť hrán. Feather (0-250px) vytvára jemný prechod. Contrast (0-100) zostruje hrany. Shift Edge (-100 až +100) zmršťuje alebo rozširuje výber. Aplikujú sa na celý obvod výberu. Používajú sa na finálne doladenie po použití zjemňovacích nástrojov, odstránenie artefaktov a prispôsobenie výberu novému pozadiu."
      },
      {
        text: "Decontaminate Colors",
        displayName: "dekontaminácia farieb",
        explanation: "Checkbox v Select and Mask workspace, ktorý odstraňuje farebné okraje (color bleeding) z pôvodného pozadia na hranách výberu. Nahrádza pixely na hranách podobnými farbami z vnútra objektu. Amount posúvač (0-100%) určuje silu efektu. Vyžaduje výstup do novej vrstvy (je to deštruktívna operácia). Používa sa na odstránenie zeleného okraja po greenscreen extrakcii, modrého okraja z oblohy a žltého odtieňa z pozadia."
      },
      {
        text: "Output Settings",
        displayName: "výstupné nastavenia",
        explanation: "Určujú formát výsledku zo Select and Mask workspace. Output To možnosti: Selection (aktívny výber), Layer Mask (maska na aktuálnej vrstve), New Layer (nová vrstva s maskou), New Layer with Layer Mask, New Document (nový dokument). New Layer with Mask je nedeštruktívna možnosť. Používa sa na export výberu pre ďalšie použitie, vytvorenie editovateľnej masky a nový dokument pre compositing workflow."
      }
    ],
    exercises: [
      {
        type: 'single-choice',
        question: 'Ktorý nástroj v Select and Mask inteligentne detekuje a zjemňuje hrany v označených oblastiach?',
        options: ['Quick Selection Tool', 'Refine Edge Brush', 'Edge Detection', 'Lasso Tool'],
        correctAnswer: 1
      },
      {
        type: 'true-false',
        question: 'Smart Radius aplikuje rovnaký radius na všetky časti hrany výberu.',
        options: ['True', 'False'],
        correctAnswer: false
      },
      {
        type: 'single-choice',
        question: 'Čo robí Decontaminate Colors v Select and Mask?',
        options: ['Zvýrazňuje farby', 'Odstraňuje farebné fringes z pozadia', 'Pridáva saturáciu', 'Invertuje farby'],
        correctAnswer: 1
      },
      {
        type: 'single-choice',
        question: 'Ktorá klávesová skratka otvorí Select and Mask workspace?',
        options: ['Alt+Cmd/Ctrl+M', 'Alt+Cmd/Ctrl+R', 'Alt+Cmd/Ctrl+S', 'Cmd/Ctrl+R'],
        correctAnswer: 1
      },
      {
        type: 'true-false',
        question: 'View Modes v Select and Mask slúžia len na dekoráciu a neovplyvňujú kvalitu výberu.',
        options: ['True', 'False'],
        correctAnswer: false
      }
    ],
    useTextExercise: true
  },
  {
    id: 4,
    title: "Clipping Masks a Vector Masks",
    content: "**Clipping Masks** sú praktické pri vkladaní fotografií alebo textúr do textu, loga či tvaru bez deštruktívneho mazania. Vo Photoshope ich vytvoríme skratkou **Cmd/Ctrl+Alt+G**, pričom **Base Layer** určuje viditeľnú oblasť vrstiev nad ním. V Illustrátore rovnaký princíp použijeme cez **Object > Clipping Mask > Make**. Ak potrebujeme technicky presné a ostré okraje, siahneme po **Vector Mask** vytvorenej cez **Pen Tool** - je vhodná najmä pre geometrické tvary a print. Naopak pri fotografiách a mäkkých prechodoch je vhodnejšia **Layer Mask** (Raster Mask), ktorá podporuje plynulé gradienty. **Vector Mask** (Path-based Mask) ostáva ideálna tam, kde je dôležitá škálovateľnosť a čistá hrana. Aktívny stav a úpravy oboch masiek sledujeme cez **Mask Thumbnail** v Layers Paneli.",
    keywords: [
      {
        text: "Clipping Mask",
        displayName: "clipping maska",
        explanation: "Clipping Mask používa tvar a opacity base layer na masknutie vrstiev nad ňou. Vo Photoshope: Layer > Create Clipping Mask (Cmd/Ctrl+Alt+G), Alt+klik medzi vrstvami. Clipped layer má šípku v Layers Paneli. Viacero vrstiev môže byť clipped na jednu base layer. Používa sa na vloženie textúry do textu, obrázok do tvaru a aplikovanie adjustment len na špecifickú vrstvu."
      },
      {
        text: "Vector Mask",
        displayName: "vektorová maska",
        explanation: "Vector Mask je path-based maska vo Photoshope poskytujúca ostré, škálovateľné hranice. Layer > Vector Mask > Current Path (konvertuje work path). Zobrazuje sa ako druhý thumbnail v Layers Paneli. Shift+klik znamená disable/enable. Používa sa na presné geometrické výrezy, logo cutouts, masknutie do pravidelných tvarov (kruhy, obdĺžniky) a print design s crisp edges."
      },
      {
        text: "Layer Mask",
        displayName: "vrstvová maska",
        explanation: "Layer Mask je pixel-based (raster) maska využívajúca grayscale hodnoty (čierna znamená hidden, biela visible, šedá partial transparency). Layer > Layer Mask > Reveal All/Hide All. Možno maľovať štetcom, aplikovať gradienty. Používa sa na mäkké prechody, realistické blending, photomontáž a postupné fade efekty."
      },
      {
        text: "Base Layer",
        displayName: "základná vrstva",
        explanation: "Base Layer je spodná vrstva určujúca tvar a opacity pre clipped layers nad ňou. Nemusí obsahovať obsah - môže byť len Shape Layer. Úpravy opacity base layer ovplyvňujú všetky clipped layers. Používa sa na kontrolu celkovej opacity group of layers a spoločný tvar pre viacero textúr/adjustments."
      },
      {
        text: "Path-based Mask",
        displayName: "maska založená na cestách",
        explanation: "Path-based Mask je maska používajúca vektorové paths namiesto pixelov, poskytujúca nekonečne škálovateľné, ostré hranice. Je editovateľná pomocou Direct Selection a Pen nástrojov. Je konvertovateľná na pixel-based. Používa sa pri print design vyžadujúcom crisp edges pri rôznych veľkostiach, geometrických kompozíciách a presných technical illustration."
      },
      {
        text: "Raster Mask",
        displayName: "rastrová maska",
        explanation: "Raster Mask je maska založená na pixeloch využívajúca grayscale bitmap na určenie transparency. Rozlíšenie je závislé od document size. Umožňuje mäkké prechody, gradienty, brush strokes. Možno aplikovať filters, adjustments. Používa sa na fotorealistické blending, komplexné soft-edge selections, gradient transitions a textúrované edges."
      },
      {
        text: "Mask Thumbnail",
        displayName: "náhľad masky",
        explanation: "Miniatura masky zobrazená v Layers Paneli vedľa náhľadu samotnej vrstvy. Layer Mask sa zobrazuje ako čiernobiely rastrový náhľad, Vector Mask má druhý náhľad s ikonou cesty. Kliknutím prepnete editáciu medzi obsahom vrstvy a maskou. Alt+kliknutie zobrazí samotnú masku v pracovnej ploche. Shift+kliknutie dočasne vypne alebo zapne masku. Používa sa na vizuálnu indikáciu aktívnej masky, rýchly prístup k editácii masky a náhľad obsahu masky."
      },
      {
        text: "Illustrator Clipping Mask",
        displayName: "ilustrátorová clipping maska",
        explanation: "Illustrator Clipping Mask znamená, že v Illustrátore vrchný objekt určuje viditeľnosť spodných objektov. Object > Clipping Mask > Make (Cmd/Ctrl+7). Vrchný objekt stráca fill/stroke a stáva sa mask boundary. Release (Cmd/Ctrl+Alt+7) odstráni masku. Skupina musí byť selected. Používa sa na vloženie obrázka do tvaru v Illustrátore, komplexné text layouts, presné vektorové výrezy a modulárne design systems."
      }
    ],
    exercises: [
      {
        type: 'single-choice',
        question: 'Ktorý typ masky vo Photoshope poskytuje ostré, škálovateľné hranice?',
        options: ['Layer Mask', 'Vector Mask', 'Clipping Mask', 'Quick Mask'],
        correctAnswer: 1
      },
      {
        type: 'true-false',
        question: 'Clipping Mask môže mať len jednu clipnutú vrstvu nad base layer.',
        options: ['True', 'False'],
        correctAnswer: false
      },
      {
        type: 'single-choice',
        question: 'Aký je hlavný rozdiel medzi Layer Mask a Vector Mask?',
        options: ['Layer Mask je deštruktívna', 'Layer Mask je pixel-based, Vector Mask je path-based', 'Vector Mask nemožno editovať', 'Nie je medzi nimi rozdiel'],
        correctAnswer: 1
      },
      {
        type: 'single-choice',
        question: 'Ktorá klávesová skratka vytvorí Clipping Mask vo Photoshope?',
        options: ['Cmd/Ctrl+G', 'Cmd/Ctrl+Alt+G', 'Cmd/Ctrl+Shift+G', 'Cmd/Ctrl+7'],
        correctAnswer: 1
      },
      {
        type: 'true-false',
        question: 'V Illustratore vrchný objekt v Clipping Mask určuje viditeľnosť spodných objektov.',
        options: ['True', 'False'],
        correctAnswer: true
      }
    ],
    useTextExercise: true
  },
  {
    id: 5,
    title: "Character a Paragraph Panels",
    content: "Pri profesionálnej typografii pracujeme s **Character Panel** a **Paragraph Panel**, ktoré spolu pokrývajú detail textu aj štruktúru odstavcov. V Character Paneli dolaďujeme **leading**, **kerning**, **tracking** a **baseline shift**, aby text pôsobil čitateľne a vizuálne vyvážene. **Leading** ovplyvňuje komfort čítania, **kerning** rieši problematické medzery medzi konkrétnymi písmenami a **tracking** mení hustotu celého textového bloku. **Baseline Shift** sa hodí pri indexoch, špeciálnych znakoch alebo zarovnávaní rozdielnych fontov. Cez **OpenType Features** aktivujeme pokročilé prvky ako **ligatures**, swashes či alternatívne glyphy. V Paragraph Paneli riešime zarovnanie, odsadenie a rytmus textu - cez **Justification**, **Hyphenation** a **Space Before/After** dosiahneme konzistentný sadzobný výsledok bez ručných workaroundov.",
    keywords: [
      {
        text: "Leading",
        displayName: "riadkovanie",
        explanation: "Vertikálny rozostup medzi základnými líniami textových riadkov, nastaviteľný v Character Panel. Meria sa v bodoch (pts). Automatická hodnota je 120% veľkosti písma, ale môžete ju nastaviť manuálne pre presnejšiu kontrolu. Kladné hodnoty znamenajú väčší rozostup. Klávesové skratky: Alt+Šípka hore/dole. Používa sa na zlepšenie čitateľnosti v hustom texte, zvýšenie bielych medzier v nadpisoch a vytvorenie kompaktných rozložení s tesným riadkovaním."
      },
      {
        text: "Kerning",
        displayName: "kerning",
        explanation: "Úprava medzery medzi konkrétnymi pármi písmen v Character Paneli. Metrics využíva vstavanú kerningovú tabuľku z fontu. Optical je algoritmus, ktorý vizuálne kompenzuje medzery. Manual umožňuje zadať číselnú hodnotu (Alt+šípka vľavo/vpravo). Kurzor musí byť umiestnený medzi dvoma písmenami. Používa sa na opravu problematických párov ako 'AV', 'To', 'We' v nadpisoch, presné typografické doladenie loga a korekciu problematických kombinácií písmen."
      },
      {
        text: "Tracking",
        displayName: "tracking",
        explanation: "Uniformné rozšírenie alebo zúženie medzery medzi všetkými znakmi vo výbere v Character Paneli. Na rozdiel od Kerningu (ktorý pracuje s pármi) ovplyvňuje celý text. Kladné hodnoty vytvárajú voľnejší text, záporné tesnejší. Alt+Cmd/Ctrl+Q resetuje na predvolené. Používa sa na rozšírenie textu v nadpisoch s veľkými písmenami pre eleganciu, zúženie textu na prispôsobenie priestoru a jemné úpravy pre vizuálnu rovnováhu."
      },
      {
        text: "Baseline Shift",
        displayName: "posun základnej čiary",
        explanation: "Vertikálny posun znakov hore alebo dole od základnej čiary v Character Panel bez zmeny riadkovania. Kladné hodnoty posúvajú hore, záporné dole. Ovláda sa klávesovou skratkou Alt+Shift+šípka hore/dole. Je nezávislý od veľkosti písma. Používa sa na manuálne vytvorenie horných a dolných indexov, vertikálne zarovnanie kombinácie rôznych fontov, jemné doladenie matematických symbolov a inline poznámky pod čiarou."
      },
      {
        text: "OpenType Features",
        displayName: "opentype funkcie",
        explanation: "Pokročilé typografické funkcie v moderných fontoch aktivovateľné v Character Panel menu. Obsahujú ligatúry (fi, fl, ffi), ozdobné alternatívy (swashes), štýlové alternatívy, poradové číslovky (1st, 2nd) a zlomky. Dostupnosť závisí od konkrétneho fontu. Nájdete ich cez ikonku panelového menu vpravo hore. Používajú sa na profesionálnu sadzbu kníh s ligatúrami, elegantné nadpisy s ozdobnými alternatívami a správne formátované zlomky v receptoch."
      },
      {
        text: "Justification",
        displayName: "zarovnanie do bloku",
        explanation: "Režim zarovnania v Paragraph Panel, ktorý rozťahuje text na plnú šírku odstavca. Nastavenia zarovnania (v menu panelu) určujú Word Spacing (minimálne/žiadané/maximálne %), Letter Spacing a Glyph Scaling. Adobe Single-line alebo Every-line Composer ovplyvňuje kvalitu. Používa sa v novinách a časopisoch vyžadujúcich kompaktné stĺpce, formálnych dokumentoch a knihách s tradičným layoutom."
      },
      {
        text: "Hyphenation",
        displayName: "delenie slov",
        explanation: "Automatické delenie slov na konci riadkov v Paragraph Panel. Hyphenation checkbox zapína alebo vypína funkciu. Hyphenation Zone určuje, ako ďaleko od okraja môže byť pomlčka. Consecutive Hyphens nastavuje limit po sebe idúcich pomlčiek. Je to kompromis medzi lepším rozostupom a menším počtom pomlčiek. Používa sa pri zarovnanom texte v úzkych stĺpcoch, viacjazyčných layoutoch a kontrole estetiky verzus čitateľnosti v publikáciách."
      },
      {
        text: "Space Before/After",
        displayName: "medzera pred/po",
        explanation: "Vertikálna medzera pridaná pred alebo po odstavci v Paragraph Panel namiesto dodatočných prázdnych riadkov. Meria sa v bodoch (pts) alebo iných jednotkách. Je konzistentnejšia než medzery vytvorené klávesou Enter. Paragraph Styles môžu túto hodnotu zahŕňať. Používa sa na konzistentný rozostup medzi nadpismi a bežným textom, štandardizovaný vertikálny rytmus a profesionálne publikačné layouty."
      }
    ],
    exercises: [
      {
        type: 'single-choice',
        question: 'Ktorý nástroj upravuje medzery medzi všetkými znakmi vo výbere?',
        options: ['Kerning', 'Tracking', 'Leading', 'Baseline Shift'],
        correctAnswer: 1
      },
      {
        type: 'true-false',
        question: 'Metrics kerning používa vizuálny algoritmus na kompenzáciu medzier medzi písmenami.',
        options: ['True', 'False'],
        correctAnswer: false
      },
      {
        type: 'single-choice',
        question: 'Čo upravuje Leading v Character Panel?',
        options: ['Horizontálny rozostup medzi znakmi', 'Vertikálny rozostup medzi riadkami', 'Veľkosť písma', 'Farbu textu'],
        correctAnswer: 1
      },
      {
        type: 'single-choice',
        question: 'Ktorý nástroj slúži na vytvorenie superscripts a subscripts?',
        options: ['Leading', 'Tracking', 'Baseline Shift', 'Kerning'],
        correctAnswer: 2
      },
      {
        type: 'true-false',
        question: 'Justification rozťahuje text na plnú šírku odstavca.',
        options: ['True', 'False'],
        correctAnswer: true
      }
    ],
    useTextExercise: true
  },
  {
    id: 6,
    title: "Neural Filters a AI-powered úpravy",
    content: "**Neural Filters** urýchľujú pokročilé retuše a kreatívne úpravy, keď potrebujeme výsledok dosiahnuť rýchlo, ale stále pod kontrolou. Cez **Filter > Neural Filters** otvoríme AI pracovný priestor s lokálnymi aj cloudovými filtrami. Pri portrétoch sa často používa **Skin Smoothing**, ktorý vyhladí pleť a zároveň vie zachovať textúru. Nástroj **Smart Portrait** umožňuje meniť výraz tváre, smer pohľadu, vek alebo osvetlenie bez zdĺhavej manuálnej práce. Na umelecké variácie slúži **Style Transfer**, kde prenesieme náladu referenčného obrázka na fotografiu. Ak potrebujeme väčší výstup, **Super Zoom** dopočíta detaily pri zväčšení. Pre simuláciu hĺbky ostrosti je vhodný **Depth Blur** a pri historických snímkach pomáha **Colorize**, ktorý automaticky koloruje čiernobiele fotografie.",
    keywords: [
      {
        text: "Neural Filters",
        displayName: "neurónové filtre",
        explanation: "AI filtre vo Photoshope využívajúce modely strojového učenia pre pokročilé úpravy. Nájdete ich v menu Filter > Neural Filters. Existujú cloudové filtre (vyžadujú internet, výkonné spracovanie) a Beta filtre (lokálne, rýchle). Ikona Download slúži na stiahnutie modelu. Používajú sa na retušovanie portrétov s AI, transformáciu veku, prenos štýlu, koloráciu starých fotografií a super rozlíšenie."
      },
      {
        text: "Skin Smoothing",
        displayName: "vyhladzovanie pleti",
        explanation: "Neural Filter automaticky rozpoznávajúci a vyhladzujúci pokožku v portrétoch. Blur posúvač určuje stupeň vyhladzenia. Texture posúvač zachováva prirodzené póry. Remove blemishes odstraňuje nedokonalosti. Obsahuje náhľad v reálnom čase. Používa sa na beauty retušovanie, profilové fotografie profesionálov, módnu fotografiu a svadobné fotografie."
      },
      {
        text: "Smart Portrait",
        displayName: "inteligentný portrét",
        explanation: "Neural Filter umožňujúci úpravu výrazu, veku a osvetlenia tváre pomocou AI. Posúvače Happiness/Surprise/Anger menia emócie. Age posúvač omladzuje alebo zostaruje tvár. Gaze direction mení smer pohľadu. Hair thickness upravuje hustotu vlasov. Facial lighting mení osvetlenie. Používa sa na úpravu výrazu na fotografiách, varianty dizajnu postavy, koncepty postupu veku a korekciu portretného osvetlenia."
      },
      {
        text: "Style Transfer",
        displayName: "prenos štýlu",
        explanation: "Neural Filter aplikujúci umelecký štýl z jedného obrázka na druhý využívajúc hlboké učenie. Source image upload načíta referenčný štýl. Strength posúvač určuje intenzitu efektu. Preserve original colors možnosť zachováva pôvodné farby. Výstupné nastavenia rozlíšenia. Používa sa na umelecké transformácie fotografií, vytváranie maľovacích efektov, zladenie vizuálneho štýlu naprieč obrázkami a kreatívnu koncepčnú exploráciu."
      },
      {
        text: "Super Zoom",
        displayName: "super zoom",
        explanation: "Neural Filter zvyšujúci rozlíšenie obrázka pomocou AI technológie zväčšovania. Nájdete ho v Image > Image Size alebo Neural Filter > Super Zoom. Používa algoritmus Preserve Details 2.0. Umožňuje až 4-násobné zväčšenie. Obsahuje zvýraznenie hrán. Používa sa pri zvýšení rozlíšenia starých fotografií, príprave obrázkov s nízkym rozlíšením na tlač, obnove detailov a forenznom vylepšení obrázkov."
      },
      {
        text: "Depth Blur",
        displayName: "rozmazanie podľa hĺbky",
        explanation: "Neural Filter simulujúci bokeh efekt s automatickou detekciou hĺbky scény. Depth map generation znamená, že AI vytvára informácie o hĺbke. Blur strength posúvač upravuje silu rozmazania. Focus distance adjustment nastavuje vzdialenosť zaostrenia. Bokeh shape selection vyberá tvar bokeh. Edge refinement zjemňuje hrany. Používa sa na rozmazanie pozadia v portrétoch, bokeh v produktovej fotografii, izoláciu subjektu a simuláciu malej hĺbky ostrosti."
      },
      {
        text: "Colorize",
        displayName: "kolorácia",
        explanation: "Neural Filter automaticky pridávajúci farby do čiernobielych fotografií pomocou AI natrénovanej na miliónoch obrázkov. Automaticky detekuje objekty a scény. Nastaviteľné farebné profily (Neutral/Warm/Cool). Farbenie zohľadňujúce scénu. Výber ohniskového bodu. Používa sa pri reštaurovaní starých rodinných fotografií, kolorácii historických obrázkov, archívnej reštaurácii a kreatívnej reinterpretácii."
      },
      {
        text: "Neural Filter Workspace",
        displayName: "pracovný priestor neurónových filtrov",
        explanation: "Vyhradené rozhranie v menu Filter > Neural Filters pre prístup k AI nástrojom. Obsahuje kategórie Featured a Beta filtrov. Download management spravuje cloudové modely. Režimy náhľadu. Výstupné nastavenia (New Layer/Current Layer/New Document). História filtrov a predvoľby. Používa sa na centralizované AI editovanie, hromadné spracovanie s neurónovými filtrami, experimentovanie s AI efektami a optimalizáciu pracovného postupu."
      }
    ],
    exercises: [
      {
        type: 'single-choice',
        question: 'Kde sa otvárajú Neural Filters?',
        options: ['Edit > Neural Filters', 'Filter > Neural Filters', 'Window > Neural Filters', 'Layer > Neural Filters'],
        correctAnswer: 1
      },
      {
        type: 'true-false',
        question: 'Neural Filters používajú umelú inteligenciu pre automatické úpravy.',
        options: ['True', 'False'],
        correctAnswer: true
      },
      {
        type: 'single-choice',
        question: 'Ktorý Neural Filter umožňuje zmenu výrazu tváre?',
        options: ['Skin Smoothing', 'Smart Portrait', 'Style Transfer', 'Colorize'],
        correctAnswer: 1
      },
      {
        type: 'single-choice',
        question: 'Na čo sa používa Colorize Neural Filter?',
        options: ['Zmenu farieb', 'Pridanie farieb do čiernobielych fotografií', 'Odstránenie farieb', 'Úpravu kontrastu'],
        correctAnswer: 1
      },
      {
        type: 'true-false',
        question: 'Super Zoom Neural Filter dokáže zvýšiť rozlíšenie obrázka pomocou AI.',
        options: ['True', 'False'],
        correctAnswer: true
      }
    ],
    useTextExercise: true
  },
  {
    id: 7,
    title: "Image Trace a vektorizácia v Illustrátore",
    content: "Funkciu **Image Trace** používame na prevod rastrových obrázkov na editovateľné vektorové paths, čo je ideálne pri logách, ilustráciách a line art grafike. Po vložení obrázka cez **File > Place** otvoríme panel **Window > Image Trace** a zvolíme vhodný workflow. Rýchly štart zabezpečia **Presets** - napríklad **High Fidelity Photo** pre detailné farebné výstupy, **3 Colors** pre posterizovaný vzhľad alebo **Line Art** pre čistú čiernobielu kresbu. V režime Black and White je kľúčový **Threshold**, ktorý určuje hranicu medzi svetlými a tmavými oblasťami. Parametre **Paths** a **Corners** pomáhajú vyvážiť presnosť voči jednoduchosti tvarov, zatiaľ čo **Noise** odstráni drobné artefakty zo skenov. Keď je náhľad pripravený, cez **Expand** prevedieme výsledok na plne editovateľné vektory. V prípade potreby jemného doladenia využijeme **Advanced Options** s voľbami **Fills**, **Strokes** a **Snap Curves to Lines**.",
    keywords: [
      {
        text: "Image Trace",
        displayName: "trasovanie obrázka",
        explanation: "Image Trace je funkcia v Illustrátore automaticky konvertujúca rastrové obrázky na vektorové paths. Nachádza sa v menu Window > Image Trace alebo v Control Paneli. Select placed image + trace preset. Preview mode pre real-time adjustments. Algoritmus analyzuje farby, edges a shapes. Používa sa na vektorizáciu lôg, konverziu skenov na editovateľné vektory, transformáciu fotografií na ilustratívny štýl a digitalizáciu ručných kresieb."
      },
      {
        text: "Image Trace Panel",
        displayName: "panel trasovanie",
        explanation: "Image Trace Panel je rozhranie pre Image Trace s presets, parameters a preview controls. Nachádza sa v menu Window > Image Trace. Preset dropdown menu (High Fidelity Photo, Line Art, 6/3 Colors). Mode: Color/Grayscale/Black and White. Advanced button znamená detailed options. Preview checkbox. Používa sa na fine-tuning vectorization nastavení, experimentovanie s rôznymi approaches a achieving optimal trace quality."
      },
      {
        text: "Presets",
        displayName: "predvoľby",
        explanation: "Presets sú predkonfigurované Image Trace nastavenia optimalizované pre rôzne typy content. High Fidelity Photo znamená maximum colors/detail. Low Fidelity Photo simplified. 3/6/16 Colors posterized. Shades of Gray grayscale gradients. Line Art/Technical Drawing black and white. Silhouettes solid shapes. Možno uložiť vlastné presets. Používajú sa na rýchlu vectorizáciu bez manuálneho ladenia, konzistentné výsledky a starting point pre custom adjustments."
      },
      {
        text: "Threshold",
        displayName: "prah",
        explanation: "Posúvač v Image Trace Panel určujúci hranicu medzi čiernou a bielou v Black and White mode (0-255). Nižšie hodnoty znamenajú viac čiernych pixelov (tmavšie výsledky). Vyššie hodnoty znamenajú viac bielych pixelov (svetlejšie). Predvolená hodnota je 128 (stredná šedá). Obsahuje náhľad v reálnom čase. Používa sa na konverziu skenovaných kresieb, jemné doladenie vektorizácie line artu, úpravu pre prepálené alebo podexponované skeny a vytváranie vysokokontrastných efektov."
      },
      {
        text: "Paths",
        displayName: "cesty",
        explanation: "Parameter v Advanced Options určujúci, koľko vektorových ciest vytvorí trace algoritmus. Percentage posúvač (0-100%). Vyššie hodnoty znamenajú viac ciest, presnejšie kopírovanie originálu a komplexnejšie vektory. Nižšie hodnoty znamenajú menej ciest a zjednodušené tvary. Je to kompromis medzi presnosťou a jednoduchosťou. Používa sa na zjednodušenú vektorizáciu loga, zníženie zložitosti súboru, rovnováhu medzi detailom a editovateľnosťou a optimalizáciu pre ďalšie úpravy."
      },
      {
        text: "Corners",
        displayName: "rohy",
        explanation: "Parameter v Advanced Options kontrolujúci, koľko ostrých rohov vytvorí trace namiesto hladkých kriviek. Percentage posúvač (0-100%). Vyššie hodnoty znamenajú viac anchor pointov s rohovými rukoväťami a ostrejšie tvary. Nižšie znamenajú hladké Bézierove krivky. Ovplyvňuje geometrický verzus organický vzhľad. Používa sa na technické kresby s ostrými hranami, architektonické ilustrácie, geometrický dizajn loga a zachovanie uhlových tvarov."
      },
      {
        text: "Noise",
        displayName: "šum",
        explanation: "Parameter v Advanced Options ignorujúci malé pixelové oblasti pod špecifikovanou veľkosťou (1-100px). Vyššie hodnoty ignorujú väčšie artefakty. Eliminuje zrnitosť textúry, textúru papiera zo skenov a artefakty JPEG kompresie. Vytvára čistejšiu vektorizáciu. Používa sa na odstránenie nedokonalostí zo skenov, čistenie zdrojových obrázkov nízkej kvality, elimináciu nechcených detailov textúry a vytváranie hladších vektorových výsledkov."
      },
      {
        text: "Expand",
        displayName: "rozbaliť",
        explanation: "Tlačidlo v Control Panel alebo Object > Image Trace > Expand, ktoré konvertuje výsledok Image Trace na editovateľné vektorové cesty. Je to permanentná konverzia - už nie je možné upraviť trace nastavenia. Vytvára cesty a zložené cesty. Zoskupuje výsledok. Ungroup + Direct Select umožňuje editáciu individual ciest. Používa sa po finálnom schválení trace náhľadu, pred editáciou vektorových detailov, na export vektorov a integráciu do dizajnu."
      }
    ],
    exercises: [
      {
        type: 'single-choice',
        question: 'Ktorý Image Trace preset je najvhodnejší na konverziu loga na vektory?',
        options: ['High Fidelity Photo', 'Line Art', '16 Colors', 'Shades of Gray'],
        correctAnswer: 1
      },
      {
        type: 'true-false',
        question: 'Threshold slider ovplyvňuje len Color mode v Image Trace.',
        options: ['True', 'False'],
        correctAnswer: false
      },
      {
        type: 'single-choice',
        question: 'Čo robí Noise parameter v Image Trace?',
        options: ['Pridáva šum do výsledku', 'Ignoruje malé pixelové oblasti', 'Zvyšuje kontrast', 'Mení farebný priestor'],
        correctAnswer: 1
      },
      {
        type: 'single-choice',
        question: 'Kedy treba použiť Expand na Image Trace result?',
        options: ['Hneď po trace', 'Pred úpravou vector paths', 'Nikdy', 'Len pri exporte'],
        correctAnswer: 1
      },
      {
        type: 'true-false',
        question: 'Vyššie Paths hodnoty vytvárajú jednoduchšie a menej komplexné vektorové tvary.',
        options: ['True', 'False'],
        correctAnswer: false
      }
    ],
    useTextExercise: true
  },
  {
    id: 8,
    title: "Liquify Tool a úprava tela",
    content: "**Liquify Tool** je silný nástroj na retuš postáv, úpravu proporcií a kontrolované deformácie, pri ktorých potrebujeme presne riadiť intenzitu zásahu. Cez **Filter > Liquify** otvoríme samostatné rozhranie s real-time preview. Základom je **Forward Warp Tool**, ktorým jemne modelujeme siluetu, črty tváre alebo účes. Pri portrétoch zrýchľuje workflow **Face-Aware Liquify**, ktoré automaticky rozpozná tvár a ponúkne priame ovládanie očí, nosa či úst. Na lokálne zmenšovanie a zväčšovanie oblastí používame **Pucker Tool** a **Bloat Tool**. Ak chceme niektoré časti ochrániť pred úpravou, označíme ich cez **Freeze Mask Tool**. Korekcie spätne doladíme nástrojom **Reconstruct Tool**, ktorý vie účinok lokálne aj globálne zmierniť. Presnosť práce výrazne ovplyvňujú **Brush Tool Options** (Size, Density, Pressure, Rate) a stabilitu okrajov pri deformácii zabezpečí voľba **Pin Edges**.",
    keywords: [
      {
        text: "Liquify Tool",
        displayName: "nástroj Liquify",
        explanation: "Liquify Tool je filter vo Photoshope umožňujúci deformáciu pixelov ako tekutiny s real-time preview. Nachádza sa v menu Filter > Liquify (Shift+Cmd/Ctrl+X). Samostatné rozhranie s náhľadom a nástrojmi. Forward Warp, Reconstruct, Pucker, Bloat, Push Left, Freeze, Thaw nástroje. Face-Aware Liquify pre automatickú detekciu tváre. Show Backdrop pre viacvrstvový kontext. Používa sa na retušovanie postáv, úpravu proporcií tela, zjemnenie tvárí, kreatívne deformácie a korekciu perspektívy."
      },
      {
        text: "Forward Warp Tool",
        displayName: "nástroj posúvania",
        explanation: "Forward Warp Tool je hlavný nástroj v Liquify na tlačenie a ťahanie pixelov v smere pohybu štetca. Klávesová skratka: W. Size, Density, Pressure, Rate nastavenia. Ťahanie posúva oblasti. Brush size určuje rozsah efektu. Používa sa na úpravu siluety tela, zjemnenie pásu, zväčšenie pier, úpravu vlasov, korekciu pózy a jemné posúvanie oblastí."
      },
      {
        text: "Face-Aware Liquify",
        displayName: "inteligentná úprava tváre",
        explanation: "AI funkcia v Liquify automaticky detekujúca tváre a poskytujúca slidery pre oči, nos, ústa, tvár. Panel na pravej strane Liquify rozhrania. Eyes (veľkosť, výška, šírka, náklon), Nose (výška, šírka), Mouth (úsmev, horná/dolná pera, šírka, výška), Face Shape (čelo, bradu, tvár, oblasť čela). Supports multiple faces. Používa sa na zjemnenie portrétu bez manuálneho kreslenia, konzistentné úpravy viacerých tvárí, rýchle korekcie výrazov a profesionálne beauty retušovanie."
      },
      {
        text: "Pucker Tool",
        displayName: "nástroj zúženia",
        explanation: "Pucker Tool je nástroj v Liquify ťahajúci pixely dovnútra k stredu štetca, zmenšujúci oblasti. Klávesová skratka: S. Je ako zoomovanie von. Používa sa na zúženie nosa, zmenšenie pórov, zjemnenie líc, zúženie pásu a zmenšenie oblastí."
      },
      {
        text: "Bloat Tool",
        displayName: "nástroj zväčšenia",
        explanation: "Bloat Tool je nástroj v Liquify tlačiaci pixely von od stredu štetca, zväčšujúci oblasti. Klávesová skratka: B. Je ako zoomovanie dovnútra. Používa sa na zväčšenie očí, zväčšenie svalov, zvýraznenie líc, zväčšenie pier a rozšírenie oblastí."
      },
      {
        text: "Freeze Mask Tool",
        displayName: "nástroj zamrazenia",
        explanation: "Freeze Mask Tool je nástroj v Liquify označujúci oblasti na ochranu pred deformáciou červeným prekrytím. Klávesová skratka: F. Mask Options: None, Mask All, Invert All. Používa sa na ochranu pozadia pri úprave popredia, zamknutie vlasov pri úprave tváre, zachovanie oblečenia pri body reshaping a selektívna ochrana detailov."
      },
      {
        text: "Reconstruct Tool",
        displayName: "nástroj rekonštrukcie",
        explanation: "Reconstruct Tool je nástroj v Liquify postupne vracajúci deformácie späť k originálu. Klávesová skratka: R. Mode dropdown (Revert, Rigid, Stiff, Smooth, Loose). Reconstruct button vracia všetko. Strength posúvač určuje intenzitu. Používa sa na zníženie príliš silných zmien, jemné doladenie deformácií, selektívne vrátenie oblastí a progresívne undo."
      },
      {
        text: "Brush Tool Options",
        displayName: "možnosti štetca",
        explanation: "Brush Tool Options sú nastavenia na pravej strane Liquify rozhrania ovplyvňujúce všetky nástroje. Size (1-15000px) určuje veľkosť štetca. Density (0-100) určuje feathering hrán. Pressure (0-100) určuje intenzitu. Rate (0-100) rýchlosť aplikácie pri držaní. Stylus Pressure možnosť pre grafické tablety. Používajú sa na presné ovládanie deformácií, jemné úpravy a prispôsobenie workflow."
      },
      {
        text: "Pin Edges",
        displayName: "pripnutie okrajov",
        explanation: "Pin Edges je checkbox v Liquify Options zamykajúci okraje obrazu, aby sa pri deformáciách nevytvorili prázdne oblasti. Zabraňuje transparentným okrajom. Je užitočné pri extreme deformáciách. Default je vypnuté. Používa sa na udržanie integrity obrazu, zabraňovanie transparencii, prácu s okrajovými deformáciami a automatickú kompenzáciu."
      }
    ],
    exercises: [
      {
        type: 'single-choice',
        question: 'Ktorý nástroj v Liquify automaticky detekuje tváre a poskytuje slidery pre úpravu?',
        options: ['Forward Warp Tool', 'Face-Aware Liquify', 'Pucker Tool', 'Reconstruct Tool'],
        correctAnswer: 1
      },
      {
        type: 'true-false',
        question: 'Freeze Mask Tool v Liquify slúži na ochranu oblastí pred deformáciou.',
        options: ['True', 'False'],
        correctAnswer: true
      },
      {
        type: 'single-choice',
        question: 'Aký je hlavný rozdiel medzi Pucker a Bloat Tool?',
        options: ['Pucker zväčšuje, Bloat zmenšuje', 'Pucker zmenšuje, Bloat zväčšuje', 'Nie je medzi nimi rozdiel', 'Pucker je rýchlejší'],
        correctAnswer: 1
      },
      {
        type: 'single-choice',
        question: 'Ktorá klávesová skratka otvorí Liquify filter?',
        options: ['Cmd/Ctrl+L', 'Shift+Cmd/Ctrl+X', 'Alt+Cmd/Ctrl+L', 'Cmd/Ctrl+Shift+L'],
        correctAnswer: 1
      },
      {
        type: 'true-false',
        question: 'Pin Edges v Liquify zabraňuje vytvoreniu transparentných okrajov pri deformáciách.',
        options: ['True', 'False'],
        correctAnswer: true
      }
    ],
    useTextExercise: true
  },
  {
    id: 9,
    title: "Content-Aware nástroje a inteligentná retuš",
    content: "Pri čistení fotografií od rušivých prvkov je **Content-Aware Fill** jeden z najefektívnejších nástrojov, pretože automaticky doplní chýbajúcu oblasť textúrou z okolia. V pracovnom priestore **Edit > Content-Aware Fill** máme kontrolu nad vzorkovaním, náhľadom aj výstupom. Na zmenu proporcií bez poškodenia dôležitých objektov používame **Content-Aware Scale**, ktorý chráni tváre či architektúru. Ak potrebujeme objekt presunúť alebo vytvoriť jeho kópiu, pomôže **Content-Aware Move** s automatickým dorobením pôvodného miesta. Pre väčšie plochy je praktický **Patch Tool** v **Content-Aware** režime, pri drobných vadách zas rýchly **Spot Healing Brush**. Keď chceme mať nad zdrojom viac kontroly, siahneme po **Healing Brush Tool**. Rozhodnutie **Clone Stamp vs Healing Brush** robíme podľa toho, či potrebujeme presnú kópiu pixelov alebo inteligentné zliatie s okolím.",
    keywords: [
      {
        text: "Content-Aware Fill",
        displayName: "inteligentná výplň",
        explanation: "AI nástroj automaticky vyplňujúci vybrané oblasti obsahom z okolia. Edit > Content-Aware Fill workspace. Ovládanie oblasti vzorkovania štetcom. Nastavenia Color Adaptation, Rotation Adaptation, Scale. Možnosť výstupu do novej vrstvy. Používa sa na odstránenie nechcených objektov, rozšírenie pozadia, odstránenie turistov z fotografií a opravu rušivých prvkov."
      },
      {
        text: "Content-Aware Fill Workspace",
        displayName: "pracovný priestor inteligentnej výplne",
        explanation: "Vyhradené rozhranie pre Content-Aware Fill s náhľadom, vzorkovacím štetcom a možnosťami. Edit > Content-Aware Fill. Zelené prekrytie zobrazuje oblasť vzorkovania (štetec na pridanie/odobratie). Režimy náhľadu: Default, Original. Výstupné nastavenia: Current Layer/New Layer/Duplicate Layer. Používa sa na precíznu kontrolu zdrojových oblastí, náhľad pred aplikáciou a iteratívne zjemňovanie."
      },
      {
        text: "Content-Aware Scale",
        displayName: "inteligentné škálovanie",
        explanation: "Edit > Content-Aware Scale škáluje obrázky neuniformne a chráni dôležité objekty. Ochrana Skin Tones, ochrana Alpha channel. Protect možnosť vyberá masku chránených oblastí. Amount posúvač určuje normal verzus content-aware. Používa sa na zmenu pomeru strán bez skreslenia subjektov, prispôsobenie obrázkov layoutom a zmenu veľkosti pozadia bez ovplyvnenia popredia."
      },
      {
        text: "Content-Aware Move",
        displayName: "inteligentný presun",
        explanation: "Content-Aware Move Tool (J) presúva alebo duplikuje objekty s AI vyplnením pôvodného miesta a prelínaním na novej pozícii. Režim: Move/Extend. Structure posúvač určuje striktné/voľné prispôsobenie. Color posúvač riadi prelínanie farieb. Transform on drop možnosť. Používa sa na premiestnenie objektov v scéne, prirodzené duplikovanie prvkov a opravu kompozícií."
      },
      {
        text: "Patch Tool",
        displayName: "záplatovací nástroj",
        explanation: "Patch Tool (J) na retušovanie väčších oblastí v Content-Aware mode. Výberové laso, pretiahnite do zdrojovej oblasti. Content-Aware/Normal režim. Structure posúvač zachováva textúru. Používa sa na opravu veľkých škvŕn, odstránenie vrások, retušovanie pleti v portrétoch a korekciu nerovnomerných textúr."
      },
      {
        text: "Spot Healing Brush",
        displayName: "bodový liečivý štetec",
        explanation: "Spot Healing Brush Tool (J) automaticky opravuje nedokonalosti bez manuálneho výberu zdroja. Typy: Content-Aware/Create Texture/Proximity Match. Veľkosť štetca nastaviteľná. Možnosť Sample All Layers. Používa sa na odstránenie pupienkov/škvŕn, opravu malých rušivých prvkov, rýchle retušovanie a odstránenie prachu."
      },
      {
        text: "Healing Brush Tool",
        displayName: "liečivý štetec",
        explanation: "Healing Brush Tool (J) s manuálnym výberom zdroja (Alt+kliknutie) na precízne retušovanie. Prelína textúru, osvetlenie a tieňovanie zo zdroja s cieľom. Režim, Source (Sampled/Pattern), Aligned možnosť. Diffusion posúvač. Používa sa na precízne retušovanie pleti, zladenie textúry, náhradu problematických oblastí a profesionálnu portrétnú prácu."
      },
      {
        text: "Clone Stamp Tool",
        displayName: "klonovací pečiatkovač",
        explanation: "Clone Stamp Tool (S) kopíruje presne pixely zo zdrojovej oblasti (Alt+kliknutie nastaví zdroj). Opacity, Flow, Aligned možnosti. Show Overlay náhľad. Sample možnosti: Current/Below/All Layers. Používa sa na presnú duplikáciu, klonovanie vzorov, retušovanie s ostrými hranami a zachovanie pôvodnej textúry presne."
      }
    ],
    exercises: [
      {
        type: 'single-choice',
        question: 'Kde sa otvára Content-Aware Fill workspace?',
        options: ['Filter > Content-Aware Fill', 'Edit > Content-Aware Fill', 'Select > Content-Aware Fill', 'Window > Content-Aware Fill'],
        correctAnswer: 1
      },
      {
        type: 'true-false',
        question: 'Content-Aware Scale chráni dôležité objekty pri škálovaní obrázka.',
        options: ['True', 'False'],
        correctAnswer: true
      },
      {
        type: 'single-choice',
        question: 'Ktorý nástroj automaticky opravuje imperfections bez manuálneho výberu zdroja?',
        options: ['Healing Brush', 'Clone Stamp', 'Spot Healing Brush', 'Patch Tool'],
        correctAnswer: 2
      },
      {
        type: 'single-choice',
        question: 'Aký je hlavný rozdiel medzi Clone Stamp a Healing Brush?',
        options: ['Clone Stamp je rýchlejší', 'Healing Brush blenduje textúru s okolím', 'Clone Stamp má viac možností', 'Žiadny rozdiel'],
        correctAnswer: 1
      },
      {
        type: 'true-false',
        question: 'Content-Aware Move môže objekty len presúvať, nie duplikovať.',
        options: ['True', 'False'],
        correctAnswer: false
      }
    ],
    useTextExercise: true
  },
  {
    id: 10,
    title: "Layer Styles a pokročilé efekty",
    content: "**Layer Styles** sú rýchly spôsob, ako navrhovať tlačidlá, textové efekty, ikony a UI prvky bez deštruktívnych úprav vrstvy. Dialóg otvoríme cez **Layer > Layer Style** alebo dvojklikom na vrstvu. Pre hĺbku a oddelenie od pozadia sa bežne používa **Drop Shadow**, zatiaľ čo **Inner Shadow** vytvára vtlačený vzhľad. Svetelné a neonové efekty dosiahneme kombináciou **Outer Glow** a **Inner Glow**. Pri simulácii reliéfu je kľúčový **Bevel and Emboss**, kde cez **Technique**, **Direction**, **Depth** a **Size** riadime charakter 3D efektu. Pre jemné svetelné profily doplníme **Contour** a pre špecifické tieňovanie môžeme použiť **Satin**. Vzhľad vrstvy ďalej meníme cez **Color/Gradient/Pattern Overlay** a čisté hrany doplníme cez **Stroke**. Opakovateľnosť workflowu zabezpečia uložené **Presets** a rýchle kopírovanie štýlov medzi vrstvami.",
    keywords: [
      {
        text: "Layer Styles",
        displayName: "layer styles",
        explanation: "Nedeštruktívne efekty aplikované na obsah vrstvy. Layer > Layer Style alebo dvojklik na vrstvu. Drop Shadow, Bevel/Emboss, Glow, Overlay, Stroke a ďalšie. Nedeštruktívne, editovateľné. Fx ikona v Layers Panel. Pravý klik > Copy/Paste Layer Style. Používajú sa na dizajn tlačidiel, textové efekty, vytváranie ikon, UI prvky, mockupy produktov a rýchle prototypovanie."
      },
      {
        text: "Bevel and Emboss",
        displayName: "bevel a emboss",
        explanation: "Layer Style simulujúci 3D reliéf na 2D vrstve. Štýl: Outer Bevel, Inner Bevel, Emboss, Pillow Emboss, Stroke Emboss. Technika: Smooth/Chisel Hard/Chisel Soft. Depth určuje výšku reliéfu. Direction: Up/Down. Size, Soften, Angle, Altitude. Gloss Contour mení profil osvetlenia. Používa sa na 3D textové efekty, vytváranie tlačidiel, embossované logá, metalické efekty a simuláciu kamenného vyrezávania."
      },
      {
        text: "Contour",
        displayName: "kontúra",
        explanation: "V Bevel and Emboss, sekcia Contour mení tvar profilu gradientu osvetlenia, vytvárajúc metalické, plastové alebo vlastné efekty tieňovania. Prednastavené kontúry (Linear, Cone, Ring a ďalšie) alebo vlastný editor kriviek. Gloss Contour verzus Texture. Range posúvač kontroluje dosah. Používa sa na chrómované efekty, lesklé plastové tlačidlá, metalický text, kruhové zvýraznenia a vlastné profily osvetlenia."
      },
      {
        text: "Drop Shadow",
        displayName: "drop shadow",
        explanation: "Layer Style pridávajúci tieň pod vrstvu simulujúci výšku. Blend Mode (predvolene Multiply), Opacity, Angle, Distance, Spread, Size. Use Global Light synchronizuje uhol naprieč štýlmi. Layer Knocks Out Drop Shadow možnosť. Používa sa na pridanie hĺbky UI prvkom, realistické tiene na fotografiách, výška v material dizajne a vizuálne oddelenie vrstiev."
      },
      {
        text: "Inner Shadow",
        displayName: "vnútorný tieň",
        explanation: "Layer Style vytvárajúci tieň vo vnútri hraníc vrstvy, simulujúci zapustený/zahĺbený efekt. Blend Mode, Opacity, Angle, Distance, Choke, Size. Opačný smer než Drop Shadow. Používa sa na zapustené tlačidlá, vyrezávané textové efekty, hĺbku v UI, realistické zapustenia a efekty studní/dutín."
      },
      {
        text: "Outer Glow",
        displayName: "vonkajšia žiara",
        explanation: "Layer Style pridávajúci efekt žiary okolo hrán vrstvy. Blend Mode (predvolene Screen), Opacity, Noise, Color/Gradient, Technique (Softer/Precise), Spread, Size. Používa sa na neónové efekty, svietiaci text, zvýraznenie tlačidiel, sci-fi UI prvky, halo efekty a oddelenie od tmavého pozadia."
      },
      {
        text: "Inner Glow",
        displayName: "vnútorná žiara",
        explanation: "Layer Style vytvárajúci žiaru vo vnútri hraníc vrstvy. Source: Edge (od hrán dovnútra) alebo Center (od stredu von). Blend Mode, Opacity, Choke, Size. Používa sa na efekty podsvietenia, vnútorné zvýraznenia, svietiace hrany, hĺbku UI a simuláciu mrazeného skla."
      },
      {
        text: "Gradient Overlay",
        displayName: "gradient overlay",
        explanation: "Layer Style aplikujúci gradient cez obsah vrstvy. Blend Mode, Opacity, Gradient picker (prednastavené/vlastné), Style (Linear/Radial/Angle/Reflected/Diamond), Angle, Scale. Align with Layer checkbox. Používa sa na kolorovanie odtieňov šedej, metalické gradienty, overlaye západu slnka, dúhový text a rýchle farebné variácie."
      },
      {
        text: "Stroke",
        displayName: "stroke obrys",
        explanation: "Layer Style pridávajúci obrys okolo hraníc vrstvy. Size (px), Position (Outside/Inside/Center), Blend Mode, Fill Type (Color/Gradient/Pattern). Používa sa na orámovaný text, okraje ikon, zdôraznenie tvarov, vytváranie konzistentných obrysov, nálepkové efekty a cel-shading štýl."
      }
    ],
    exercises: [
      {
        type: 'single-choice',
        question: 'Ktorý Layer Style simuluje 3D reliéf?',
        options: ['Drop Shadow', 'Bevel and Emboss', 'Stroke', 'Color Overlay'],
        correctAnswer: 1
      },
      {
        type: 'true-false',
        question: 'Layer Styles sú deštruktívne a po aplikovaní ich nemožno zmeniť.',
        options: ['True', 'False'],
        correctAnswer: false
      },
      {
        type: 'single-choice',
        question: 'Čo robí Contour v Bevel and Emboss?',
        options: ['Mení farbu', 'Mení shape lighting profile', 'Pridáva textúru', 'Zväčšuje vrstvu'],
        correctAnswer: 1
      },
      {
        type: 'single-choice',
        question: 'Ktorý Layer Style vytvára tieň vnútri vrstvy?',
        options: ['Drop Shadow', 'Outer Shadow', 'Inner Shadow', 'Bevel'],
        correctAnswer: 2
      },
      {
        type: 'true-false',
        question: 'Stroke Layer Style môže byť aplikovaný len Outside layer boundaries.',
        options: ['True', 'False'],
        correctAnswer: false
      }
    ],
    useTextExercise: true
  },
  {
    id: 11,
    title: "Camera Raw Filter a RAW spracovanie",
    content: "**Camera Raw Filter** je univerzálne prostredie na nedeštruktívne spracovanie RAW aj JPEG/TIFF fotografií, keď potrebujeme presnú kontrolu expozície, farieb a detailov. Otvoríme ho cez **Filter > Camera Raw Filter** na ľubovoľnej vrstve. V **Basic Paneli** nastavujeme globálny tón a farebnosť pomocou expozície, kontrastu, highlightov, tieňov a saturácie. Pre jemnejšie modelovanie kontrastu slúži **Tone Curve**, kde vieme pracovať parametricky aj cez point curve. Ak potrebujeme zasiahnuť len vybrané farby, použijeme **HSL/Color Panel** s kontrolou Hue, Saturation a Luminance. Ostrosť a šum riešime v **Detail Paneli**, kde hodnoty Amount, Radius, Detail a Masking určujú charakter zostrenia. Technické chyby objektívu koriguje sekcia **Lens Corrections**. Konzistentný výstup naprieč sériou fotografií zabezpečí ukladanie vlastných **Presets**.",
    keywords: [
      {
        text: "Camera Raw Filter",
        displayName: "Camera Raw filter",
        explanation: "Nedeštruktívne editovacie rozhranie vo Photoshope určené na spracovanie RAW súborov aj bežných formátov ako JPEG alebo TIFF. Otvoríte ho cez Filter > Camera Raw Filter (skratka Cmd/Shift/A) a získate prístup k panelom Basic, Curves, Detail, HSL, Lens Corrections, Effects a Calibration. Obsahuje histogram s náhľadom a možnosť porovnania pred/po úpravou (klávesa P). Používa sa na spracovanie RAW fotografií, farebné úpravy JPEG súborov, hromadné úpravy sérií fotografií a nedeštruktívny photo editing bez straty pôvodných údajov."
      },
      {
        text: "Basic Panel",
        displayName: "základný panel",
        explanation: "Hlavný panel v Camera Raw na globálne úpravy tónu a farieb fotografie. Obsahuje posúvače: Exposure (expozícia), Contrast (kontrast), Highlights (svetlá), Shadows (tiene), Whites (biele body), Blacks (čierne body), Texture (textúra), Clarity (jasnosť), Dehaze (odstránenie hmly), Vibrance (sýtosť) a Saturation (nasýtenie). Ďalej nájdete nastavenia Temperature/Tint na vyváženie bielej a tlačidlo Auto na automatické úpravy. Používa sa na základné úpravy expozície, celkovú farebnú korekciu, úpravu kontrastu a ako východisková báza pre ďalší photo editing."
      },
      {
        text: "Tone Curve",
        displayName: "tónová krivka",
        explanation: "Panel v Camera Raw určený na precíznu kontrolu kontrastu. Ponúka dva režimy: Parametric curve s posúvačmi pre oblasti Highlights/Lights/Darks/Shadows a Point Curve s klasickými Bézierovými bodmi. Obsahuje aj predvoľby Linear/Medium/Strong Contrast a možnosť upravovať jednotlivé farebné kanály (RGB/R/G/B). Používa sa na jemné doladenie kontrastu v konkrétnych tónových rozsahoch, vytváranie S-kriviek pre dramatický vzhľad, oddelenie tieňov od svetlých oblastí a kinematografické farebné ladenie fotografií."
      },
      {
        text: "HSL Panel",
        displayName: "HSL panel",
        explanation: "Color Mixer v Camera Raw určený na selektívne úpravy farieb. Obsahuje tri záložky: Hue (posun odtieňa farby), Saturation (intenzita sýtosti) a Luminance (jas). Každá záložka má 8 posúvačov pre farebné rozsahy: Red (červená), Orange (oranžová), Yellow (žltá), Green (zelená), Aqua (tyrkysová), Blue (modrá), Purple (purpurová) a Magenta (fialová). Súčasťou je aj Targeted Adjustment Tool na priamu úpravu farieb. Používa sa na zmenu odtieňa oblohy, zvýraznenie zelene rastlín, úpravu tónu pleti a selektívne odfarbenie konkrétnych farebných oblastí."
      },
      {
        text: "Detail Panel",
        displayName: "panel detailov",
        explanation: "Panel v Camera Raw určený na zostrovanie (Sharpening) a odstránenie šumu (Noise Reduction). Zostrovanie obsahuje posúvače Amount (množstvo), Radius (polomer), Detail (detaily) a Masking (maska - Alt+ťahanie zobrazí náhľad masky). Noise Reduction má posúvače Luminance (svetelný šum), Color (farebný šum), Detail (zachovanie detailov) a Smoothness (vyhladenie). Používa sa na zostrovanie hrán objektov, odstránenie šumu z fotografií s vysokým ISO, zachovanie dôležitých detailov a prípravu fotografií na tlač."
      },
      {
        text: "Lens Corrections",
        displayName: "korekcie objektívu",
        explanation: "Panel v Camera Raw určený na opravu skreslenia objektívu (lens distortion), chromatickej aberácie a vinětácie (stmavnutie rohov). Ponúka záložku Profile na automatickú detekciu objektívu a aplikáciu korekcií, alebo záložku Manual s posúvačmi Distortion, Chromatic Aberration a Vignetting na manuálne úpravy. Aktivuje sa zaškrtnutím Enable Profile Corrections. Používa sa na opravu skreslenia typu barrel alebo pincushion, odstránenie farebného okraja na kontrastných hranách a korekciu stmavnutých rohov fotografie."
      },
      {
        text: "Camera Raw Presets",
        displayName: "Camera Raw predvoľby",
        explanation: "Uložené kombinácie nastavení v Camera Raw, ktoré možno rýchlo aplikovať na fotografie. Nájdete ich v paneli Presets, rozdelené na User Presets (vaše vlastné) a Adobe Presets (od Adobe). Nový preset vytvoríte tlačidlom Create Preset, kde si vyberiete, ktoré parametre chcete uložiť. Existuje aj možnosť Apply on import na automatické aplikovanie pri otvorení fotografií. Používajú sa na konzistentné spracovanie sérií fotografií, vytvorenie značkového farebného štýlu, rýchle kreatívne ladenie a štandardizované pracovné postupy vo fotografii."
      },
      {
        text: "RAW vs JPEG Processing",
        displayName: "RAW vs JPEG spracovanie",
        explanation: "RAW súbory (prípony .CR2, .NEF, .ARW) obsahujú nespracované dáta zo senzoru fotoaparátu s maximálnou editovacou flexibilitou. JPEG je už skomprimovaný a spracovaný formát s obmedzeným dynamickým rozsahom. RAW pracuje s 12-16 bitovou hĺbkou farieb, kým JPEG len s 8 bitmi. Camera Raw dokáže spracovať oba formáty, ale RAW súbory ponúkajú oveľa väčší priestor na korekcie. Používa sa pri profesionálnej fotografii, kde potrebujete maximálnu kvalitu, extrémne korekcie expozície a prípravu fotografií na kvalitnejšiu tlač."
      }
    ],
    exercises: [
      {
        type: 'single-choice',
        question: 'Kde sa otvára Camera Raw Filter vo Photoshope?',
        options: ['Edit > Camera Raw', 'Filter > Camera Raw Filter', 'Image > Camera Raw', 'Window > Camera Raw'],
        correctAnswer: 1
      },
      {
        type: 'true-false',
        question: 'Camera Raw Filter funguje len na RAW súboroch, nie na JPEG.',
        options: ['True', 'False'],
        correctAnswer: false
      },
      {
        type: 'single-choice',
        question: 'Ktorý panel obsahuje Exposure, Contrast a Highlights slidery?',
        options: ['Detail Panel', 'HSL Panel', 'Basic Panel', 'Tone Curve'],
        correctAnswer: 2
      },
      {
        type: 'single-choice',
        question: 'Na čo sa používa HSL Panel?',
        options: ['Sharpening', 'Selektívne úpravy jednotlivých farieb', 'Noise reduction', 'Lens corrections'],
        correctAnswer: 1
      },
      {
        type: 'true-false',
        question: 'RAW súbory majú väčší dynamic range a editing latitude než JPEG.',
        options: ['True', 'False'],
        correctAnswer: true
      }
    ],
    useTextExercise: true
  },
  {
    id: 12,
    title: "3D priestor vo Photoshope",
    content: "Vo Photoshope vieme cez **3D workspace** vytvoriť 3D text, mockupy a konceptové vizualizácie bez potreby externého 3D softvéru. Konverziu vrstvy spustíme cez **3D > New 3D Extrusion from Selected Layer**. Pri tvorbe **3D Textu** je kľúčový parameter **Extrusion Depth**, ktorý určuje hĺbku objektu. Ak potrebujeme základné modely, cez **3D menu** vytvoríme aj **3D Shapes** ako kocku, guľu alebo valec. V paneli **Window > 3D** spravujeme **Mesh**, **Materials** a **Lights**. Geometriu dolaďujeme cez úpravy meshu, povrchy cez **Materials** (Diffuse, Specular, Bump) a realistickejšie osvetlenie dosiahneme v sekcii **Environment** pomocou reflection mappingu a IBL. Pred exportom nastavíme **Render Settings** - draft režim na rýchly náhľad, final režim na kvalitný výstup. Navigáciu v scéne riešime cez **Camera Tools** (orbit, pan, dolly).",
    keywords: [
      {
        text: "3D Workspace",
        displayName: "3D pracovný priestor",
        explanation: "Pracovný priestor vo Photoshope na vytváranie a editáciu 3D obsahu. 3D > New 3D Extrusion from Selected Layer/Path. Window > 3D panel. Nástroje: Move, Rotate, Scale Object/Camera. Properties Panel na mesh/materiál/osvetlenie. Používa sa na vytváranie 3D textu, mockupy produktov, jednoduchú 3D grafiku, typografické efekty a koncepčnú vizualizáciu."
      },
      {
        text: "3D Text Extrusion",
        displayName: "3D extruzia textu",
        explanation: "Konverzia 2D textovej vrstvy na 3D extrudovaný objekt. 3D > New 3D Extrusion from Selected Layer. Extrusion Depth posúvač (0 až nekonečno). Twist, Taper možnosti v Properties. Caps (predné/zadné plochy) možno textúrovať. Používa sa na dizajn loga s hĺbkou, typografické plagáty, úvodné karty, dimenzionálny branding a 3D písmo."
      },
      {
        text: "Extrusion Depth",
        displayName: "hĺbka extrúzie",
        explanation: "Parameter určujúci, ako hlboko je 2D tvar/text extrudovaný do 3D priestoru. Properties Panel > Mesh sekcia. 0 znamená ploché, vyššie hodnoty hlbšie. Ovplyvňuje zložitosť geometrie a čas renderovania. Používa sa na jemnú hĺbku pre embossovaný vzhľad, extrémnu hĺbku pre dramatický 3D text a úpravu proporcií v 3D dizajne."
      },
      {
        text: "3D Panel",
        displayName: "3D panel",
        explanation: "Window > 3D panel zobrazujúci hierarchiu 3D scény. Vrchná úroveň: Scene, Current View, Meshes, Materials, Lights. Výber prvku zobrazí vlastnosti v Properties Panel. Ikona oka určuje viditeľnosť. Používa sa na navigáciu v komplexných 3D scénach, výber konkrétneho meshu/materiálu na editáciu, organizovanie 3D prvkov a správu svetiel."
      },
      {
        text: "Materials",
        displayName: "materiály",
        explanation: "Povrchové vlastnosti 3D objektov v 3D Panel. Diffuse (základná farba), Specular (zvýraznenie), Illumination (žiara), Ambient, Reflection, Opacity, Bump (falošná hĺbka), Normal, Environment. Mapovanie textúry na každý kanál. Používajú sa na realistické kovové povrchy, lesklé plasty, matné povrchové úpravy, textúrované materiály a vlastné vzhľady povrchov."
      },
      {
        text: "Mesh",
        displayName: "mesh geometria",
        explanation: "3D geometrická štruktúra v 3D Panel. Vlastnosti: Extrusion Depth, Twist, Taper Top/Bottom, Inflate (skosenie), Deform axis. Catch Shadows checkbox. Caps (Front/Back Inflation). Používa sa na tvarovanie extrudovanej geometrie, vytváranie jedinečných 3D tvarov, úpravu proporcií a skosenie hrán pre hladší vzhľad."
      },
      {
        text: "Camera Tools",
        displayName: "nástroje kamery",
        explanation: "Nástroje na navigáciu v 3D priestore. Orbit (otáčanie okolo), Roll (krútenie pohľadu), Pan (posúvanie pohľadu), Walk (štýl FPS), Zoom. Klávesa K prepína medzi režimami. Reset camera v 3D Panel. Používajú sa na prezeranie 3D objektov z rôznych uhlov, kompozíciu 3D scén, hľadanie optimálnej perspektívy a nastavenie kľúčových snímok animácie."
      },
      {
        text: "Render Settings",
        displayName: "nastavenia renderu",
        explanation: "3D > Render Settings určujú kvalitu 3D výstupu. Predvoľby: Default, Solid, Wireframe, Vertices, Unlit Texture, Normals. Ray Traced Draft (rýchle) verzus Ray Traced Final (pomalé, vysoká kvalita). Progresívne zjemňovanie. Používajú sa na rýchly náhľad počas práce, finálny vysokokvalitný render na výstup a vyváženie kvality verzus čas."
      },
      {
        text: "IBL (Image-Based Lighting)",
        displayName: "osvetlenie založené na obrázku",
        explanation: "Environment v 3D scéne používajúce panoramatický obrázok na osvetlenie a odrazy. 3D Panel > Environment. Nahradenie textúry vlastným HDRI/obrázkom. Posúvače Intensity, Shadow softness. Používa sa na realistické odrazy na kovových povrchoch, ambientné osvetlenie zladené so scénou, kreatívne farebné svetelné efekty a simuláciu produktovej fotografie."
      }
    ],
    exercises: [
      {
        type: 'single-choice',
        question: 'Ako sa vytvára 3D text extrúzia vo Photoshope?',
        options: ['Edit > 3D Text', 'Type > Create 3D', '3D > New 3D Extrusion from Selected Layer', 'Filter > 3D > Extrude'],
        correctAnswer: 2
      },
      {
        type: 'true-false',
        question: 'Extrusion Depth určuje, ako hlboko je 2D shape extrudovaný do 3D priestoru.',
        options: ['True', 'False'],
        correctAnswer: true
      },
      {
        type: 'single-choice',
        question: 'Kde sa upravujú surface vlastnosti 3D objektov?',
        options: ['Layers Panel', 'Materials v 3D Panel', 'Adjustments Panel', 'Channels Panel'],
        correctAnswer: 1
      },
      {
        type: 'single-choice',
        question: 'Ktorý Render Setting poskytuje najvyššiu kvalitu ale najdlhší čas renderu?',
        options: ['Ray Traced Draft', 'Solid', 'Ray Traced Final', 'Wireframe'],
        correctAnswer: 2
      },
      {
        type: 'true-false',
        question: 'IBL (Image-Based Lighting) používa panoramic image pre lighting a reflections.',
        options: ['True', 'False'],
        correctAnswer: true
      }
    ],
    useTextExercise: true
  }
];

export const professionalFinalTest: Exercise[] = [
  {
    type: 'single-choice',
    question: 'Ktorý blend mode používa farby hornej vrstvy ale jas spodnej?',
    options: ['Hue', 'Color', 'Luminosity', 'Saturation'],
    correctAnswer: 1
  },
  {
    type: 'true-false',
    question: 'Even-Odd Fill Rule berie do úvahy direction (smer) paths pri určovaní fill oblastí.',
    options: ['True', 'False'],
    correctAnswer: false
  },
  {
    type: 'multiple-choice',
    question: 'Ktoré nástroje poskytuje Select and Mask pre pokročilé výbery?',
    options: [
      'Refine Edge Brush',
      'Edge Detection',
      'Global Refinements',
      'Magic Wand'
    ],
    correctAnswer: [0, 1, 2]
  },
  {
    type: 'single-choice',
    question: 'Čo je hlavný rozdiel medzi Clipping Mask a Layer Mask?',
    options: [
      'Clipping Mask používa tvar spodnej vrstvy',
      'Layer Mask používa tvar spodnej vrstvy',
      'Clipping Mask je deštruktívna',
      'Layer Mask funguje len v Illustrátore'
    ],
    correctAnswer: 0
  },
  {
    type: 'choose-correct',
    question: '________ posúva jednotlivé znaky vertikálne bez zmeny leading.',
    options: ['Baseline Shift', 'Leading'],
    correctAnswer: { 0: 'Baseline Shift' }
  },
  {
    type: 'true-false',
    question: 'Neural Filters využívajú umelú inteligenciu na automatické úpravy fotografií.',
    options: ['True', 'False'],
    correctAnswer: true
  },
  {
    type: 'single-choice',
    question: 'Ktorý nástroj v Liquify automaticky detekuje tvár a umožňuje úpravu sliderom?',
    options: ['Forward Warp Tool', 'Face-Aware Liquify', 'Pucker Tool', 'Reconstruct Tool'],
    correctAnswer: 1
  },
  {
    type: 'multiple-choice',
    question: 'Ktoré Content-Aware nástroje sú dostupné vo Photoshope?',
    options: [
      'Content-Aware Fill',
      'Content-Aware Scale',
      'Content-Aware Move',
      'Content-Aware Export'
    ],
    correctAnswer: [0, 1, 2]
  },
  {
    type: 'sort',
    question: 'Priraďte Layer Styles k ich použitiu:',
    options: [
      'Drop Shadow - Pridanie hĺbky a oddelenie od pozadia',
      'Bevel and Emboss - Simulácia 3D reliéfu',
      'Outer Glow - Svetelné efekty a žiara',
      'Stroke - Obrysy a okraje'
    ],
    correctAnswer: [
      'Drop Shadow - Pridanie hĺbky a oddelenie od pozadia',
      'Bevel and Emboss - Simulácia 3D reliéfu',
      'Outer Glow - Svetelné efekty a žiara',
      'Stroke - Obrysy a okraje'
    ]
  },
  {
    type: 'choose-correct',
    question: '________ panel obsahuje Sharpening a Noise Reduction nástroje.',
    options: ['Detail', 'Basic'],
    correctAnswer: { 0: 'Detail' }
  }
];

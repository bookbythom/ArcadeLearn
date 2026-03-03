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

export const intermediateThemes: Theme[] = [
  {
    id: 1,
    title: "Layers Panel a organizácia vrstiev",
    content: "**Layers Panel** je základ, keď organizujeme komplexné projekty s množstvom prvkov a potrebujeme mať rýchly prístup ku každej časti dizajnu. Pri kontrole variantov a príprave rôznych exportov pracujeme s **viditeľnosťou vrstiev**, ktorá nám umožní porovnávať verzie bez zásahu do obsahu. Hotové časti chránime cez **zamykanie**, aby sa omylom neposunuli alebo neupravili. Súvisiace prvky spájame do **Layer Groups**, vďaka čomu ostáva dokument prehľadný aj pri desiatkach vrstiev. Na jemné prelínanie, vodoznaky či budovanie hĺbky slúži **Opacity**, zatiaľ čo **Fill** nastavujeme vtedy, keď chceme zachovať Layer Styles, ale potlačiť samotný obsah vrstvy. Veľký rozdiel robí aj konzistentné **pomenovanie** vrstiev, ktoré zrýchľuje tímovú prácu aj neskoršie úpravy.",
    keywords: [
      {
        text: "Layers Panel",
        explanation: "Layers Panel je panel vo Photoshope (F7 alebo Window > Layers) zobrazujúci všetky vrstvy dokumentu. Ukazuje náhľady vrstiev, ich názvy, viditeľnosť a blend modes. Vrstvy sú usporiadané od hornej po spodnú, pričom horné prekrývajú spodné. Používa sa na organizáciu, výber a správu všetkých prvkov projektu."
      },
      {
        text: "Viditeľnosť vrstiev",
        displayName: "viditeľnosť",
        explanation: "Viditeľnosť vrstiev je možnosť skryť alebo zobraziť vrstvy klikaním na ikonu oka v Layers Paneli. Skryté vrstvy sa nezobrazia v dokumente ale zostávajú zachované. Alt+klik na ikonu oka skryje všetky ostatné vrstvy. Používa sa na kontrolu dizajnu, porovnávanie verzií alebo export rôznych variantov."
      },
      {
        text: "Zamykanie",
        displayName: "zamknutie vrstiev",
        explanation: "Zamknutie vrstiev je ochrana vrstvy pred úpravami klikaním na ikonu zámku v Layers Paneli. Možnosti: Lock Transparent Pixels (chráni priehľadné oblasti), Lock Image Pixels (chráni všetky pixely), Lock Position (zabraňuje posúvaniu), Lock All (úplná ochrana). Používa sa na ochranu dokončených častí projektu."
      },
      {
        text: "Layer Groups",
        explanation: "Layer Groups sú zložky v Layers Paneli (Ctrl/Cmd+G) organizujúce súvisiace vrstvy. Vytvárajú sa cez Layer > New > Group alebo kliknutím na ikonu zložky. Možno ich zbaliť/rozbaliť šípkou vedľa názvu. Efekty aplikované na group ovplyvňujú všetky vrstvy v ňom. Používajú sa pri komplexných projektoch s desiatkami vrstiev."
      },
      {
        text: "Opacity",
        explanation: "Opacity je priehľadnosť celej vrstvy vrátane jej efektov (0-100%). Ovláda sa sliderom v Layers Paneli alebo číslicami (5 = 50%, 0 = 100%). Nižšia opacity umožňuje vidieť vrstvy pod ňou. Ovplyvňuje všetko vrátane Layer Styles. Používa sa na jemné prelínanie prvkov, watermarky alebo vytvorenie hĺbky v kompozícii."
      },
      {
        text: "Fill",
        explanation: "Fill je priehľadnosť len obsahu vrstvy bez efektov (0-100%). Na rozdiel od Opacity neovplyvňuje Layer Styles ako tiene, svietenie či stroke. Nastavuje sa v Layers Paneli pod Opacity. Používa sa keď chcete zachovať viditeľné efekty (napr. Outer Glow), ale skryť samotný obsah vrstvy."
      },
      {
        text: "pomenovanie",
        displayName: "pomenovanie vrstiev",
        explanation: "Pomenovanie vrstiev znamená dvojklik na názov vrstvy v Layers Paneli, ktorý umožňuje jeho úpravu. Dobre pomenované vrstvy (napr. 'Pozadie', 'Logo', 'Text nadpis') zlepšujú orientáciu v projekte. Používanie konzistentného systému pomenovávania (napr. prefixov) urýchľuje prácu v tímoch a pri opakovaných úpravách."
      }
    ],
    exercises: [
      {
        type: 'single-choice',
        question: 'Aká je klávesová skratka na otvorenie Layers Panel vo Photoshope?',
        options: ['F5', 'F7', 'F9', 'Ctrl+L'],
        correctAnswer: 1
      },
      {
        type: 'true-false',
        question: 'Fill ovplyvňuje aj Layer Styles aplikované na vrstvu.',
        options: ['True', 'False'],
        correctAnswer: false
      },
      {
        type: 'multiple-choice',
        question: 'Ktoré možnosti zámku vrstiev existujú vo Photoshope?',
        options: [
          'Lock Transparent Pixels',
          'Lock Position',
          'Lock All',
          'Lock Colors'
        ],
        correctAnswer: [0, 1, 2]
      },
      {
        type: 'choose-correct',
        question: 'Klávesová skratka ________ vytvorí Layer Group z vybraných vrstiev.',
        options: ['Ctrl/Cmd+G', 'Ctrl/Cmd+Shift+G'],
        correctAnswer: { 0: 'Ctrl/Cmd+G' }
      },
      {
        type: 'sort',
        question: 'Priraďte správne charakteristiky:',
        options: [
          'Opacity - Ovplyvňuje vrstvu aj jej efekty',
          'Fill - Ovplyvňuje len obsah vrstvy',
          'Ikona oka - Prepína viditeľnosť vrstvy',
          'Layer Group - Organizuje súvisiace vrstvy'
        ],
        correctAnswer: [
          'Opacity - Ovplyvňuje vrstvu aj jej efekty',
          'Fill - Ovplyvňuje len obsah vrstvy',
          'Ikona oka - Prepína viditeľnosť vrstvy',
          'Layer Group - Organizuje súvisiace vrstvy'
        ]
      }
    ],
    useTextExercise: true
  },

  {
    id: 2,
    title: "Pen Tool a úprava uzlov",
    content: "**Pen Tool** používame vtedy, keď potrebujeme presné vektorové kreslenie lôg, výstrih objektov z fotografií alebo tvorbu custom shapes bez straty kvality pri zväčšení. Pri geometrických formách a ostrých hranách vytvárame **corner points**, zatiaľ čo pre prirodzené krivky a organické línie sú vhodné **smooth points**. Tvar existujúcich ciest meníme cez **Anchor Points**, aby sme vedeli jemne doladiť každé zakrivenie. O smer a intenzitu kriviek sa starajú **Control Handles**, ktoré dávajú nad segmentmi presnú kontrolu. Ak potrebujeme upraviť len konkrétnu časť objektu, siahneme po **Direct Selection Tool** bez toho, aby sme menili celý tvar naraz. Pri prechode medzi ostrým a plynulým charakterom uzla využívame **Convert Anchor Point Tool**.",
    keywords: [
      {
        text: "Pen Tool",
        explanation: "Pen Tool je nástroj v Adobe Illustrator (klávesa P) alebo Photoshop na vytváranie presných vektorových ciest. Každé kliknutie pridá anchor point. Kliknutie a ťahanie vytvára smooth curve s kontrolnými bodmi. Držanie Alt upravuje kontrolné body nezávisle. Používa sa na presné vektorové kreslenie lôg, výstrih objektov alebo custom shapes."
      },
      {
        text: "Corner points",
        displayName: "rohové uzly (corner points)",
        explanation: "Corner point je typ anchor point vytvorený jednoduchým kliknutím. Vytvára ostrý roh bez kontrolných bodov. Segmenty cesty medzi corner points sú rovné čiary. Alt+klik na smooth point ho konvertuje na corner point. Používa sa pre geometrické tvary, ostré hrany a architektonické prvky."
      },
      {
        text: "Smooth points",
        displayName: "hladké uzly (smooth points)",
        explanation: "Smooth point je typ anchor point vytvorený kliknutím a ťahaním. Má dve kontrolné ramienka, ktoré ovládajú zakrivenie segmentov. Ramienka sú vždy v priamke pre plynulý prechod. Používa sa pre organické tvary, krivky a plynulé línie."
      },
      {
        text: "Anchor Points",
        explanation: "Anchor Point je uzol na vektorovej ceste definujúci jej tvar a polohu. Môže byť corner point (rohový) alebo smooth point (hladký). Je zobrazený ako malý štvorček alebo krúžok pri výbere cesty. Používa sa ako základný stavebný bod vektorových objektov."
      },
      {
        text: "Control Handles",
        displayName: "kontrolné ramienka",
        explanation: "Control Handles sú čiary vychádzajúce zo smooth point, ktoré určujú smer a intenzitu zakrivenia segmentu. Dlhšie ramienka znamenajú silnejšie zakrivenie. Smer ramienka určuje smer krivky. Upravujú sa ťahaním ich koncových bodov. Alt+drag oddeľuje ramienka pre asymetrické krivky."
      },
      {
        text: "Direct Selection Tool",
        explanation: "Direct Selection Tool je nástroj (klávesa A) na výber a úpravu jednotlivých anchor points a segmentov cesty. Kliknutie na anchor point ho vyberá a zobrazí jeho kontrolné ramienka. Umožňuje posúvať uzly a meniť tvar kriviek bez ovplyvnenia celého objektu. Používa sa na jemnú úpravu tvarov a presné vyladenie kriviek."
      },
      {
        text: "Convert Anchor Point Tool",
        explanation: "Convert Anchor Point Tool je nástroj (Shift+C v Illustrátore) konvertujúci typ uzla. Kliknutie na smooth point ho zmení na corner point. Kliknutie a ťahanie na corner point vytvorí smooth point s ramienkami. Ťahanie ramienka smooth point oddelí ramienka pre asymetrické krivky. Používa sa na presné ovládanie zakrivenia ciest."
      }
    ],
    exercises: [
      {
        type: 'single-choice',
        question: 'Ako vytvoríte smooth point pomocou Pen Tool?',
        options: [
          'Jednoduché kliknutie',
          'Kliknutie a ťahanie',
          'Double-click',
          'Alt+kliknutie'
        ],
        correctAnswer: 1
      },
      {
        type: 'true-false',
        question: 'Direct Selection Tool mení celý objekt naraz.',
        options: ['True', 'False'],
        correctAnswer: false
      },
      {
        type: 'multiple-choice',
        question: 'Ktoré tvrdenia o control handles sú pravdivé?',
        options: [
          'Určujú zakrivenie segmentu',
          'Dlhšie ramienka vytvárajú silnejšie zakrivenie',
          'Sú viditeľné len pri výbere anchor point',
          'Existujú len pri corner points'
        ],
        correctAnswer: [0, 1, 2]
      },
      {
        type: 'choose-correct',
        question: 'Nástroj ________ konvertuje typ uzla medzi hladkým a rohovým.',
        options: ['Convert Anchor Point Tool', 'Direct Selection Tool'],
        correctAnswer: { 0: 'Convert Anchor Point Tool' }
      },
      {
        type: 'sort',
        question: 'Priraďte správne charakteristiky k typom uzlov:',
        categories: ['Corner point', 'Smooth point', 'Control handles', 'Anchor point'],
        options: [
          'Vytvára ostrý roh',
          'Má kontrolné ramienka',
          'Určujú zakrivenie',
          'Základný uzol cesty'
        ],
        correctAnswer: [0, 1, 2, 3]
      }
    ],
    useTextExercise: true
  },

  {
    id: 3,
    title: "Rozšírené výberové nástroje",
    content: "Pri objektoch s rovnými hranami, ako sú budovy či okná, je najpraktickejší **Polygonal Lasso Tool**. Ak má objekt výrazné kontrastné obrysy, rýchlejšie funguje **Magnetic Lasso Tool**, ktorý sa k hranám automaticky prichytáva. Na jednofarebné plochy alebo oblasti s podobným odtieňom používame **Magic Wand Tool**, pričom parameter **Tolerance** určuje, aký široký farebný rozsah sa zahrnie do výberu. Pri prirodzených tvaroch je efektívny **Quick Selection Tool**, ktorý maľovaním využíva automatickú **hranovú detekciu**. Voľba **Contiguous** rozhoduje, či vyberáme iba súvislú oblasť, alebo všetky podobné farby v celom obrázku. Ak pracujeme s viacerými vrstvami a výber má vychádzať z výsledného vzhľadu, zapíname **Sample All Layers**.",
    keywords: [
      {
        text: "Polygonal Lasso Tool",
        explanation: "Polygonal Lasso Tool je výberový nástroj vo Photoshope vytvárajúci výber pomocou rovných línií. Každé kliknutie pridá bod, uzavretie výberu je kliknutím na prvý bod alebo double-click. Backspace maže posledný bod. Používa sa pre výber objektov s rovnými hranami ako budovy, okná alebo geometrické tvary."
      },
      {
        text: "Magnetic Lasso Tool",
        explanation: "Magnetic Lasso Tool je inteligentný výberový nástroj automaticky detekujúci a prichytávajúci sa k hranám. Pri ťahaní pozdĺž hrany automaticky umiestňuje anchor points. Width určuje oblasť detekcie, Contrast citlivosť na zmeny, Frequency hustotu bodov. Delete key maže posledný bod. Používa sa na rýchly výber objektov s ostrými kontrastnými hranami."
      },
      {
        text: "Magic Wand Tool",
        explanation: "Magic Wand Tool je nástroj (klávesa W) vyberajúci oblasti na základe podobnosti farieb. Kliknutie vyberie pixel a všetky priľahlé podobné pixely. Používa sa na rýchly výber jednofarebných pozadí alebo oblastí s podobnými farbami."
      },
      {
        text: "Tolerance",
        explanation: "Tolerance je parameter určujúci rozsah podobných farieb zahrnutých do výberu (0-255). Hodnota 0 vyberá len identický odtieň, 255 vyberá všetky farby. Vyššia tolerance znamená tolerantnejší výber s viac farbami. Nastavuje sa v Options Bar. Typické hodnoty: 10-30 pre presné výbery, 50-80 pre širšie oblasti."
      },
      {
        text: "Quick Selection Tool",
        explanation: "Quick Selection Tool je inteligentný nástroj (klávesa W) automaticky detekujúci hrany pri maľovaní štetcom. 'Maľovaním' cez oblasť ju pridáva do výberu. Alt+maľovanie odčítava z výberu. Veľkosť štetca sa mení klávesami [ a ]. Auto-Enhance zjemňuje hrany výberu. Používa sa na rýchle výbery s prírodnými hranami."
      },
      {
        text: "hranovou detekciou",
        displayName: "hranová detekcia",
        explanation: "Hranová detekcia je technológia analyzujúca kontrast a farby na automatické nájdenie hraníc objektov. Funguje najlepšie pri vysokom kontraste medzi objektom a pozadím. Používa analýzu susedných pixelov na predikciu smeru hrany."
      },
      {
        text: "Contiguous",
        explanation: "Contiguous je voľba v Options Bar určujúca, či výber zahŕňa len súvislé (priľahlé) oblasti alebo všetky podobné pixely v celom obrázku. Zaškrtnuté znamená vyberanie len spojenej oblasti, nezaškrtnuté vyberá všetky podobné farby kdekoľvek. Používa sa na kontrolu rozsahu výberu."
      },
      {
        text: "Sample All Layers",
        explanation: "Sample All Layers je voľba umožňujúca výber na základe viditeľných farieb zo všetkých vrstiev, nie len aktívnej. Nezaškrtnuté znamená vyberanie len z aktívnej vrstvy. Používa sa pri práci s viacerými vrstvami, keď potrebujete výber založený na finálnom vizuálnom výsledku."
      }
    ],
    exercises: [
      {
        type: 'single-choice',
        question: 'Ktorý nástroj sa automaticky prichytáva k hranám s vysokým kontrastom?',
        options: [
          'Polygonal Lasso Tool',
          'Magnetic Lasso Tool',
          'Magic Wand Tool',
          'Lasso Tool'
        ],
        correctAnswer: 1
      },
      {
        type: 'true-false',
        question: 'Tolerance parameter ovplyvňuje len Quick Selection Tool.',
        options: ['True', 'False'],
        correctAnswer: false
      },
      {
        type: 'multiple-choice',
        question: 'Ktoré nástroje používajú inteligentnú detekciu hraníc?',
        options: [
          'Magnetic Lasso Tool',
          'Quick Selection Tool',
          'Polygonal Lasso Tool',
          'Magic Wand Tool'
        ],
        correctAnswer: [0, 1]
      },
      {
        type: 'choose-correct',
        question: 'Voľba ________ určuje, či Magic Wand vyberá len súvislé oblasti.',
        options: ['Contiguous', 'Tolerance'],
        correctAnswer: { 0: 'Contiguous' }
      },
      {
        type: 'sort',
        question: 'Priraďte nástroje k ich použitiu:',
        options: [
          'Polygonal Lasso - Výber objektov s rovnými hranami',
          'Magnetic Lasso - Výber objektov s kontrastnými hranami',
          'Magic Wand - Výber podobných farieb',
          'Quick Selection - Rýchly výber maľovaním štetcom'
        ],
        correctAnswer: [
          'Polygonal Lasso - Výber objektov s rovnými hranami',
          'Magnetic Lasso - Výber objektov s kontrastnými hranami',
          'Magic Wand - Výber podobných farieb',
          'Quick Selection - Rýchly výber maľovaním štetcom'
        ]
      }
    ],
    useTextExercise: true
  },

  {
    id: 4,
    title: "Masky a ich aplikácia",
    content: "Pri kompozíciách, výstrihoch a prelínaní fotografií je **Layer Mask** kľúčová, pretože umožňuje skrývať časti vrstvy nedeštruktívne a bez straty pôvodných pixelov. Novú masku pridávame cez **Add Layer Mask** a ak je aktívny výber, jeho tvar sa prenesie priamo do masky. Pre plynulé prechody medzi dvoma obrázkami používame **Gradient Mask**, napríklad pri fade efektoch alebo jemnom skrývaní okrajov. Detaily dolaďujeme technikou **Painting on Mask**, kde biela farba odhaľuje a čierna zakrýva. Na kontrolu kvality masky slúži **Alt+klik na masku**, ktorý zobrazí samotnú čiernobielu mapu. Cez **Shift+klik** masku dočasne vypneme a rýchlo porovnáme výsledok, a keď potrebujeme obsah posúvať nezávisle od masky, odpojíme **Link ikonu**.",
    keywords: [
      {
        text: "Layer Mask",
        explanation: "Layer Mask je čiernobiela maska pripojená k vrstve určujúca jej viditeľnosť. Čierna (0) znamená úplne skryté, biela (255) úplne viditeľné, šedá (128) 50% priehľadné. Pridáva sa cez ikonu v Layers Paneli alebo Layer > Layer Mask > Reveal All/Hide All. Nie je mazateľná - možno ju kedykoľvek upraviť. Používa sa na jemné prelínanie, kompozície a nedeštruktívne výstrihy."
      },
      {
        text: "Add Layer Mask",
        explanation: "Add Layer Mask je ikona v dolnej časti Layers Panel (obdĺžnik s kruhom) pridávajúca novú masku k vrstve. Kliknutie pridá bielu masku (všetko viditeľné). Alt+klik pridá čiernu masku (všetko skryté). Ak existuje aktívny výber, maska ho použije ako tvar. Klávesová skratka v menu: Layer > Layer Mask > Reveal All."
      },
      {
        text: "Gradient Mask",
        displayName: "gradient v maske",
        explanation: "Gradient Mask je technika použitia gradientu na layer mask pre vytvorenie plynulého prechodu priehľadnosti. Čierny->biely gradient postupne skrýva oblasť. Používa sa na jemné prelínanie dvoch obrázkov, fade efekty alebo postupné skrývanie krajov kompozície."
      },
      {
        text: "Painting on Mask",
        displayName: "maľovanie na maske",
        explanation: "Painting on Mask je technika použitia štetca na úpravu layer mask. Maľovanie čiernou skrýva oblasti, bielou ich odhaľuje. Šedá vytvára čiastočnú priehľadnosť. Soft brush vytvára jemné prechody, hard brush ostré hrany. X klávesa prepína medzi čiernou a bielou. Používa sa na presné upravovanie výstrihov a komplexných kompozícií."
      },
      {
        text: "Alt+klik na masku",
        displayName: "zobrazenie masky",
        explanation: "Alt+klik na masku znamená Alt/Option+klik na miniatúru masky v Layers Paneli, ktorý prepína medzi zobrazením masky a normálneho zobrazenia vrstvy. V režime zobrazenia masky vidíte čiernobiely obraz masky. Používa sa na kontrolu a úpravu detailov masky, odhalenie chýb alebo presné maľovanie."
      },
      {
        text: "Shift+klik",
        displayName: "vypnutie masky",
        explanation: "Shift+klik na miniatúru masky v Layers Paneli dočasne vypína/zapína masku. Vypnutá maska má červený X. Vrstva je dočasne plne viditeľná. Používa sa na rýchle porovnanie verzie s maskou a bez masky alebo dočasné zobrazenie skrytého obsahu."
      },
      {
        text: "Link ikona",
        displayName: "prepojenie vrstvy a masky",
        explanation: "Link ikona je ikona reťaze medzi vrstvou a maskou v Layers Paneli. Kliknutím sa prepojenie zapína alebo vypína. Prepojené znamená, že vrstva a maska sa posúvajú spoločne. Odpojené znamená, že možno posúvať vrstvu nezávisle od masky. Používa sa pri premiestnení obsahu v rámci masky alebo vytvorení špeciálnych efektov."
      }
    ],
    exercises: [
      {
        type: 'single-choice',
        question: 'Ktorá farba v layer mask úplne skrýva obsah vrstvy?',
        options: ['Čierna', 'Biela', 'Šedá', 'Červená'],
        correctAnswer: 0
      },
      {
        type: 'true-false',
        question: 'Layer mask trvalo vymaže pixely z vrstvy.',
        options: ['True', 'False'],
        correctAnswer: false
      },
      {
        type: 'multiple-choice',
        question: 'Ktoré klávesové skratky súvisia s layer mask?',
        options: [
          'Alt+klik zobrazí masku',
          'Shift+klik vypne masku',
          'Ctrl+klik vytvorí výber z masky',
          'Delete vymaže masku'
        ],
        correctAnswer: [0, 1, 2]
      },
      {
        type: 'choose-correct',
        question: '________ vytvára plynulý prechod priehľadnosti v maske.',
        options: ['Gradient Tool', 'Blur Tool'],
        correctAnswer: { 0: 'Gradient Tool' }
      },
      {
        type: 'sort',
        question: 'Priraďte farby v maske k ich efektu:',
        categories: ['Čierna', 'Biela', 'Šedá 50%', 'Gradient'],
        options: [
          'Úplne skryté',
          'Úplne viditeľné',
          'Polovične priehľadné',
          'Postupný prechod'
        ],
        correctAnswer: [0, 1, 2, 3]
      }
    ],
    useTextExercise: true
  },

  {
    id: 5,
    title: "Kerning a tracking v typografii",
    content: "V typografii riešime **kerning** najmä pri veľkých nápisoch a logách, kde sú nerovnomerné medzery medzi dvojicami znakov najviac viditeľné, napríklad pri pároch ako AV alebo To. **Tracking** naopak upravuje hustotu celého textového bloku a pomáha nám zlepšiť čitateľnosť alebo doladiť vizuálny štýl. Všetky tieto nastavenia máme prehľadne v **Character Paneli**, kde pracujeme aj s leadingom. Ako východisko často zvolíme **Optical Kerning**, ktorý medzery vyrovná podľa tvaru znakov. Pri kvalitných fontoch sa oplatí **Metrics Kerning**, pretože využíva páry pripravené autorom písma. Finálne detaily dolaďujeme cez **Manual Kerning** a skratky **Alt+šípkami**. Pre komfort čítania odstavcov následne upravujeme aj **Leading**.",
    keywords: [
      {
        text: "Kerning",
        explanation: "Kerning je úprava horizontálnej medzery medzi konkrétnym párom znakov. V Character Paneli sa nastavuje v em jednotkách (1/1000 em). Metrics využíva kerningové páry z fontu, Optical poskytuje automatický vizuálny kerning, Manual umožňuje vlastnú hodnotu. Alt/Option+šípka vľavo/vpravo mení kerning o 20 jednotiek (Ctrl/Cmd mení o 100 jednotiek). Používa sa pri veľkých textoch (nadpisy) na odstránenie vizuálne nerovnomerných medzier."
      },
      {
        text: "Tracking",
        displayName: "letter-spacing",
        explanation: "Tracking je rovnomerná úprava medzier medzi všetkými znakmi vo vybratom texte. V Character Paneli je označené ako VA so šípkami. Kladná hodnota zväčšuje medzery, záporná ich zmenšuje. Neovplyvňuje kerning páry (ten sa pridáva k tracking hodnote). Používa sa na úpravu hustoty textu, zlepšenie čitateľnosti alebo štylizáciu nadpisov."
      },
      {
        text: "Character Panel",
        explanation: "Character Panel je panel vo Photoshope (Window > Character) a v Illustrátore obsahujúci všetky nastavenia písma. Zahŕňa: font family, style, size, leading, kerning, tracking, vertical/horizontal scale, baseline shift a ďalšie. Klávesová skratka: Ctrl/Cmd+T. Používa sa na všetky typografické úpravy textu."
      },
      {
        text: "Optical Kerning",
        explanation: "Optical Kerning je automatický kerningový algoritmus analyzujúci tvary znakov a upravujúci medzery pre vizuálne rovnomerný výsledok. Ignoruje kern páry zabudované vo fonte. Funguje dobre pre väčšinu fontov, najmä pri kombinácii rôznych veľkostí alebo fontov. Nastavuje sa v rozbaľovacom menu Character Panela pre kerning. Používa sa ako dobrý východiskový bod pred manuálnymi úpravami."
      },
      {
        text: "Metrics Kerning",
        explanation: "Metrics Kerning je kerning používajúci kern páry vytvorené dizajnérom fontu a zabudované v súbore fontu. Obsahuje preddefinované medzery pre problematické páry ako 'AV', 'To', 'We'. Je štandardným nastavením pre väčšinu textov. Kvalita závisí od kvality fontu. Niektoré bezplatné fonty nemajú kerning páry. Nastavuje sa v Character Paneli."
      },
      {
        text: "Manual Kerning",
        displayName: "manuálny kerning",
        explanation: "Manual Kerning je vlastná úprava kerning hodnoty zadaním čísla v Character Paneli. Kladné hodnoty zväčšujú medzeru, záporné ju zmenšujú. Alt/Option+šípka vľavo znamená -20 jednotiek, Alt/Option+šípka vpravo +20, s Ctrl/Cmd to je ±100. Používa sa na jemné doladenie po Optical/Metrics kerningu, najmä pri logách, nadpisoch alebo veľkých textoch."
      },
      {
        text: "Alt+šípky",
        displayName: "klávesové skratky kerning",
        explanation: "Alt+šípky znamená Alt/Option+Left/Right Arrow, ktoré upravujú kerning medzi dvoma znakmi. Kurzor musí byť medzi znakmi (nie výber). Upravuje o -20/+20 jednotiek kerning. Ctrl/Cmd+Alt+Arrow znamená ±100 jednotiek. Je to rýchlejšie než manuálne zadávanie hodnôt v Character Paneli."
      },
      {
        text: "Leading",
        explanation: "Leading je vertikálna medzera medzi baseline dvoch po sebe idúcich riadkov textu. Meria sa od baseline k baseline, nie medzi riadkami. V Character Paneli je označené ako A↕️. Auto leading znamená 120% veľkosti písma. Kladná hodnota zväčšuje medzery, menšia než font size vytvára prekrývanie. Ovplyvňuje čitateľnosť - väčší leading znamená vzdušnejší text. Typické hodnoty: 120-150% font size."
      }
    ],
    exercises: [
      {
        type: 'single-choice',
        question: 'Ktorý typ kerningu používa kern páry zabudované vo fonte?',
        options: ['Optical Kerning', 'Metrics Kerning', 'Manual Kerning', 'Auto Kerning'],
        correctAnswer: 1
      },
      {
        type: 'true-false',
        question: 'Tracking upravuje medzery len medzi konkrétnymi pármi znakov.',
        options: ['True', 'False'],
        correctAnswer: false
      },
      {
        type: 'multiple-choice',
        question: 'Ktoré nástroje poskytuje Character Panel?',
        options: [
          'Kerning',
          'Tracking',
          'Leading',
          'Color Correction'
        ],
        correctAnswer: [0, 1, 2]
      },
      {
        type: 'choose-correct',
        question: 'Klávesová skratka ________ zmenšuje kerning medzi dvoma znakmi.',
        options: ['Alt+Left Arrow', 'Alt+Right Arrow'],
        correctAnswer: { 0: 'Alt+Left Arrow' }
      },
      {
        type: 'sort',
        question: 'Priraďte typografické pojmy k definíciám:',
        options: [
          'Kerning - Medzera medzi konkrétnymi pármi znakov',
          'Tracking - Rovnomerná medzera v celom texte',
          'Leading - Vertikálna medzera medzi riadkami',
          'Optical Kerning - Automatická úprava na základe tvaru'
        ],
        correctAnswer: [
          'Kerning - Medzera medzi konkrétnymi pármi znakov',
          'Tracking - Rovnomerná medzera v celom texte',
          'Leading - Vertikálna medzera medzi riadkami',
          'Optical Kerning - Automatická úprava na základe tvaru'
        ]
      }
    ],
    useTextExercise: true
  },

  {
    id: 6,
    title: "Filtre vo Photoshope",
    content: "Ak chceme rýchlo testovať vizuálne štýly, siahneme po **Filter Gallery**, kde vieme kombinovať viac filtrov a okamžite vidieť výsledok. Na hĺbku ostrosti, zjemnenie pozadia alebo redukciu šumu používame **Blur Filters**; pritom **Gaussian Blur** vytvára rovnomerné rozmazanie a **Motion Blur** dodáva pocit pohybu. Po zmene veľkosti obrázka alebo pri potrebe zvýrazniť detaily aplikujeme **Sharpen Filters**. Kreatívnejší vzhľad, detekciu hrán či výrazné štylizácie dosiahneme cez **Stylize Filters**. Aby boli úpravy flexibilné, pred filtrami vrstvu často konvertujeme na **Smart Objects**, čím ostávajú filtre editovateľné. Ak je efekt príliš silný, okamžite po aplikácii použijeme **Fade** na jemné doladenie intenzity alebo blend modu.",
    keywords: [
      {
        text: "Filter Gallery",
        explanation: "Filter Gallery je rozhranie vo Photoshope (Filter > Filter Gallery) zobrazujúce náhľad a umožňujúce kombináciu viacerých filtrov. Filtre sú organizované do kategórií: Artistic, Brush Strokes, Distort, Sketch, Stylize, Texture. Umožňuje vrstvenie filtrov a úpravu parametrov s okamžitým náhľadom. Funguje len s 8-bit RGB obrazmi. Používa sa na umelecké efekty a štylizáciu fotografií."
      },
      {
        text: "Blur Filters",
        displayName: "rozmazávacie filtre",
        explanation: "Blur Filters sú skupina filtrov vytvárajúcich efekt rozmazania. Zahŕňajú: Gaussian Blur (rovnomerné), Motion Blur (smerové), Radial Blur (kruhové/zoom), Lens Blur (hĺbka ostrosti), Box/Surface/Shape Blur. Radius parameter určuje intenzitu. Používajú sa na zjemnenie pozadia, efekty pohybu, vytvorenie hĺbky alebo redukciu šumu."
      },
      {
        text: "Gaussian Blur",
        explanation: "Gaussian Blur je najpoužívanejší blur filter vytvárajúci rovnomerné, prirodzené rozmazanie. Nachádza sa v menu Filter > Blur > Gaussian Blur. Radius parameter (0.1-1000 pixelov) určuje intenzitu - vyššia hodnota znamená silnejšie rozmazanie. Používa matematický gaussovský algoritmus. Používa sa na zjemnenie pokožky, vytvorenie hĺbky ostrosti, redukciu šumu alebo pre bokeh efekt."
      },
      {
        text: "Motion Blur",
        explanation: "Motion Blur je filter vytvárajúci efekt smerového pohybu. Nachádza sa v menu Filter > Blur > Motion Blur. Angle určuje smer pohybu (0-360°), Distance intenzitu (1-2000 pixelov). Vytvára dojem rýchlosti a dynamiky. Používa sa na simuláciu pohybu vozidiel, športových akcií alebo vytvorenie kinematografického efektu rozmazaného pozadia."
      },
      {
        text: "Sharpen Filters",
        displayName: "zostrovacie filtre",
        explanation: "Sharpen Filters sú skupina filtrov zvyšujúcich ostrosť a detaily zvýraznením hraníc. Zahŕňajú: Sharpen, Sharpen More, Sharpen Edges, Unsharp Mask, Smart Sharpen. Unsharp Mask poskytuje najlepšiu kontrolu s Amount, Radius a Threshold parametrami. Používajú sa na doostenie fotografií po zmene veľkosti, vylepšenie detailov alebo korekciu mäkko zachytených obrázkov."
      },
      {
        text: "Stylize Filters",
        displayName: "štylizačné filtre",
        explanation: "Stylize Filters sú skupina filtrov vytvárajúcich umelecké a štýlové efekty. Zahŕňajú: Find Edges, Emboss, Solarize, Wind, Oil Paint. Nachádzajú sa v menu Filter > Stylize. Vytvárajú dramatické zmeny v obraze. Používajú sa na abstraktné umenie, grafický dizajn, postery alebo kreatívne fotomanipulácie."
      },
      {
        text: "Filter Menu",
        displayName: "ponuka filtrov",
        explanation: "Filter Menu je hlavné menu obsahujúce všetky filtre (Filter > ...). Je organizované do kategórií: Blur, Sharpen, Noise, Render, Stylize, Pixelate, Distort a ďalšie. Niektoré filtre majú vlastné dialógové okná, iné používajú Filter Gallery. Posledný použitý filter je na vrchu (Ctrl/Cmd+F ho zopakuje). Neural Filters sú AI-powered filtre."
      },
      {
        text: "Smart Objects",
        displayName: "inteligentné objekty",
        explanation: "Smart Objects sú špeciálny typ vrstvy zachovávajúci pôvodné dáta obrazu. Vytvárajú sa cez Layer > Smart Objects > Convert to Smart Object. Filtre aplikované na Smart Object sa stávajú Smart Filters - nedeštruktívne, editovateľné a možno ich vypnúť/zapnúť. Používajú sa pre zachovanie kvality pri transformáciách a nedeštruktívnu aplikáciu filtrov."
      },
      {
        text: "Fade",
        displayName: "fade príkaz",
        explanation: "Fade je príkaz Edit > Fade (Ctrl/Cmd+Shift+F) dostupný ihneď po aplikovaní filtra alebo nástroja. Umožňuje zmeniť opacity (0-100%) a blend mode poslednej akcie. Fade nemožno použiť po ďalšej akcii. Používa sa na zjemnenie príliš silných filtrov alebo experimentovanie s blend modes filtrov."
      }
    ],
    exercises: [
      {
        type: 'single-choice',
        question: 'Ktorý filter vytvára efekt smerového pohybu?',
        options: ['Gaussian Blur', 'Motion Blur', 'Radial Blur', 'Lens Blur'],
        correctAnswer: 1
      },
      {
        type: 'true-false',
        question: 'Filter Gallery funguje s 16-bit CMYK obrazmi.',
        options: ['True', 'False'],
        correctAnswer: false
      },
      {
        type: 'multiple-choice',
        question: 'Ktoré filtre patria do kategórie Blur?',
        options: [
          'Gaussian Blur',
          'Motion Blur',
          'Unsharp Mask',
          'Radial Blur'
        ],
        correctAnswer: [0, 1, 3]
      },
      {
        type: 'choose-correct',
        question: 'Pre nedeštruktívnu aplikáciu filtrov je potrebné použiť ________.',
        options: ['Smart Objects', 'Layer Groups'],
        correctAnswer: { 0: 'Smart Objects' }
      },
      {
        type: 'sort',
        question: 'Priraďte filtre k ich účelu:',
        options: [
          'Gaussian Blur - Rovnomerné rozmazanie',
          'Motion Blur - Efekt pohybu',
          'Unsharp Mask - Zvýšenie ostrosti',
          'Find Edges - Detekcia hrán'
        ],
        correctAnswer: [
          'Gaussian Blur - Rovnomerné rozmazanie',
          'Motion Blur - Efekt pohybu',
          'Unsharp Mask - Zvýšenie ostrosti',
          'Find Edges - Detekcia hrán'
        ]
      }
    ],
    useTextExercise: true
  },

  {
    id: 7,
    title: "Úprava Hue, Saturation a Brightness",
    content: "Pri farebných korekciách je **Hue/Saturation adjustment** praktický nástroj na zmenu odtieňa, sýtosti aj jasu bez zložitého workflow. Pomocou **Hue slidera** vieme preladením farieb odstrániť farebný posun alebo vytvoriť alternatívne farebné verzie. **Saturation slider** je vhodný na oživenie vyblednutých farieb, ale aj na úplnú desaturáciu do čiernobiela. Jemné zosvetlenie alebo stmavenie konkrétnych farebných rozsahov rieši **Lightness slider**. Ak chceme jednotný tón alebo vintage náladu, zapneme **Colorize**. Veľmi presné výsledky dáva **Targeted Adjustment Tool**, kde upravujeme farbu priamo kliknutím na objekt. Pre nedeštruktívnu prácu používame **Adjustment Layers** a cez **Channel dropdown** cielime úpravy len na vybrané farebné rozsahy.",
    keywords: [
      {
        text: "Hue/Saturation adjustment",
        displayName: "Hue/Saturation",
        explanation: "Hue/Saturation je nástroj na úpravu odtieňa, sýtosti a jasu farieb. Nachádza sa v Image > Adjustments > Hue/Saturation (Ctrl/Cmd+U). Má tri slidery: Hue (±180°), Saturation (±100), Lightness (±100). Edit dropdown vyberá farebný rozsah na úpravu. Používa sa na korekciu farieb, zmenu tónu obrázka alebo vytvorenie špeciálnych farebných efektov."
      },
      {
        text: "Hue slider",
        displayName: "Hue",
        explanation: "Hue slider je slider (±180°) rotujúci farby na farebnom kolese. 0° znamená pôvodné farby. Pozitívne hodnoty rotujú doprava (červená→žltá→zelená→azúrová→modrá→purpurová→červená), negatívne doľava. ±180° vytvorí komplementárne farby. Používa sa na zmenu celkového tónu obrázka, korekciu farebného odtieňa alebo kreatívne farebné efekty."
      },
      {
        text: "Saturation slider",
        displayName: "Saturation",
        explanation: "Saturation slider je slider (±100) upravujúci intenzitu farieb. 0 znamená pôvodnú sýtosť. Kladné hodnoty zvyšujú sýtosť (živejšie farby), -100 vytvára čiernobiely obraz. Desaturation je používaná alternatíva k Grayscale režimu zachovávajúca RGB color mode. Používa sa na vylepšenie nudných farieb, vytvorenie vintage efektu alebo dramatizáciu scény."
      },
      {
        text: "Lightness slider",
        displayName: "Lightness",
        explanation: "Lightness slider je slider (±100) upravujúci jas farieb v Hue/Saturation. Na rozdiel od Brightness/Contrast tento slider posúva farby smerom k bielej (+) alebo čiernej (-). Vysoké hodnoty vytvárajú vyblednuté farby. Používa sa opatrne - príliš veľké zmeny strácajú detaily. Lepšie je použiť Curves/Levels pre kontrolu jasu."
      },
      {
        text: "Colorize",
        explanation: "Colorize je voľba v Hue/Saturation vytvárajúca monotónny (jednofarebný) efekt. Zaškrtnutím sa obrázok zafarbí jedným odtieňom. Hue určuje farbu, Saturation jej intenzitu, Lightness jas. Vytvára efekt sépie, duotone alebo stylizovaných farebných tónov. Používa sa na vintage efekty, umelecké fotografie alebo unifikáciu farebného tónu viacerých obrázkov."
      },
      {
        text: "Targeted Adjustment Tool",
        explanation: "Targeted Adjustment Tool je nástroj v paneli Hue/Saturation (ikona ruky s prstom), ktorý umožňuje priamu úpravu farieb na obrázku. Kliknutie na farbu automaticky vyberie jej rozsah. Ťahanie doľava/doprava upravuje Saturation, hore/dolu Hue. Eliminuje hádanie, ktorý farebný kanál upraviť. Používa sa na intuitívnu úpravu konkrétnych farieb v zložitých obrázkoch."
      },
      {
        text: "Adjustment Layers",
        displayName: "adjustment vrstvy",
        explanation: "Adjustment Layers sú špeciálne vrstvy aplikujúce nedeštruktívne úpravy na vrstvy pod nimi. Vytvárajú sa cez Layer > New Adjustment Layer alebo ikonu v Layers Paneli. Zahŕňajú: Hue/Saturation, Curves, Levels, Color Balance a ďalšie. Možno ich kedykoľvek upraviť, vypnúť alebo vymazať. Layer mask umožňuje selektívnu aplikáciu. Používajú sa na všetky profesionálne farebné korekcie."
      },
      {
        text: "Channel dropdown",
        displayName: "farebné kanály",
        explanation: "Channel dropdown je dropdown umožňujúci výber konkrétneho farebného rozsahu. Možnosti sú: Master (všetky farby), Reds, Yellows, Greens, Cyans, Blues, Magentas. Každý kanál upravuje len svoj farebný rozsah. Rozsah výberu možno upraviť pomocou vzorkovacích nástrojov. Používa sa na selektívnu úpravu konkrétnych farieb bez ovplyvnenia ostatných."
      }
    ],
    exercises: [
      {
        type: 'single-choice',
        question: 'Ktorý slider v Hue/Saturation vytvorí čiernobiely obraz?',
        options: ['Hue na -180', 'Saturation na -100', 'Lightness na -100', 'Colorize'],
        correctAnswer: 1
      },
      {
        type: 'true-false',
        question: 'Hue slider rotuje farby o maximum ±360 stupňov.',
        options: ['True', 'False'],
        correctAnswer: false
      },
      {
        type: 'multiple-choice',
        question: 'Ktoré farebné kanály možno upravovať v Hue/Saturation?',
        options: [
          'Reds',
          'Greens',
          'Blues',
          'Blacks'
        ],
        correctAnswer: [0, 1, 2]
      },
      {
        type: 'choose-correct',
        question: 'Voľba ________ vytvára monotónny jednofarebný efekt.',
        options: ['Colorize', 'Desaturate'],
        correctAnswer: { 0: 'Colorize' }
      },
      {
        type: 'sort',
        question: 'Priraďte slidery k ich funkciám:',
        options: [
          'Hue - Rotuje farby na farebnom kolese',
          'Saturation - Upravuje intenzitu farieb',
          'Lightness - Posúva farby k bielej/čiernej',
          'Targeted Tool - Úprava kliknutím na obrázok'
        ],
        correctAnswer: [
          'Hue - Rotuje farby na farebnom kolese',
          'Saturation - Upravuje intenzitu farieb',
          'Lightness - Posúva farby k bielej/čiernej',
          'Targeted Tool - Úprava kliknutím na obrázok'
        ]
      }
    ],
    useTextExercise: true
  },

  {
    id: 8,
    title: "Expozícia: Clona, čas uzávierky a ISO",
    content: "Pri fotení rozhoduje **expozičný trojuholník**, pretože spája správny jas s kreatívnym vzhľadom záberu. Hodnotu **Aperture** vyjadrenú ako **f-stop** volíme podľa toho, či chceme malé rozostrenie pozadia pri portréte alebo veľkú **hĺbku ostrosti** pri krajine. Parameter **Shutter Speed** nastavujeme podľa pohybu: krátke časy ho zmrazia, dlhé vytvoria zámerné rozmazanie. Keď svetla nie je dosť, zvyšujeme **ISO citlivosť**, no počítame s tým, že vyššie ISO prináša viac **šumu**. V poloautomatických režimoch dolaďujeme jas cez **expozičnú kompenzáciu**, aby výsledok zodpovedal zámeru. Pred stlačením spúšte kontrolujeme **histogram**, ktorý spoľahlivo ukáže riziko prepálených svetiel alebo utopených tieňov.",
    keywords: [
      {
        text: "Expozičný trojuholník",
        displayName: "exposure triangle",
        explanation: "Expozičný trojuholník je vzťah medzi tromi parametrami ovplyvňujúcimi expozíciu: clona, čas uzávierky a ISO. Zmena jedného parametra vyžaduje kompenzáciu iných pre zachovanie správnej expozície. Napríklad otvorenie clony (väčší otvor) vyžaduje rýchlejší čas alebo nižšie ISO. Pochopenie tohto vzťahu je základom manuálnej fotografie."
      },
      {
        text: "Aperture",
        displayName: "clona",
        explanation: "Aperture je otvor v objektíve regulujúci množstvo svetla dopadajúceho na senzor. Označuje sa f-číslom (f-stop): f/1.4, f/2.8, f/4, f/5.6, f/8, f/11, f/16, f/22. Paradoxne: nižšie číslo znamená väčší otvor a viac svetla. Každý full stop (f/2.8→f/4) znižuje svetlo na polovicu. Ovplyvňuje hĺbku ostrosti a ostrosť."
      },
      {
        text: "f-stop",
        explanation: "Jednotka označujúca veľkosť clony. Vypočítava sa ako pomer ohniskovej vzdialenosti k priemeru otvoru (f/2.8 znamená ohnisková/2.8). Štandardná stupnica: f/1.4, f/2, f/2.8, f/4, f/5.6, f/8, f/11, f/16, f/22. Každý krok predstavuje polovicu alebo dvojnásobok svetla. Moderné fotoaparáty umožňujú 1/3 stop kroky (f/2.8, f/3.2, f/3.5, f/4)."
      },
      {
        text: "hĺbka ostrosti",
        displayName: "depth of field",
        explanation: "Vzdialenosť v zábere, v ktorej sú objekty ostré. Ovplyvňuje ju clona, vzdialenosť od objektu a ohnisková vzdialenosť. Malá clona (f/1.8) znamená malú hĺbku ostrosti (rozmazané pozadie, portrét). Veľká clona (f/16) znamená veľkú hĺbku ostrosti (všetko ostré, krajina). Používa sa na izoláciu objektu alebo zachovanie ostrosti celej scény."
      },
      {
        text: "Shutter Speed",
        displayName: "čas uzávierky",
        explanation: "Doba, počas ktorej je senzor vystavený svetlu. Označuje sa v sekundách: 1/8000s, 1/1000s, 1/250s, 1/60s, 1/15s, 1s, 30s. Rýchlejší čas (1/1000s) znamená zmrazený pohyb a menej svetla. Pomalší čas (1s) znamená rozmazaný pohyb a viac svetla. Pravidlo: minimálny čas sa rovná 1/ohnisková vzdialenosť pre ostrý obraz z ruky (50mm potrebuje 1/50s)."
      },
      {
        text: "ISO citlivosť",
        displayName: "ISO",
        explanation: "Citlivosť senzora na svetlo. Hodnoty: 100, 200, 400, 800, 1600, 3200, 6400, 12800 a vyššie. ISO 100 znamená najnižší šum, najlepšiu kvalitu, ale potrebuje viac svetla. ISO 6400 znamená vysoký šum, horšiu kvalitu, ale možnosť fotenia v tme. Každé zdvojnásobenie znamená dvojnásobná citlivosť. Používa sa ako posledná možnosť v expozičnom trojuholníku - len keď clona a čas nedokážu dosiahnuť správnu expozíciu."
      },
      {
        text: "šumu",
        displayName: "šum/noise",
        explanation: "Nežiaduce zrnenie alebo farebné bodky v obraze spôsobené vysokým ISO. Viditeľnejšie v tmavých oblastiach a pri nízkej expozícii. Moderné fotoaparáty majú lepší šum než staršie. Luminance noise = zrnenie, Color noise = farebné bodky. Znižuje sa: nižším ISO, správnou expozíciou, noise reduction v postprodukcii alebo pri fotografovaní RAW formátom."
      },
      {
        text: "Expozičná kompenzácia",
        displayName: "EV",
        explanation: "Expozičná kompenzácia je funkcia kamery (+/- tlačidlo alebo koliesko) upravujúca automatickú expozíciu v režimoch P/A/S. Označuje sa v EV (Exposure Value): -3, -2, -1, 0, +1, +2, +3. +1 EV znamená dvojnásobne viac svetla, -1 EV polovicu svetla. Používa sa keď kamera nesprávne meria expozíciu (biele pozadie podexponuje, tmavé overexponuje)."
      },
      {
        text: "Histogram",
        explanation: "Histogram je graf zobrazujúci rozloženie tónov v obraze. X-os predstavuje tóny (ľavá=tiene, stredná=stredné tóny, pravá=svetlá), Y-os počet pixelov daného tónu. Dokonale exponovaný obraz má histogram bez 'orezaných' krajov (čierne/biele bez detailov). Používa sa na kontrolu expozície pri fotografovaní a v postprodukcii. Je spoľahlivejší než LCD displej kamery."
      }
    ],
    exercises: [
      {
        type: 'single-choice',
        question: 'Ktoré f-číslo predstavuje najväčší otvor clony?',
        options: ['f/1.4', 'f/5.6', 'f/11', 'f/22'],
        correctAnswer: 0
      },
      {
        type: 'true-false',
        question: 'Vyššie ISO vždy zlepšuje kvalitu fotografie.',
        options: ['True', 'False'],
        correctAnswer: false
      },
      {
        type: 'multiple-choice',
        question: 'Ktoré parametre tvoria expozičný trojuholník?',
        options: [
          'Clona',
          'Čas uzávierky',
          'ISO',
          'Ohnisková vzdialenosť'
        ],
        correctAnswer: [0, 1, 2]
      },
      {
        type: 'choose-correct',
        question: 'Malá clona f/1.8 vytvára ________ hĺbku ostrosti.',
        options: ['malú', 'veľkú'],
        correctAnswer: { 0: 'malú' }
      },
      {
        type: 'sort',
        question: 'Priraďte hodnoty k ich efektom:',
        categories: ['f/1.8', 'f/16', '1/1000s', 'ISO 6400'],
        options: [
          'Malá hĺbka ostrosti',
          'Veľká hĺbka ostrosti',
          'Zmrazený pohyb',
          'Viac šumu'
        ],
        correctAnswer: [0, 1, 2, 3]
      }
    ],
    useTextExercise: true
  },

  {
    id: 9,
    title: "Konverzia farebných modelov",
    content: "Pri príprave tlačových výstupov robíme **RGB do CMYK konverziu** cez **Image > Mode > CMYK Color**, no ešte predtým je dobré zapnúť **Gamut Warning** a odhaliť **Out of Gamut** farby, ktoré sa v tlači stlmia. Kľúčové je mať správne nastavené **Color Settings**, najmä **Working Spaces**, aby zobrazovanie aj konverzie zostali konzistentné. V rámci **RGB Working Space** volíme sRGB pre web a Adobe RGB pre širší farebný rozsah pri tlači. **CMYK Working Space** nastavujeme podľa tlačovej technológie, napríklad Coated FOGRA39 pre európsky ofset. Cez **Color Management Policies** určujeme, ako sa budú riešiť súbory s odlišnými profilmi. Na presnejšiu kontrolu používame **Convert to Profile**, kde vyberáme aj **Rendering Intent** podľa typu obsahu: Perceptual pre fotografie, Relative Colorimetric univerzálne, Saturation pre grafiku a Absolute Colorimetric na proofing.",
    keywords: [
      {
        text: "RGB do CMYK konverzia",
        displayName: "konverzia do CMYK",
        explanation: "RGB do CMYK konverzia je proces prevodu RGB obrazu na CMYK pre tlač. Nachádza sa v Image > Mode > CMYK Color. RGB má širší gamut než CMYK, preto niektoré živé farby (najmä jasná zelená, modrá, oranžová) sa stlmia. Nevratná operácia - vytvorte si kópiu RGB verzie. Vykonajte až po dokončení všetkých úprav. Niektoré funkcie Photoshopu nefungujú v CMYK režime."
      },
      {
        text: "Image > Mode > CMYK Color",
        displayName: "režim CMYK",
        explanation: "Image > Mode > CMYK Color je menu príkaz vo Photoshope konvertujúci dokument z RGB do CMYK farebného režimu. Nachádza sa v Image > Mode > CMYK Color. Automaticky konvertuje všetky farby použitím default CMYK Working Space z Color Settings. Je to nevratná operácia - niektoré dáta sa stratia. Pred konverziou použite Gamut Warning na identifikáciu problémových farieb."
      },
      {
        text: "Gamut Warning",
        explanation: "Gamut Warning je funkcia Photoshopu (View > Gamut Warning, Ctrl/Cmd+Shift+Y) zobrazujúca farby mimo CMYK gamut ako šedú masku. Umožňuje identifikovať problematické farby pred konverziou. Farby označené šedou nebudú presne reprodukovateľné pri tlači. Používa sa v RGB režime pred konverziou na CMYK na identifikáciu a opravu problémových farieb."
      },
      {
        text: "Out of Gamut",
        displayName: "mimo gamut",
        explanation: "Out of Gamut sú farby existujúce v jednom farebnom priestore (napríklad RGB), ale nereprezentovateľné v inom (napríklad CMYK). RGB má širší gamut - obsahuje živejšie farby než CMYK. Pri konverzii sa out-of-gamut farby automaticky nahradia najbližšou reprodukovateľnou farbou. Výrazné neónové farby, jasná azúrová a jasná zelená sú typicky out-of-gamut v CMYK."
      },
      {
        text: "Color Settings",
        explanation: "Color Settings je dialógové okno Edit > Color Settings (Ctrl/Cmd+Shift+K) určujúce color management nastavenia Photoshopu. Obsahuje: Working Spaces (RGB, CMYK, Gray, Spot), Color Management Policies, Conversion Options. Presets: North America General Purpose 2, Europe General Purpose 3. Je dôležité nastaviť pred začatím projektu podľa výstupného média."
      },
      {
        text: "Working Spaces",
        displayName: "pracovné priestory",
        explanation: "Working Spaces sú predvolené farebné profily v Color Settings. RGB Working Space: sRGB (web, štandard), Adobe RGB (1998) (tlač, širší gamut), ProPhoto RGB (najširší gamut). CMYK Working Space: závisí od tlačového procesu a papiera - Coated FOGRA39 (európsky štandard), U.S. Web Coated (SWOP) v2. Gray/Spot pre špeciálne účely."
      },
      {
        text: "Color Management Policies",
        displayName: "pravidlá správy farieb",
        explanation: "Color Management Policies sú nastavenia v Color Settings určujúce, ako Photoshop reaguje na otvorenie súborov s odlišným profilom. Off znamená ignoruje profily. Preserve Embedded Profiles zachováva profil súboru. Convert to Working Space konvertuje na pracovný priestor. Ask When Opening pýta sa pri otvorení. Profile Mismatches/Missing Profiles voľby určujú dialógy."
      },
      {
        text: "RGB Working Space",
        displayName: "RGB priestor",
        explanation: "RGB Working Space je farebný priestor pre RGB prácu. sRGB znamená malý gamut, web štandard, väčšina displejov. Adobe RGB (1998) znamená stredný gamut, profesionálna tlač a fotografia. ProPhoto RGB má najširší gamut, zachováva maximum informácií z RAW, ale väčšina displejov ho nezobrazí správne. Výber závisí od cieľového výstupu - web=sRGB, tlač=Adobe RGB."
      },
      {
        text: "CMYK Working Space",
        displayName: "CMYK priestor",
        explanation: "CMYK Working Space je farebný priestor pre CMYK tlač. Závisí od: typu tlače (offset, digitálna), papiera (coated/uncoated), noriem (FOGRA, SWOP, Japan Color). Coated FOGRA39 (ISO 12647-2) je európsky štandard pre offset tlač na lesklý papier. U.S. Web Coated (SWOP) v2 je americký štandard. Vždy konzultujte s tlačiarňou pre správny profil."
      },
      {
        text: "Convert to Profile",
        explanation: "Convert to Profile je pokročilá funkcia Edit > Convert to Profile umožňujúca presnú kontrolu konverzie medzi profilmi. Na rozdiel od Image > Mode ponúka výber: Source/Destination Profile, Rendering Intent, Black Point Compensation, Dithering. Preview checkbox zobrazuje zmeny. Používa sa na profesionálne konverzie s kontrolou nad rendering intent a detailnými nastaveniami."
      },
      {
        text: "Rendering Intent",
        explanation: "Rendering Intent je metóda konverzie out-of-gamut farieb pri zmene profilu. Perceptual zachováva vzťahy farieb, komprimuje celý gamut (fotografie). Relative Colorimetric zachováva in-gamut farby presne, posúva out-of-gamut k najbližším (default, univerzálne). Saturation maximalizuje sýtosť (grafika, grafy). Absolute Colorimetric simuluje presný papier/farby (proofing). Výber závisí od typu obsahu."
      }
    ],
    exercises: [
      {
        type: 'single-choice',
        question: 'Ktorý RGB priestor je štandard pre webovú grafiku?',
        options: ['sRGB', 'Adobe RGB', 'ProPhoto RGB', 'CMYK'],
        correctAnswer: 0
      },
      {
        type: 'true-false',
        question: 'RGB má užší gamut než CMYK.',
        options: ['True', 'False'],
        correctAnswer: false
      },
      {
        type: 'multiple-choice',
        question: 'Ktoré Rendering Intents existujú vo Photoshope?',
        options: [
          'Perceptual',
          'Relative Colorimetric',
          'Saturation',
          'Dynamic Range'
        ],
        correctAnswer: [0, 1, 2]
      },
      {
        type: 'choose-correct',
        question: 'Funkcia ________ zobrazuje farby mimo CMYK gamut.',
        options: ['Gamut Warning', 'Color Picker'],
        correctAnswer: { 0: 'Gamut Warning' }
      },
      {
        type: 'sort',
        question: 'Priraďte RGB priestory k ich použitiu:',
        options: [
          'sRGB - Webová grafika a štandardné displeje',
          'Adobe RGB - Profesionálna tlač a fotografia',
          'ProPhoto RGB - Najširší gamut pre RAW editáciu',
          'CMYK - Tlačové výstupy'
        ],
        correctAnswer: [
          'sRGB - Webová grafika a štandardné displeje',
          'Adobe RGB - Profesionálna tlač a fotografia',
          'ProPhoto RGB - Najširší gamut pre RAW editáciu',
          'CMYK - Tlačové výstupy'
        ]
      }
    ],
    useTextExercise: true
  },

  {
    id: 10,
    title: "Kombinácia výberov a feathering",
    content: "Komplexné maskovanie staviame cez **Selection Modes**, ktoré umožňujú kombinovať jednoduché výbery do presného výsledku. Režim **New Selection** použijeme pri novom výbere alebo keď chceme pôvodný výber nahradiť. Cez **Add to Selection** (Shift) pridávame ďalšie oblasti a pomocou **Subtract from Selection** (Alt) odstraňujeme nechcené časti. Keď nás zaujíma len prekryv výberov, využijeme **Intersect with Selection** (Shift+Alt). Na jemnejšie okraje slúži **Feather**: nižšie hodnoty pre prirodzené výstrihy, vyššie pre mäkké vignette efekty. Dodatočné úpravy robíme cez **Select > Modify** (napríklad **Border**, **Smooth**, **Expand/Contract**) a ak potrebujeme meniť iba tvar výberu, použijeme **Transform Selection** bez zásahu do obsahu vrstvy.",
    keywords: [
      {
        text: "Selection Modes",
        displayName: "režimy výberu",
        explanation: "Štyri ikony v Options Bar výberových nástrojov určujúce interakciu s existujúcim výberom. New Selection (obdĺžnik) = vytvorí nový výber, zruší existujúci. Add (dva obdĺžniky) = pridá k výberu (Shift). Subtract (obdĺžniky s mínus) = odčíta (Alt). Intersect (prekrývajúce obdĺžniky) = priesečník (Shift+Alt). Zobrazujú sa pri všetkých výberových nástrojoch."
      },
      {
        text: "New Selection",
        displayName: "nový výber",
        explanation: "New Selection je predvolený režim výberových nástrojov. Vytvorenie nového výberu automaticky zruší existujúci výber. Ikona je jeden obdĺžnik. Nemá žiadne modifikačné klávesy. Používa sa pri začatí nového výberu alebo keď chcete nahradiť existujúci výber."
      },
      {
        text: "Add to Selection",
        displayName: "pridanie k výberu",
        explanation: "Režim (Shift alebo druhá ikona v Options Bar) pridávajúci novú oblasť k existujúcemu výberu. Výsledný výber = union (zjednotenie) oboch oblastí. Možno kombinovať rôzne výberové nástroje - napr. Rectangular Selection + Lasso. Kurzor zobrazuje + symbol. Používa sa na výber viacerých nesúvisiacich objektov alebo zložitých tvarov."
      },
      {
        text: "Subtract from Selection",
        displayName: "odčítanie z výberu",
        explanation: "Režim (Alt alebo tretia ikona v Options Bar) odoberajúci oblasť z existujúceho výberu. Výsledný výber = rozdiel (pôvodný mínus nový). Kurzor zobrazuje - symbol. Používa sa na odstránenie nechcených častí výberu alebo vytvorenie zložitých tvarov s otvormi (napr. krúžok = kruh mínus menší kruh v strede)."
      },
      {
        text: "Intersect with Selection",
        displayName: "priesečník výberov",
        explanation: "Režim (Shift+Alt alebo štvrtá ikona) vytvárajúci výber len z prekrývajúcej sa oblasti medzi existujúcim a novým výberom. Výsledný výber = intersection (priesečník). Kurzor zobrazuje X symbol. Menej intuitívny, ale užitočný pre presné výbery - napr. výber len červenej farby v konkrétnej oblasti (Magic Wand na červenú, intersect s Rectangular Selection oblasti)."
      },
      {
        text: "Feather",
        explanation: "Parameter (0-1000 pixelov) zjemňujúci hrany výberu vytváraním postupného prechodu. Nastavuje sa v Options Bar pred vytvorením výberu alebo Select > Modify > Feather po vytvorení. Vyššia hodnota = mäkší prechod. 0 px = ostré hrany. Typické hodnoty: 2-5 px pre jemné výstrihy, 20-50 px pre soft vignettes. Feather radius určuje vzdialenosť prechodu od okraja výberu."
      },
      {
        text: "Select > Modify",
        displayName: "úpravy výberu",
        explanation: "Menu ponúkajúce dodatočné úpravy existujúcich výberov. Border (0-200 px) = vytvorí rám určenej šírky okolo výberu. Smooth (1-100 px) = zaoblí ostré rohy. Expand (1-100 px) = zväčší výber. Contract (1-100 px) = zmenší výber. Feather = zjemní hrany. Všetky fungujú na existujúcich výberoch."
      },
      {
        text: "Border",
        explanation: "Funkcia Select > Modify > Border vytvárajúca rám určenej šírky (1-200 pixelov) okolo existujúceho výberu. Vyberá len hraničnú oblasť - vnútro aj vonku sú deselected. Používa sa na vytvorenie border efektov, outline strokes alebo selektívne úpravy okrajov objektov."
      },
      {
        text: "Smooth",
        explanation: "Funkcia Select > Modify > Smooth (Sample Radius 1-100 pixelov) zaobľujúca ostré rohy výberu. Analyzuje okolité oblasti a vyhladzuje nepravidelnosti. Vyššia hodnota = hladší, zaoblený výber. Používa sa na odstránenie zubatých hrán z Magic Wand výberov alebo vytvorenie organickejších tvarov z geometrických výberov."
      },
      {
        text: "Expand/Contract",
        displayName: "rozšírenie/zmrštenie",
        explanation: "Funkcie Select > Modify > Expand/Contract (1-100 pixelov) rovnomerne zväčšujúce alebo zmenšujúce výber. Expand pridáva pixely okolo hranice, Contract ich odoberá. Zachováva približný tvar výberu. Používa sa na kompenzáciu featheru, odstránenie farebných okrajov pri výstrihu (Contract 1-2 px) alebo zväčšenie výberu pre bezpečnostný priestor."
      },
      {
        text: "Transform Selection",
        explanation: "Funkcia Select > Transform Selection umožňujúca otáčanie, škálovanie, skosenie a perspektívu samotného výberu bez ovplyvnenia obsahu vrstvy. Zobrazí transformačný rám len okolo výberu. Enter aplikuje transformáciu, Esc zruší. Používa sa na presné tvarovanie výberov pre aplikáciu efektov alebo pri vytváraní zložitých kompozičných masiek."
      }
    ],
    exercises: [
      {
        type: 'single-choice',
        question: 'Ktorá klávesa pridáva oblasť k existujúcemu výberu?',
        options: ['Shift', 'Alt', 'Ctrl', 'Tab'],
        correctAnswer: 0
      },
      {
        type: 'true-false',
        question: 'Feather parameter možno nastaviť len po vytvorení výberu.',
        options: ['True', 'False'],
        correctAnswer: false
      },
      {
        type: 'multiple-choice',
        question: 'Ktoré funkcie sú v Select > Modify menu?',
        options: [
          'Border',
          'Smooth',
          'Expand',
          'Gradient'
        ],
        correctAnswer: [0, 1, 2]
      },
      {
        type: 'choose-correct',
        question: 'Klávesová skratka ________ vytvára priesečník výberov.',
        options: ['Shift+Alt', 'Ctrl+Alt'],
        correctAnswer: { 0: 'Shift+Alt' }
      },
      {
        type: 'sort',
        question: 'Priraďte režimy výberu k ich funkciám:',
        options: [
          'New Selection - Vytvorí nový výber',
          'Add to Selection - Pridá k existujúcemu výberu',
          'Subtract - Odčíta z výberu',
          'Intersect - Vytvorí priesečník'
        ],
        correctAnswer: [
          'New Selection - Vytvorí nový výber',
          'Add to Selection - Pridá k existujúcemu výberu',
          'Subtract - Odčíta z výberu',
          'Intersect - Vytvorí priesečník'
        ]
      }
    ],
    useTextExercise: true
  },

  {
    id: 11,
    title: "Grids a Guides v dizajne",
    content: "Pre presné rozloženie prvkov v UI, ikonách a layoutoch je základom **Grid**, ktorý drží geometriu a konzistenciu kompozície. **Guides** používame na definovanie okrajov, stĺpcov a zarovnávacích línií, aby mal dizajn jasnú štruktúru. Aktivované **Rulers** nám pomáhajú s meraním a presným umiestnením vodítok. Pri práci výrazne zrýchľuje **Snap**, pretože prvky sa automaticky prichytávajú ku gridu, guides alebo hranám vrstiev. V prípade horšej viditeľnosti upravíme farbu a štýl cez **Guide Options**. Dynamické zarovnanie počas presúvania objektov poskytujú **Smart Guides**, ktoré ukazujú osi, stredy aj vzdialenosti. Keď je layout hotový, zapneme **Lock Guides**, aby sa vodítka náhodne neposúvali.",
    keywords: [
      {
        text: "Grids",
        displayName: "mriežka",
        explanation: "Grids je pravidelná sieť línií zobrazená cez celú pracovnú plochu. Zapína sa View > Show > Grid (Ctrl/Cmd+'). Nastavenia sa nachádzajú v Preferences > Guides, Grid & Slices: Gridline Every (vzdialenosť hlavných línií), Subdivisions (počet vedľajších línií), Color. Grid sa netlačí a neukladá v súbore. Snap to Grid zarovnáva objekty k mriežke. Používa sa pre presné rozmiestnenie, ikony, UI dizajn."
      },
      {
        text: "Grid",
        displayName: "grid mriežka",
        explanation: "Grid je pravidelná sieť línií cez dokument. Zapína sa View > Show > Grid (Ctrl/Cmd+'). Nastavuje sa v Preferences > Guides, Grid & Slices. Gridline Every určuje vzdialenosť hlavných línií, Subdivisions počet vedľajších delení. Snap to Grid (Shift+Ctrl/Cmd+;) prichytáva objekty k mriežke. Používa sa pre presné rozloženie prvkov."
      },
      {
        text: "Guides",
        displayName: "vodítka",
        explanation: "Guides sú jednotlivé horizontálne/vertikálne čiary pre zarovnávanie. Vytvárajú sa ťahaním z Rulers (musí byť zapnuté Ctrl/Cmd+R). Presun existujúceho guide: ťahanie pomocou nástroja na presun. Vymazanie: ťahanie späť na Ruler alebo View > Clear Guides. View > Show > Guides (Ctrl/Cmd+;) prepína viditeľnosť. Farbu/štýl v Preferences > Guides, Grid & Slices. Používajú sa pre zarovnanie textu, stĺpcov, okrajov a prvkov v layout dizajne."
      },
      {
        text: "Rulers",
        displayName: "pravítka",
        explanation: "Rulers sú pravítka zobrazené na hornom a ľavom okraji dokumentu. View > Rulers (Ctrl/Cmd+R) prepína viditeľnosť. Zobrazujú jednotky nastavené v Preferences (pixely, palce, cm). Double-click na Ruler otvára Preferences. Pravý klik na Ruler mení jednotky. Origin point (0,0) je v ľavom hornom rohu, možno ho presunúť ťahaním z priesečníka pravítok. Používajú sa na meranie a vytváranie guides."
      },
      {
        text: "Snap",
        displayName: "prichytávanie",
        explanation: "Snap je funkcia automaticky zarovnávajúca objekty a výbery k guides, grid, layer edges alebo document bounds. View > Snap (Ctrl/Cmd+Shift+;) zapína/vypína. Submenu View > Snap To ponúka: Guides, Grid, Layers, Slices, Document Bounds. Má magnetic effect v určenej vzdialenosti (zvyčajne 8 pixelov). Dočasné vypnutie držaním Ctrl/Cmd pri ťahaní. Zrýchľuje precízne zarovnávanie."
      },
      {
        text: "Guide Options",
        displayName: "nastavenia vodítok",
        explanation: "Guide Options sú nastavenia vzhľadu guides a grid. Nachádzajú sa v Preferences > Guides, Grid & Slices (Ctrl/Cmd+K). Guides: Color (predvolené: Light Blue/Cyan), Style (Lines/Dashed Lines). Grid: Color, Style, Gridline Every (napríklad 1 inch), Subdivisions (napríklad 4). Slices: Line Color. Zmena farieb pomáha rozlíšiť guides na rôznofarebných pozadiach."
      },
      {
        text: "Smart Guides",
        explanation: "Smart Guides sú dynamické vodítka automaticky zobrazované pri posúvaní, transformácii alebo kreslení objektov. Zapínajú sa View > Show > Smart Guides (Ctrl/Cmd+U). Zobrazujú: zarovnanie s inými objektmi, rovnaké vzdialenosti, centrálne body, úhly rotácie. Farba sa nastavuje v Preferences > Guides, Grid & Slices. Dočasné vypnutie Ctrl/Cmd. V Illustrátore sú ešte inteligentnejšie - merajú angles, spacing, alignment. Významne zrýchľujú presný dizajn."
      },
      {
        text: "Lock Guides",
        displayName: "zamknutie vodítok",
        explanation: "Lock Guides je funkcia View > Lock Guides (Alt/Option+Ctrl/Cmd+;) zabraňujúca nechceným posunom guides. Zamknuté guides nemožno presunúť. Stále funguje Snap to Guides. Odomknutie rovnakou skratkou. Používa sa po nastavení presných pozícií guides na ochranu layout systému počas práce na projekte."
      }
    ],
    exercises: [
      {
        type: 'single-choice',
        question: 'Ako vytvoríte nové guide vodítko vo Photoshope?',
        options: [
          'Ťahaním z Ruler',
          'View > New Guide',
          'Ctrl+G',
          'Kliknutím na Grid'
        ],
        correctAnswer: 0
      },
      {
        type: 'true-false',
        question: 'Grid mriežka sa tlačí spolu s dokumentom.',
        options: ['True', 'False'],
        correctAnswer: false
      },
      {
        type: 'multiple-choice',
        question: 'Ktoré funkcie poskytuje Snap To menu?',
        options: [
          'Guides',
          'Grid',
          'Layers',
          'Colors'
        ],
        correctAnswer: [0, 1, 2]
      },
      {
        type: 'choose-correct',
        question: 'Klávesová skratka ________ prepína viditeľnosť Smart Guides.',
        options: ['Ctrl/Cmd+U', 'Ctrl/Cmd+G'],
        correctAnswer: { 0: 'Ctrl/Cmd+U' }
      },
      {
        type: 'sort',
        question: 'Priraďte funkcie k ich použitiu:',
        options: [
          'Grid - Pravidelná mriežka cez dokument',
          'Guides - Jednotlivé vodítka pre zarovnanie',
          'Smart Guides - Dynamické vodítka pri posúvaní',
          'Snap - Automatické prichytávanie k vodítkam'
        ],
        correctAnswer: [
          'Grid - Pravidelná mriežka cez dokument',
          'Guides - Jednotlivé vodítka pre zarovnanie',
          'Smart Guides - Dynamické vodítka pri posúvaní',
          'Snap - Automatické prichytávanie k vodítkam'
        ]
      }
    ],
    useTextExercise: true
  },

  {
    id: 12,
    title: "White Balance a farebná teplota",
    content: "Správny **White Balance** je dôležitý preto, aby biela pôsobila neutrálne a farby na fotografii vyzerali prirodzene. **Color Temperature** v **Kelvinoch** nám pomáha pochopiť charakter svetla a zvoliť vhodnú kompenzáciu: nižšie hodnoty riešia teplé žlté svetlo, vyššie korigujú chladný modrý nádych. V praxi často stačia **White Balance presets** podľa typu osvetlenia, napríklad Daylight, Cloudy alebo Tungsten. Najpresnejší výsledok však dosiahneme cez **Custom White Balance** so sivou kartou v konkrétnych podmienkach. V postprocese je rýchla voľba **White Balance Tool** s **Eyedropper**, ktorým klikneme na neutrálnu oblasť. Jemné doladenie potom robíme cez **Temperature** na modro-žltej osi a **Tint** na zeleno-magentovej osi. Na pokročilé farebné ladenie celej snímky využijeme aj **Color Balance** pre tiene, stredné tóny a svetlá.",
    keywords: [
      {
        text: "White Balance",
        explanation: "White Balance je nastavenie kamery alebo úprava v postprodukcii, ktoré koriguje farebný odtieň na základe svetelného zdroja. Kompenzuje farebný nádych svetla, aby biela vyzerala neutrálne. Nesprávny WB znamená oranžové (tungsten svetlo) alebo modré (tieň) fotografie. V kamere: predvoľby alebo custom. V postprodukcii: Camera Raw, Color Balance. Je to najdôležitejšia farebná korekcia."
      },
      {
        text: "Color Temperature",
        displayName: "farebná teplota",
        explanation: "Color Temperature je charakteristika svetla vyjadrená v Kelvinoch (K) popisujúca, či svetlo má teplý (žltý/oranžový) alebo chladný (modrý) odtieň. Paradoxne: nižšie K znamená teplý tón (sviečka 1800K, žiarovka 3200K), vyššie K chladný tón (zatienenie 7500K, jasná obloha 10000K). Denné svetlo ~5500K je neutrálne. Možno upraviť v postprodukcii."
      },
      {
        text: "Kelvinoch",
        displayName: "Kelvin",
        explanation: "Kelvin je jednotka merania farebnej teploty svetla. Stupnica: 1000K (sviečka, veľmi oranžová) → 3200K (žiarovka, teplá) → 5500K (denné svetlo, neutrálne) → 6500K (zamračené, mierne chladné) → 7500K (tieň, chladné) → 10000K+ (jasná modrá obloha). Fotoaparáty a software používajú K na určenie a korekciu farebného odtieňa."
      },
      {
        text: "White Balance presets",
        displayName: "WB predvoľby",
        explanation: "White Balance presets sú prednastavené režimy White Balance vo fotoaparátoch pre bežné svetelné podmienky. Auto WB znamená kamera analyzuje scénu. Daylight (~5500K) slnečné vonkajšie. Cloudy (~6500K) zamračené. Shade (~7500K) tieň. Tungsten/Incandescent (~3200K) žiarovky. Fluorescent (~4000K) žiarivky. Flash blesk. Custom vlastný WB zo šedej karty. Vybrať pred fotografovaním pre konzistentné výsledky."
      },
      {
        text: "Custom White Balance",
        displayName: "vlastný WB",
        explanation: "Custom White Balance je presné nastavenie WB v kamere fotografovaním neutrálneho objektu (šedá/biela karta) pod aktuálnym osvetlením. Postup: fotografia šedej karty → menu kamery → Custom WB → vybrať fotografiu → nastaviť ako custom. Je to najpresnejšia metóda WB. Používa sa pri štúdiovom fotografovaní, produktovej fotografii alebo keď auto/presets nedávajú správne výsledky."
      },
      {
        text: "White Balance Tool",
        displayName: "WB nástroj",
        explanation: "White Balance Tool je vzorkovací nástroj na automatické nastavenie WB. Kliknutie na neutrálnu oblasť (šedá, biela) vo fotke automaticky upraví Temperature a Tint pre neutralizáciu farby. Funguje najlepšie na skutočne neutrálnych povrchoch. Používa sa ako rýchly východiskový bod WB korekcie v RAW súboroch."
      },
      {
        text: "Color Balance",
        displayName: "farebná rovnováha",
        explanation: "Color Balance je úprava vo Photoshope (Image > Adjustments > Color Balance), ktorá upravuje farebný odtieň samostatne pre Shadows, Midtones a Highlights. Tri slidery: Cyan↔Red, Magenta↔Green, Yellow↔Blue. Funguje na všetkých typoch súborov (JPEG, TIFF). Používa sa na jemnú farebnú korekciu, vytvorenie atmosféry alebo korekciu scén so zmiešaným osvetlením."
      },
      {
        text: "Temperature",
        displayName: "temperature slider",
        explanation: "Temperature je slider v Camera Raw/Lightroom posúvajúci farby pozdĺž modro-žltej osi. Negatívne hodnoty (naľavo) znamenajú chladnejší modrý tón. Pozitívne hodnoty (napravo) teplejší žltý tón. Hodnoty sú v Kelvinoch alebo relatívne (±100). Je to primárny nástroj WB korekcie. Kombinuje sa s Tint pre presné nastavenie neutrality."
      },
      {
        text: "Tint",
        explanation: "Tint je slider v Camera Raw/Lightroom posúvajúci farby pozdĺž zeleno-magentovej osi. Negatívne hodnoty (naľavo) znamenajú zelený nádych (typický pri fluorescenčnom svetle). Pozitívne hodnoty (napravo) znamenajú magentový nádych. Používa sa v kombinácii s Temperature na odstránenie farebných nádychov, ktoré Temperature slider nevyriešil. Je menej používaný než Temperature, ale nevyhnutný pre presný WB."
      },
      {
        text: "Eyedropper",
        displayName: "eyedropper",
        explanation: "Eyedropper je vzorkovací nástroj v dialógových oknách úprav. Kliknutie na špecifickú oblasť obrázka vzorkuje farbu a použije ju na kalibráciu. Vo WB: kliknutie na neutrálnu oblasť automaticky nastaví WB. V Curves: nastavuje white/gray/black points. Shortcuts sú často: I (eyedropper), Shift+klik na obrázku."
      }
    ],
    exercises: [
      {
        type: 'single-choice',
        question: 'Ktorá hodnota Kelvinov predstavuje neutrálne denné svetlo?',
        options: ['3200K', '5500K', '7500K', '10000K'],
        correctAnswer: 1
      },
      {
        type: 'true-false',
        question: 'Nižšie hodnoty Kelvinov vytvárajú chladnejší modrý odtieň.',
        options: ['True', 'False'],
        correctAnswer: false
      },
      {
        type: 'multiple-choice',
        question: 'Ktoré WB predvoľby má väčšina fotoaparátov?',
        options: [
          'Daylight',
          'Tungsten',
          'Cloudy',
          'Neon'
        ],
        correctAnswer: [0, 1, 2]
      },
      {
        type: 'choose-correct',
        question: 'Slider ________ posúva farby pozdĺž zeleno-magenta osi.',
        options: ['Tint', 'Temperature'],
        correctAnswer: { 0: 'Tint' }
      },
      {
        type: 'sort',
        question: 'Usporiadajte hodnoty Kelvinov od najteplejších po najchladnejšie:',
        options: [
          '3200K - Žiarovka',
          '5500K - Denné svetlo',
          '6500K - Zamračené',
          '7500K - Tieň'
        ],
        correctAnswer: [
          '3200K - Žiarovka',
          '5500K - Denné svetlo',
          '6500K - Zamračené',
          '7500K - Tieň'
        ]
      }
    ],
    useTextExercise: true
  }
];

export const intermediateFinalTest: Exercise[] = [
  // Island 1: Layers Panel a organizácia vrstiev
  {
    type: 'true-false',
    question: 'Fill ovplyvňuje aj Layer Styles aplikované na vrstvu.',
    options: ['True', 'False'],
    correctAnswer: false
  },
  // Island 2: Pen Tool a úprava uzlov
  {
    type: 'single-choice',
    question: 'Ako vytvoríte smooth point pomocou Pen Tool?',
    options: [
      'Jednoduché kliknutie',
      'Kliknutie a ťahanie',
      'Double-click',
      'Alt+kliknutie'
    ],
    correctAnswer: 1
  },
  // Island 3: Rozšírené výberové nástroje
  {
    type: 'multiple-choice',
    question: 'Ktoré nástroje používajú inteligentnú detekciu hraníc?',
    options: [
      'Magnetic Lasso Tool',
      'Quick Selection Tool',
      'Polygonal Lasso Tool',
      'Magic Wand Tool'
    ],
    correctAnswer: [0, 1]
  },
  // Island 4: Masky a ich aplikácia
  {
    type: 'choose-correct',
    question: 'Farba ________ v layer mask úplne skrýva obsah vrstvy.',
    options: ['čierna', 'biela'],
    correctAnswer: { 0: 'čierna' }
  },
  // Island 5: Kerning a tracking v typografii
  {
    type: 'single-choice',
    question: 'Ktorý typ kerningu využíva zabudované páry od dizajnéra fontu?',
    options: ['Optical Kerning', 'Metrics Kerning', 'Manual Kerning', 'Auto Kerning'],
    correctAnswer: 1
  },
  // Island 6: Filtre vo Photoshope
  {
    type: 'single-choice',
    question: 'Ktorý filter vytvára efekt smerového pohybu?',
    options: ['Gaussian Blur', 'Motion Blur', 'Radial Blur', 'Lens Blur'],
    correctAnswer: 1
  },
  // Island 7: Úprava Hue, Saturation a Brightness
  {
    type: 'true-false',
    question: 'Saturation slider nastavený na -100 vytvorí čiernobiely obraz.',
    options: ['True', 'False'],
    correctAnswer: true
  },
  // Island 9: Konverzia farebných modelov
  {
    type: 'sort',
    question: 'Priraďte Rendering Intents k ich použitiu:',
    options: [
      'Perceptual - Fotografie a zachovanie vzťahov farieb',
      'Relative Colorimetric - Univerzálne použitie',
      'Saturation - Grafika a grafy',
      'Absolute Colorimetric - Proofing'
    ],
    correctAnswer: [
      'Perceptual - Fotografie a zachovanie vzťahov farieb',
      'Relative Colorimetric - Univerzálne použitie',
      'Saturation - Grafika a grafy',
      'Absolute Colorimetric - Proofing'
    ]
  },
  // Island 10: Kombinácia výberov a feathering
  {
    type: 'multiple-choice',
    question: 'Ktoré Selection Modes existujú vo Photoshope?',
    options: [
      'Add to Selection (Shift)',
      'Subtract from Selection (Alt)',
      'Intersect with Selection (Shift+Alt)',
      'Merge Selection (Ctrl)'
    ],
    correctAnswer: [0, 1, 2]
  },
  // Island 11: Grids a Guides v dizajne
  {
    type: 'choose-correct',
    question: '________ sa automaticky zobrazujú pri posúvaní objektov na detekciu zarovnaní a vzdialeností.',
    options: ['Smart Guides', 'Grid'],
    correctAnswer: { 0: 'Smart Guides' }
  }
  // Vynechané: Island 8 (Expozícia: Clona, čas uzávierky a ISO), Island 12 (White Balance a farebná teplota)
];

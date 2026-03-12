export interface KeywordDefinition {
  text: string;
  displayName?: string;
  explanation: string;
}

export interface Exercise {
  type: 'multiple-choice' | 'true-false' | 'choose-correct' | 'sort' | 'single-choice';
  question: string;
  options: string[];
  correctAnswer: number | boolean | number[] | string[] | Record<string, string>;
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

export const beginnerThemes: Theme[] = [
  {
    id: 1,
    title: "Základy rastrovej grafiky",
    content: "Rastrová (bitmapová) grafika pracuje s **pixelmi**, teda malými farebnými bodmi usporiadanými do pravidelnej mriežky, pričom každý pixel má svoju presnú pozíciu a farbu. Kvalitu takéhoto obrazu určuje najmä **počet pixelov** (napríklad 1920 × 1080) a hodnota **PPI** (Pixels Per Inch), ktorá vyjadruje hustotu obrazu pri zobrazení. Keď rastrový obrázok výrazne zväčšujeme, objaví sa **pixelizácia** a obraz stráca ostrosť aj jemné detaily. V tlači sa zároveň stretávame s pojmom **DPI** (Dots Per Inch), ktorý označuje hustotu tlačových bodov zariadenia, nie samotného obrázka. Medzi najbežnejšie rastrové formáty patria **JPEG** pre fotografie, **PNG** pre grafiku s priehľadnosťou a **GIF** pre jednoduché animácie.",
    keywords: [
      {
        text: "pixelmi",
        displayName: "pixel",
        explanation: "Pixel je najmenšia jednotka digitálneho obrazu v rastrovej grafike - bod s definovanou farbou, ktorý v kombinácii s ďalšími pixelmi vytvára celkový obraz. Používa sa ako základný stavebný prvok všetkých digitálnych fotografií a obrázkov."
      },
      {
        text: "počet pixelov",
        explanation: "Počet pixelov je celkový počet obrazových bodov, ktoré tvoria digitálny obraz. Vyššie rozlíšenie znamená viac pixelov a väčší detail. Používa sa na určenie kvality a vhodnosti obrázka pre konkrétne použitie (web, tlač, veľkoformátový banner)."
      },
      {
        text: "PPI",
        explanation: "Pixels Per Inch je jednotka, ktorá vyjadruje, koľko pixelov digitálneho obrazu pripadá na dĺžku jedného palca (2,54 cm) pri jeho zobrazení. Používa sa na určenie jemnosti a ostrosti obrazu na obrazovkách."
      },
      {
        text: "pixelizácia",
        explanation: "Pixelizácia je nežiaduci efekt, ktorý vzniká pri zväčšovaní rastrových obrázkov, keď sa jednotlivé pixely stanú viditeľnými a obraz stráca plynulosť a detaily. Dôležité ju poznať pri práci s obrázkami rôznych rozlíšení a pri príprave grafiky pre rôzne výstupné médiá."
      },
      {
        text: "DPI",
        explanation: "Dots Per Inch je jednotka, ktorá vyjadruje, koľko obrazových bodov (pixelov) sa nachádza na ploche jedného palca (2,54 cm). Používa sa na určenie kvality tlače alebo zobrazenia."
      },
      {
        text: "JPEG",
        explanation: "Joint Photographic Experts Group je formát s vysokou kompresiou vhodný pre fotografie a obrázky s plynulými farebnými prechodmi. Využíva stratovú kompresiu, ktorá znižuje kvalitu, ale výrazne zmenšuje veľkosť súboru."
      },
      {
        text: "PNG",
        explanation: "Portable Network Graphics je formát s bezstratovou kompresiou podporujúci priehľadnosť. Je vhodný pre grafiku s ostrými hranami, textom a transparentnými oblasťami."
      },
      {
        text: "GIF",
        explanation: "Graphics Interchange Format je formát podporujúci jednoduché animácie a má obmedzenú paletu 256 farieb. Je vhodný pre jednoduché grafické prvky a animácie."
      }
    ],
    exercises: [
      {
        type: 'true-false',
        question: 'Rastrové obrázky si zachovávajú kvalitu pri ľubovoľnom zväčšení.',
        options: ['True', 'False'],
        correctAnswer: false
      },
      {
        type: 'choose-correct',
        question: 'Najmenšia jednotka rastrovej grafiky sa nazýva ________.',
        options: ['pixel', 'vektor'],
        correctAnswer: { 0: 'pixel' }
      },
      {
        type: 'sort',
        question: 'Priraďte správne využitie k formátom:',
        categories: ['JPEG', 'PNG', 'GIF', 'BMP'],
        options: [
          'Fotografie s plnou farebnou hĺbkou',
          'Grafika s priehľadnosťou',
          'Jednoduché animácie',
          'Nekomprimované obrázky'
        ],
        correctAnswer: [0, 1, 2, 3]
      },
      {
        type: 'single-choice',
        question: 'Ktorá jednotka sa používa na meranie hustoty pixelov v obraze?',
        options: ['PPI', 'DPI', 'LPI', 'CPI'],
        correctAnswer: 0
      },
      {
        type: 'multiple-choice',
        question: 'Ktoré z nasledujúcich tvrdení o rastrovej grafike sú pravdivé?',
        options: [
          'Je založená na matematických vzorcoch',
          'Pri zväčšovaní stráca kvalitu',
          'Každý bod má svoju presnú pozíciu a farbu',
          'Je vhodná pre tlač vo veľkých formátoch'
        ],
        correctAnswer: [1, 2]
      }
    ],
    useTextExercise: true
  },

  {
    id: 2,
    title: "Úvod do vektorovej grafiky",
    content: "Vektorová grafika je založená na matematických vzorcoch, ktoré definujú **vektory** ako čiary a krivky s presne určenými vlastnosťami. Na rozdiel od rastrovej grafiky si vektorové objekty zachovávajú dokonalú kvalitu pri akomkoľvek zväčšení, pretože sa pri zmene mierky vždy nanovo prepočítajú. Na tvorbu hladkých a organických tvarov používame **Bézierove krivky**, ktorých priebeh určujú **uzly** a **kontrolné body**. Medzi typické formáty vektorovej grafiky patria **SVG** pre web, **AI** ako natívny formát Adobe Illustratora a **EPS** pre univerzálne použitie, najmä v tlači. Tento typ grafiky je ideálny pre ikony, logá a ilustrácie, kde je kľúčová škálovateľnosť.",
    keywords: [
      {
        text: "vektory",
        displayName: "vektory",
        explanation: "Vektory sú matematicky definované čiary alebo krivky určené smerom a veľkosťou. Predstavujú základný prvok vektorovej grafiky. Používajú sa na vytváranie škálovateľných grafických prvkov ako ikony a ilustrácie."
      },
      {
        text: "Bézierove krivky",
        explanation: "Bézierove krivky sú matematicky definované krivky používané vo vektorovej grafike. Sú určené začiatočným a koncovým bodom a jedným alebo viacerými kontrolnými bodmi, ktoré ovplyvňujú ich tvar. Používajú sa na kreslenie hladkých organických tvarov a presných kriviek v dizajne."
      },
      {
        text: "uzly",
        displayName: "uzly",
        explanation: "Uzly sú body v priestore, ktoré definujú začiatok, koniec alebo zmenu smeru vektorovej cesty. Môžu byť ostré alebo hladké. Používajú sa na úpravu a presné tvarovanie vektorových objektov."
      },
      {
        text: "kontrolné body",
        displayName: "kontrolné body",
        explanation: "Kontrolné body sú body, ktoré neurčujú priamo cestu, ale ovplyvňujú zakrivenie Bézierovej krivky medzi dvoma uzlami. Používajú sa na jemnú úpravu tvaru kriviek a dosiahnutie požadovaného zakrivenia."
      },
      {
        text: "SVG",
        explanation: "Scalable Vector Graphics je vektorový formát pre web založený na XML. Umožňuje vytvárať grafiku, ktorá sa prispôsobí akejkoľvek veľkosti bez straty kvality. Používa sa pre ikony a grafické prvky na webových stránkach."
      },
      {
        text: "AI",
        explanation: "Adobe Illustrator je natívny vektorový formát programu Adobe Illustrator. Zachováva všetky editovateľné vlastnosti vektorových objektov. Používa sa na ukladanie a zdieľanie vektorových projektov medzi dizajnérmi."
      },
      {
        text: "EPS",
        explanation: "Encapsulated PostScript je univerzálny vektorový formát používaný v tlači a grafickom dizajne. Je podporovaný väčšinou grafických programov. Používa sa na prípravu grafiky pre profesionálnu tlač a výmenu súborov medzi rôznymi aplikáciami."
      }
    ],
    exercises: [
      {
        type: 'multiple-choice',
        question: 'Ktoré z nasledujúcich vlastností patria vektorovej grafike?',
        options: [
          'Zachováva kvalitu pri zväčšení',
          'Je založená na pixeloch',
          'Využíva matematické vzorce',
          'Má obmedzené rozlíšenie'
        ],
        correctAnswer: [0, 2]
      },
      {
        type: 'sort',
        question: 'Priraďte správne charakteristiky:',
        categories: ['Vektor', 'Uzol', 'Kontrolný bod', 'Bézierova krivka'],
        options: [
          'Matematicky definovaná čiara určená smerom a veľkosťou',
          'Bod definujúci začiatok, koniec alebo zmenu smeru',
          'Bod ovplyvňujúci zakrivenie bez priameho určenia cesty',
          'Matematicky definovaná krivka s kontrolnými bodmi'
        ],
        correctAnswer: [0, 1, 2, 3]
      },
      {
        type: 'single-choice',
        question: 'Ktorý z nasledujúcich formátov NIE JE vektorový?',
        options: ['SVG', 'AI', 'EPS', 'PNG'],
        correctAnswer: 3
      },
      {
        type: 'choose-correct',
        question: 'Vektorová grafika využíva ________ krivky na vytváranie hladkých tvarov.',
        options: ['Bézierove', 'Pixelové'],
        correctAnswer: { 0: 'Bézierove' }
      },
      {
        type: 'true-false',
        question: 'Vektorová grafika je vhodnejšia pre fotografie než rastrová grafika.',
        options: ['True', 'False'],
        correctAnswer: false
      }
    ],
    useTextExercise: true
  },

  {
    id: 3,
    title: "Farebné modely RGB a CMYK",
    content: "Farebné modely predstavujú rôzne spôsoby, ako v grafike digitálne vyjadrujeme farby. Model **RGB** (Red, Green, Blue) funguje na aditívnom princípe, pri ktorom farby vznikajú miešaním červeného, zeleného a modrého svetla, a používa sa najmä na obrazovkách. Naopak model **CMYK** (Cyan, Magenta, Yellow, Key/Black) pracuje subtraktívne pomocou pigmentov, ktoré svetlo odčítavajú, preto je štandardom v tlači. RGB zároveň pracuje s pojmom **farebná hĺbka** udávaným v bitoch; pri 8 bitoch na kanál vieme zobraziť približne 16,7 milióna odtieňov. Pri príprave podkladov na tlač je potrebná **konverzia** z RGB do CMYK, pričom môže nastať **posun farieb**, keďže nie všetky RGB farby sa dajú v CMYK verne reprodukovať.",
    keywords: [
      {
        text: "RGB",
        explanation: "RGB je aditívny farebný model založený na miešaní červeného, zeleného a modrého svetla. Používa sa pre digitálne zobrazenie na monitoroch, televízoroch a mobilných zariadeniach."
      },
      {
        text: "CMYK",
        explanation: "CMYK je subtraktívny farebný model založený na miešaní azúrovej, purpurovej, žltej a čiernej farby. Používa sa v tlačiarenskom priemysle pre tlač na papier a iné fyzické médiá."
      },
      {
        text: "farebnou hĺbkou",
        displayName: "farebná hĺbka",
        explanation: "Farebná hĺbka určuje, koľko farebných odtieňov môže byť zobrazených. Meria sa v bitoch na kanál, pričom vyššia hodnota umožňuje presnejšie zobrazenie farieb."
      },
      {
        text: "konverzia",
        explanation: "Konverzia je proces prevodu farieb z jedného farebného modelu do druhého, najčastejšie z RGB do CMYK pri príprave digitálnej grafiky na tlač. Používa sa vždy pri príprave digitálnych projektov pre fyzickú tlač."
      },
      {
        text: "posun farieb",
        explanation: "Posun farieb je zmena vo vzhľade farieb, ktorá nastáva pri konverzii medzi farebnými modelmi. Niektoré farby v RGB nemožno presne reprodukovať v CMYK a naopak. Dôležité je pri príprave dizajnov o tom vedieť, aby ste mohli upraviť farby pred finálnym exportom."
      }
    ],
    exercises: [
      {
        type: 'single-choice',
        question: 'Ktorý farebný model sa primárne používa pre tlač?',
        options: ['RGB', 'CMYK', 'HSB', 'LAB'],
        correctAnswer: 1
      },
      {
        type: 'true-false',
        question: 'RGB je subtraktívny farebný model.',
        options: ['True', 'False'],
        correctAnswer: false
      },
      {
        type: 'choose-correct',
        question: 'Pri príprave grafiky na tlač je potrebná konverzia z ________ do CMYK.',
        options: ['RGB', 'HSB'],
        correctAnswer: { 0: 'RGB' }
      },
      {
        type: 'multiple-choice',
        question: 'Ktoré tvrdenia o farebných modeloch sú pravdivé?',
        options: [
          'RGB využíva miešanie svetla',
          'CMYK sa používa pre digitálne zobrazenie',
          'Konverzia medzi RGB a CMYK môže spôsobiť posun farieb',
          '8-bitová farebná hĺbka umožňuje zobraziť milióny farieb'
        ],
        correctAnswer: [0, 2, 3]
      },
      {
        type: 'sort',
        question: 'Priraďte správne farby k modelom:',
        categories: ['R v RGB', 'G v RGB', 'C v CMYK', 'Y v CMYK'],
        options: [
          'Červená',
          'Zelená',
          'Azúrová',
          'Žltá'
        ],
        correctAnswer: [0, 1, 2, 3]
      }
    ],
    useTextExercise: true
  },

  {
    id: 4,
    title: "Základné formáty grafických súborov",
    content: "V grafickom dizajne používame rôzne formáty súborov, pričom každý je vhodný na iný účel. **JPEG** využíva stratovú kompresiu a je ideálny najmä na fotografie, no menej vhodný pre grafiku s textom alebo ostrými hranami. **PNG** podporuje **priehľadnosť** a bezstratovú kompresiu, preto sa často používa pri webovej grafike a logách. Pre jednoduché **animácie** je určený **GIF**, ktorý síce pracuje len s 256 farbami, no pri jednoduchých prvkoch funguje spoľahlivo. Vektorový formát **SVG** je navrhnutý pre web a responzívny dizajn, takže sa plynulo prispôsobí rôznym veľkostiam. Natívny formát Photoshopu **PSD** uchováva všetky **vrstvy** na ďalšiu editáciu, zatiaľ čo **AI** je natívny formát Adobe Illustratora pre vektorové projekty.",
    keywords: [
      {
        text: "JPEG",
        explanation: "Joint Photographic Experts Group je formát s vysokou kompresiou vhodný pre fotografie a obrázky s plynulými farebnými prechodmi. Využíva stratovú kompresiu, ktorá znižuje kvalitu, ale výrazne zmenšuje veľkosť súboru."
      },
      {
        text: "PNG",
        explanation: "Portable Network Graphics je formát s bezstratovou kompresiou podporujúci priehľadnosť. Je vhodný pre grafiku s ostrými hranami, textom a transparentnými oblasťami."
      },
      {
        text: "priehľadnosť",
        explanation: "Priehľadnosť je vlastnosť grafického formátu, ktorá umožňuje definovať, ktoré časti obrázka sú viditeľné a ktoré priehľadné. Využíva sa pre grafiku, ktorá musí splynúť s pozadím. Používa sa pri tvorbe lôg, ikon a webových grafických prvkov."
      },
      {
        text: "GIF",
        explanation: "Graphics Interchange Format je formát podporujúci jednoduché animácie a má obmedzenú paletu 256 farieb. Je vhodný pre jednoduché grafické prvky a animácie."
      },
      {
        text: "animáciu",
        displayName: "animácia",
        explanation: "Animácia je sekvencia obrázkov vytvárajúca dojem pohybu. V kontexte webovej grafiky ju podporujú formáty ako GIF a modernejšie formáty ako APNG a WebP. Používa sa na prilákanie pozornosti, vysvetlenie procesov alebo pridanie interaktivity na web."
      },
      {
        text: "SVG",
        explanation: "Scalable Vector Graphics je vektorový formát pre web založený na XML. Umožňuje vytvárať grafiku, ktorá sa prispôsobí akejkoľvek veľkosti bez straty kvality."
      },
      {
        text: "PSD",
        explanation: "Photoshop Document je natívny formát programu Adobe Photoshop. Zachováva všetky vrstvy, masky a editovateľné vlastnosti. Používa sa na ukladanie rozpracovaných projektov pre neskoršie úpravy."
      },
      {
        text: "AI",
        explanation: "Adobe Illustrator je natívny vektorový formát programu Adobe Illustrator. Zachováva všetky editovateľné vlastnosti vektorových objektov. Používa sa na ukladanie a zdieľanie vektorových projektov medzi dizajnérmi."
      },
      {
        text: "vrstvy",
        displayName: "vrstvy",
        explanation: "Vrstvy sú koncept v grafických programoch, ktorý umožňuje pracovať s rôznymi elementmi obrázka nezávisle. Zachovávajú sa v editovateľných formátoch ako PSD, AI alebo XCF. Používajú sa na nedeštruktívnu editáciu, organizáciu projektu a jednoduché úpravy jednotlivých elementov."
      }
    ],
    exercises: [
      {
        type: 'multiple-choice',
        question: 'Ktoré formáty podporujú priehľadnosť?',
        options: ['JPEG', 'PNG', 'GIF', 'BMP'],
        correctAnswer: [1, 2]
      },
      {
        type: 'single-choice',
        question: 'Ktorý formát je najvhodnejší pre fotografie s vysokou kompresiou?',
        options: ['PNG', 'JPEG', 'GIF', 'SVG'],
        correctAnswer: 1
      },
      {
        type: 'sort',
        question: 'Priraďte správne vlastnosti k formátom:',
        options: [
          'JPEG - Stratová kompresia',
          'PNG - Bezstratová kompresia s priehľadnosťou',
          'GIF - Animácia s limitovanou paletou farieb',
          'SVG - Vektorový formát'
        ],
        correctAnswer: [
          'JPEG - Stratová kompresia',
          'PNG - Bezstratová kompresia s priehľadnosťou',
          'GIF - Animácia s limitovanou paletou farieb',
          'SVG - Vektorový formát'
        ]
      },
      {
        type: 'choose-correct',
        question: 'Formát ________ je natívnym formátom programu Photoshop a zachováva všetky vrstvy.',
        options: ['PSD', 'AI'],
        correctAnswer: { 0: 'PSD' }
      },
      {
        type: 'true-false',
        question: 'SVG formát je vhodný pre ukladanie fotografií.',
        options: ['True', 'False'],
        correctAnswer: false
      }
    ],
    useTextExercise: true
  },

  {
    id: 5,
    title: "Úvod do Adobe Photoshop",
    content: "Adobe Photoshop je profesionálny softvér na úpravu rastrovej grafiky, ktorého **pracovné prostredie** tvoria **panely**, **nástroje** a pracovná plocha. Každý projekt začína vytvorením **dokumentu** s vhodným rozlíšením a farebným modelom podľa účelu použitia. Kľúčovým prvkom sú **vrstvy**, ktoré nám pomáhajú organizovať obsah a upravovať ho nedeštruktívne, teda bez trvalých zásahov do originálu. Pri selektívnych úpravách využívame rôzne **výberové nástroje**, aby sme pracovali len s konkrétnou časťou obrázka. Photoshop zároveň ponúka široké možnosti práce s **filtrami** a **maskami**, vďaka ktorým vieme vytvárať efekty a skrývať časti vrstiev bez definitívneho mazania.",
    keywords: [
      {
        text: "pracovné prostredie",
        explanation: "Pracovné prostredie je užívateľské rozhranie Photoshopu, ktoré zahŕňa panely, nástroje a pracovnú plochu. Môže byť prispôsobené podľa potrieb užívateľa. Používa sa na efektívnu organizáciu workspace pre rôzne typy projektov (retušovanie, web dizajn, ilustrácia)."
      },
      {
        text: "panely",
        explanation: "Panely sú prvky užívateľského rozhrania, ktoré poskytujú prístup k funkciám a nastaveniam. Zahŕňajú panel vrstiev, panel histórie, panel vlastností a ďalšie. Používajú sa na rýchly prístup k často používaným funkciám a ovládacím prvkom."
      },
      {
        text: "nástroje",
        explanation: "Nástroje sú súbor nástrojov na úpravu obrázkov vrátane výberových nástrojov, štetcov, retuše a iných funkcií. Používajú sa na každodenné úlohy ako výber, maľovanie, mazanie, retušovanie a transformáciu objektov."
      },
      {
        text: "dokument",
        explanation: "Dokument je pracovný súbor vo Photoshope s definovaným rozlíšením, farebným modelom a obsahom vrstiev. Používa sa ako základ pre každý projekt, kde sa nastavujú rozmery a parametre podľa finálneho účelu."
      },
      {
        text: "vrstvy",
        explanation: "Vrstvy sú koncept umožňujúci prácu s rôznymi elementmi obrázka nezávisle. Fungujú ako priehľadné fólie uložené nad sebou, pričom každá môže obsahovať rôzny obsah. Používajú sa na organizáciu projektu, nedeštruktívnu editáciu a jednoduchú úpravu jednotlivých elementov."
      },
      {
        text: "výberových nástrojov",
        displayName: "výberové nástroje",
        explanation: "Výberové nástroje sú nástroje slúžiace na označenie konkrétnych častí obrázka pre ďalšiu editáciu. Zahŕňajú obdĺžnikový výber, eliptický výber, laso, magnetické laso a ďalšie. Používajú sa na izoláciu oblastí pre samostatnú úpravu, vymazanie pozadia alebo aplikovanie efektov len na určité časti."
      },
      {
        text: "filtrami",
        displayName: "filtre",
        explanation: "Filtre sú efekty a úpravy, ktoré možno aplikovať na vrstvy alebo výbery. Zahŕňajú rozostrenie, zostrenie, skreslenie a umelecké efekty. Používajú sa na vylepšenie kvality obrázkov, vytvorenie špeciálnych efektov alebo štylizáciu fotografií."
      },
      {
        text: "maskami",
        displayName: "masky",
        explanation: "Masky sú nástroj umožňujúci skryť alebo zobraziť časti vrstvy bez trvalého vymazania dát. Používajú sa pre nedeštruktívnu editáciu a umožňujú jemné prechody medzi viditeľnými a skrytými časťami."
      }
    ],
    exercises: [
      {
        type: 'sort',
        question: 'Priraďte správne charakteristiky:',
        options: [
          'Panel vrstiev - Zobrazuje a organizuje vrstvy v dokumente',
          'Panel histórie - Zaznamenáva kroky úprav a umožňuje vrátiť sa späť',
          'Výberové nástroje - Slúžia na označenie špecifických častí obrázka',
          'Masky - Umožňujú nedeštruktívne skrývanie častí vrstvy'
        ],
        correctAnswer: [
          'Panel vrstiev - Zobrazuje a organizuje vrstvy v dokumente',
          'Panel histórie - Zaznamenáva kroky úprav a umožňuje vrátiť sa späť',
          'Výberové nástroje - Slúžia na označenie špecifických častí obrázka',
          'Masky - Umožňujú nedeštruktívne skrývanie častí vrstvy'
        ]
      },
      {
        type: 'true-false',
        question: 'Vo Photoshope je možné pracovať s vektorovými tvarmi.',
        options: ['True', 'False'],
        correctAnswer: true
      },
      {
        type: 'multiple-choice',
        question: 'Ktoré z nasledujúcich nástrojov patria medzi výberové nástroje vo Photoshope?',
        options: ['Obdĺžnikový výber', 'Laso', 'Štetec', 'Magnetické laso'],
        correctAnswer: [0, 1, 3]
      },
      {
        type: 'single-choice',
        question: 'Čo umožňujú vrstvy vo Photoshope?',
        options: [
          'Len úpravu jasu a kontrastu',
          'Nedeštruktívnu editáciu',
          'Len aplikáciu filtrov',
          'Len zmenu farebného modelu'
        ],
        correctAnswer: 1
      },
      {
        type: 'choose-correct',
        question: '________ umožňujú skryť alebo zobraziť časti vrstvy bez trvalého vymazania dát.',
        options: ['Masky', 'Filtre'],
        correctAnswer: { 0: 'Masky' }
      }
    ],
    useTextExercise: true
  },

  {
    id: 6,
    title: "Úvod do Adobe Illustrator",
    content: "Adobe Illustrator je profesionálny softvér na vektorovú grafiku, ktorého **pracovné prostredie** tvoria **panely**, **nástroje** a **kresliace plochy** (artboards). Základom práce je pochopenie **vektorových ciest**, ktoré vytvárame pomocou **uzlov** a **segmentov**. Na rýchle skladanie základných objektov slúžia **tvarové nástroje** ako obdĺžnik, elipsa, polygón či hviezda. Najdôležitejším nástrojom je **pero** (Pen Tool), s ktorým vieme vytvárať presné vlastné krivky a tvary. Illustrator pracuje s pojmami **výplň** (fill) a **obrys** (stroke), ktoré určujú vzhľad vnútra objektu a jeho hrany. Pre prehľadnú organizáciu projektu používame **vrstvy**, podobne ako vo Photoshope.",
    keywords: [
      {
        text: "pracovné prostredie",
        explanation: "Pracovné prostredie je užívateľské rozhranie Illustratora, ktoré zahŕňa panely nástrojov, vlastností, vrstiev a kresliacu plochu. Môže byť prispôsobené podľa typu práce (ikony, ilustrácie, logo dizajn)."
      },
      {
        text: "panelov",
        displayName: "panely",
        explanation: "Panely sú prvky rozhrania poskytujúce prístup k funkciám programu. Zahŕňajú panel vrstiev, farieb, výplní a ďalšie. Používajú sa na rýchle nastavenie vlastností objektov a organizáciu pracovného postupu."
      },
      {
        text: "nástrojov",
        displayName: "nástroje",
        explanation: "Nástroje sú sada nástrojov na tvorbu a úpravu vektorovej grafiky. Nachádzajú sa v ľavom paneli a zahŕňajú nástroje na kreslenie, výber, transformáciu a textové nástroje."
      },
      {
        text: "kresliacich plôch",
        displayName: "kresliace plochy (artboards)",
        explanation: "Kresliace plochy sú pracovné oblasti v dokumente, kde vytvárate svoju grafiku. Jeden dokument môže obsahovať viacero artboardov pre rôzne verzie dizajnu. Používajú sa pri tvorbe viacstranových projektov, variácií loga alebo mobilných aplikácií."
      },
      {
        text: "vektorových ciest",
        displayName: "vektorové cesty",
        explanation: "Vektorové cesty sú základné stavebné prvky vektorovej grafiky v Illustrátore. Skladajú sa z uzlov spojených segmentami a určujú tvar objektov. Používajú sa na vytváranie akýchkoľvek vektorových ilustrácií, lôg a ikon."
      },
      {
        text: "uzlov",
        displayName: "uzly",
        explanation: "Uzly sú body, ktoré definujú tvar vektorovej cesty. Môžu byť rohové (sharp) alebo hladké (smooth). Používajú sa na presné tvarovanie a úpravu vektorových objektov posúvaním uzlov a úpravou kontrolných bodov."
      },
      {
        text: "segmentov",
        displayName: "segmenty",
        explanation: "Segmenty sú časti cesty medzi dvoma uzlami. Môžu byť rovné alebo zakrivené. Používajú sa na vytvorenie kontúry tvaru a môžu byť samostatne upravované."
      },
      {
        text: "základné tvarové nástroje",
        explanation: "Základné tvarové nástroje sú nástroje na rýchle vytváranie geometrických tvarov. Zahŕňajú obdĺžnik (Rectangle), elipsu (Ellipse), polygón a hviezdu. Používajú sa ako základ pre komplexnejšie dizajny alebo pre tvorbu jednoduchých ikon."
      },
      {
        text: "pero",
        displayName: "pero (Pen Tool)",
        explanation: "Pero je najdôležitejší nástroj v Illustrátore na vytváranie vlastných vektorových ciest. Umožňuje presné kreslenie priamych línií aj zakrivených Bézierových kriviek. Používa sa na kreslenie vlastných tvarov, vektorové obkreslenie a vytváranie presných ilustrácií."
      },
      {
        text: "výplne",
        displayName: "výplň (fill)",
        explanation: "Výplň je farba alebo vzor vnútornej plochy vektorového objektu. Môže byť jednofarebná, gradientová alebo obsahovať vzor. Používa sa na definovanie vnútorného vzhľadu tvarov a objektov."
      },
      {
        text: "obrysu",
        displayName: "obrys (stroke)",
        explanation: "Obrys je viditeľná čiara tvorená po obvode vektorového objektu. Môže mať nastavenú hrúbku, farbu a štýl (plná čiara, prerušovaná). Používa sa na definovanie ohraničenia objektov a vytváranie líniových ilustrácií."
      },
      {
        text: "vrstvy",
        displayName: "vrstvy",
        explanation: "Vrstvy sú organizačný systém na usporiadanie objektov v Illustrátore. Umožňujú skupinovať súvisiace prvky a pracovať s nimi nezávisle. Používajú sa na udržanie poriadku v komplexných projektoch a rýchlu navigáciu medzi prvkami."
      }
    ],
    exercises: [
      {
        type: 'true-false',
        question: 'Adobe Illustrator je primárne určený na prácu s rastrovou grafikou.',
        options: ['True', 'False'],
        correctAnswer: false
      },
      {
        type: 'multiple-choice',
        question: 'Ktoré z nasledujúcich patria medzi základné tvarové nástroje v Illustrátore?',
        options: ['Obdĺžnik (Rectangle)', 'Štetec (Brush)', 'Elipsa (Ellipse)', 'Polygón'],
        correctAnswer: [0, 2, 3]
      },
      {
        type: 'single-choice',
        question: 'Ktorý nástroj je najdôležitejší pre vytváranie vlastných vektorových ciest v Illustrátore?',
        options: ['Štetec', 'Pero (Pen Tool)', 'Laso', 'Čarovná palička'],
        correctAnswer: 1
      },
      {
        type: 'choose-correct',
        question: 'Vektorové cesty sa skladajú z ________ spojených segmentami.',
        options: ['uzlov', 'pixelov'],
        correctAnswer: { 0: 'uzlov' }
      },
      {
        type: 'sort',
        question: 'Priraďte správne charakteristiky:',
        options: [
          'Výplň (Fill) - Farba vnútornej plochy objektu',
          'Obrys (Stroke) - Viditeľná čiara po obvode objektu',
          'Artboard - Pracovná oblasť pre dizajn',
          'Uzol - Bod definujúci tvar vektorovej cesty'
        ],
        correctAnswer: [
          'Výplň (Fill) - Farba vnútornej plochy objektu',
          'Obrys (Stroke) - Viditeľná čiara po obvode objektu',
          'Artboard - Pracovná oblasť pre dizajn',
          'Uzol - Bod definujúci tvar vektorovej cesty'
        ]
      }
    ],
    useTextExercise: true
  },

  {
    id: 7,
    title: "Základné nástroje výberu vo Photoshope a Illustrátore",
    content: "Výberové nástroje sú v oboch programoch kľúčové, pretože nám umožňujú pracovať len s konkrétnymi časťami dizajnu. Vo **Photoshope** používame **obdĺžnikový a eliptický výber** pri geometrických tvaroch, **laso** pri voľných výberoch a **magnetické laso**, ktoré sa automaticky prichytáva k hranám. **Čarovná palička** vyberá oblasti podľa farby, zatiaľ čo **rýchly výber** inteligentne rozpoznáva obrysy objektov. V **Illustrátore** pracujeme s **výberovým nástrojom** (Selection Tool) na výber celých objektov a s **nástrojom priameho výberu** (Direct Selection Tool) na úpravu jednotlivých uzlov a segmentov ciest. V oboch programoch vieme **kombinovať výbery** cez pridávanie, odčítanie alebo prienik a vo Photoshope navyše používame **zjemnenie výberu** na plynulejšie prechody.",
    keywords: [
      {
        text: "Photoshope",
        displayName: "Photoshop",
        explanation: "Program Adobe Photoshop je určený na prácu s rastrovou grafikou. Obsahuje rozsiahlu sadu výberových nástrojov pre prácu s pixelmi a oblasťami obrázkov."
      },
      {
        text: "Obdĺžnikový a eliptický výber",
        explanation: "Obdĺžnikový a eliptický výber sú základné geometrické výberové nástroje vo Photoshope. Obdĺžnikový výber vytvára pravouhlé výbery, zatiaľ čo eliptický výber vytvára oválne výbery. Používajú sa na rýchly výber pravidelných tvarov."
      },
      {
        text: "Laso",
        explanation: "Laso je nástroj umožňujúci voľný výber ťahaním myšou vo Photoshope. Je vhodný pre nepravidelné tvary, vyžaduje však presnú ruku."
      },
      {
        text: "Magnetické laso",
        explanation: "Magnetické laso je inteligentný nástroj vo Photoshope, ktorý sa automaticky prichytáva k hranám objektov. Uľahčuje výber objektov s jasnými kontúrami."
      },
      {
        text: "Čarovná palička",
        explanation: "Čarovná palička je nástroj vo Photoshope, ktorý vyberá oblasti s podobnou farbou. Pracuje s parametrom tolerancie. Používa sa na rýchly výber jednofarebných pozadí."
      },
      {
        text: "Rýchly výber",
        explanation: "Rýchly výber je inteligentný nástroj vo Photoshope automaticky detekujúci hrany objektov. Je rýchlejší a presnejší než manuálne výberové nástroje."
      },
      {
        text: "Illustrátore",
        displayName: "Illustrator",
        explanation: "Program Adobe Illustrator je určený na prácu s vektorovou grafikou. Obsahuje nástroje na výber celých objektov aj jednotlivých uzlov a segmentov."
      },
      {
        text: "výberovým nástrojom",
        displayName: "výberový nástroj (Selection Tool)",
        explanation: "Výberový nástroj je základný nástroj v Illustrátore označený ako Selection Tool (V). Slúži na výber, presun a transformáciu celých objektov. Používa sa na prácu s kompletným vektorovým objektom."
      },
      {
        text: "nástrojom priameho výberu",
        displayName: "nástroj priameho výberu (Direct Selection Tool)",
        explanation: "Nástroj priameho výberu je nástroj v Illustrátore označený ako Direct Selection Tool (A). Umožňuje vyberať a upravovať jednotlivé uzly a segmenty vektorových ciest. Používa sa na presné tvarovanie vektorových objektov."
      },
      {
        text: "kombinovať výbery",
        displayName: "kombinovať výbery",
        explanation: "Kombinovanie výberov je možnosť spájať viacero výberov pomocou režimov pridania, odčítania alebo prieniku. Je dostupné v oboch programoch. Používa sa na vytváranie komplexných výberov."
      },
      {
        text: "Zjemnenie výberu",
        explanation: "Zjemnenie výberu je technika vo Photoshope na elimináciu ostrých hrán výberu. Vytvára plynulé prechody medzi vybranou oblasťou a pozadím."
      }
    ],
    exercises: [
      {
        type: 'multiple-choice',
        question: 'Ktoré nástroje patria medzi základné nástroje výberu vo Photoshope?',
        options: ['Obdĺžnikový výber', 'Laso', 'Magnetické laso', 'Pero (Pen Tool)'],
        correctAnswer: [0, 1, 2]
      },
      {
        type: 'choose-correct',
        question: 'V Illustrátore slúži ________ na vyberanie a úpravu jednotlivých uzlov vektorových ciest.',
        options: ['Direct Selection Tool', 'Selection Tool'],
        correctAnswer: { 0: 'Direct Selection Tool' }
      },
      {
        type: 'single-choice',
        question: 'Ktorý nástroj vo Photoshope je najvhodnejší na výber oblastí s podobnou farbou?',
        options: ['Obdĺžnikový výber', 'Laso', 'Čarovná palička', 'Selection Tool'],
        correctAnswer: 2
      },
      {
        type: 'true-false',
        question: 'Výbery je možné kombinovať iba vo Photoshope, nie v Illustrátore.',
        options: ['True', 'False'],
        correctAnswer: false
      },
      {
        type: 'sort',
        question: 'Priraďte správne charakteristiky k nástrojom:',
        options: [
          'Magnetické laso (PS) - Automaticky sa prichytáva k hranám',
          'Čarovná palička (PS) - Vyberá oblasti s podobnou farbou',
          'Selection Tool (AI) - Vyberá celé objekty',
          'Direct Selection Tool (AI) - Vyberá jednotlivé uzly'
        ],
        correctAnswer: [
          'Magnetické laso (PS) - Automaticky sa prichytáva k hranám',
          'Čarovná palička (PS) - Vyberá oblasti s podobnou farbou',
          'Selection Tool (AI) - Vyberá celé objekty',
          'Direct Selection Tool (AI) - Vyberá jednotlivé uzly'
        ]
      }
    ],
    useTextExercise: true
  },

  {
    id: 8,
    title: "Základy typografie",
    content: "Typografia je umenie aj technika usporiadania písma, pričom základ tvorí výber vhodného **písma** (fontu), jeho **veľkosti**, **rezu** (napríklad bold alebo italic) a **farby** textu. Písma delíme najmä na **pätkové** (serif), ktoré majú ozdobné zakončenia ťahov, a **bezpätkové** (sans-serif) s čistejším vzhľadom. Pri sadzbe pracujeme s pojmami **kerning** (úprava medzier medzi konkrétnymi pármi znakov) a **tracking** (úprava medzier v celom texte). Pri navrhovaní textu je dôležitá **čitateľnosť** a jasná **hierarchia** informácií, aby sa čitateľ v obsahu rýchlo orientoval. Dobre zvládnutá typografia vytvára **vizuálnu harmóniu** a výrazne zlepšuje kvalitu komunikácie.",
    keywords: [
      {
        text: "písmo",
        explanation: "Písmo je súbor znakov s jednotným dizajnom. Definuje vzhľad textu a má významný vplyv na celkový dojem z dizajnu. Používa sa na vytvorenie osobitosti značky, zlepšenie čitateľnosti a dosiahnutie požadovaného emocionálneho účinku."
      },
      {
        text: "veľkosť",
        explanation: "Veľkosť písma je výška písma meraná v bodoch (points) alebo pixeloch. Ovplyvňuje čitateľnosť a hierarchiu textu. Používa sa na vytvorenie vizuálnej hierarchie (nadpisy vs. bežný text) a zabezpečenie čitateľnosti na rôznych zariadeniach."
      },
      {
        text: "rezy",
        displayName: "rezy",
        explanation: "Rezy sú varianty písma v rámci rovnakej rodiny (bold, italic, light). Používajú sa na zdôraznenie alebo vytvorenie vizuálnej hierarchie."
      },
      {
        text: "farba",
        explanation: "Farba je farebný tón aplikovaný na text. Ovplyvňuje čitateľnosť, náladu a kontrast s pozadím. Používa sa na vytvorenie kontrastu pre lepšiu čitateľnosť, zdôraznenie dôležitých prvkov a navodenie atmosféry."
      },
      {
        text: "pätkové",
        explanation: "Pätkové písmo je typ písma s malými ťahmi (pätkami) na koncoch znakov. Tradične sa používa v tlačených médiách, najmä pre dlhšie texty, keďže pätky vedú oko po riadku."
      },
      {
        text: "bezpätkové",
        explanation: "Bezpätkové písmo je typ písma bez pätiek. Pôsobí modernejšie a čistejšie, je vhodné pre digitálne médiá a nadpisy."
      },
      {
        text: "kerning",
        explanation: "Kerning je proces úpravy horizontálnych medzier medzi konkrétnymi pármi znakov. Cieľom je dosiahnuť vizuálne rovnomerné rozostupy. Používa sa najmä pri veľkých písmach (nadpisy) na dosiahnutie profesionálneho vzhľadu."
      },
      {
        text: "tracking",
        explanation: "Tracking je úprava medzier medzi všetkými znakmi v bloku textu. Používa sa na zlepšenie čitateľnosti alebo na dosiahnutie špecifického vizuálneho efektu."
      },
      {
        text: "čitateľnosť",
        explanation: "Čitateľnosť je miera ľahkosti čítania textu. Je ovplyvnená výberom písma, veľkosťou, farbou a rozostupmi. Je kľúčová pre webové stránky, články, knihy a všetky textovo náročné materiály."
      },
      {
        text: "hierarchiu",
        displayName: "hierarchia",
        explanation: "Hierarchia je usporiadanie textových prvkov podľa dôležitosti. Vytvára sa pomocou veľkosti, hrúbky, farby a umiestnenia. Používa sa na vedenie pozornosti čitateľa a zlepšenie skenovateľnosti obsahu."
      },
      {
        text: "vizuálnu harmóniu",
        displayName: "vizuálna harmónia",
        explanation: "Vizuálna harmónia je estetická rovnováha a súlad typografických prvkov. Vytvára príjemný a profesionálny dojem. Používa sa na vytvorenie konzistentného a príťažlivého dizajnu, ktorý buduje dôveru a zvyšuje zapamätateľnosť značky."
      }
    ],
    exercises: [
      {
        type: 'multiple-choice',
        question: 'Ktoré z nasledujúcich písem patria medzi pätkové (serif)?',
        options: ['Times New Roman', 'Arial', 'Georgia', 'Helvetica'],
        correctAnswer: [0, 2]
      },
      {
        type: 'choose-correct',
        question: '________ je proces úpravy horizontálnych medzier medzi konkrétnymi pármi znakov.',
        options: ['Kerning', 'Tracking'],
        correctAnswer: { 0: 'Kerning' }
      },
      {
        type: 'single-choice',
        question: 'Ktorý typ písma je všeobecne považovaný za vhodnejší pre dlhé texty v tlačených médiách?',
        options: [
          'Bezpätkové (sans-serif)',
          'Pätkové (serif)',
          'Skriptové (script)',
          'Dekoratívne (decorative)'
        ],
        correctAnswer: 1
      },
      {
        type: 'sort',
        question: 'Priraďte správne charakteristiky:',
        options: [
          'Pätkové písmo - Obsahuje malé ťahy na koncoch znakov',
          'Bezpätkové písmo - Neobsahuje pätky, pôsobí modernejšie',
          'Kerning - Úprava medzier medzi konkrétnymi pármi znakov',
          'Tracking - Úprava medzier v celom texte'
        ],
        correctAnswer: [
          'Pätkové písmo - Obsahuje malé ťahy na koncoch znakov',
          'Bezpätkové písmo - Neobsahuje pätky, pôsobí modernejšie',
          'Kerning - Úprava medzier medzi konkrétnymi pármi znakov',
          'Tracking - Úprava medzier v celom texte'
        ]
      },
      {
        type: 'true-false',
        question: 'Bezpätkové písmo (sans-serif) je vždy vhodnejšie pre webové stránky než pätkové (serif).',
        options: ['True', 'False'],
        correctAnswer: false
      }
    ],
    useTextExercise: true
  },

  {
    id: 9,
    title: "Základy kompozície vo fotografii",
    content: "Kompozícia vo fotografii je umenie premysleného usporiadania prvkov v zábere. Základným princípom je **pravidlo tretín**, ktoré delí obraz na deväť častí a odporúča umiestňovať dôležité prvky na priesečníky alebo pozdĺž línií. **Vedúce línie** prirodzene smerujú pohľad diváka k hlavnému objektu a **rámovanie** pomocou stromov, okien či dverí pomáha zvýrazniť subjekt. Významnú úlohu hrá aj **perspektíva**, ktorá ovplyvňuje vnímanie hĺbky a priestoru. **Symetria** a opakujúce sa **vzory** vytvárajú harmonický výsledok, zatiaľ čo zámerné **porušenie symetrie** dokáže pridať napätie a vizuálny záujem. Pri fotení sa zároveň snažíme o **izolovanie objektu** od rušivého pozadia pomocou hĺbky ostrosti, kontrastu a vhodných kompozičných postupov.",
    keywords: [
      {
        text: "Pravidlo tretín",
        explanation: "Pravidlo tretín je kompozičný princíp, ktorý rozdeľuje obraz na deväť rovnakých častí dvoma horizontálnymi a dvoma vertikálnymi čiarami. Kľúčové prvky by mali byť umiestnené na priesečníkoch týchto línií alebo pozdĺž nich."
      },
      {
        text: "Vedúce línie",
        displayName: "Vedúce línie",
        explanation: "Vedúce línie sú prirodzené alebo vytvorené línie v kompozícii, ktoré vedú pohľad diváka k hlavnému objektu. Môžu byť priame, zakrivené, konvergujúce alebo divergujúce."
      },
      {
        text: "Rámovanie",
        explanation: "Rámovanie je technika, pri ktorej sa využívajú prvky scény (stromy, dvere, okná) na vytvorenie prirodzeného rámu okolo hlavného objektu. Zvýrazňuje objekt a pridáva hĺbku."
      },
      {
        text: "Perspektíva",
        explanation: "Perspektíva je spôsob zobrazenia trojrozmerného priestoru na dvojrozmernej ploche. Ovplyvňuje vnímanie veľkosti, vzdialenosti a priestorových vzťahov."
      },
      {
        text: "Symetria",
        explanation: "Symetria je rovnováha a zrkadlenie prvkov v kompozícii. Vytvára pocit harmónie, stability a pokoja, zatiaľ čo jej narušenie môže pridať dynamiku a napätie."
      },
      {
        text: "vzory",
        displayName: "vzory",
        explanation: "Vzory sú opakujúce sa prvky v kompozícii. Vytvárajú vizuálny záujem a harmóniu. Používajú sa pri architektonickej, prírodnej alebo abstraktnej fotografii na vytvorenie zaujímavých a hypnotických kompozícií."
      },
      {
        text: "porušenie symetrie",
        explanation: "Porušenie symetrie je zámerné narušenie symetrického usporiadania. Vytvára napätie, dynamiku a záujem. Používa sa na pridanie vizuálneho prekvapenia a pritiahnutie pozornosti v inak symetrických scénach."
      },
      {
        text: "izolovanie objektu",
        explanation: "Izolovanie objektu je oddelenie hlavného objektu od pozadia pomocou hĺbky ostrosti, kontrastu alebo kompozície. Zvyšuje pozornosť na hlavný subjekt. Používa sa pri portrétoch, produktovej fotografii a všade, kde chcete jednoznačne vyzdvihnúť konkrétny prvok."
      }
    ],
    exercises: [
      {
        type: 'true-false',
        question: 'Pravidlo tretín odporúča umiestniť hlavný objekt presne do stredu fotografie.',
        options: ['True', 'False'],
        correctAnswer: false
      },
      {
        type: 'single-choice',
        question: 'Ktorý kompozičný prvok využíva objekty scény na vytvorenie prirodzeného ohraničenia hlavného subjektu?',
        options: ['Pravidlo tretín', 'Vedúce línie', 'Rámovanie', 'Symetria'],
        correctAnswer: 2
      },
      {
        type: 'multiple-choice',
        question: 'Ktoré z nasledujúcich prvkov môžu slúžiť ako vedúce línie vo fotografii?',
        options: ['Cesta', 'Rieka', 'Plot', 'Horizont'],
        correctAnswer: [0, 1, 2, 3]
      },
      {
        type: 'sort',
        question: 'Priraďte správne charakteristiky:',
        options: [
          'Pravidlo tretín - Rozdelenie obrazu na deväť častí',
          'Vedúce línie - Prvky vedúce pohľad k hlavnému objektu',
          'Rámovanie - Využitie prvkov scény na ohraničenie',
          'Perspektíva - Zobrazenie priestoru a hĺbky'
        ],
        correctAnswer: [
          'Pravidlo tretín - Rozdelenie obrazu na deväť častí',
          'Vedúce línie - Prvky vedúce pohľad k hlavnému objektu',
          'Rámovanie - Využitie prvkov scény na ohraničenie',
          'Perspektíva - Zobrazenie priestoru a hĺbky'
        ]
      },
      {
        type: 'choose-correct',
        question: '________ a vzory vytvárajú harmonický a príťažlivý obraz, zatiaľ čo jej porušenie môže vytvoriť napätie a záujem.',
        options: ['Symetria', 'Perspektíva'],
        correctAnswer: { 0: 'Symetria' }
      }
    ],
    useTextExercise: true
  },

  {
    id: 10,
    title: "Základy kompozície v grafickom dizajne",
    content: "Kompozícia v grafickom dizajne znamená vedomé usporiadanie vizuálnych prvkov do harmonického a funkčného celku. Medzi jej kľúčové princípy patria **rovnováha**, **kontrast**, **hierarchia**, **rytmus** a **jednota**, ktoré spolu určujú, ako bude dizajn pôsobiť a ako sa v ňom bude používateľ orientovať. Na udržanie poriadku a konzistencie sa často používa systém **mriežok**. Dôležitým konceptom je aj **zlatý rez** - matematický pomer približne 1:1,618, ktorý človek prirodzene vníma ako príjemný. Pri kompozícii myslíme aj na **negatívny priestor**, pretože prázdne miesta sú rovnako dôležité ako obsah a pomáhajú vytvoriť jasný **vizuálny tok**.",
    keywords: [
      {
        text: "rovnováha",
        explanation: "Rovnováha je rozloženie vizuálnej váhy prvkov v kompozícii. Môže byť symetrická (formálna) alebo asymetrická (neformálna). Používa sa na vytvorenie stabilného a príjemného dizajnu, ktorý nevyzerá naklonený ani nepríjemne vyvážený."
      },
      {
        text: "kontrast",
        explanation: "Kontrast je rozdiel medzi prvkami v kompozícii. Vytvára vizuálny záujem a pomáha zvýrazniť dôležité prvky. Používa sa na pritiahnutie pozornosti, vytvorenie dramatického efektu a zlepšenie čitateľnosti."
      },
      {
        text: "hierarchia",
        explanation: "Hierarchia je usporiadanie prvkov podľa dôležitosti. Určuje, v akom poradí bude divák vnímať informácie a na čo sa zameria najskôr. Používa sa na vedenie pozornosti diváka a zabezpečenie, že najdôležitejšie informácie sú prijaté ako prvé."
      },
      {
        text: "rytmus",
        explanation: "Rytmus je opakovanie alebo variácia prvkov vytvárajúca pocit pohybu a dynamiky v kompozícii. Používa sa na vytvorenie vizuálneho záujmu, pohybu a jednotnosti v dizajne."
      },
      {
        text: "jednota",
        explanation: "Jednota je koherencia a súlad všetkých prvkov v dizajne. Vytvára pocit úplnosti a profesionality. Používa sa na zabezpečenie, že všetky prvky dizajnu vyzerajú ako súčasť toho istého celku."
      },
      {
        text: "mriežky",
        displayName: "mriežky",
        explanation: "Mriežky sú systém horizontálnych a vertikálnych línií používaný na organizáciu obsahu. Poskytujú štruktúru a konzistenciu dizajnu. Používajú sa pri tvorbe webových stránok, časopisov, posterov a všetkých viacprvkových layoutov."
      },
      {
        text: "zlatý rez",
        explanation: "Zlatý rez je matematický pomer približne 1:1,618, ktorý sa v umení a dizajne považuje za esteticky príjemný. Často sa používa na určenie proporcií a umiestnenie kľúčových prvkov. Používa sa pri fotografii, layoutoch a architektonických návrhoch pre prirodzene príjemné proporcie."
      },
      {
        text: "Negatívny priestor",
        explanation: "Negatívny priestor sú prázdne alebo nevyplnené oblasti v kompozícii. Pomáha definovať a zvýrazniť hlavné prvky, zlepšuje čitateľnosť a vytvára vizuálnu rovnováhu. Používa sa na zlepšenie čitateľnosti, vytvorenie elegancie a niekedy aj na skryté vizuálne triky."
      },
      {
        text: "vizuálny tok",
        explanation: "Vizuálny tok je cesta, po ktorej oko pozorovateľa putuje po kompozícii. Môže byť riadený pomocou línií, farieb a usporiadania prvkov. Používa sa na navigáciu diváka cez dizajn a zabezpečenie, že najdôležitejšie informácie sú videné v správnom poradí."
      }
    ],
    exercises: [
      {
        type: 'true-false',
        question: 'Negatívny priestor v dizajne je škodlivý a mal by byť minimalizovaný.',
        options: ['True', 'False'],
        correctAnswer: false
      },
      {
        type: 'single-choice',
        question: 'Aký je približný matematický pomer zlatého rezu?',
        options: ['1:1', '1:1,414', '1:1,618', '1:2'],
        correctAnswer: 2
      },
      {
        type: 'multiple-choice',
        question: 'Ktoré z nasledujúcich princípov patria medzi základné princípy kompozície?',
        options: ['Rovnováha', 'Kontrast', 'Hierarchia', 'Gradient'],
        correctAnswer: [0, 1, 2]
      },
      {
        type: 'choose-correct',
        question: 'Dizajnéri využívajú ________ na organizáciu obsahu a vytvorenie vizuálneho poriadku.',
        options: ['mriežky', 'vrstvy'],
        correctAnswer: { 0: 'mriežky' }
      },
      {
        type: 'sort',
        question: 'Priraďte správne charakteristiky:',
        options: [
          'Rovnováha - Rozloženie vizuálnej váhy prvkov',
          'Hierarchia - Usporiadanie prvkov podľa dôležitosti',
          'Zlatý rez - Matematický pomer približne 1:1,618',
          'Negatívny priestor - Prázdne oblasti v kompozícii'
        ],
        correctAnswer: [
          'Rovnováha - Rozloženie vizuálnej váhy prvkov',
          'Hierarchia - Usporiadanie prvkov podľa dôležitosti',
          'Zlatý rez - Matematický pomer približne 1:1,618',
          'Negatívny priestor - Prázdne oblasti v kompozícii'
        ]
      }
    ],
    useTextExercise: true
  },

  {
    id: 11,
    title: "Základy farieb a farebnej teórie",
    content: "Farebná teória skúma, ako farby fungujú a ako na seba vzájomne pôsobia. Základom je **farebné koleso**, ktoré prehľadne ukazuje vzťahy medzi jednotlivými farbami. **Primárne farby** (červená, žltá a modrá) sú základné, pretože ich nemožno vytvoriť miešaním iných farieb, zatiaľ čo **sekundárne farby** vznikajú ich kombináciou. **Komplementárne farby** ležia oproti sebe a vytvárajú výrazný **kontrast**, ktorý priťahuje pozornosť. Naopak **analogické farby** sú vedľa seba a pôsobia harmonickejšie. Pri práci s farbou rozlišujeme tri základné vlastnosti: **odtieň** (samotná farba), **sýtosť** (intenzita a čistota) a **jas** (množstvo svetla alebo tmy v danej farbe).",
    keywords: [
      {
        text: "Farebné koleso",
        explanation: "Farebné koleso je kruhové usporiadanie farieb, ktoré zobrazuje vzťahy medzi primárnymi, sekundárnymi a terciárnymi farbami. Slúži ako nástroj pre výber farebných schém."
      },
      {
        text: "Primárne farby",
        displayName: "Primárne farby",
        explanation: "Primárne farby sú základné farby (červená, žltá, modrá v tradičnom modeli), ktoré sa nedajú vytvoriť zmiešaním iných farieb. Z nich možno odvodiť všetky ostatné farby."
      },
      {
        text: "Sekundárne farby",
        displayName: "Sekundárne farby",
        explanation: "Sekundárne farby sú farby vznikajúce zmiešaním dvoch primárnych farieb. Zahŕňajú oranžovú, zelenú a fialovú."
      },
      {
        text: "Komplementárne farby",
        displayName: "Komplementárne farby",
        explanation: "Komplementárne farby sú farby ležiace oproti sebe na farebnom kolese. Vytvárajú maximálny kontrast a vzájomne sa zvýrazňujú."
      },
      {
        text: "Analogické farby",
        displayName: "Analogické farby",
        explanation: "Analogické farby sú farby ležiace vedľa seba na farebnom kolese. Vytvárajú harmonický, príjemný efekt a často sa vyskytujú v prírode."
      },
      {
        text: "Odtieň",
        explanation: "Odtieň je samotná farba identifikovaná názvom (červená, modrá, zelená, žltá atď.). Predstavuje základnú vlastnosť farby, ktorá ju odlišuje od iných farieb na farebnom kolese. Odtieň určuje, či je farba teplá alebo studená."
      },
      {
        text: "sýtosť",
        explanation: "Sýtosť je intenzita a čistota farby. Určuje, ako živá alebo tlmená farba vyzerá. Vysoká sýtosť znamená čistú, žiarivú farbu, zatiaľ čo nízka sýtosť vytvára tlmené, šedivé tóny. Sýtosť je kľúčová pri vytváraní výrazných alebo jemných kompozícií."
      },
      {
        text: "kontrast",
        explanation: "Kontrast je rozdiel medzi svetlými a tmavými oblasťami v obraze alebo medzi farbami. Silný kontrast vytvára dramatický, výrazný efekt (napr. komplementárne farby), zatiaľ čo nízky kontrast vytvára jemný, harmonický dojem. Kontrast je základným nástrojom pre riadenie pozornosti a vytvorenie hĺbky."
      },
      {
        text: "jas",
        explanation: "Jas je množstvo svetla alebo tmy vo farbe (od tmavej po svetlú). Je to jedna z troch základných vlastností farby. Používa sa na vytvorenie kontrastu, hĺbky a pri úprave expozície fotografií alebo grafických prvkov."
      }
    ],
    exercises: [
      {
        type: 'sort',
        question: 'Priraďte správne farby:',
        options: [
          'Primárna farba - Červená',
          'Sekundárna farba - Zelená',
          'Komplementárna k červenej - Zelená',
          'Analogická k modrej - Azúrová'
        ],
        correctAnswer: [
          'Primárna farba - Červená',
          'Sekundárna farba - Zelená',
          'Komplementárna k červenej - Zelená',
          'Analogická k modrej - Azúrová'
        ]
      },
      {
        type: 'single-choice',
        question: 'Ktorá vlastnosť farby určuje jej intenzitu alebo čistotu?',
        options: ['Odtieň', 'Sýtosť', 'Jas', 'Kontrast'],
        correctAnswer: 1
      },
      {
        type: 'multiple-choice',
        question: 'Ktoré z nasledujúcich dvojíc sú komplementárne farby?',
        options: [
          'Červená a zelená',
          'Modrá a oranžová',
          'Žltá a fialová',
          'Červená a modrá'
        ],
        correctAnswer: [0, 1, 2]
      },
      {
        type: 'choose-correct',
        question: '________ farby ležia vedľa seba na farebnom kolese a vytvárajú harmonický efekt.',
        options: ['Analogické', 'Komplementárne'],
        correctAnswer: { 0: 'Analogické' }
      },
      {
        type: 'true-false',
        question: 'Sekundárne farby sa nedajú vytvoriť miešaním iných farieb.',
        options: ['True', 'False'],
        correctAnswer: false
      }
    ],
    useTextExercise: true
  },

  {
    id: 12,
    title: "Základy svetla a tieňa vo fotografii",
    content: "Svetlo a tieň patria medzi základné stavebné prvky fotografie. **Expozíciu** - teda množstvo svetla dopadajúceho na snímač - určujú tri parametre: **clona**, **čas uzávierky** a **citlivosť ISO**. **Tvrdé svetlo** vytvára ostré tiene a vysoký kontrast, zatiaľ čo **mäkké svetlo** prináša jemnejšie prechody a pokojnejší výsledok. Dôležitý je aj smer, z ktorého svetlo prichádza; svetlo spredu, zboku alebo zozadu mení charakter snímky aj vnímanie objemu. **Farebná teplota** meraná v kelvinoch výrazne ovplyvňuje atmosféru fotografie. Napokon, **dynamický rozsah** opisuje, ako dobre snímač zachytí detaily v najjasnejších aj najtmavších častiach scény.",
    keywords: [
      {
        text: "Expozíciu",
        displayName: "expozícia",
        explanation: "Expozícia je množstvo svetla, ktoré dopadá na snímač fotoaparátu. Správna expozícia je kľúčová pre dobre exponovanú fotografiu bez preexponovaných alebo podexponovaných oblastí."
      },
      {
        text: "clona",
        explanation: "Clona je mechanizmus v objektíve, ktorý reguluje množstvo prechádzajúceho svetla. Označuje sa číslom f (napr. f/2.8, f/8), pričom nižšie číslo znamená väčší otvor a viac svetla. Používa sa na ovládanie expozície a hĺbky ostrosti - širšia clona pre rozmazané pozadie (portréty), užšia pre ostrý celok (krajiny)."
      },
      {
        text: "čas uzávierky",
        explanation: "Čas uzávierky je doba, počas ktorej je snímač vystavený svetlu. Kratší čas 'zmrazí' pohyb, dlhší čas môže vytvoriť efekt rozmazania pohybu. Používa sa na zachytenie športových akcií (rýchly čas) alebo vytvorenie umeleckých efektov s pohybom (pomalý čas pre vodopády, hviezdy)."
      },
      {
        text: "citlivosť ISO",
        explanation: "Citlivosť ISO je parameter určujúci citlivosť snímača na svetlo. Vyššie ISO umožňuje fotografovať pri slabšom svetle, ale môže zvýšiť šum v obraze. Používa sa pri fotografovaní v interiéri, večernom/nočnom fotografovaní alebo kdekoľvek bez dostačujúceho svetla."
      },
      {
        text: "Tvrdé svetlo",
        explanation: "Tvrdé svetlo je priame, intenzívne svetlo vytvárajúce ostré tiene a vysoký kontrast. Často pochádza z jediného zdroja ako slnko alebo blesk. Používa sa na vytvorenie dramatických, výrazných fotografií alebo pri módnom a umeleckom fotografovaní."
      },
      {
        text: "mäkké svetlo",
        explanation: "Mäkké svetlo je difúzne svetlo produkujúce jemné prechody a nízky kontrast. Vytvára sa v zamračenom počasí alebo použitím difúzorov. Používa sa pri portrétnom fotografovaní pre lichotivý vzhľad pokožky a pri produktovom fotografovaní."
      },
      {
        text: "Smerové svetlo",
        explanation: "Smerové svetlo je svetlo dopadajúce z konkrétneho smeru (predné, bočné, zadné). Každý smer vytvára odlišný efekt a atmosféru. Používa sa na modelovanie tvárí a objektov, vytvorenie hĺbky a dramatického účinku vo fotografii."
      },
      {
        text: "Farebná teplota",
        explanation: "Farebná teplota je charakteristika svetla vyjadrená v kelvinoch. Nižšie hodnoty (3000K) predstavujú teplejšie, žltkasté svetlo, vyššie hodnoty (6500K) chladnejšie, modrasté svetlo. Používa sa na nastavenie vyváženia bielej farby pre prirodzené farby alebo na vytvorenie umeleckej atmosféry (teplý západ slnka vs. chladné ráno)."
      },
      {
        text: "Dynamický rozsah",
        explanation: "Dynamický rozsah je schopnosť snímača zachytiť detaily v svetlých aj tmavých oblastiach. Širší dynamický rozsah umožňuje zachovať viac detailov v tieňoch a svetlách. Používa sa pri HDR fotografii, krajinách s jasnou oblohou a temnými lesmi, alebo pri interiéroch s oknami."
      }
    ],
    exercises: [
      {
        type: 'sort',
        question: 'Priraďte správne charakteristiky:',
        categories: ['Clona f/2.8', 'Clona f/16', 'Krátky čas uzávierky', 'Dlhý čas uzávierky'],
        options: [
          'Väčší otvor, viac svetla, menšia hĺbka ostrosti',
          'Menší otvor, menej svetla, väčšia hĺbka ostrosti',
          '"Zmrazí" pohyb',
          'Môže vytvoriť efekt rozmazania pohybu'
        ],
        correctAnswer: [0, 1, 2, 3]
      },
      {
        type: 'single-choice',
        question: 'Ktorý parameter fotoaparátu ovplyvňuje množstvo šumu v obraze?',
        options: ['Clona', 'Čas uzávierky', 'Citlivosť ISO', 'Ohnisková vzdialenosť'],
        correctAnswer: 2
      },
      {
        type: 'multiple-choice',
        question: 'Ktoré tvrdenia o svetle vo fotografii sú pravdivé?',
        options: [
          'Tvrdé svetlo vytvára ostré tiene',
          'Mäkké svetlo produkuje jemné prechody',
          'Bočné svetlo zvýrazňuje textúru',
          'Predné svetlo vždy vytvára najlepší portrét'
        ],
        correctAnswer: [0, 1, 2]
      },
      {
        type: 'choose-correct',
        question: '________ svetla sa meria v kelvinoch a ovplyvňuje atmosféru snímky.',
        options: ['Farebná teplota', 'Intenzita'],
        correctAnswer: { 0: 'Farebná teplota' }
      },
      {
        type: 'true-false',
        question: 'Vyššie ISO hodnoty vždy vedú k lepšej kvalite fotografie.',
        options: ['True', 'False'],
        correctAnswer: false
      }
    ],
    useTextExercise: true
  }
];

export const beginnerFinalTest: Exercise[] = [
  {
    type: 'multiple-choice',
    question: 'Ktoré z nasledujúcich tvrdení o rastrovej grafike sú pravdivé?',
    options: [
      'Je založená na matematických vzorcoch',
      'Pri zväčšovaní stráca kvalitu',
      'Každý bod má svoju presnú pozíciu a farbu',
      'Je vhodná pre tlač vo veľkých formátoch'
    ],
    correctAnswer: [1, 2]
  },
  {
    type: 'true-false',
    question: 'Vektorová grafika si zachováva dokonalú kvalitu pri akomkoľvek zväčšení.',
    options: ['True', 'False'],
    correctAnswer: true
  },
  {
    type: 'single-choice',
    question: 'Ktorý farebný model sa primárne používa pre tlač?',
    options: ['RGB', 'CMYK', 'HSB', 'LAB'],
    correctAnswer: 1
  },
  {
    type: 'multiple-choice',
    question: 'Ktoré formáty podporujú priehľadnosť?',
    options: ['JPEG', 'PNG', 'GIF', 'BMP'],
    correctAnswer: [1, 2]
  },
  {
    type: 'choose-correct',
    question: '________ umožňujú skryť alebo zobraziť časti vrstvy bez trvalého vymazania dát.',
    options: ['Masky', 'Filtre'],
    correctAnswer: { 0: 'Masky' }
  },
  {
    type: 'single-choice',
    question: 'Ktorý nástroj v Illustrátore umožňuje vyberať a upravovať jednotlivé uzly vektorových ciest?',
    options: ['Selection Tool (V)', 'Direct Selection Tool (A)', 'Pen Tool (P)', 'Magic Wand Tool (Y)'],
    correctAnswer: 1
  },
  {
    type: 'choose-correct',
    question: '________ je proces úpravy horizontálnych medzier medzi konkrétnymi pármi znakov.',
    options: ['Kerning', 'Tracking'],
    correctAnswer: { 0: 'Kerning' }
  },
  {
    type: 'true-false',
    question: 'Pravidlo tretín odporúča umiestniť hlavný objekt presne do stredu fotografie.',
    options: ['True', 'False'],
    correctAnswer: false
  },
  {
    type: 'single-choice',
    question: 'Ktorý princíp kompozície sa týka rozloženia vizuálnej váhy prvkov?',
    options: ['Rytmus', 'Rovnováha', 'Jednota', 'Kontrast'],
    correctAnswer: 1
  },
  {
    type: 'sort',
    question: 'Priraďte správne typy farieb:',
    options: [
      'Primárne farby - Červená, žltá, modrá',
      'Sekundárne farby - Vznikajú miešaním primárnych',
      'Komplementárne farby - Protiľahlé strany farebného kolesa',
      'Analogické farby - Ležia vedľa seba na farebnom kolese'
    ],
    correctAnswer: [
      'Primárne farby - Červená, žltá, modrá',
      'Sekundárne farby - Vznikajú miešaním primárnych',
      'Komplementárne farby - Protiľahlé strany farebného kolesa',
      'Analogické farby - Ležia vedľa seba na farebnom kolese'
    ]
  }
];

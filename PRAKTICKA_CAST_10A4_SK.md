## 2	Praktická časť

### 2.1	Návrh grafických prvkov pre webovú aplikáciu v Adobe Illustrator

V tejto fáze praktickej práce sme sa zamerali na návrh vizuálnych prvkov pre webovú aplikáciu v programe Adobe Illustrator. Všetky prvky boli vytvorené pomocou vektorovej grafiky, ktorá umožňuje zachovať vysokú kvalitu zobrazenia na rôznych zariadeniach a rozlíšeniach obrazovky, a zároveň poskytuje flexibilitu pri úpravách. Navrhli sme hlavné navigačné prvky, doplnkové ilustrácie a ikonografiu.

Ako prvé sme navrhli ostrovčeky, ktoré predstavujú hlavné navigačné aj vizuálne prvky aplikácie. Každý ostrovček reprezentuje jednu tému alebo finálny test v rámci konkrétnej úrovne. Vizuál ostrovčekov je inšpirovaný mapou postupu z edukačnej aplikácie Duolingo.

Odomknutý ostrovček pre tému sme navrhli ako vizuálne označenie témy, ku ktorej má používateľ prístup, no ešte ju nezačal alebo nedokončil. Tento variant predstavuje základný stav ostrovčeka, ktorý je farebne prispôsobený úrovni náročnosti, v ktorej sa používateľ nachádza. Tým sme zabezpečili vizuálnu konzistentnosť a jednoduchšiu orientáciu v rámci jednotlivých úrovní aplikácie.

Odomknutý ostrovček pre finálny test sme vytvorili ako variant, ktorý reprezentuje dostupnosť záverečného testu danej úrovne. Ostrovček farebne nadväzuje na farebnosť úrovne, v ktorej sa používateľ aktuálne nachádza, čím je zachovaná vizuálna kontinuita. Zároveň je oproti témovému ostrovčeku odlíšený ikonou trofeje, aby bolo zrejmé, že ide o prvok uzatvárajúci úroveň a signalizujúci možnosť overenia získaných vedomostí.

Zamknutý ostrovček sme navrhli ako vizuálne označenie tém, ktoré ešte nie sú pre používateľa dostupné. Použili sme tlmené farebné odtiene a výrazný symbol zámku, čím sme jednoznačne vyjadrili neprístupnosť obsahu. Tento variant slúži na jasné rozlíšenie medzi dostupnými a nedostupnými témami bez potreby doplňujúcich textových informácií.

Ostrovček pre tému alebo finálny test dokončený s chybami sme vytvorili ako variant, ktorý zobrazuje stav, keď používateľ tému síce absolvoval, no počas riešenia cvičení urobil chyby. Tento variant sme vizuálne odlíšili od odomknutých ostrovčekov použitím zelených odtieňov, čím informuje o zvládnutí témy, avšak s chybami. Cieľom je motivovať používateľa k opätovnému prejdeniu témy a zlepšeniu výsledkov.

Ostrovček pre tému alebo finálny test dokončený bez chýb sme navrhli ako variant v zlatej farbe, ktorá symbolizuje úspech. Tento variant slúži ako vizuálna spätná väzba a podporuje pocit dosiahnutia „perfektného“ výsledku.

Vektorové obrázky pre domovskú stránku sme navrhli ako doplnkové grafické prvky, ktoré dotvárajú vizuálnu identitu jednotlivých úrovní. Každý obrázok bol tematicky navrhnutý a farebne prispôsobený úrovni náročnosti a slúžil na vizuálne zobrazenie charakteru danej úrovne.

Ikonu streaku sme vytvorili ako vizuálnu reprezentáciu pravidelnosti používania aplikácie. Tento prvok znázorňuje počet po sebe idúcich dní aktivity používateľa a podporuje budovanie návyku pravidelného učenia prostredníctvom motivačného vizuálneho prvku.

Pri návrhu komponentov sme navrhli aj podporné komponenty pre progress používateľa. Prvým je progress always-on pop-up na domovskej stránke, ktorý dynamicky zobrazuje progress používateľa v aktuálnej úrovni (XP, podmienky na odomknutie finálneho testu a stav sekcie). Druhým sú čiary okolo ostrovčekov, ktoré vizuálne znázorňujú, koľko cvičení používateľ vyriešil správne v danom ostrovčeku. Pri bežnej téme ide o rozsah 0 až 5 správnych odpovedí, pri finálnom teste o rozsah 0 až 10.

### 2.2	Návrh typov cvičení, tém a mechaník

V tejto fáze praktickej práce sme sa zamerali na návrh samotného vzdelávacieho obsahu webovej aplikácie. Cieľom bolo vytvoriť logicky usporiadaný obsah, ktorý umožní používateľovi postupné osvojovanie si vedomostí prostredníctvom interaktívnych cvičení. Pri návrhu sme sa inšpirovali typmi úloh používanými v edukačnej aplikácii Kahoot.

Ako prvé sme navrhli päť základných typov cvičení, pričom pri niektorých sme pripravili aj textové a obrázkové varianty: Multiple Choice, Single Choice, Sort, Choose the Correct Option a True/False.

Cvičenia typu Multiple Choice sme navrhli ako úlohy, v ktorých si používateľ vyberá jednu alebo viacero správnych odpovedí z ponúknutých možností.

Cvičenia typu Single Choice sme navrhli ako úlohy s práve jednou správnou odpoveďou.

Cvičenia typu Sort sme navrhli ako interaktívne úlohy, v ktorých používateľ triedi alebo usporadúva prvky do správneho poradia alebo kategórií.

Cvičenia typu Choose the Correct Option sme vytvorili ako úlohy, pri ktorých používateľ dopĺňa správne odpovede do viet alebo výrazov.

Cvičenia typu True/False sme navrhli ako rýchle overovacie úlohy, v ktorých používateľ rozhoduje o pravdivosti tvrdení určením, či ide o pravdu alebo lož.

Ďalším krokom bol návrh tematickej štruktúry obsahu aplikácie. Pre každú úroveň náročnosti sme vytvorili 12 tém, ktoré na seba logicky nadväzujú a umožňujú postupné zvyšovanie náročnosti učiva aj cvičení. Ku každej téme sme navrhli päť cvičení, ktoré kombinujú rôzne typy úloh. Tento prístup umožňuje používateľovi precvičiť si danú tému z viacerých uhlov a zvyšuje efektivitu učenia. Dokopy sme pre tematické ostrovčeky navrhli 36 tém a 180 cvičení rozdelených do troch úrovní náročnosti; finálne testy sú v aplikácii riešené samostatne.

Súčasťou návrhu obsahu bolo aj vyhľadanie vhodných obrázkov pre jednotlivé témy a cvičenia. Obrázky sme vyberali s dôrazom na ich pochopiteľnosť a tematickú relevantnosť.

Ako ďalšie sme navrhli mechaniku XP (Experience Points). XP body slúžia ako číselné vyjadrenie úspešnosti používateľa za správne vyriešené cvičenia, dokončené témy a absolvovanie finálnych testov. Prideľovanie XP sme navrhli tak, že za každé správne vyriešené cvičenie používateľ získa 5 XP, čo znamená, že za dokončenie celej témy bez chýb môže používateľ získať najviac 25 XP. Tento systém poskytuje používateľovi zrozumiteľnú spätnú väzbu o jeho výkone.

Mechanika levelov je priamo naviazaná na nazbierané XP body. Po dosiahnutí vopred definovaného počtu XP používateľ postúpi na vyšší level, ktorý reprezentuje jeho celkový pokrok v aplikácii. Vyššie levely zároveň sprístupňujú nové témy alebo odomknutie ďalšej obtiažnosti.

Súčasne s mechanikou XP a levelov sme navrhli aj mechaniku streaku, ktorá sleduje počet po sebe nasledujúcich dní, počas ktorých je používateľ aktívny v aplikácii. Streak sa zvýši raz za deň po dokončení ostrovčeka; ak používateľ vynechá kontinuitu (t. j. posledná aktivita nebola včera), pri ďalšej aktivite sa séria začína odznova. Tento mechanizmus zvyšuje pravdepodobnosť, že používateľ bude pokračovať v učení sa pravidelne.

### 2.3	Návrh používateľského rozhrania vo Figme

V tejto fáze praktickej práce sme sa zamerali na návrh používateľského rozhrania webovej aplikácie v programe Figma. Cieľom bolo navrhnúť prehľadné rozhranie, ktoré pokrýva domovskú stránku, návrhy vyskakovacích okien aj všetky varianty výsledkov po dokončení jednotlivých typov cvičení.

Ako prvé sme navrhli hlavnú domovskú stránku aplikácie. Stránka bola vizuálne navrhnutá tak, aby pripomínala mapu postupu s kľukatou cestičkou vytvorenou z ostrovčekov, podobne ako v edukačnej aplikácii Duolingo.

Následne sme navrhli podstránku zameranú na chyby používateľa, ktorá slúži na prehľadné zobrazenie chýb, ktoré používateľ urobil počas riešenia cvičení v jednotlivých témach. Prehľadnosť sme zabezpečili rozdelením stránky na sekcie, kde každá obsahuje názov témy a následne zoznam cvičení, v ktorých používateľ urobil chybu.

Ďalším krokom bol návrh profilových vyskakovacích okien. Vytvorili sme tri varianty, ktoré zodpovedajú rôznym stavom používateľa. Prvý variant je určený pre prihláseného používateľa a zobrazuje základné informácie o profile a dostupné akcie. Druhý variant sme navrhli ako prihlasovacie vyskakovacie okno, ktoré sa zobrazí pri prvej interakcii používateľa so stránkou. Tretí variant predstavuje registračné vyskakovacie okno určené pre nových používateľov. Pri všetkých variantoch sme dbali na jednotný vizuálny štýl a jednoduché ovládanie.

V ďalšej fáze sme sa zamerali na návrh stránky Learn Page, ktorá sa zobrazí po kliknutí na odomknutý ostrovček témy a predstavuje úvod do danej témy. Skladá sa z názvu témy, popisu s kľúčovými slovami a obrázka alebo obrázkov, ktoré slúžia ako príklady. Navrhli sme štyri varianty tejto stránky, ktoré sa líšia počtom obrázkov k téme, keďže niektoré témy potrebujú viac ukážok na pochopenie rozdielov alebo fungovania.

Súčasťou návrhu Learn stránky bol aj príklad vyskakovacieho okna, ktoré sa zobrazí po kliknutí na kľúčové slovo v texte. Toto okno slúži na doplnenie vysvetlenia alebo definície pojmu bez nutnosti opustenia aktuálnej stránky.

V závere tejto časti sme navrhli používateľské rozhranie pre všetky typy cvičení. Okrem základných stavov cvičení sme navrhli aj všetky možné varianty výsledkov, ktoré môžu nastať po dokončení cvičenia.

Na záver sme navrhli stránku Result Page, ktorá sa zobrazí po dokončení posledného cvičenia a slúži na zobrazenie celkového hodnotenia za všetkých päť cvičení v podobe grafu a zobrazenia počtu XP, ktoré používateľ za vypracovanie daných cvičení získal.

### 2.4	Tvorba frontendu

V tejto kapitole sa zameriavame na používateľskú časť aplikácie, teda na to, čo používateľ vidí a s čím priamo pracuje počas učenia. Frontend sme implementovali ako React aplikáciu v TypeScripte, pričom sme pri vývoji priebežne porovnávali výsledok s návrhom vo Figme. Cieľom nebolo iba „funkčné“ zobrazenie stránok, ale aj zachovanie vizuálnej konzistencie, logického toku obrazoviek a intuitívneho ovládania v každom kroku používateľa.

Pri implementácii sme kapitolu usporiadali podľa reálneho toku používateľa v aplikácii: vstup cez prihlásenie, orientácia na domovskej stránke, prechod učebným tokom ostrovčekov a následne podporné časti (chyby, profil, admin). Takéto poradie lepšie zodpovedá tomu, ako aplikácia funguje v praxi.

#### 2.4.1	Stránky Sign in a Register

Prihlasovacia a registračná stránka tvoria vstupnú bránu do aplikácie. Obe stránky používajú klientsku validáciu vstupov (povinné polia, formát e‑mailu, pravidlá pre heslo a meno) ešte pred odoslaním požiadavky na server.

Pri registrácii sa volá endpoint `auth/signup`; po úspechu je používateľ vyzvaný na prihlásenie. Pri prihlásení sa volá `auth/signin`, prijatý `accessToken` sa uloží do localStorage a aplikácia sa presmeruje na hlavnú trasu, kde sa následne overí session cez `auth/session`.

Pri neplatných údajoch alebo zlyhaní požiadavky aplikácia zobrazuje okamžité chybové hlásenia, takže používateľ dostane priamu spätnú väzbu bez nejasných stavov.

#### 2.4.2	Domovská stránka

Domovská stránka predstavuje hlavný orientačný bod celej aplikácie. Používateľ na nej vidí tri samostatné sekcie úrovní (beginner, intermediate, professional), mapu ostrovčekov pre každú úroveň a priebežné údaje v hlavičke (level, XP progres, streak). Každá úroveň obsahuje 12 tematických ostrovčekov a jeden finálny test.

Pri implementácii sme presne definovali pravidlá odomykania. Bežné ostrovčeky sa odomykajú postupne podľa dosiahnutého stavu predchádzajúcich tém. Finálny test sa neodomkne automaticky po otvorení úrovne, ale až po splnení dvoch podmienok: používateľ má v danej sekcii aspoň 300 XP a zároveň má dokončených všetkých 12 tém. Ak sú podmienky nesplnené, po kliknutí na zamknutý test aplikácia zobrazí vysvetlenie, čo ešte chýba.

Domovská stránka zároveň rieši orientáciu v dlhom obsahu. Pomocou Intersection Observer sa priebežne určuje aktuálne viditeľná sekcia, aby sa správne aktualizoval XP indikátor pre danú úroveň. Po prihlásení sa pre bežného používateľa vykoná automatické posunutie na prvú odomknutú úroveň, čo skracuje čas hľadania miesta, kde má pokračovať. Pri účte admin sa auto-scroll nevykonáva a všetky ostrovčeky sú dostupné okamžite.

#### 2.4.3	Obsah ostrovčekov

Po otvorení ostrovčeka sa používateľ pri bežnej téme dostane na Learn Page potom samotné cvičenia a nakoniec Result Page. Pri finálnom teste sa používateľ dostane priamo k cvičeniam a končí pri Result Page. Learn Page obsahuje názov témy, vysvetľujúci text, kľúčové slová a obrázky, ktoré slúžia ako vizuálna podpora výkladu.

Pri Learn Page sme riešili aj správanie rozloženia pri rôznych veľkostiach obrazovky, aby text zostal čitateľný a správne zarovnaný voči obrázkom. Pri kľúčových slovách sa po kliknutí zobrazujú vysvetľujúce vyskakovacie okná, takže používateľ nemusí opúšťať aktuálnu stránku.

V režime admin sa práve na Learn Page realizuje aj nahrávanie obrázkov. Admin môže nahrávať a meniť obrázky obsahu (content images) priamo pri kartách témy a rovnako aj obrázky ku kľúčovým slovám vo vyskakovacom okne. Podporené je aj nahrávanie pretiahnutím súboru na kľúčové slovo. Táto funkcionalita je dostupná iba pre prihláseného admina.

Implementácia toku obsahuje aj riadenie postupu používateľa. Pri bežnej téme je prvý slide obsahový a pre neadmin účty je na ňom 30-sekundový časovač pred povolením tlačidla Next. Pri prechode medzi cvičeniami sa zobrazuje informačný popup s typom úlohy, po dokončení sa vypočíta počet správnych odpovedí, uložia sa chyby a zobrazí sa Result Page s možnosťou prejsť nesprávne odpovede v režime review.

#### 2.4.4	Podstránka Mistakes

Podstránka Mistakes slúži na zobrazenie chýb, ktoré používateľ urobil pri riešení cvičení. Dáta sa po načítaní session synchronizujú z backendu do lokálneho úložiska a stránka pracuje s chybami zoskupenými podľa témy. Pri prepnutí na kartu Mistakes sa zobrazenie cielene obnoví, aby používateľ videl aktuálny stav.

V hlavnom zozname sa zobrazujú tematické karty a v nich konkrétne chybné úlohy. Každá položka obsahuje typ cvičenia a otázku, takže používateľ vie rýchlo identifikovať problém. Po kliknutí sa otvorí detail chyby, kde je zobrazená pôvodná otázka, odpoveď používateľa a správna odpoveď; spôsob zobrazenia sa prispôsobuje typu úlohy (výberové úlohy, triedenie, priraďovanie).

Stránka rieši aj oba prázdne stavy. Ak používateľ zatiaľ žiadne chyby neurobil, zobrazí sa motivačné hlásenie „No Mistakes Yet“. Ak chyby v minulosti mal, ale všetky už opravil, zobrazí sa osobitný stav „You Fixed All Your Mistakes“. Takéto rozlíšenie lepšie odzrkadľuje reálny pokrok používateľa než jednoduché „prázdne dáta“.

#### 2.4.5	Profilové vyskakovacie okno

Profilové vyskakovacie okno zobrazuje základné používateľské informácie (profilová fotografia, meno, e‑mail) a samostatný blok s náhodne vybraným tipom. Tip sa vyberá pri otvorení komponentu z vopred definovaného zoznamu.

Úprava profilu je riešená priamo v tomto okne. Používateľ môže meniť meno, e‑mail, heslo aj profilovú fotografiu bez prechodu na inú stránku. Pri zmene hesla aplikácia vyžaduje zadanie aktuálneho hesla; pri zmene e‑mailu server kontroluje, či adresa už nie je obsadená.

Nahratie profilovej fotografie je limitované na podporované formáty obrázkov a veľkosť 5 MB. Obrázok sa konvertuje na Base64 a ukladá sa ako súčasť profilových dát cez profilové API.

#### 2.4.6	Podstránka Admin

Podstránka Admin je určená výhradne používateľovi s rolou admin. Admin na tejto stránke vidí zoznam všetkých používateľov vrátane základných údajov (e‑mail, meno, level, XP, streak, dátum registrácie) a môže vykonávať administrátorské operácie.

Medzi hlavné operácie patrí zmena roly používateľa (user/admin), reset používateľských dát a vymazanie používateľa. Pri resetovaní sa obnoví progres, ostrovčeky, streak a súvisiace údaje; pri vymazaní sa odstránia všetky údaje naviazané na konkrétneho používateľa.


### 2.5	Tvorba backendu

Backend je implementovaný pomocou Supabase Edge Functions v prostredí Deno s frameworkom Hono. Táto časť zabezpečuje autentifikáciu, správu dát, administrátorské operácie a prácu so súbormi. Pri návrhu backendu sme sa zamerali na jednoduchosť, prehľadnosť a spoľahlivé prepojenie s frontendovou časťou aplikácie.

#### 2.5.1	Mechaniky využité v aplikácii

Na backendovej strane sme implementovali mechaniky, ktoré sú potrebné pre každodenné fungovanie aplikácie: autentifikáciu, správu session, ukladanie progresu, ostrovčekov, streaku, cvičení a chýb. Súčasťou backendu sú aj administrátorské mechaniky pre správu používateľov (zoznam používateľov, zmena roly, reset dát, vymazanie používateľa).

Mechaniky pre nahrávanie obrázkov sú dostupné cez admin API endpointy, ale v používateľskom rozhraní sa využívajú najmä priamo v Learn Page (content image a keyword image). Backend po nahratí uloží metadata a odkazy tak, aby frontend vedel načítať správny obrázok pre konkrétnu úroveň, tému a index.

#### 2.5.2	Návrh databázy

Pre potreby aplikácie sme zvolili model kľúč‑hodnota. Dáta sú uložené v jednej tabuľke a organizačne rozdelené pomocou prefixov v kľúčoch. Tento prístup bol vhodný najmä pre rýchlu implementáciu a jednoduchú správu používateľských dát bez potreby zložitej databázovej schémy.

Výhodou zvoleného modelu je jednoduché rozšírenie. Pri potrebe nového typu údajov stačí definovať nový prefix a pravidlá jeho spracovania, bez zásahu do štruktúry existujúcich dát.

#### 2.5.3	Prefixy ako „kolekcie“

Jednotlivé typy dát používajú vlastné prefixy, napríklad `user:`, `session:`, `profile:`, `progress:`, `islands:`, `exercise-data:`, `streak:`, `mistakes:` a `admin:`. Pre obrázky sa ukladajú metadáta pod kľúčmi `island-image:`, `content-image:` a `keyword-image:`.

Tento spôsob organizácie sa osvedčil aj pri administrátorských operáciách, keďže je možné rýchlo získať prehľad o konkrétnom type údajov a vykonať hromadné operácie bez zložitého filtrovania.

#### 2.5.4	Ukladanie súborov (Supabase Storage)

Obrázky sa ukladajú do Supabase Storage bucketu `arcadelearn-island-images`. Pri nahrávaní backend vytvorí jedinečný názov súboru, uloží súbor do bucketu, vygeneruje signed URL a do KV vrstvy uloží metadáta (URL, názov súboru, čas nahratia, autor nahratia).

Validácia prebieha na viacerých úrovniach: vo frontendovej časti (najmä pri content/keyword obrázkoch a profilovej fotografii) sa kontroluje, že ide o obrázok a že súbor nepresahuje 5 MB, pričom pri `content-image` backend navyše explicitne kontroluje povolené MIME typy. Veľkosť súboru je zároveň obmedzená nastavením bucketu na 5 MB.

Takýto postup zjednodušuje údržbu aplikácie, keďže multimédiá sú spravované samostatne a frontend pracuje iba s odkazmi a metadátami potrebnými na zobrazenie.

---

### 2.6	Prepojenie backendu s frontendom

Prepojenie je realizované cez jednotnú API vrstvu. Frontend posiela požiadavky na backendové koncové body a spracúva odpovede v jednotnom formáte. Tento prístup zjednodušuje ošetrenie chýb, prenos session tokenu aj opakované používanie volaní v rôznych častiach aplikácie.

V praxi to znamená, že komponenty používateľského rozhrania neriešia technické detaily komunikácie. Každý komponent iba vyžiada požadované údaje a API vrstva zabezpečí správne hlavičky, prenos `X-Session-Token`, časový limit 15 sekúnd a opakované pokusy pri dočasnom zlyhaní siete.

---

### 2.7	Nasadenie na web

Nasadenie je v projekte rozdelené na dve časti: frontend a backend. Frontend je pripravený na produkčné zostavenie pomocou Vite (`npm run build`), backend beží ako Supabase Edge Function (`arcade-server`).

Pre cloudové nasadenie je v dokumentácii uvedený postup cez Cloudflare Pages pre frontend, pričom backend zostáva hostovaný v prostredí Supabase. Takto ostáva oddelená prezentácia aplikácie od API a dátovej vrstvy.

---

### 2.8	Záver

V implementačnej časti sme sa zamerali na najdôležitejšie kroky potrebné pre vznik funkčnej webovej aplikácie: tvorbu frontendu, tvorbu backendu, prepojenie oboch častí a nasadenie na web. Výsledkom je stabilná aplikácia, ktorá zachováva navrhnutý vzhľad, podporuje vzdelávací tok používateľa a umožňuje ďalšie rozširovanie.

Najväčším prínosom implementácie je prepojenie vizuálne prepracovaného rozhrania s funkčným technickým základom. Aplikácia tak spĺňa nielen estetické požiadavky návrhu, ale aj praktické požiadavky na správu obsahu, spoľahlivé ukladanie dát a použiteľnosť pri každodennom učení.

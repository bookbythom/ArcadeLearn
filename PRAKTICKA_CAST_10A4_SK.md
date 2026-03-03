# Praktická časť – tvorba aplikácie ArcadeLearn

## 1. Cieľ praktickej časti

Cieľom praktickej časti bolo navrhnúť a implementovať webovú aplikáciu ArcadeLearn, ktorá kombinuje vzdelávanie s princípmi gamifikácie. Aplikácia mala používateľa viesť cez tematické ostrovy, motivovať ho k pravidelnému učeniu, vyhodnocovať jeho odpovede, ukladať pokrok a poskytovať spätnú väzbu vo forme bodov skúseností, streaku a prehľadu chýb.

Pri tvorbe aplikácie som sa sústredil na tri základné piliere:

- zrozumiteľný používateľský tok od registrácie po dokončenie tém,
- stabilný technický základ s oddelením frontendovej a backendovej logiky,
- praktickú udržateľnosť riešenia, aby bol projekt ďalej rozšíriteľný.

Aplikáciu som vyvíjal ako plnohodnotný projekt so samostatným používateľským rozhraním, API vrstvou, perzistentným ukladaním dát a administrátorskými funkciami. Výsledkom je funkčné riešenie, ktoré nie je iba statickou ukážkou, ale reálne použiteľnou aplikáciou so stavom používateľa, históriou pokroku a dynamickým obsahom.

---

## 2. Analýza požiadaviek a návrh riešenia

Na začiatku som si definoval funkčné požiadavky:

1. Používateľ sa musí vedieť registrovať, prihlásiť a odhlásiť.
2. Po prihlásení musí vidieť svoje meno, profil, XP a streak.
3. Obsah musí byť rozdelený do troch úrovní náročnosti: beginner, intermediate, professional.
4. Každá úroveň má viacero ostrovov (tém), ktoré sa odomykajú postupne.
5. Každý ostrov obsahuje vzdelávací obsah a sadu cvičení.
6. Odpovede sa musia vyhodnocovať, ukladať a premietnuť do pokroku.
7. Chybné odpovede sa majú ukladať do sekcie mistakes.
8. Musí existovať admin režim na správu používateľov a obrázkov.

Z nefunkčných požiadaviek boli najdôležitejšie:

- rýchle načítanie stránok,
- stabilita pri výpadkoch siete,
- jednoduché nasadenie bez platených služieb,
- čitateľný a maintainovateľný kód.

Na základe toho som navrhol architektúru s oddelenými vrstvami:

- prezentačná vrstva v Reacte,
- doménová logika v utility moduloch,
- API klient ako samostatná vrstva,
- backend endpointy v Supabase Edge Function,
- perzistencia stavu v key-value úložisku.

Takéto rozdelenie mi umožnilo meniť logiku bez zásahov do UI komponentov a zároveň testovať jednotlivé časti samostatne.

---

## 3. Výber technológií a dôvod výberu

Frontend som postavil na React + TypeScript + Vite.

React som zvolil kvôli komponentovej architektúre, ktorá je vhodná pre aplikáciu s viacerými obrazovkami a opakovane použitými prvkami (hlavička, modály, cvičenia, ostrovy). TypeScript som použil na zníženie chýb pri práci so stavom a dátovými štruktúrami. Vite som zvolil kvôli rýchlemu development serveru a jednoduchému build procesu.

Pre backend som použil Supabase Edge Function, kde je implementovaná REST API vrstva. Výhodou je, že aplikácia má:

- jednoduchú autentifikačnú logiku,
- perzistentné úložisko,
- možnosť nahrávania obrázkov,
- jednoduché nasadenie na cloud bez zložitej infraštruktúry.

Pre hosting som použil Cloudflare Pages, čo umožnilo bezplatné publikovanie frontendovej časti s jednoduchým napojením na GitHub.

Výsledný stack je praktický pre školský projekt, ale zároveň dostatočne robustný na reálne používanie.

---

## 4. Implementácia frontendovej časti

### 4.1 Hlavný shell aplikácie

Jadrom frontendovej časti je hlavný App komponent, ktorý riadi:

- autentifikačný stav,
- načítanie používateľských dát,
- prepínanie tabov,
- otvorenie LearnPage,
- otvorenie profile modalu,
- routing pre signin, register, home, mistakes a admin.

Po spustení aplikácie prebehne kontrola session tokenu. Ak token neexistuje alebo je neplatný, používateľ je presmerovaný na prihlasovaciu obrazovku. Pri platnom tokene sa načítajú profil, progress, islands, exercise dáta, streak a mistakes.

Dôležitá bola aj optimalizácia načítania. Stránky ako HomePage, LearnPage alebo ProfilePopup sa načítavajú lazy spôsobom. Po prihlásení sa najpoužívanejšie časti prefetchnú počas idle času, aby pôsobila aplikácia plynulo.

### 4.2 Header, footer a navigácia

V hlavičke sa zobrazuje aktívna sekcia, XP progress a streak. Navigácia funguje cez routing a zmenu interného stavu tak, aby používateľ vedel rýchlo prejsť medzi home, mistakes a admin panelom.

Footer dopĺňa vizuálnu konzistenciu. Pri otvorenom LearnPage sa mení layout tak, aby mal používateľ maximum priestoru na obsah a cvičenia.

### 4.3 Profile popup

Profilový popup rieši:

- zmenu mena,
- zmenu emailu,
- zmenu hesla,
- zmenu profilovej fotky,
- odhlásenie.

Pri editácii sa robí validácia vstupov (meno, email, heslo). Pri chybe sa zobrazí konkrétna správa. Pri úspechu sa údaje uložia na backend a zároveň sa aktualizuje lokálny stav aplikácie.

V rámci UX úprav som zjednotil edit akcie tak, aby boli vizuálne konzistentné a jasné. Edit ovládanie je postavené na jednoznačnej ikone, ktorá je použitá vo všetkých relevantných častiach profilu.

---

## 5. Learn flow a cvičenia

Najdôležitejšia časť celej aplikácie je obrazovka LearnPage, kde prebieha reálne učenie.

### 5.1 Štruktúra jednej témy

Každá téma obsahuje:

- obsahový slide (teória),
- sadu cvičení.

Pri bežnej téme sa najskôr zobrazuje teória s časovačom. Až po uplynutí času môže používateľ pokračovať. Pri final teste obsahový slide nie je, používateľ ide priamo na cvičenia.

### 5.2 Typy cvičení

Aplikácia podporuje viacero typov:

- true/false,
- choose-correct,
- sort,
- single-choice,
- multiple-choice.

Každý typ má vlastný komponent, ale LearnPage ich vykresľuje cez centralizovaný renderer. Tým sa odstránilo duplicité prepínanie logiky v hlavnom komponente a každý typ cvičenia má jasne oddelenú zodpovednosť.

### 5.3 Stav cvičení

Pre každý slide sa udržiava stav:

- zvolená odpoveď,
- informácia, či bolo odoslané,
- výsledok správne/nesprávne.

Po dokončení všetkých cvičení sa vypočíta výsledok a zobrazí sa výsledková obrazovka.

### 5.4 Review mode

Ak má používateľ chyby, môže prejsť režimom opravy, kde sa znovu prechádzajú iba nesprávne odpovede. Tento režim je dôležitý pedagogicky, pretože vedie k okamžitej korekcii chýb, nie iba k pasívnemu zobrazeniu skóre.

---

## 6. Gamifikácia: XP, levely, ostrovy a streak

Gamifikácia je implementovaná tak, aby motivovala, ale zároveň ostala férová.

### 6.1 XP model

Za správnu odpoveď sa prideľuje 5 XP. XP sa počítajú per ostrov a ukladajú sa do celkového aj sekciového progressu.

Úroveň používateľa rastie po 100 XP. Tento model je jednoduchý a pre používateľa transparentný.

### 6.2 Odomykanie ostrovov

Po dokončení ostrova sa:

- aktualizuje status ostrova,
- odomkne sa nasledujúci ostrov,
- prípadne sa po splnení podmienok odomkne final test.

Final test sa odomkne až keď má používateľ dostatok section XP a dokončené všetky predchádzajúce ostrovy v danej úrovni.

### 6.3 Streak

Streak sleduje po sebe idúce dni aktivity. Pri dokončení ostrova sa streak incrementuje. Ak používateľ vynechá príliš dlhý interval, streak sa resetuje. Tento mechanizmus zvyšuje pravidelnosť používania.

---

## 7. Mistakes systém a spätná väzba

Mistakes systém je navrhnutý ako praktický nástroj na opakovanie.

### 7.1 Ukladanie chýb

Po dokončení témy sa zozbierajú nesprávne odpovede a uložia sa pod konkrétnu tému a úroveň.

Používa sa kombinácia:

- localStorage (rýchly lokálny fallback),
- backend synchronizácia (perzistencia medzi zariadeniami).

### 7.2 Čistenie a validácia dát

Pri načítaní mistakes sa validuje formát dát a odfiltrujú sa neplatné alebo zastarané položky. Tým sa predchádza pádom UI pri poškodených alebo starých dátach.

### 7.3 Pedagogická hodnota

Používateľ vidí, v ktorých témach robí chyby najčastejšie. Tento model zlepšuje cielené opakovanie a zvyšuje šancu, že sa chyba už nezopakuje.

---

## 8. Backend implementácia a API logika

Backend je postavený ako sada endpointov v jednej edge funkcii.

### 8.1 Autentifikácia

Signup vytvorí používateľa, inicializuje profil, progress, islands a streak. Signin overí heslo a vráti session token. Session endpoint overuje token a signout token zneplatní.

### 8.2 Profil

Profil endpointy umožňujú načítanie a update profilu, plus priamu zmenu emailu a hesla. Pri zmene emailu sa aktualizujú súvisiace záznamy, aby ostal systém konzistentný.

### 8.3 Progress a islands

Progress endpointy pracujú s XP a levelom. Islands endpointy ukladajú stav každého ostrova. Exercise-data endpoint drží doplnkové výsledky cvičení (napr. počet správnych odpovedí).

### 8.4 Streak a mistakes

Streak endpoint rieši dennú logiku aktivity. Mistakes endpointy poskytujú CRUD operácie pre chyby používateľa.

### 8.5 Admin operácie

Admin časť umožňuje overiť admin status, získať používateľov, meniť admin práva, resetovať používateľské dáta a mazať používateľov. Všetky citlivé endpointy prechádzajú autorizáciou a admin kontrolou.

### 8.6 Obrázky a storage

Aplikácia používa upload obrázkov pre ostrovy, obsah a keywords. Pri štarte backendu sa kontroluje existujúci storage bucket. Ak neexistuje, backend ho vytvorí. Súbory sa ukladajú s metadátami a vracajú sa signed URL adresy.

---

## 9. Kvalita, čistenie kódu a refaktoring

Počas tvorby som robil viacero refaktorov zameraných na kvalitu:

- odstránenie nepoužívaných súborov a assetov,
- zjednotenie namingu a štruktúry komponentov,
- prečistenie generated-like častí,
- zníženie duplicity v routing a render logike,
- stabilizácia warningov v Deno súboroch tak, aby nezahlcovali editor.

Dôležitý výsledok je, že projekt sa dá dlhodobo udržiavať. Kód je čitateľný, funkcie majú jasné zodpovednosti a väčšina komplexnej logiky je centralizovaná v helper moduloch.

---

## 10. Testovanie a overenie funkčnosti

Každá významnejšia úprava bola overená minimálne cez:

- TypeScript kontrolu,
- produkčný build.

Okrem toho prebiehalo manuálne testovanie hlavných flowov:

- registrácia/prihlásenie/odhlásenie,
- prechod cez ostrovy,
- výpočet výsledkov,
- zmena profilu,
- mistakes sekcia,
- admin operácie.

Takéto kombinované testovanie bolo dôležité, pretože časť logiky je stavová a behaviorálna, čo sa najlepšie overuje aj reálnym preklikom.

---

## 11. Nasadenie

Projekt je napojený na GitHub a nasadzovaný na Cloudflare Pages. Po pushi na hlavnú vetvu je nová verzia dostupná online.

Táto pipeline bola zvolená kvôli jednoduchosti, bezplatnosti a spoľahlivosti. Umožňuje rýchly feedback loop: úprava → build → push → online kontrola.

---

## 12. Čo považujem za hlavný prínos projektu

Za najväčší prínos považujem to, že aplikácia neslúži iba na prezentáciu technológií, ale rieši reálny edukatívny scenár:

- používateľ sa učí cez obsah,
- hneď si vedomosti testuje,
- dostáva motivačnú spätnú väzbu,
- vie sa vracať k chybám,
- a dlhodobo sleduje svoj progres.

Technicky projekt prepája frontend, backend, perzistenciu, autentifikáciu a administračné nástroje do jedného funkčného celku.

---

## 13. Limity a možné rozšírenia

Aj keď je aplikácia funkčná, existujú smery ďalšieho rozvoja:

- detailnejšie analytiky učenia (úspešnosť podľa typu otázok),
- jemnejší anti-cheat model pre rýchle klikanie,
- export pokroku,
- rozsiahlejšie automatizované testy,
- personalizované odporúčanie tém podľa chýb.

Tieto rozšírenia by zvýšili hodnotu produktu, no pre rozsah maturitnej práce bolo prioritou doručiť stabilné jadro funkcií.

---

## 14. Záver praktickej časti

V praktickej časti sa podarilo navrhnúť a implementovať plnohodnotnú vzdelávaciu aplikáciu s gamifikáciou, používateľskými účtami, ukladaním pokroku, správou chýb a admin nástrojmi.

Projekt spĺňa pôvodné funkčné ciele, má čistú architektúru a je pripravený na ďalší rozvoj. Z pohľadu vývoja bol najväčší dôraz kladený na pochopiteľnú logiku, stabilitu flowu, konzistentné UI správanie a udržateľnosť kódu.

Týmto bola praktická časť úspešne naplnená: vznikol konkrétny, nasadený a overený softvérový produkt, ktorý demonštruje schopnosť samostatne vytvoriť modernú webovú aplikáciu od návrhu až po produkčné nasadenie.

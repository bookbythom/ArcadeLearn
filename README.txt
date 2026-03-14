Návod na lokálne spustenie webovej aplikácie

1) Nainštalovanie Node.js (ak ešte nie je nainštalovaný)
- Otvorte https://nodejs.org
- Stiahnite verziu LTS (napr. "Node.js 20 LTS")
- Spustite inštalátor a dokončite inštaláciu

2) Nainštalovanie npm (ak ešte nie je nainštalované)
- npm sa štandardne nainštaluje spolu s Node.js
- Ak príkaz npm nefunguje, preinštalujte Node.js LTS z https://nodejs.org

3) Overenie inštalácie Node.js a npm (CMD/PowerShell/Terminal)
	node -v
	npm -v
- Ak oba príkazy vypíšu verziu, inštalácia je v poriadku (napr. node -v -> v20.11.1, npm -v -> 10.2.4)

4) Otvorenie projektového priečinka v termináli
- Prejdite do priečinka ArcadeLearn (tam, kde je súbor package.json)
Napr.:
- (Windows): cd C:\Users\Meno\Desktop\ArcadeLearn
- (macOS): cd /Users/meno/Desktop/ArcadeLearn

5) Nainštalovanie závislostí projektu: npm install
- po spustení sa vypíše "added ... packages" a vytvorí sa priečinok node_modules

6) Spustenie aplikácie: npm run dev
- Príklad výstupu:
	VITE v6.x.x  ready in  xxx ms
	➜  Local:   http://localhost:5173/
	➜  Network: use --host to expose

7) Otvorenie aplikácie v prehliadači: http://localhost:5173
- cislo za "localhost:" môże byť iné, preto treba použit to čo sa vypíše vo výstupe za "Local:"

8) Prihlásenie:
    Admin účet:
    - email: admin@gmail.com
    - heslo: Admin123

    Bežný účet:
    - email: user@gmail.com
    - heslo: User12345
    
    (je možné aj vytvorenie nového konta cez Register stránku a následne sa doň prihláste cez Sign in stránku)






Návod na spustenie a prihlásenie sa webovej aplikácie online

1) Do prehliadača zadajte: https://arcadelearn.pages.dev

2) Na stránke Sign in použite tieto prihlasovacie údaje:
    Admin účet:
    - email: admin@gmail.com
    - heslo: Admin123

    Bežný účet:
    - email: user@gmail.com
    - heslo: User12345
   
    (je možné aj vytvorenie nového konta cez Register stránku a následne sa doň prihláste cez Sign in stránku)
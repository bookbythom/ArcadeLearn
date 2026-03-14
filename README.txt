Návod na lokálne spustenie webovej aplikácie

1) Nainštalovanie Node.js (ak ešte nie je nainštalovaný)
- Windows:
    - Otvorte https://nodejs.org
    - Kliknite na tlačidlo Get Node.js®
    - Stiahnite verziu pre Windows kliknutim na tlačidlo Windows Installer (.msi)
    - Spustite inštalátor a dokončite inštaláciu

- macOS:
    - Otvorte https://nodejs.org
    - Kliknite na tlačidlo Get Node.js®
    - Stiahnite verziu pre macOS kliknutim na tlačidlo macOS Installer (.pkg)
    - Spustite inštalátor a dokončite inštaláciu

2) Overenie inštalácie Node.js a npm (CMD/PowerShell/Terminal):
	node -v
	npm -v
- Ak oba príkazy vypíšu verziu, inštalácia je v poriadku (napr. node -v -> v20.11.1, npm -v -> 10.2.4)

3) Otvorenie projektového priečinka v PowerShell / Termináli
- Prejdite do priečinka ArcadeLearn (tam, kde je súbor package.json)
Napr.:
- (Windows): cd C:\Users\Meno\Desktop\ArcadeLearn
- (macOS): cd /Users/meno/Desktop/ArcadeLearn

4) Nainštalovanie závislostí projektu: npm install
- po spustení sa vypíše "added ... packages" a vytvorí sa priečinok node_modules

5) Spustenie aplikácie: npm run dev
    - Príklad výstupu:
                        VITE v6.x.x  ready in  xxx ms
                        ➜  Local:   http://localhost:5173/
                        ➜  Network: use --host to expose

6) Otvorenie aplikácie v prehliadači: http://localhost:5173
- cislo za "localhost:" môże byť iné, preto treba použit to čo sa vypíše vo výstupe za "Local:"

7) Prihlásenie:
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



Link s návrhom front-endu vo Figme: https://www.figma.com/design/p7BgsrZkERbMNdkynXGNRo/knoll_Maturita_ArcadeLearn?node-id=0-1&t=ln9p3dQ2UyJJljBv-1
Príloha 1 - Súbory nahraté na lokálne úložisko

Príloha obsahuje súbory aplikácie, ktoré tvoria jej štruktúru a sú potrebné na jej spustenie. Nahraté súbory:

Webové práce - HTML/CSS/JavaScript/TypeScript skripty, komponenty používateľského rozhrania, externé písma, fotky a obrázky použité na stránke, export databázy a konfiguračné súbory projektu

index.html - vstupný HTML súbor aplikácie
package.json - zoznam závislostí a skriptov projektu
tsconfig.json, vite.config.ts, postcss.config.mjs - konfiguračné súbory projektu
src/main.tsx a src/app/App.tsx - vstupný bod a koreňový komponent frontendovej časti
src/app/components - komponenty používateľského rozhrania (stránky, rozloženie, ostrovčeky, profil, administrácia, zdieľané prvky)
src/app/data - dátové súbory tém, poučiek, kľúčových pojmov a cvičení pre úrovne beginner, intermediate a professional
src/app/utils - pomocná logika aplikácie (API komunikácia, progres, chyby, validácie, synchronizácia údajov)
src/imports - mapy importov SVG súborov a grafických zdrojov pre ostrovčeky, stavy ostrovčekov, testy a ilustrácie
src/styles - globálne štýly a téma aplikácie
supabase/info.tsx - konfiguračné údaje Supabase pre frontend
supabase/functions/arcade-server/index.ts - hlavná backendová edge funkcia (autentifikácia, profil, progres, chyby, administrácia, obrázky)
supabase/functions/arcade-server/kv_store.tsx - vrstva kľúč-hodnota pre ukladanie a čítanie údajov
supabase/functions/arcade-server/deno.json - konfigurácia runtime prostredia backendu

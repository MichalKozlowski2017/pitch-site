# Konwencje — trzymaj się tego na każdym pitchu

## Technika

- **Jedna prawda o treści:** `content/client.json` + Zod w `src/lib/client-config.ts`.
- **Render sekcji:** wyłącznie przez `src/components/registry.ts` — nie hardcoduj sekcji w `page.tsx`.
- **Props sekcji:** `SectionProps` → `{ client }`.
- **Nowy wygląd** = nowy wariant: plik komponentu → registry → enum w `variantsSchema` → wiersz w `AGENTS.md` → wpis w `docs/industries/` jeśli branżowy.
- **Opcjonalne sekcje:** brak klucza w JSON lub puste `items` → komponent zwraca `null` (np. `pricing`, `faq`, `reviews`).
- **Loader serwera:** `src/lib/load-client-config.ts` — nie importuj `node:fs` w komponentach klienckich.

## Treść i etyka

- **Opinie:** tylko prawdziwe (Google, Facebook z linkiem/źródłem). Pusta tablica `reviews.items` = sekcja ukryta.
- **Dane kontaktowe:** z ogłoszenia / od klienta — nie wymyślaj telefonu, NIP, adresu.
- **Zdjęcia:** z ogłoszenia, portfolio klienta, własne po zgodzie — nie cudze realizacje.
- **Demo:** `pitch.enabled: true`, badge + `/pitch`; po sprzedaży `false`.
- **SEO:** sensowny `title` / `description` z miastem i główną usługą.

## UX przed oddaniem

- [ ] Telefon / WhatsApp działa (`tel:` / `wa.me`)
- [ ] Mobile: sticky CTA, header, sekcje nie „wylewają” poza ekran
- [ ] Lenis + kotwice: klik w nav nie teleportuje
- [ ] `npm run build` przechodzi
- [ ] Preview URL działa

## Motion (domyślne oczekiwania)

- Lenis smooth scroll + GSAP reveals (`LandingMotion.tsx`)
- `prefers-reduced-motion` — bez blokowania treści
- Sekcje premium (pricing, services, gallery): osobne animacje w GSAP, nie generyczny fade wszędzie
- Autoplay w galerii: pauza przy hoverze i po ręcznej zmianie slajdu

## Git / pitch

- **Branch:** `pitch/<slug-firmy>` z `main` (jeden repo, wiele pitchy).
- **Commit:** po logicznej paczce (moduł, polish pitcha); nie mieszaj niepowiązanych klientów.
- Po merge modułu do `main` — zaktualizuj docs jeśli zmienił się kontrakt sekcji.

## Cennik usługi (dla Ciebie, nie na stronie klienta)

Orientacyjny pakiet outreach: **1290–1490 PLN** (strona + rok hostingu); domena osobno lub w pakiecie.  
Doprecyzuj w rozmowie — zapisuj wyniki negocjacji w learnings branży, nie w starterze.

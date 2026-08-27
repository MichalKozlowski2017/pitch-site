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

## Branding (logo i typografia)

**Gdy klient nie ma logo** (typowe na OLX) — zaprojektuj prosty znak na pitchu:

1. **Research:** czy jest logo na Google / FB / starym www? Jeśli tak — użyj (z zgodą / jako referencja); nie kopiuj cudzych znaków 1:1.
2. **Proste logo na demo:** SVG wordmark lub monogram (inicjały) w kolorach z `theme` → `public/images/<slug>/logo.svg` → `business.logo` w JSON.
3. **Styl:** czytelny na jasnym i ciemnym tle (header transparent + solid po scrollu). Bez stockowych ikon z branży — lepiej litera, inicjał lub uproszczona nazwa firmy.
4. **Typografia:** dopasuj charakter marki — domyślnie Syne (display) + Manrope (body); przy pitchu można podmienić parę fontów w `layout.tsx` (beauty: eleganckiej; budowa: solidniej). Graj trackingiem, wagą nagłówka i akcentem kolorystycznym, żeby strona nie wyglądała jak surowy starter.
5. **Theme:** paleta pod logo / zdjęcia hero — primary, accent i tło spójne z wordmarkiem.

Bez logo w JSON header pokazuje samą nazwę tekstem — **na demie zawsze staraj się dać `business.logo`**, jeśli klient nie dostarczył własnego.

## UX przed oddaniem

- [ ] Telefon / WhatsApp działa (`tel:` / `wa.me`)
- [ ] Mobile: sticky CTA, header, sekcje nie „wylewają” poza ekran
- [ ] Lenis + kotwice: klik w nav nie teleportuje
- [ ] `npm run build` przechodzi
- [ ] Preview URL działa

## Rytm sekcji (tło)

**Nie sklejaj dwóch ciemnych sekcji (`primary`) obok siebie** — galeria i cennik zlewają się wizualnie.

| Sekcja | Tło |
|--------|-----|
| hero, usługi, realizacje (`fullBleedShowcase`), USP, opinie, kontakt | jasne (`background` / `surface`) |
| cennik, FAQ | ciemne (`primary`) |

- `fullBleedShowcase` = **jasna sekcja**, ciemny tylko kadr ze zdjęciem (jak `featuredSlider`).
- Po jasnej galerii → ciemny cennik daje kontrast; opcjonalnie cienka linia / gradient na górze cennika.
- Kolejność slotów: unikaj `primary` → `primary` bez jasnej przerwy między.

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

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# pitch-site — starter pod outreach OLX

Landing dla lokalnych wykonawców. Treść i wybór layoutu żyją w **`content/client.json`**. UI składa się z **wymiennych wariantów** slotów przez `src/components/registry.ts`.

## Workflow: nowe zlecenie / pitch

1. Użytkownik wrzuca: **link** (OLX / Fixly / Oferteo / Maps…) — opcjonalnie nazwa, miasto, telefon.
2. **Kwalifikacja** — `npm run lead:ingest -- --url <OLX> --phone <tel> --save` ([`docs/lead-scoring.md`](docs/lead-scoring.md)): auto-fetch, zdjęcia, analiza, werdykt. Bez `pitch` → nie buduj demo.
3. **Sprawdź** [`data/outreach-tracker.csv`](data/outreach-tracker.csv) — duplikat telefonu / firmy / URL.
4. Research: opinie Google (tylko prawdziwe), zdjęcia, jakość istniejącej strony (jeśli jest).
5. Uzupełnij `content/client.json` (`business`, sekcje, `theme`, `variants`, `pitch` — kąt w copy `/pitch`).
6. Zdjęcia: `public/images/` albo remote (host w `next.config.ts`).
7. `npm run dev` → sprawdź desktop/mobile; ewent. zmień `variants`.
8. Deploy preview + wiadomość z [`docs/outreach.md`](docs/outreach.md).
9. Zaktualizuj wiersz w `data/outreach-tracker.csv` (demo / wysłane / odpowiedź / cena).

**Dokumentacja:** [`docs/README.md`](docs/README.md) — konwencje, workflow, playbooki branż (`docs/industries/`). Po pitchu dopisz learnings do właściwego pliku branży.

## Input — szablon

```
Link: <URL ogłoszenia / profilu>   ← wystarczy; resztę agent wyciąga
Firma: …                           ← opcjonalnie
Miasto: …
Telefon: …
Uwagi: …
```

## Struktura `client.json`

- `business` — nazwa, lokalizacja, telefon, e-mail, godziny
- `seo` — title / description
- `theme` — kolory (CSS variables)
- `navigation` — linki w headerze
- `hero` / `services` / `usp` / `reviews` / `gallery` / `area` / `faq` / `contact` — treść sekcji
- `variants` — który komponent w danym slocie
- `pitch.enabled` — badge demo (wyłącz na produkcji)

## Katalog wariantów

| Slot | Wariant | Kiedy |
|------|---------|--------|
| header | `solid` | Sticky na jasnym tle |
| header | `transparent` | Nad `fullBleedPhoto` |
| hero | `fullBleedPhoto` | Mocne zdjęcie |
| hero | `split` | Słabsze zdjęcie / więcej tekstu |
| services | `grid` | Siatka usług |
| services | `bento` | Asymetryczna siatka bento — karta `highlight` większa (beauty) |
| services | `bentoFull` | Bento 50/50 — prawa kolumna 2×2 na pełną wysokość (6 usług) |
| pricing | `cards` | Cennik (beauty / stałe ceny); bez `pricing` w JSON = ukryte |
| usp | `list` | Lista USP |
| reviews | `cards` | Opinie Google |
| gallery | `grid` | Szybka siatka realizacji |
| gallery | `featuredSlider` | Duży kadr + opis, thumbs, GSAP — budowlanka |
| gallery | `fullBleedShowcase` | Wycentrowane cinematic portfolio (beauty) |
| area | `chips` | Miasta |
| faq | `accordion` | FAQ; bez `faq` w JSON = ukryte |
| contact | `simple` | Kontakt + CTA |
| footer | `simple` | Footer |

**Nowy wariant:** plik w `src/components/<slot>/` → `registry` → enum w `variantsSchema` → wiersz tutaj.

## Zasady

- Tylko prawdziwe opinie. Zero fake social proof.
- Nie wymyślaj telefonów / NIP / adresów.
- **Brak logo:** na każdym pitchu prosty znak (SVG wordmark/monogram) + spójny `theme` i typografia — szczegóły w `docs/conventions.md`.
- `pitch.enabled: true` na demie; `false` przy wdrożeniu.
- Schema: `src/lib/client-config.ts` · Render: `LandingSections.tsx`

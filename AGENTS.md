<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# pitch-site — starter pod outreach OLX

Landing dla lokalnych wykonawców. Treść i wybór layoutu żyją w **`content/client.json`**. UI składa się z **wymiennych wariantów** slotów przez `src/components/registry.ts`.

## Workflow: nowe zlecenie / pitch

1. Użytkownik wrzuca: link lub treść ogłoszenia OLX/Allegro, nazwę firmy, miasto, telefon, opcjonalnie link Google Business.
2. Research: opinie Google (tylko prawdziwe), ton komunikacji, czy ma już stronę, mocne zdjęcia.
3. Uzupełnij `content/client.json` (`business`, sekcje, `theme`, `variants`, `pitch`).
4. Zdjęcia: `public/images/` albo remote (host w `next.config.ts`).
5. `npm run dev` → sprawdź desktop/mobile; ewent. zmień `variants`.
6. Deploy preview + wiadomość z [`docs/outreach.md`](docs/outreach.md).

## Input — szablon

```
Ogłoszenie: <link lub tekst>
Firma: …
Miasto / obszar: …
Telefon: …
Google (opcjonalnie): …
Uwagi: …
```

## Struktura `client.json`

- `business` — nazwa, lokalizacja, telefon, e-mail, godziny
- `seo` — title / description
- `theme` — kolory (CSS variables)
- `navigation` — linki w headerze
- `hero` / `services` / `usp` / `reviews` / `gallery` / `area` / `contact` — treść sekcji
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
| usp | `list` | Lista USP |
| reviews | `cards` | Opinie Google |
| gallery | `grid` | Realizacje |
| area | `chips` | Miasta |
| contact | `simple` | Kontakt + CTA |
| footer | `simple` | Footer |

**Nowy wariant:** plik w `src/components/<slot>/` → `registry` → enum w `variantsSchema` → wiersz tutaj.

## Zasady

- Tylko prawdziwe opinie. Zero fake social proof.
- Nie wymyślaj telefonów / NIP / adresów.
- `pitch.enabled: true` na demie; `false` przy wdrożeniu.
- Schema: `src/lib/client-config.ts` · Render: `LandingSections.tsx`

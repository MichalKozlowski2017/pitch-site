# Pitch Site

Starter **Next.js (App Router) + TypeScript + Tailwind + Zod** pod spersonalizowane landingi dla lokalnych wykonawców (outreach OLX / Allegro).

## Idea

1. Wklejasz ogłoszenie + dane firmy.
2. Agent / Ty wypełniacie `content/client.json` i dobieracie **warianty** sekcji.
3. Wysyłasz preview URL z ofertą wdrożenia w 24h.

## Start

```bash
npm install
npm run dev
```

- Landing: [http://localhost:3000](http://localhost:3000)
- Oferta pitch: [http://localhost:3000/pitch](http://localhost:3000/pitch)

## Konfiguracja klienta

Edytuj [`content/client.json`](content/client.json):

- **dane** — firma, SEO, hero, usługi, USP, opinie, galeria, obszar, kontakt, theme
- **`variants`** — który komponent w danym slocie (np. `hero: "fullBleedPhoto"` vs `"split"`)

Schema i loader: [`src/lib/client-config.ts`](src/lib/client-config.ts).  
Rejestr wariantów: [`src/components/registry.ts`](src/components/registry.ts).

### Szybki test swapu wariantów

W `client.json` zmień np.:

```json
"variants": {
  "header": "solid",
  "hero": "split"
}
```

(zamiast `transparent` + `fullBleedPhoto`) i odśwież stronę.

## Dokumentacja dla agentów

- [`AGENTS.md`](AGENTS.md) — workflow, katalog wariantów, dodawanie komponentów
- [`data/outreach-tracker.csv`](data/outreach-tracker.csv) — kto dostał pitch, odpowiedź, cena (dedup)
- [`docs/outreach-tracker.md`](docs/outreach-tracker.md) — jak prowadzić tracker
- [`docs/outreach.md`](docs/outreach.md) — szablon wiadomości + checklista etyki
- [`.cursor/rules/pitch.mdc`](.cursor/rules/pitch.mdc)

## Stack

- Next.js 16, React 19, Tailwind 4, Zod 4, GSAP (ScrollTrigger)
- Fonty: Syne (display) + Manrope (body)
- Zdjęcia remote: `images.unsplash.com` (demo); produkcja → `public/images/`
- Motion: [`LandingMotion`](src/components/motion/LandingMotion.tsx) — hero entrance + scroll reveal (`data-reveal` / `data-hero-item`)

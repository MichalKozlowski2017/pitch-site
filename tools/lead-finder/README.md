# Lead finder

CLI do oceny leadów OLX. Pełna dokumentacja: [`docs/lead-scoring.md`](../../docs/lead-scoring.md).

```bash
# Pełny pipeline: ogłoszenie → zdjęcia → analiza → scoring
npm run lead:ingest -- --url "https://www.olx.pl/d/oferta/..." --phone "+48..." --save

# Tylko scoring z gotowego JSON
npm run lead:score -- --file data/leads/<slug>.json --save
```

## Moduły

| Plik | Rola |
|------|------|
| `ingest-olx.ts` | Orchestrator — `lead:ingest` |
| `fetch-olx.ts` | Playwright fetch ogłoszenia |
| `download-photos.ts` | Pobieranie z CDN do `data/leads/assets/` |
| `analyze-photos.ts` | Rozdzielczość, jakość, hero/galeria |
| `score.ts` | Wagi i werdykt |
| `score-lead.ts` | CLI `lead:score` |

Wymaga Chrome (Playwright `channel: 'chrome'`) lub `npx playwright install chromium`.

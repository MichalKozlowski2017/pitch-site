# Lead scoring — system oceny ogłoszeń

Strukturalna ocena leadów OLX / Fixly / Maps pod kątem **czy warto robić pitch strony**.

Powiązane: [`lead-qualification.md`](lead-qualification.md) (reguły werdyktu), [`outreach-tracker.md`](outreach-tracker.md) (dedup).

## Szybki start

```bash
# Auto-ingest: ogłoszenie + zdjęcia + analiza + scoring
npm run lead:ingest -- --url "https://www.olx.pl/d/oferta/..." --save

# Telefon z inputu użytkownika (gdy OLX nie odsłania w headless)
npm run lead:ingest -- --url "..." --phone "+48796917536" --save

# Pełna ocena z gotowego JSON (po ręcznym researchu www/Maps)
npm run lead:score -- --file data/leads/example-lead.json --save
```

Wynik: **0–100 punktów** + werdykt `pitch` / `maybe` / `skip` + kąt + raport Markdown + pobrane zdjęcia.

## Workflow agenta (zalecany)

```
Link od użytkownika
    ↓
npm run lead:ingest -- --url <OLX> --phone <tel z inputu> --save
    ↓
Automatycznie: fetch OLX (Playwright) → pobierz zdjęcia → analiza → scoring
    ↓
Wynik: data/leads/<slug>.json + data/leads/scores/<slug>.md + data/leads/assets/<slug>/
    ↓
Agent: uzupełnij research (www, Google Maps, Booksy) w JSON
    ↓
npm run lead:score -- --file data/leads/<slug>.json --save
    ↓
pitch → branch + skopiuj zdjęcia do public/images/<slug>/
```

## Co robi `lead:ingest`

| Krok | Opis |
|------|------|
| **Fetch OLX** | Playwright (Chrome) — tytuł, opis, miasto, specjalizacje, URL zdjęć, wyświetlenia |
| **Pobieranie zdjęć** | CDN OLX → `data/leads/assets/<slug>/01.jpg …` |
| **Analiza zdjęć** | Rozdzielczość, liczba, jakość 0–10, czy nadaje się na hero/galerię |
| **Scoring** | Wagi + werdykt + dedup z `outreach-tracker.csv` |

### Analiza zdjęć (automatyczna)

| Metryka | Znaczenie |
|---------|-----------|
| `qualityScore` | 0–10 — rozdzielczość + liczba + rozmiar pliku |
| `suitableForHero` | min. 800px dłuższy bok, ≥35 KB |
| `suitableForGallery` | ≥3 zdjęcia w dobrej jakości (≥720px, ≥25 KB) |
| `flags` | `mal_zdjec`, `niska_jakosc`, `brak_zdjec` |

Wynik analizy wpływa na wymiary **Treść ogłoszenia** i **Gotowość demo**.

## Wymiary oceny (wagi)

| Wymiar | Waga | Co mierzy |
|--------|------|-----------|
| **Kontakt** | 15% | Telefon, e-mail, godziny w opisie |
| **Treść ogłoszenia** | 15% | Zdjęcia, jakość zdjęć, opis, cennik |
| **Dopasowanie do pitcha** | 15% | Usługa lokalna vs model/kurs/spam |
| **Luka online** | 20% | Brak www = wysoko; mocna www = nisko |
| **Gotowość demo** | 15% | Materiał na `client.json` + analiza zdjęć |
| **Social proof** | 10% | Opinie Google do sekcji `reviews` |
| **Aktywność** | 5% | Wyświetlenia ogłoszenia |
| **Czerwone flagi** | 5% | Duplikat, brak kontaktu, słabe zdjęcia |

### Progi werdyktu

| Wynik | Werdykt |
|-------|---------|
| ≥ 70 | `pitch` |
| 45–69 | `maybe` |
| < 45 | `skip` |

## Wymagania techniczne

- **Playwright** — używa Chrome (`channel: 'chrome'`) lub bundled Chromium
- Pierwszy raz: `npx playwright install chromium` (opcjonalnie, jeśli brak Chrome)
- Telefon: OLX czasem wymaga kliknięcia „Pokaż” — podaj `--phone` z inputu użytkownika

## Format pliku wejściowego

Szablon: [`data/leads/example-lead.json`](../data/leads/example-lead.json)

Pole `photoAnalysis` uzupełnia się automatycznie przez `lead:ingest`.

## Pliki narzędzia

| Plik | Rola |
|------|------|
| `tools/lead-finder/ingest-olx.ts` | CLI `lead:ingest` — pełny pipeline |
| `tools/lead-finder/fetch-olx.ts` | Playwright fetch ogłoszenia |
| `tools/lead-finder/download-photos.ts` | Pobieranie z CDN |
| `tools/lead-finder/analyze-photos.ts` | Analiza rozdzielczości / jakości |
| `tools/lead-finder/score.ts` | Logika wag i werdyktu |
| `tools/lead-finder/score-lead.ts` | CLI `lead:score` |

## Zdjęcia na pitchu

Po werdykcie `pitch`:

1. Skopiuj `data/leads/assets/<slug>/` → `public/images/<slug>/`
2. Użyj w `content/client.json` → `gallery`, `hero`

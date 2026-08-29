# Lead scoring — system oceny ogłoszeń

Strukturalna ocena leadów OLX / Fixly / Maps pod kątem **czy warto robić pitch strony**.

Powiązane: [`lead-qualification.md`](lead-qualification.md) (reguły werdyktu), [`outreach-tracker.md`](outreach-tracker.md) (dedup).

## Szybki start

```bash
# 1. Brief — co zebrać z ogłoszenia + zapytania Google
npm run lead:score -- --url "https://www.olx.pl/d/oferta/..."

# 2. Pełna ocena (po uzupełnieniu JSON)
npm run lead:score -- --file data/leads/example-lead.json

# 3. Zapis wyniku
npm run lead:score -- --file data/leads/example-lead.json --save
```

Wynik: **0–100 punktów** + werdykt `pitch` / `maybe` / `skip` + kąt + raport Markdown.

## Dlaczego nie auto-scrape OLX?

CloudFront blokuje bezpośredni fetch z serwera (`403`). Agent **otwiera ogłoszenie w przeglądarce** (MCP browser), wyciąga dane i zapisuje do JSON. Skrypt robi resztę: scoring, dedup z CSV, raport.

## Workflow agenta

```
Link od użytkownika
    ↓
Sprawdź tracker (CSV) — duplikat?
    ↓
Przeglądarka: tytuł, opis, tel, miasto, liczba zdjęć, URL zdjęć
    ↓
Google: www, Maps/opinie, Booksy, IG/FB
    ↓
Zapisz data/leads/<slug>.json
    ↓
npm run lead:score -- --file ... --save
    ↓
W odpowiedzi: tabela werdyktu (jak w lead-qualification.md)
    ↓
pitch → dopiero wtedy client.json + branch
```

## Wymiary oceny (wagi)

| Wymiar | Waga | Co mierzy |
|--------|------|-----------|
| **Kontakt** | 15% | Telefon, e-mail, godziny w opisie |
| **Treść ogłoszenia** | 15% | Zdjęcia, długość opisu, cennik, miasto |
| **Dopasowanie do pitcha** | 15% | Usługa lokalna vs model/kurs/spam |
| **Luka online** | 20% | Brak www = wysoko; mocna www = nisko |
| **Gotowość demo** | 15% | Czy starczy materiału na `client.json` |
| **Social proof** | 10% | Opinie Google do sekcji `reviews` |
| **Aktywność** | 5% | Wyświetlenia ogłoszenia |
| **Czerwone flagi** | 5% | Duplikat, brak kontaktu, red flags |

### Progi werdyktu

| Wynik | Werdykt |
|-------|---------|
| ≥ 70 | `pitch` |
| 45–69 | `maybe` |
| < 45 | `skip` |

**Override (wymuszone skip):** duplikat w trackerze (status ≠ research/szablon), ogłoszenie model/kurs, mocna www przy niskim wyniku.

## Format pliku wejściowego

Szablon: [`data/leads/example-lead.json`](../data/leads/example-lead.json)

```json
{
  "sourceUrl": "https://www.olx.pl/d/oferta/...",
  "industry": "beauty",
  "listing": {
    "title": "...",
    "description": "...",
    "phone": "+48...",
    "city": "...",
    "sellerName": "...",
    "photoCount": 8,
    "photoUrls": ["https://..."],
    "views": 120,
    "priceText": "od 80 zł"
  },
  "research": {
    "website": { "found": false },
    "googleMaps": { "found": true, "rating": 4.8, "reviewCount": 12, "url": "..." },
    "booksy": { "found": false },
    "instagram": { "found": true, "url": "...", "active": true },
    "facebook": { "found": false },
    "redFlags": [],
    "notes": "..."
  }
}
```

### Pola `research.website`

| `quality` | Znaczenie |
|-----------|-----------|
| `none` | Brak strony |
| `weak` | Wolna, zła mobile, brak portfolio |
| `medium` | OK, ale da się lepiej |
| `strong` | Portfolio, SEO, formularz — **skip pitch od zera** |

## Wyjście

- **stdout:** raport Markdown (tabela werdyktu + wymiary + następne kroki)
- **`--save`:** `data/leads/scores/<slug>.json` + `.md`
- **`--json`:** sam wynik scoringu na stdout

## Checklist zbierania zdjęć

Przy `pitch` zapisz URL-e z ogłoszenia w `listing.photoUrls` — agent potem pobiera do `public/images/<slug>/` (ręcznie lub skryptem).

- Min. 4 zdjęcia realizacji → galeria + hero
- Bez zdjęć stockowych — tylko z ogłoszenia / profilu klienta
- Opinie: tylko prawdziwe z Google Maps → `reviews` w JSON

## Pliki narzędzia

| Plik | Rola |
|------|------|
| `tools/lead-finder/types.ts` | Schematy Zod |
| `tools/lead-finder/score.ts` | Logika wag i werdyktu |
| `tools/lead-finder/tracker.ts` | Dedup z `outreach-tracker.csv` |
| `tools/lead-finder/research-queries.ts` | Zapytania Google dla agenta |
| `tools/lead-finder/report.ts` | Raport Markdown |
| `tools/lead-finder/score-lead.ts` | CLI |

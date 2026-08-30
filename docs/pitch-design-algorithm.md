# Algorytm designu pitcha

Checklist przed uzupełnieniem `client.json`. Celem jest **różnicowanie projektów** — nie ten sam bento + sage na każdej stronie.

## 1. Kolor przewodni z materiałów

**Zasada:** `theme.accent` (i ewentualnie `muted`) wynika z **zdjęć i brandu klienta**, nie z domyślnego teal/sage.

| Sygnał w materiałach | Accent | Przykład |
|---------------------|--------|----------|
| Róż / fuksja / czerwień paznokci | `#D4567A` – `#E879A0` | Łapko-cure |
| Beż / nude / ciepły salon | `#B8956A` – `#C4A574` | Effect Nails |
| Ciemny luksus / black nails | `#C9A962` (złoto) lub `#8B7355` | — |
| Zieleń / sage (tylko gdy brand tak wygląda) | `#5B8A8A` | Lena (jeśli zdjęcia zielone) |
| Budowlanka / neutral | `#2563EB` lub stonowany szary | — |

**Workflow:**

1. Po `lead:ingest` — przejrzyj miniatury w `data/leads/assets/<slug>/`.
2. Jeśli pipeline zwróci `photoAnalysis.dominantHue` — użyj jako hint (TODO w `analyze-photos.ts`).
3. Dopasuj `primary` (ciemny tekst), `background`, `muted` do accentu (ciepłe tło przy różu, nie szary teal).
4. Logo SVG — ten sam accent w monogramie.

## 2. Wybór wariantu usług (bez numeracji)

**Nigdy** nie numeruj usług (`01`, `02`…) — usunięte ze wszystkich wariantów.

| Liczba usług | Preferowany wariant | Uzasadnienie |
|--------------|---------------------|--------------|
| 3 | `cards` | 3 kolumny wyśrodkowane |
| 4 | `grid` lub `cards` | 2×2 |
| 5 | `bento` | asymetria, highlight |
| 6 | `cards` (równa 3×2) **lub** `bentoFull` | przy `cards` — bez col-span featured |
| 7+ | `grid` | prosta siatka |

**Rotacja w branży beauty** (żeby strony się nie dublowały):

| Kolejność pitcha | Wariant usług |
|------------------|---------------|
| 1 | `bento` / `bentoFull` |
| 2 | `cards` |
| 3 | `spotlight` |
| 4 | `rail` |
| 5 | `grid` |
| 6+ | z powrotem od początku, inny niż poprzedni |

Sprawdź `data/outreach-tracker.csv` — jak ostatni manicure miał `bentoFull`, następny dostaje `cards` lub `grid`.

## 3. Cennik — siatka i wzór tła

### Siatka (`section-layout.ts`)

| Pozycje | Layout |
|---------|--------|
| 1 | jedna karta, max-width, wyśrodkowana |
| 2 | 2 kolumny, wyśrodkowane (`max-w-3xl mx-auto`) |
| 3 | 3 kolumny, wyśrodkowane (`max-w-5xl mx-auto`) — **nie** pełna szerokość z pustymi bokami |
| 4 | 4 kolumny |
| 5–6 | 3 kolumny |
| 7+ | 4 kolumny |

### Wzór tła (`pricing.pattern`)

Rotuj **per projekt** (nie ten sam diagonal wszędzie):

| Wzór | Charakter |
|------|-----------|
| `diagonal` | klasyczne paski |
| `dots` | delikatne kropki |
| `waves` | fale — beauty / miękkie |
| `crosshatch` | krzyżówka — bardziej techniczne |
| `rings` | koncentryczne — premium |

**Algorytm:** hash slug → indeks w tablicy wzorców, **albo** ręcznie w `client.json` inny niż poprzedni pitch w trackerze.

```ts
// lib/section-layout.ts — pickPricingPattern(slug)
```

## 4. Inne sloty — szybka różnicowalność

| Slot | Co zmieniać między pitchami |
|------|------------------------------|
| hero | `fullBleedPhoto` vs `split` |
| gallery | `fullBleedShowcase` (beauty) vs `featuredSlider` (budowlanka) vs `grid` |
| header | `transparent` nad hero vs `solid` |
| usp | copy + ewentualnie ikony w theme |

## 5. Checklist przed oddaniem

- [ ] Accent z foto / brandu, nie default teal
- [ ] Usługi: wariant **inny** niż poprzedni pitch tej branży w trackerze
- [ ] Brak numeracji w usługach i cenniku
- [ ] Cennik 3 poz. — wyśrodkowany layout
- [ ] `pricing.pattern` — inny wzór niż ostatni projekt
- [ ] Logo SVG spójne z accentem
- [ ] Mobile + telefon w CTA

## Powiązane pliki

- `src/lib/section-layout.ts` — siatki usług/cennika, wzory
- `src/components/services/ServicesCards.tsx` — wariant bez numeracji
- `src/components/pricing/PricingCards.tsx` — dynamiczna siatka + pattern
- `docs/industries/beauty.md` — learnings po pitchu

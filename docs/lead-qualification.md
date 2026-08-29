# Kwalifikacja leada — zanim zrobisz pitch

Uniwersalny model: **wklejasz link** (OLX, Fixly, Oferteo, Google Maps, Facebook…) → agent **sam ocenia**, czy warto robić stronę i pod jaki kąt.

Nie filtrujemy „tylko bez strony”. Testowe pitchy pokazały, że wielu ma już www — nadal można sprzedać **lżejszy landing**, ale inny message niż „nie masz strony”.

## Wejście

Minimum od Ciebie:

```
Link: <URL ogłoszenia / profilu / wizytówki>
```

Opcjonalnie: miasto, branża, uwagi. **Nie są wymagane** — agent wyciąga z linku i researchu.

## Wyjście (zawsze w odpowiedzi)

Krótka tabela decyzji:

| Pole | Wartości |
|------|----------|
| **Werdykt** | `pitch` / `maybe` / `skip` |
| **Kąt** | `greenfield` / `refresh` / `complement` — tylko gdy `pitch` lub `maybe` |
| **Obecność online** | `brak` / `tylko_katalogi` / `social` / `slaba_www` / `mocna_www` |
| **Duplikat** | tak/nie (tracker + telefon) |

Plus 3–5 bulletów **dlaczego** (konkretnie, z linkami).

## Research (kolejność)

1. **Tracker** — `data/outreach-tracker.csv` po telefonie, firmie, URL źródła.
2. **Źródło linku** — odczyt ogłoszenia: firma, telefon, miasto, usługi, zdjęcia, linki w opisie.
3. **Strona www** — szukaj w:
   - linkach w ogłoszeniu / profilu,
   - wizytówce OLX („Zobacz wizytówkę”),
   - Google Business / Maps (pole website),
   - wyszukiwarka: `"nazwa firmy" + miasto` (czy jest własna domena).
4. **Jakość www** (jeśli jest) — szybki przegląd:
   - mobile (czytelny telefon, nie rozjeżdża się),
   - czas ładowania (subiektywnie / Lighthouse jeśli masz),
   - czy to tylko FB / Instagram / Oferteo / Panorama Firm,
   - czy WordPress z landingami SEO pod miasta (jak u dojrzałych firm).
5. **Social proof** — opinie Google (prawdziwe do `reviews`), zdjęcia do galerii.
6. **Czerwone flagi** — brak telefonu, podejrzany profil, zero realizacji, duplikat innej firmy.

## Werdykt

### `pitch` — rób demo

| Sygnał | Typowy kąt |
|--------|------------|
| Brak własnej strony; tylko OLX / Fixly / FB | `greenfield` |
| Tylko katalog (Oferteo, firmy.net) bez domeny | `greenfield` |
| Jest www, ale słabe: wolne, brzydkie mobile, brak portfolio/cennika | `refresh` |
| Jest www, ale lead żyje z OLX — brak szybkiego CTA na telefon | `complement` |

### `maybe` — zapytaj Ciebie lub zrób tylko research

- Nieczytelny kontakt, słabe zdjęcia, nie wiadomo czy to ta sama firma co w Google.
- Strona „średnia” — można pitchować refresh, ale ROI niepewne.
- Klient ma www, ale ogłoszenie sugeruje, że szuka widoczności — warto Twojej decyzji.

### `skip` — nie rób pitcha

- **Mocna www** — portfolio, mobile, SEO, formularz; pitch „strona od zera” nie ma sensu.
- **Duplikat** w trackerze (ten sam telefon / ta sama firma / ten sam OLX).
- Brak danych do sensownego demo (zero zdjęć, zero opisu, zero kontaktu).
- Świadomie nie chcesz tej branży / regionu (Twoja decyzja biznesowa).

## Kąt pitcha (`pitch_angle`)

Używany w `pitch.offerHeadline` / wiadomości outreach — **dopasuj do werdyktu**, nie jeden szablon.

| Kąt | Kiedy | Przykładowy message |
|-----|--------|---------------------|
| `greenfield` | Brak własnej strony | „Przygotowałem podgląd strony pod Twoje ogłoszenie — działa na telefonie, klient od razu dzwoni.” |
| `refresh` | Jest www, słabe | „Masz już stronę — ten podgląd to wersja szybsza i czytelniejsza na mobile niż obecna.” |
| `complement` | Dobra/straszna www, ale OLX to główny kanał | „Landing pod OLX: jeden link, portfolio + opinie + telefon — bez przeklikiwania.” |

## Zapis po analizie

Przed `client.json` / branchem:

1. Wiersz w `data/outreach-tracker.csv`:
   - `status=research` lub `skip`,
   - `zrodlo_ogloszenia` = wklejony link,
   - `notatki` = werdykt + kąt + URL www jeśli jest + 1 zdanie dlaczego.

2. Pitch tylko gdy `pitch` — wtedy `cp content/client.starter.json` → branch `pitch/<slug>`.

## Checklist agenta (skrót)

Po wklejeniu linku odpowiedz **najpierw kwalifikacją**, potem dopiero „działamy z projektem”:

- [ ] Tracker — nie duplikat?
- [ ] Co w ogłoszeniu? (firma, tel, miasto, zdjęcia)
- [ ] Czy ma www? Jaki URL? Jaka jakość?
- [ ] Werdykt: pitch / maybe / skip
- [ ] Jeśli pitch: kąt greenfield / refresh / complement
- [ ] Dopiero potem: starter, JSON, branch

## Przyszły skrypt (opcjonalnie)

**Zaimplementowane:** `npm run lead:score` — [`docs/lead-scoring.md`](lead-scoring.md).

Agent nadal robi research w przeglądarce (OLX blokuje auto-fetch), wypełnia `data/leads/<slug>.json`, skrypt liczy wynik i werdykt.

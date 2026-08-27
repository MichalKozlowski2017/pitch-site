# Beauty — paznokcie, fryzjer, kosmetyczka

Playbook pod lokalne usługi beauty z mocnym wizualnie portfolio i cennikiem z ogłoszenia.

## Profil

- Lead: głównie OLX (ogłoszenia z cenami i zdjęciami prac).
- Klientka/decydent: często jednoosobowa działalność, imię w brandzie (np. „u Moniki”).
- Kupuje: zaufanie, portfolio, czytelny cennik, łatwy kontakt (tel / WhatsApp).

## Zalecany układ sekcji

```
header (transparent) → hero (fullBleedPhoto) → services → gallery → pricing → usp → reviews* → area → faq → contact
```

\* `reviews` tylko gdy są prawdziwe opinie — inaczej puste `items`.

## Warianty (starter)

| Slot | Wariant | Dlaczego |
|------|---------|----------|
| header | `transparent` | Hero na zdjęciu — premium |
| hero | `fullBleedPhoto` | Zdjęcie stylizacji / dłoni |
| services | `grid` | 4–6 usług bez cen w opisie |
| gallery | `fullBleedShowcase` | 16:9, filmstrip, cover-fade — **nie** `featuredSlider` (za „ramowe”) |
| pricing | `cards` | Ceny z ogłoszenia; jedna karta `highlight` opcjonalnie |
| usp | `list` | Higiena, doświadczenie, atmosfera — jasne tło |
| faq | `accordion` | Pytania o trwałość, ciążę, przygotowanie — szablon w JSON |
| area | `chips` | Miasto + okolice |
| contact | `simple` | Tel + WhatsApp |

**Kolejność:** portfolio **zaraz po usługach** — klientka najpierw chce zobaczyć efekt.

## Nav (przykład)

Usługi → Portfolio → Cennik → Dlaczego [brand] → FAQ → Kontakt

## Theme

- Tło: ciepły off-white (`#FAF6F4`)
- Primary: ciemny brąz/grafit (`#2C2426`)
- Accent: dusty rose (`#C48B9F`) — nie neonowy róż
- Fonty: Syne + Manrope (domyślne startera) — przy pitchu można podmienić parę pod charakter salonu
- **Logo:** większość leadów bez znaku → wordmark lub monogram (np. inicjał imienia) w SVG, kolory z palety powyżej

## Copy

- Krótkie zdania, benefit („trzyma się 2–3 tygodnie”), nie żargon bez wyjaśnienia.
- CTA: „Zadzwoń”, „Umów wizytę”, numer w `hero.ctaPrimary`.
- **Nie** generuj fake opinii — lepiej brak sekcji niż placeholder.

## FAQ — typowe pytania (PL)

Można wkleić do `client.json` i dopasować do salonu:

- Ile trzyma się hybryda?
- Czy niszczy paznokcie?
- Jak przygotować się do wizyty?
- Ile trwa wizyta / jak się umówić?
- Hybryda w ciąży?
- Zdjęcie stylizacji z innego salonu?
- Higiena / sterylizacja?

Źródła researchu: typowe FAQ salonów manicure (trwałość 2–4 tyg., przygotowanie bez kremów przed wizytą).

## Galeria — uwagi techniczne

- Aspect **16:9**, szerokość jak `Container` (`max-w-6xl`) — nie full-bleed na cały monitor.
- Przejście slajdów: **cover fade** (stary pod spodem, nowy na wierzchu) — bez prześwitywania tła.
- Autoplay: pauza na hover (strzałki, miniatury, kadr) + 12 s po ręcznej zmianie.
- Miniatury: scroll poziomy + kreska pod aktywną — bez `ring` obcinanego przez krawędź.

## Motion

- Lenis + sticky header (`data-header-scrolled`)
- Pricing / services: premium GSAP (sheen, stagger)
- Mobile: `StickyMobileCta`

## Zdjęcia

- `public/images/<slug>/` — 4–6 mocnych realizacji z FB/ogłoszenia
- Hero = najmocniejszy kadr
- Alt i `title` per stylizacja (Neon French, nude, itd.)

## Learnings z pitchów

### Pitch: Effect Nails Kielce (Monika)

- Branch: `pitch/effect-nails-kielce`
- Cennik z OLX: 140 / 120 / 100 / 100 zł
- Bez opinii Google w demie — sekcja reviews pusta
- `featuredSlider` odrzucony na rzecz `fullBleedShowcase` po feedbacku (wysokość laptopa, proporcje)
- Nav: Portfolio wyżej niż Cennik
- Moduły dodane w trakcie: `pricing.cards`, `faq.accordion`, Lenis, sticky header

**Do następnego beauty pitcha:** od razu `fullBleedShowcase` + pricing + FAQ; pytać o WhatsApp i Booksy.

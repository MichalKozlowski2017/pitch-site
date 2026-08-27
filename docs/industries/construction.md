# Budowlanka / remonty / usługi lokalne (męskie branże)

Playbook pod wykonawców z portfolio realizacji i mocnym zaufaniem (opinie, lata doświadczenia).

## Profil

- Lead: OLX, często ogłoszenie z telefonem i zdjęciami z budowy.
- Decydent: właściciel firmy, często imię w kontakcie.
- Kupuje: realizacje, opinie, jasny zakres usług, dojazd / obszar.

## Zalecany układ sekcji

```
header (solid lub transparent*) → hero → services → usp → gallery → reviews* → area → contact
```

\* `transparent` tylko przy bardzo mocnym zdjęciu hero.

## Warianty

| Slot | Wariant | Dlaczego |
|------|---------|----------|
| header | `solid` | Często brak „wow” zdjęcia na całą szerokość |
| hero | `fullBleedPhoto` lub `split` | Split gdy słabe zdjęcie / dużo tekstu |
| services | `grid` | Kafle: remont, łazienka, elewacja… |
| gallery | `featuredSlider` | Duży kadr + opis realizacji — **dobre dla budowy** |
| gallery alt. | `grid` | Szybko gdy dużo zdjęć bez opisów |
| pricing | *(brak)* | Rzadko stały cennik — wycena po oględzinach |
| usp | `list` | Gwarancja, terminowość, sprzątanie po robotach |
| reviews | `cards` | Tylko prawdziwe (Google / FB) |
| area | `chips` | Miejscowości w promieniu dojazdu |
| faq | opcjonalne | Termin, zaliczka, materiały — jeśli klient poda |

**Kolejność:** usługi przed galerią; cennik zwykle **nie** pokazujemy.

## Theme

- Zieleń, grafit, pomarańcz akcent (narzędzia, bezpieczeństwo) — dostosuj do logo klienta.
- Mniej „elegancko-beauty”, więcej solidnie i czytelnie.

## Copy

- Konkret: co wchodzi w usługę, obszar km, kontakt telefoniczny.
- USP: doświadczenie, ubezpieczenie (jeśli prawdziwe), sprzątanie, termin.
- Unikaj obietnic bez pokrycia („najtaniej w mieście”).

## Zdjęcia

- Realne z realizacji (nie stock budowy z ludźmi w kaskach jeśli to nie ich ekipa).
- Galeria `featuredSlider`: tytuł + krótki opis + ewent. miejscowość.

## FAQ (gdy dodajesz sekcję)

- Jak wygląda wycena?
- Czy dojeżdżacie poza [miasto]?
- Zaliczka / materiały po stronie klienta?
- Jak długo trwa typowy remont łazienki? (tylko jeśli klient tak mówi w ogłoszeniu)

## Learnings z pitchów

### Pitch: Ekspert Usługi Ogólnobudowlane (Rybno)

- Branch: `pitch/ekspert-rybno`
- Zdjęcia realne w `public/images/ekspert-rybno/`
- Opinia z FB (jedna, prawdziwa) — nie Google
- `featuredSlider` dla portfolio
- Bez modułu pricing

**Do następnego pitcha budowlanego:** zbierać 3–5 zdjęć „przed/po” z opisem; pytać o obszar dojazdu pod `area.chips`.

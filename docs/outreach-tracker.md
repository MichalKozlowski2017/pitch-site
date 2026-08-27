# Tracker outreach — firmy i feedback

Jeden plik do śledzenia, **komu już wysłaliśmy pitch** i co z tego wyszło.  
Przed nowym projektem: **sprawdź CSV**, żeby nie proponować drugi raz tej samej firmie.

**Plik:** [`../data/outreach-tracker.csv`](../data/outreach-tracker.csv)  
Otwórz w Excelu, Numbers, Google Sheets albo edytuj w Cursorze.

## Kiedy aktualizować

| Moment | Co zrobić |
|--------|-----------|
| Zaczynasz research | Nowy wiersz, `status=research` |
| Demo / branch gotowy | `status=demo`, `data_demo`, `git_branch`, `preview_url` |
| Wysłałeś wiadomość | `status=wyslane`, `data_wyslania`, `kanal_kontaktu`, `cena_zaproponowana_pln` |
| Klient odpisał | `odpowiedzial=tak`, `odpowiedz_krotka`, ewent. `status=negocjacje` |
| Sprzedaż / odmowa / cisza | `status=sprzedane` / `odmowa` / `cisza` + `cena_finalna_pln` jeśli sprzedaż |

## Kolumny

| Kolumna | Opis |
|---------|------|
| `slug` | Unikalny ID (jak nazwa brancha: `effect-nails-kielce`) |
| `firma` | Nazwa z ogłoszenia / wizytówki |
| `branza` | Np. beauty, hydraulika, remonty |
| `miasto` | Miasto lub obszar |
| `telefon` | E.164, np. `+48784988009` — **klucz do deduplikacji** |
| `zrodlo_ogloszenia` | Link OLX / Allegro / inne |
| `data_demo` | Kiedy preview było gotowe (YYYY-MM-DD) |
| `data_wyslania` | Kiedy poszła wiadomość |
| `status` | Patrz enum poniżej |
| `odpowiedzial` | `tak` / `nie` / `n/a` |
| `odpowiedz_krotka` | 1–2 zdania: ton, obiekcje, „zadzwonię”, itd. |
| `cena_zaproponowana_pln` | Kwota z oferty (np. 1290) |
| `cena_finalna_pln` | Po negocjacji / sprzedaży |
| `preview_url` | Vercel preview |
| `git_branch` | Np. `pitch/effect-nails-kielce` |
| `kanal_kontaktu` | OLX / WhatsApp / telefon / e-mail |
| `notatki` | Cokolwiek przydatnego na przyszłość |

## Statusy (`status`)

- `szablon` — demo w starterze, nie prawdziwy lead
- `research` — zbieramy dane, jeszcze bez brancha
- `demo` — preview gotowe, **nie wysłane**
- `wyslane` — wiadomość poszła, czekamy
- `odpowiedzial` — była odpowiedź (szczegóły w `odpowiedz_krotka`)
- `negocjacje` — rozmowa o cenie / zakresie
- `sprzedane` — wdrożenie / umowa
- `odmowa` — klient odmówił
- `cisza` — brak odpowiedzi (np. po 2 tygodniach)
- `rezygnacja` — my rezygnujemy z follow-upu

## Dedup — przed nowym pitchiem

1. Wyszukaj w CSV: **telefon**, **firma**, fragment **URL ogłoszenia**.
2. Jeśli wiersz istnieje i `status` ∈ `wyslane`, `odpowiedzial`, `negocjacje`, `cisza` → **nie wysyłaj ponownie** bez powodu (follow-up to osobna decyzja — dopisz w `notatki`).
3. Ten sam numer, inna firma? Dopisz wiersz z notatką — często ta sama osoba.

## Dla agenta (Cursor)

- Nowy pitch → **najpierw** przeczytaj `data/outreach-tracker.csv`.
- Po utworzeniu brancha i deployu → **dopisz lub zaktualizuj wiersz** w tym samym commicie co `client.json` (albo zaraz po).
- Nie wymyślaj telefonów — tylko z ogłoszenia / inputu użytkownika.

Powiązane: [`outreach.md`](outreach.md) (szablon wiadomości), [`workflow.md`](workflow.md) (jeśli jest na branchu z docs).

# Outreach i etyka

## Tracker firm (nie pitchuj dwa razy)

Przed nowym leadem sprawdź [`data/outreach-tracker.csv`](../data/outreach-tracker.csv) — telefon, firma, link OLX.  
Instrukcja kolumn i statusów: [`outreach-tracker.md`](outreach-tracker.md).

## Szablon wiadomości (PL)

Dostosuj imię / firmę / URL. Krótko, konkretnie, bez spamu.

```text
Dzień dobry,

Nazywam się [Imię]. Znalazłem/am Państwa ogłoszenie na [OLX/Allegro] i przygotowałem/am gotowy podgląd prostej strony internetowej pod [Firma / branża]:

👉 [URL preview]

Na stronie są m.in.:
• jasna oferta usług z ogłoszenia
• prawdziwe opinie z Google
• przycisk „zadzwoń / WhatsApp” pod telefon komórkowy

Jeśli wygląd i treść pasują, mogę wdrożyć stronę na Państwa domenie w ciągu 24 godzin (hosting + podstawowe SEO).

Gdy nie jest to teraz potrzebne — proszę zignorować tę wiadomość.

Pozdrawiam,
[Imię]
[Telefon]
```

## Benefity (do wstawienia / rozmowy)

- Wyglądacie wiarygodnie obok konkurencji, która ma tylko ogłoszenie
- Klient z telefonu od razu widzi opinie i może zadzwonić jednym tapnięciem
- Działa 24/7 jako wizytówka, gdy nie odbieracie OLX
- Wdrożenie w 24h po akceptacji — bez wielomiesięcznego projektu

## Checklista etyki / legal

- [ ] Opinie na stronie są **prawdziwe** (Google / wiarygodne źródło) — zero „wypełniaczy”
- [ ] Zdjęcia: z ogłoszenia klienta, własne stocki albo za zgodą; nie kradnij cudzego portfolio
- [ ] Demo ma `pitch.enabled: true` i jasny kontekst „to podgląd / oferta”
- [ ] Po sprzedaży: `pitch.enabled: false`, domena klienta, aktualne dane kontaktowe
- [ ] Nie obiecuje się pozycjonowania „na 1. miejscu Google” bez zakresu
- [ ] Outreach personalizowany — nie masowy identyczny spam do setek ogłoszeń
- [ ] RODO: formularze produkcyjne dopiero z polityką prywatności (V1: tel / mailto / WhatsApp)

## Po akceptacji (24h)

1. Domena + DNS / Vercel
2. Wyłączyć badge pitch
3. Podmienić zdjęcia stock na realne (jeśli były placeholderami)
4. Potwierdzić telefon, godziny, obszar
5. Krótki handover: jak zmienić tekst w `client.json`

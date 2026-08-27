# Workflow — od ogłoszenia do wdrożenia

## 1. Input od Ciebie / klienta

```
Ogłoszenie: <link lub tekst OLX/Allegro>
Firma: …
Miasto / obszar: …
Telefon: …
Google / FB (opcjonalnie): …
Uwagi: …
```

## 2. Research (15–30 min)

- Przeczytaj ogłoszenie: usługi, ceny, ton („Pan/Pani”, luzacki, premium).
- Google Business / FB: **tylko prawdziwe opinie**, zdjęcia, godziny.
- Czy ma już stronę? Jeśli tak — czego brakuje (cennik, portfolio, mobile).
- Wybierz branżę → [`industries/`](industries/).

## 3. Branch i config

```bash
git checkout main && git pull
git checkout -b pitch/<slug>
```

- Skopiuj / dostosuj `content/client.json`.
- Zdjęcia → `public/images/<slug>/`.
- Ustaw `variants` według playbooka branży.
- `theme` — kolory pod logo / zdjęcia (beauty: róż/beż; budowa: zieleń/grafit).

## 4. Build pitcha

- Uzupełnij sekcje w JSON (nie w kodzie strony).
- `npm run dev` — desktop + mobile (375px i ~1280px).
- `/pitch` — oferta i badge.
- Jeśli brakuje modułu — dodaj wariant na branchu lub najpierw na `main` jeśli uniwersalny.

## 5. Preview i outreach

- Deploy preview (Vercel).
- Wiadomość z [`outreach.md`](outreach.md) — URL, 3 bullet benefitów, bez spamu.

## 6. Po sprzedaży (24h)

1. Domena klienta, DNS.
2. `pitch.enabled: false`.
3. Finalne zdjęcia i copy od klienta.
4. Krótki handover: „tekst żyje w `client.json`”.
5. **Dopisz learnings** do `docs/industries/<branża>.md`.

## 7. Co wraca do startera (`main`)

Uniwersalne moduły (FAQ, pricing, nowy wariant galerii) → merge do `main` + aktualizacja `AGENTS.md` i docs.  
Treść konkretnego klienta zostaje na branchu pitcha lub w osobnym deployu.

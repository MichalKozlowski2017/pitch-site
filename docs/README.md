# Dokumentacja pitch-site

Ten katalog to **pamięć projektu** — zasady, workflow i wiedza branżowa z pitchy OLX/Allegro.  
Agent i człowiek powinni tu wracać **przed** nowym zleceniem i **po** oddaniu pitcha (dopisać learnings).

## Szybki start

| Plik | Kiedy czytać |
|------|----------------|
| [`workflow.md`](workflow.md) | Nowe zlecenie, branch, deploy, handover |
| [`lead-qualification.md`](lead-qualification.md) | **Zanim pitch** — werdykt po wklejeniu linku |
| [`lead-scoring.md`](lead-scoring.md) | Scoring 0–100 + CLI `npm run lead:score` |
| [`conventions.md`](conventions.md) | Zawsze — technika, treść, etyka |
| [`pitch-design-algorithm.md`](pitch-design-algorithm.md) | **Przed client.json** — kolor z foto, rotacja layoutów, wzór cennika |
| [`industries/`](industries/) | Dobór wariantów i copy pod branżę |
| [`outreach.md`](outreach.md) | Wiadomość do klienta + checklista przed wysyłką |

## Jak się „uczyć” z pitcha na pitch

Po każdym zakończonym demie (nawet bez sprzedaży):

1. Otwórz plik branży w [`industries/`](industries/) albo utwórz z [`industries/_template.md`](industries/_template.md).
2. Dopisz sekcję **„Pitch: [firma]”** — co zadziałało, jakie warianty, uwagi klienta.
3. Jeśli wzorzec jest uniwersalny (np. nowy moduł FAQ) — zaktualizuj też [`conventions.md`](conventions.md) lub [`../AGENTS.md`](../AGENTS.md).

Nie duplikuj całej treści z `client.json` — tylko **decyzje i wnioski**.

## Branże (playbooki)

| Branża | Plik | Status |
|--------|------|--------|
| Beauty / paznokcie / fryzjer | [`industries/beauty.md`](industries/beauty.md) | Effect Nails Kielce |
| Budowlanka / remonty | [`industries/construction.md`](industries/construction.md) | Ekspert Rybno |
| Nowa branża | [`industries/_template.md`](industries/_template.md) | szablon |

## Powiązania w repo

- Schema i warianty (źródło prawdy techniczne): [`../AGENTS.md`](../AGENTS.md)
- Dane klienta: [`../content/client.json`](../content/client.json)
- Reguły Cursor: [`.cursor/rules/pitch.mdc`](../.cursor/rules/pitch.mdc)

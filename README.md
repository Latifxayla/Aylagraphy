# Aylagraphy Frontend

Dieses Projekt nutzt statisches HTML/CSS/JS mit einem klaren Fine-Art-Look. Alle Elemente sind kantig (global `border-radius: 0`) und folgen der Farbwelt Old Lace (#FDF5E6) mit dunklem Grün als Akzent.

## Assets organisieren
- **Hero:** `assets/hero/hero-placeholder.svg`
  - Ersetze die Datei durch euer Hero-Foto oder lege ein anderes Bild in diesem Ordner ab und passe ggf. den Pfad in `styles.css` an (`.hero__image`).
- **Carousel:** Dateien in `assets/carousel/`
  - Standard: `carousel-1.svg` bis `carousel-4.svg`. Füge weitere Dateien hinzu und ergänze sie im Array `carouselImages` in `script.js`.
- **Content:** Bilder für Module in `assets/content/`
  - Verwendete Slots: `content-1.svg`, `content-2.svg`, `content-3.svg`, `content-4.svg`, `content-overlay.svg` (Overlay-Modul), `content-quote.svg` (Zitat-Hintergrund) sowie `gallery-1.svg` bis `gallery-4.svg`.
- Die vorhandenen SVGs sind hochwertige Platzhalter (warme Farbverläufe, subtile Körnung) und können direkt durch eigene Fotos ersetzt werden. Nutze identische Dateinamen, um nichts am Markup ändern zu müssen.

## Fonts & Farben
- Schriftvariablen in `styles.css` (`--font-heading`, `--font-body`) können auf andere Webfonts oder lokale Fonts angepasst werden.
- Primärfarbe: Old Lace `#FDF5E6`
- Akzent: Dunkles Grün `#1F2D24` (leicht variabel, siehe `--color-accent`).

## Carousel steuern
- Der Slider liest die Bildpfade aus dem Array `carouselImages` in `script.js` und wechselt automatisch alle 4 Sekunden (Fade). Dots lassen manuelles Springen zu.
- Um eigene Bilder zu verwenden, lege sie in `assets/carousel/` ab und ergänze die Pfade im Array.

## Entwicklung & Struktur
- Startseite: `home.html` (Hero + Carousel-Block + zusammenhängende Content-Module)
- Gemeinsame Navigation in allen Seiten, sticky/fixed über dem Hero-Bereich.
- Styles: `styles.css`
- Verhalten: `script.js`

Keine Build-Tools notwendig – die Seiten können direkt im Browser geöffnet werden.

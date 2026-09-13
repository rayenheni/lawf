# lawf — site du cabinet, trilingue et statique

Site d'un cabinet d'avocat à Tunis, en **français, anglais et arabe** (page arabe
entièrement RTL), sous forme de **HTML / CSS / JS vanilla** : aucun build, aucun
framework, aucune dépendance à l'exécution. Chaque langue est un vrai document
statique, donc crawlable sans JavaScript.

```
index.html            page française (racine)
en/index.html         page anglaise
ar/index.html         page arabe (dir="rtl")
assets/css/style.css  feuille de style unique (propriétés logiques : 1 fichier = 2 directions)
assets/js/main.js     ~90 lignes : menu mobile, compteurs, composeur WhatsApp/e-mail, année
assets/img/           images servies (WebP + JPEG de repli, générées par npm run images)
assets/original/      originaux intouchés (source du pipeline d'images)
robots.txt sitemap.xml assets/favicon.svg
scripts/check.mjs     vérifications statiques lancées par la CI
```

## Servir le site

```bash
npm run serve          # http://localhost:5173  (python3 -m http.server)
```

N'importe quel hébergement statique fonctionne (CDN, objet storage, Apache,
nginx…) : copiez le dépôt tel quel. Conservez la structure `/`, `/en/`, `/ar/`
et remplacez `https://www.cabinet-majdoub.tn` (utilisé dans canonical, hreflang,
sitemap et JSON-LD) par le domaine réel.

## Modifier le contenu

Chaque page est autonome : ouvrez-la et éditez le texte directement. Les trois
pages partagent la même structure de sections —

1. **hero** (badge, titre, lead, 2 CTA, 3 repères, image, bandeau de 4 compteurs)
2. **citation** (bandeau sombre)
3. **services** (6 cartes numérotées)
4. **cabinet** (portrait + badge d'expérience, méthode, 4 engagements)
5. **avis** (4 cartes à initiales + note de transparence)
6. **bandeau CTA** (rendez-vous + téléphone)
7. **contact** (composeur honnête + coordonnées)
8. **pied de page** (navigation, coordonnées, mentions légales dépliables)

— donc une modification de structure se reporte sur les 3 fichiers.

## Le formulaire est honnête par construction

Aucun backend : les boutons **WhatsApp** et **e-mail** construisent en direct
(`assets/js/main.js`) le message à partir des champs, puis ouvrent l'application
du visiteur. Le site n'affiche jamais « message envoyé » : rien n'est transmis
en silence, rien n'est stocké. Le jour où un vrai point d'entrée existe,
remplacez le composeur par un `fetch` vers celui-ci.

## Images

```bash
npm install            # installe sharp (seule dépendance, de développement)
npm run images         # assets/original/ -> assets/img/ (WebP + JPEG progressif)
```

## Accessibilité & RTL

Lien d'évitement, menu mobile via l'attribut `hidden` (hors tab-order quand
fermé, Escape pour fermer), labels appariés aux champs, `aria-current` sur la
langue active, `prefers-reduced-motion` respecté, contrastes mesurés (le laiton
sur fond clair utilise `--gold` #8a6c30, ≥ 4.5:1). La feuille de style n'emploie
que des propriétés logiques (`margin-inline`, `padding-inline`,
`inset-inline-end`) : la page arabe se contente de `dir="rtl"`, avec polices
arabes dédiées et annulation du crénage latin.

## Données de démonstration

Coordonnées, chiffres et témoignages sont des **placeholders** ; les trois pieds
de page le signalent. Avant mise en ligne pour un praticien réel : remplacer les
coordonnées, substituer des avis recueillis avec consentement écrit, compléter
l'hébergement dans les mentions légales et déclarer le traitement à l'INPDP.

## CI

`.github/workflows/ci.yml` exécute `npm run check` : présence et `lang`/`dir`
des 3 pages, hreflang + canonical, ancres internes résolues, assets locaux
présents, labels de formulaire appariés.

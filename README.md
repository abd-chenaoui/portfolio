# Portfolio — Abdallah Chenaoui

Portfolio professionnel de développeur web, conçu avec une attention particulière à la performance, l'accessibilité et l'UI/UX.

## Stack technique

- **HTML5** — Sémantique, accessibilité WCAG 2.2 AA
- **CSS3** — Custom properties, animations CSS-driven, responsive mobile-first
- **JavaScript** — Vanilla JS, Web Animations API, IntersectionObserver
- **Three.js** — Globe 3D interactif (projet Globe Intelligence)

## Projets présentés

| # | Projet | Description |
|---|--------|-------------|
| 01 | **Globe Intelligence** | Dashboard mondial interactif avec globe 3D (Three.js), données temps réel : météo, séismes, ISS, crypto |
| 02 | **Maison de Luxe** | E-commerce de joaillerie haut de gamme, design épuré et animations premium |
| 03 | **Sporting** | Boutique d'équipement sportif dynamique, design énergique |
| 04 | **Amber & Oak** | Boutique de spiritueux premium, ambiance raffinée |
| 05 | **UI/UX Showcase** | Démonstration de compétences en design d'interfaces et design systems |

## Structure

```
Portfolio/
├── index.html              # Landing page principale
├── css/
│   ├── main.css            # Design tokens + styles principaux
│   └── animations.css      # Keyframes + animations CSS
├── js/
│   ├── main.js             # Interactions, scroll reveal, navigation
│   └── sakura.js           # Animation pétales canvas
├── assets/
│   └── images/projects/    # Vitrines des projets
├── projects/
│   ├── globe-dashboard/    # Globe Intelligence
│   ├── luxury-store/       # Maison de Luxe
│   ├── sport-store/        # Sporting
│   ├── drinks-store/       # Amber & Oak
│   └── ui-ux/              # UI/UX Showcase
└── Cv-Chenaoui-Abdallah-PF.pdf
```

## Performance

- Score Lighthouse 90+ (Performance, Accessibilité, SEO, Best Practices)
- Images optimisées avec `fetchpriority`, `loading="lazy"`, dimensions explicites
- Fonts avec `preconnect` + `font-display: swap`
- Animations sur `transform` et `opacity` uniquement (composite GPU)
- CSS Scroll-Driven Animations (zéro JS pour la barre de progression)

## Contact

- **Email** : chenaoui.abd@gmail.com
- **LinkedIn** : [abd-chenaoui-pro](https://www.linkedin.com/in/abd-chenaoui-pro)
- **GitHub** : [abd-chenaoui](https://github.com/abd-chenaoui)

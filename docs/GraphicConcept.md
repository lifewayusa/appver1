## ✨ LifeWayUSA — Complete Visual Blueprint

*(inspired by the “My Religion” template anatomy, adapted to LifeWayUSA brand, content and UX flows)*

| Template Zone (reference)              | LifeWayUSA Equivalent                    | Visual & Interaction Details                                                                                                                                                                                                                                                                                                                                                                | Data / Logic Hook-ups                                                                     |         |         |
| -------------------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ------- | ------- |
| **Top Utility Bar**<br>Social + Donate | **Immigration Hot-Line Bar**             | 32 px tall; left side: 🇧🇷→🇺🇸 flag icon, “Precisa de ajuda? +1 (305) 555-USAV”; right side: language switcher *PT • EN*, tiny WhatsApp icon link. Petrole-blue background (`#084c61`), text **Figtree 500** white. Sticky above header.                                                                                                                                                  | Static; WhatsApp link fires GA event “click\_hotline”.                                    |         |         |
| **Main Header / Mega-Menu**            | **Branded Navbar**                       | White bar (96 px); left: LifeWayUSA logo **Libre Baskerville 700** 32 px; centre: nav links *Home, Por Que Mudar, Planos, Blog, Destinos*; right: `Entrar / Cadastrar` button (petrole blue + white) or avatar dropdown when logged-in, plus ⚙️ icon if `is_editor`. Hover reveals 3-column mega-dropdown under *Destinos* (USA flag map, regions, “Top 10 States”). Sticky; subtle shadow. | Clerk hooks determine auth state; active link highlighted with lilac underline `#e9d5ff`. |         |         |
| **Hero Slider**                        | **“Dream Big” Carousel**                 | Full-width (100 vh) Ken-Burns slider cycling through 4 inspirational images (family at airport, student on campus, entrepreneur networking, skyline). Overlay: **H1 Libre Baskerville 56 px white**, **subtitle Figtree 24 px**; CTA button *“Descubra Seu Perfil”* (opens MultiStepForm). Autoplay + swipe gestures.                                                                       | Each slide’s CTA passes a different preset into the form (\`profileType=family            | student | pro\`). |
| **Four-Tile Mission Grid**             | **Tools Showcase Grid**                  | Row of 6 cards (wrap to 3×2 on tablet). Icons in lilac circles: *DreamCreator, GetOpportunity, VisaMatch, CalcWay, ServiceWay, InterviewSim*. Hover = scale 1.05 + drop-shadow. Card text **15 px Figtree**, titles **20 px bold**. Background alternates white / lilac `#e9d5ff`.                                                                                                          | Clicking a card scrolls to section OR triggers tool modal if `qualify=true`.              |         |         |
| **About Block (Pastor image + text)**  | **“Why the USA?” Story Block**           | Split layout: left side illustration (vector of Statue of Liberty blended with Brazilian passport); right side copy: H2 “Porque você deveria se mudar para os EUA?” + 4 benefit bullets (Segurança, Educação, Oportunidades, Qualidade de Vida) with petrole-blue check icons. *Continue Reading →* anchors to detailed blog post.                                                          | Bullet list animated with fade-in on scroll (AOS).                                        |         |         |
| **Latest Sermons (cards with audio)**  | **Latest Blog / Podcast Teasers**        | 3-card carousel of MDX blog posts. Each card: cover photo, tag (plane, study, business), meta, 200-character excerpt, *“Ouça o resumo”* small play button (TTS snippet). Shadows identical to template.                                                                                                                                                                                     | MDX source; TTS pre-generated and cached in Supabase Storage.                             |         |         |
| **Quote + Newsletter CTA**             | **“Prepare-se para Partir” Lead Magnet** | Parallax background of airplane wing at sunrise; center quote: **“Planos bem-traçados encurtam o caminho até o sonho.”** – Mark Twain, overlay colour `rgba(8,76,97,0.85)`. Email capture form (only e-mail) with lilac submit button.                                                                                                                                                      | Submits to Supabase `prospects`, triggers n8n → Mailgun sequence.                         |         |         |
| **Our Causes (donations)**             | **Pricing Plans Strip**                  | Masonry replaced by 3 pricing cards (Free, Pro, Premium). White cards on petrole background, subtle blur behind. Each card: price, features checklist, *Assinar* CTA (stripe checkout). Middle (Pro) card pops on hover.                                                                                                                                                                    | Stripe link; when payment success → Clerk `pro=true` set via webhook.                     |         |         |
| **Volunteer CTA Banner**               | **CTA “Simule seu Visto”**               | Wide banner, petrole background + white heading **“Pronto para começar? Faça o VisaMatch agora.”** Arrow-right button in lilac.                                                                                                                                                                                                                                                             | Scrolls to VisaMatch section or opens tool directly.                                      |         |         |
| **Next Events**                        | **Upcoming Webinars / Lives**            | Left: highlighted webinar card (date badge). Right: list of next 5 webinars about visas, job market, education. Badge uses lilac rotated square 48 px. *Ver Agenda Completa* link.                                                                                                                                                                                                          | Pulls from `events` table; counts down H-M-S client-side.                                 |         |         |
| **Latest News (Blog)**                 | **Destination Highlights Grid**          | 3-column grid of destination articles (cities, states). Thumbnail with petrole overlay, slug, excerpt. *Continue Reading*.                                                                                                                                                                                                                                                                  | Slug matches `/destinos/[slug]`.                                                          |         |         |
| **Testimonials Slider**                | **Success Stories Carousel**             | 3 quotes from users “Family X got the Green Card in 12 months”. Photo in circle, role “Cliente Pro”. Same auto-slide mechanics.                                                                                                                                                                                                                                                             | Data in `stories` table.                                                                  |         |         |
| **Footer**                             | **Site Footer**                          | 400 px high, solid petrole `#084c61`. 4 columns: Links rápidos, Ferramentas, Recursos, Redes Sociais. Bottom row: slogan “Turning Dreams into Plans”, © LifeWayUSA 2025. All text white; hover links lilac.                                                                                                                                                                                 | Social icons use simple-icons SVG; GA outbound tracking.                                  |         |         |

---

### Typography & Palette (mapped)

| Aspect        | Template Font          | LifeWayUSA Mapping                 |
| ------------- | ---------------------- | ---------------------------------- |
| Display H1–H2 | Playfair Display serif | **Libre Baskerville** (brand spec) |
| Body / UI     | Open Sans              | **Figtree**                        |

| Colour Role     | Template Tone      | LifeWayUSA Hex           |
| --------------- | ------------------ | ------------------------ |
| Primary accent  | Burgundy (#8b2333) | **Petrole Blue #084c61** |
| Secondary       | Gold highlight     | **Lilac #e9d5ff**        |
| Card background | Light gray         | **Gray #f3f4f6**         |
| Text dark       | Charcoal           | **Black #000000**        |
| Neutral light   | White              | **White #ffffff**        |

---

### Responsive Behaviour

* **Desktop ≥ 1280 px** – identical to template grid counts.
* **Tablet 768-1279 px** – Hero slider keeps parallax; tools grid 3×2; pricing cards stack 2+1.
* **Mobile ≤ 767 px** – Burger menu, hero becomes swipe slider, grids collapse to 1 column with horizontal snap scroll for cards.

---

### Micro-Interactions (matching template)

| Element       | Interaction                                    |
| ------------- | ---------------------------------------------- |
| Hero CTA      | Button pulses every 6 s (scale 1.02 → 1).      |
| Tool Cards    | Lift + shadow + icon wiggle on hover.          |
| Pricing Cards | Pro card y-translate −8 px on hover.           |
| Testimonials  | Auto-slide, manual swipe on touch devices.     |
| Form Inputs   | Border changes to lilac on focus; error shake. |

---

### Component Library References

* **Carousel / Slider:** Keen-Slider (mirrors template Ken-Burns & card carousels).
* **Parallax / Ken-Burns:** simple-parallax.js on hero backgrounds.
* **Progress Bars:** Tailwind `bg-lilac` + `transition-[width]` for Stripe-like grow.

---

### Asset & Illustration Guidelines

1. **Unsplash / Pexels** images reflecting immigration moments (airport, campus, families).
2. Use **Feather Icons** or Heroicons for the 6 tool symbols, recoloured `#e9d5ff`.
3. Abstract SVG waves (lilac) separating sections to echo template’s soft dividers.

---

### Accessibility & Performance Targets

* Colour contrast ≥ 4.5:1 against petrole background.
* All sliders keyboard-navigable (`tab`, `arrow keys`).
* Image widths via `next/image` `sizes` prop to keep LCP < 2 s.
* Live-region for MultiStepForm validation messages.

---

### How This Mapping Serves UX Goals

| LifeWayUSA KPI         | Visual Mechanism (template-inspired)                                                |
| ---------------------- | ----------------------------------------------------------------------------------- |
| **Upgrade 20 %**       | Pricing strip front-and-centre with standout Pro card animation + sticky CTA.       |
| **Abandon < 15 %**     | Hero CTA jumps straight into MultiStepForm; progress saved in localStorage banner.  |
| **Tool latency < 3 s** | Tools loaded as dialog overlays (no route change) and pre-fetch TTS / AI endpoints. |

---

With this blueprint, devs and designers can reproduce the engaging, conversion-oriented feel of the My Religion template while staying fully consistent with LifeWayUSA’s brand, functional flows and content architecture.

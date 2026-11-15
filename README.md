# LEO project page

Source of the project page for "LEO: Latent Episodic Overview for Action Chunking Transformers"
(CMU 16-831, Fall 2026).

- `index.html`: page shell. No build step; React and htm are loaded from a CDN.
- `static/js/data.js`: all content (authors, results table, clips, references). Edit numbers and citations here.
- `static/js/app.js`: React components (section nav, summary, rollout picker, results table, method tabs).
- `static/css/index.css`: page styles on top of the Nerfies template (Bulma).
- `videos/`: side-by-side rollout clips and their poster images.

Preview locally with `python3 -m http.server` and open http://localhost:8000.

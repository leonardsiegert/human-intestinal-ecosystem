# Microbiome Visualization App

An interactive web application for exploring microbiome distributions and their correlation with population health factors. Built as a data-driven visualization tool with a focus on clarity, usability, and responsive design.

---

## Purpose

The human gut contains a rich microbiome whose composition can reflect or influence various aspects of population health. This project provides interactive visualizations to:

- Explore microbiome abundance distributions
- Investigate correlations between microbial species and population groups
- Reveal patterns and clusters in microbiome data

---

## Live Demo
<!-- 
**[Try it live on Render](https://your-render-app-url.com)** -->

**[Watch the demo video](demo.webm)**

---

## Tech Stack

- **Frontend**: JavaScript, D3.js, HTML5, CSS3
- **Backend**: Flask (Python)
- **Data Handling**: Pandas, Numpy, sklearn, JSON
- **Visualization**: D3.js interactive SVGs
<!-- - **Deployment**: Render
- **Containerization**: Docker
- **CI/CD**: GitHub Actions -->
- **Version Control Workflow**: Git, feature branches, pull requests

---

## Authorship & Contributions
---

#### [Leonard Siegert] (https://github.com/leonardsiegert)
- Clustering visualizations and interactive selection (D3.js)
- Data preprocessing and project structure organization
- Responsive design for mobile and desktop
- Flask server co-development and GitHub management
- Planned Dockerization and CI/CD setup
- README writing

#### [Dexter Früh] (https://github.com/dexterfrueh)
- Sunburst and tree visualizations (D3.js)
- Side-by-side layout and selection syncing across views
- Code cleanup and documentation with docstrings
- Histogram visualizations (co-developed)
- Flask server co-development and GitHub management

We followed a **real-world Git workflow**: using feature branches, code reviews, and pull requests to simulate a professional development process.

---

## What We Learned

- Designing mobile-responsive data visualizations with D3
- Collaborative software engineering practices via GitHub
<!-- - Building production-ready Flask apps with Docker
- Deploying containerized apps on cloud platforms like Render
- Managing CI/CD workflows with GitHub Actions -->
- Writing clear documentation and modular code

---

## How to Run Locally

### Clone the repository

```bash
git clone https://github.com/leonardsiegert/human-intestinal-ecosystem.git
cd human-intestinal-ecosystem
```

<!-- ### Build And Run Using Docker

```bash
docker build -t microbiome-app .
docker run -p 5000:5000 microbiome-app
``` -->

### Using A Virtual Environment

### 1. Create and activate a virtual environment

```bash
python3 -m venv venv
source venv/bin/activate     # On Windows: venv\Scripts\activate
```

### 2. Install Python dependencies

```bash
pip install -r requirements.txt
```

### 3. Start the Flask server

For development server:

```bash
python app/app.py
```

Then open http://localhost:5000 in your browser.

For production server:

```bash
gunicorn app.app:app
```
Then open http://127.0.0.1:8000 in your browser.

---
## Data & Licensing
### Microbiome Dataset

#### Source:
Lahti, L. et al. Tipping elements in the human intestinal ecosystem. Nat. Commun. 5:4344 doi: 10.1038/ncomms5344 (2014).\
Via datadryad: https://doi.org/10.5061/dryad.pk75d

#### License:
The data is in the public domain — you are free to copy, modify, distribute, and use the data for any purpose, including commercial use, without asking permission: \
https://creativecommons.org/publicdomain/zero/1.0/

### Code License

This project is licensed under the [GNU General Public License v3.0](./LICENSE)

You are free to use, modify, and distribute this software under the same license, provided you disclose source code and keep derivative works open.

<!-- ## Future Work

- Add filtering by species or metadata (e.g. age, diet)

- Include time-series microbiome data (longitudinal tracking)

- Improve accessibility and mobile usability

- Add user-upload feature for custom datasets -->
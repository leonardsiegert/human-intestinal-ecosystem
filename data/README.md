# Data Preprocessing

This folder contains scripts and processed datasets used to prepare input for the visualizations in the Flask app. It includes data cleaning, dimensionality reduction, clustering, and taxonomy resolution.

The cleaned dataset (`data_cleaned.csv`) is used as the base for all preprocessing. The two derived datasets (`cluster_data.csv`, `lineage_data.csv`) are generated through exploratory analysis and manual annotation.


---

## 📊 Dataset Descriptions

### `data_cleaned.csv`
A cleaned and reindexed version of the original dataset. This is used by the **sunburst** and **histogram** visualizations in the Flask app. Only minimal corrections and reindexing are made.

### `cluster_data.csv`
Created by running `clustering/dim_red.ipynb`. This dataset includes:
- 2D projections of bacterial abundance data using PCA, KernelPCA, and TSNE
- Cluster labels from DBSCAN and K-Means

This dataset is **only used for the clustering visualization**.

### `lineage_data.csv`
Created by running `lineage/taxonomy.ipynb`. It contains full taxonomic classification for each bacterium, including:
- Phylum, Class, Order, Family, Genus, and Species

Used in the **sunburst** and **tree plot** visualizations.

---

## 🧪 Data Preprocessing Setup

This data preprocessing environment requires **Python 3.11 or lower**, due to compatibility issues with the `taxonomy-ranks` package.

You can use either **conda** or **virtualenv** to set up an environment for data exploration.

---

### Option 1: Using Conda

Create and activate a conda environment with Python 3.11:
```bash
conda create -n data-env python=3.11 pip
conda activate data-env
```

Install dependencies:
```bash
pip install -r requirements-data.txt
```

### Option 2: Using Virtualenv (venv)

Create and activate a virtual environment (requires Python 3.11):
```bash
python3.11 -m venv data-env
source data-env/bin/activate  # On Windows: data-env\Scripts\activate
```


Upgrade pip and install dependencies:
```bash
pip install --upgrade pip
pip install -r requirements-data.txt
```


# Notebooks Overview
## clustering/dim_red.ipynb

This notebook performs exploratory clustering and dimensionality reduction.

Techniques explored:

- Dimensionality Reduction: PCA, KernelPCA (RBF), and TSNE
- Clustering: DBSCAN and K-Means
- Visualization: Samples are projected into 2D space for visual inspection

Exports cluster_data.csv, which includes:
- Coordinates for each 2D projection method
- Cluster labels

Used for the interactive clustering plot in the app.

## lineage/taxonomy.ipynb

This notebook corrects, completes, and validates bacterial taxonomy.

Process:
- Missing or ambiguous taxa were manually inspected via the NCBI Taxonomy Browser (https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi)
- Misspellings and incomplete lineages were imputed manually

Exports lineage_data.csv, with the following ranks:
- Phylum, Class, Order, Family, Genus, Species.

Used by the sunburst and tree plot views in the app.


# Licensing

The original dataset is licensed under CC0 1.0 Universal (Public Domain Dedication).
You are free to copy, modify, and distribute the data without asking permission.
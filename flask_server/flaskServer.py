#!flask/bin/python
from flask import Flask, render_template, redirect, url_for
import os
import sys


app = Flask(__name__)
app.config['DEBUG'] = True

@app.route('/')
def index():
    return redirect(url_for('landing_page'))

@app.route('/landing_page')
def landing_page():
    return render_template('landing_page.html')


@app.route('/treeplot')
def treeplot():
    return render_template('sunburst/tree_plot.html', data = "'static/data/lineage/lineage_data.csv'" )

@app.route('/sunburst')
def sunburst():
    return render_template('sunburst/sunburst_plot.html', data_taxo = "'static/data/lineage/lineage_data.csv'", data_sampl = "'static/data/data_cleaned.csv'")

@app.route('/clustering')
def clustering():
    return render_template('clustering/clustering.html', data="'static/data/clustering/cluster_data.csv'")

@app.route('/sidebyside')
def sidebyside():
    return render_template('sidebyside.html', data="'static/data/clustering/cluster_data.csv'", data_taxo="'static/data/lineage/lineage_data.csv'", data_sampl="'static/data/data_cleaned.csv'")

@app.route('/histograms')
def histograms():
    return render_template('histograms.html', data="'static/data/data_cleaned.csv'")

@app.route('/sex_heatmap')
def sex_heatmap():
    return render_template('heatmap/sex_heatmap.html', data="'static/data/pca/sex_bacteria.csv'")

@app.route('/nationality_heatmap')
def nationality_heatmap():
    return render_template('heatmap/nationality_heatmap.html', data="'static/data/pca/nationality_bacteria.csv'")

@app.route('/BMI_heatmap')
def BMI_heatmap():
    return render_template('heatmap/BMI_heatmap.html', data="'static/data/pca/BMI_bacteria.csv'")

@app.route('/age_heatmap')

def age_heatmap():
    return render_template('heatmap/age_heatmap.html', data="'static/data/pca/age_bacteria.csv'")
if __name__ == '__main__':
    app.run(debug=True, port=5000)

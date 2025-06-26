#!flask/bin/python
from flask import Flask, render_template, redirect, url_for

app = Flask(__name__)
app.config['DEBUG'] = True

@app.route('/')
def index():
    """Redirect to the landing page."""
    return redirect(url_for('landing_page'))

@app.route('/landing_page')
def landing_page():
    """Render the landing page."""
    return render_template('landing_page.html')

@app.route('/tree')
def tree():
    """Render the tree plot visualization."""
    return render_template('tree.html', data="'static/data/lineage/lineage_data.csv'")

@app.route('/sunburst')
def sunburst():
    """Render the sunburst plot visualization."""
    return render_template('sunburst.html', data_taxo="'static/data/lineage/lineage_data.csv'", data_sampl="'static/data/data_cleaned.csv'")

@app.route('/clustering')
def clustering():
    """Render the clustering visualization."""
    return render_template('clustering.html', data="'static/data/clustering/cluster_data.csv'")

@app.route('/sidebyside')
def sidebyside():
    """Render the side-by-side comparison page."""
    return render_template('sidebyside.html', data="'static/data/clustering/cluster_data.csv'", data_taxo="'static/data/lineage/lineage_data.csv'", data_sampl="'static/data/data_cleaned.csv'")

@app.route('/histograms')
def histograms():
    """Render the histograms page."""
    return render_template('histograms.html', data="'static/data/data_cleaned.csv'")

if __name__ == '__main__':
    app.run(debug=True, port=5000)

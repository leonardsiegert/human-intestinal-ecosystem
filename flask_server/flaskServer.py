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
    return render_template('sunburst/sidebyside.html', data="'static/data/clustering/cluster_data.csv'", data_taxo="'static/data/lineage/lineage_data.csv'", data_sampl="'static/data/data_cleaned.csv'")

@app.route('/sunburst_test')
def sunburst_test():
    return render_template('sunburst/sunburst_plot_test.html', data_taxo="'static/data/lineage/lineage_data.csv'", data_sampl="'static/data/data_cleaned.csv'")

@app.route('/clustering_test')
def clustering_test():
    return render_template('clustering/clustering_test.html', data="'static/data/clustering/cluster_data.csv'")

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





@app.route('/male')
def male():
    return render_template('pca/male.html', data="'static/data/pca/male_loading.csv'")

@app.route('/female')
def female():
    return render_template('pca/female.html', data="'static/data/pca/female_loading.csv'")

@app.route('/Scandinavia')
def Scandinavia():
    return render_template('pca/Scandinavia.html', data="'static/data/pca/Scandinavia_loading.csv'")

@app.route('/CentralEurope')
def CentralEurope():
    return render_template('pca/CentralEurope.html', data="'static/data/pca/CentralEurope_loading.csv'")

@app.route('/US')
def US():
    return render_template('pca/US.html', data="'static/data/pca/US_loading.csv'")

@app.route('/UKIE')
def UKIE():
    return render_template('pca/UKIE.html', data="'static/data/pca/UKIE_loading.csv'")

@app.route('/SouthEurope')
def SouthEurope():
    return render_template('pca/SouthEurope.html', data="'static/data/pca/SouthEurope_loading.csv'")

@app.route('/EasternEurope')
def EasternEurope():
    return render_template('pca/EasternEurope.html')
    
@app.route('/lean')
def lean():
    return render_template('pca/lean.html', data="'static/data/pca/lean_loading.csv'")

@app.route('/morbidobese')
def morbidobese():
    return render_template('pca/morbidobese.html', data="'static/data/pca/morbidobese_loading.csv'")

@app.route('/obese')
def obese():
    return render_template('pca/obese.html', data="'static/data/pca/obese_loading.csv'")

@app.route('/overweight')
def overweight():
    return render_template('pca/overweight.html', data="'static/data/pca/overweight_loading.csv'")

@app.route('/Age15_24')
def Age15_24():
    return render_template('pca/Age15_24.html', data="'static/data/pca/Age15_24_loading.csv'")

@app.route('/Age25_34')
def Age25_34():
    return render_template('pca/Age25_34.html', data="'static/data/pca/Age25_34_loading.csv'")

@app.route('/Age35_44')
def Age35_44():
    return render_template('pca/Age35_44.html', data="'static/data/pca/Age35_44_loading.csv'")

@app.route('/Age45_54')
def Age45_54():
    return render_template('pca/Age45_54.html', data="'static/data/pca/Age45_54_loading.csv'")

@app.route('/Age55_64')
def Age55_64():
    return render_template('pca/Age55_64.html')

@app.route('/Age65_74')
def Age65_74():
    return render_template('pca/Age65_74.html', data="'static/data/pca/Age65_74_loading.csv'")

@app.route('/Age75_84')
def Age75_84():
    return render_template('pca/Age75_84.html', data="'static/data/pca/Age75_84_loading.csv'")


if __name__ == '__main__':
    app.run(debug=True, port=5000)

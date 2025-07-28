import sys
import os
import pytest
# Add the app directory to the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../app')))
from app import app

@pytest.fixture
def client():
    with app.test_client() as client:
        yield client

######### Test if root redirects to landing_page #########
def test_root(client):
    assert client.get("/").status_code == 302  # Redirect to landing page
    assert client.get("/").location.endswith("/landing_page")

######### Test each endpoint #########
def test_landing_page(client):
    response = client.get("/landing_page")
    assert response.status_code == 200
def test_sidebyside(client):
    response = client.get("/sidebyside")
    assert response.status_code == 200
def test_tree(client):
    response = client.get("/tree")
    assert response.status_code == 200
def test_sunburst(client):
    response = client.get("/sunburst")
    assert response.status_code == 200
def test_clustering(client):
    response = client.get("/clustering")
    assert response.status_code == 200
def test_histograms(client):
    response = client.get("/histograms")
    assert response.status_code == 200

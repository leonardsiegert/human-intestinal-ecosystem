# ---- Base ----
FROM python:3.11-slim AS base

# set the working directory
WORKDIR /code

# copy the requirements file into the container at /app
COPY requirements.txt requirements.txt

# update pip and install dependencies
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt


# ---- Development Stage ----
FROM base AS dev

# copy the requirements file into the container at /app
COPY data/requirements-data.txt data/requirements-data.txt

# update pip and install dependencies
RUN pip install --no-cache-dir -r data/requirements-data.txt

COPY . .

# expose the port the app runs on
EXPOSE 5000 8888


# ---- Production Stage ----
FROM base AS prod

# copy the current directory contents into the container at /app
COPY app/ app/

# remove unnecessary files
RUN rm -rf app/__pycache__ requirements.txt

# expose the port the app runs on
EXPOSE 8000

# run the application
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "app.app:app"]
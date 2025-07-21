FROM python:3.11-slim

# set the working directory
WORKDIR /app

# copy the requirements file into the container at /app
COPY requirements.txt requirements.txt

# update pip and install dependencies
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# copy the current directory contents into the container at /app
COPY app/ app/

# expose the port the app runs on
EXPOSE 8000

# run the application
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "app.app:app"]
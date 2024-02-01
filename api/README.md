# Running the API Locally

```sh
flask run
```

# Running the API on Docker

```sh
docker build --tag syllapedia_api .
docker run --dns 8.8.8.8 --name syllapedia_api_container -d -p 5000:5000 syllapedia_api
```

# Setting up the environment (no venv file present)

```sh
python -m venv venv
venv/Scripts/activate
pip install -r requirements.txt
```

# Setting up the environment (venv file present)

```sh
venv/Scripts/activate
```

# Updating dependencies (after a git pull)

```sh
pip install -r requirements.txt
```

# Adding new dependencies (before a git commit)

```sh
pip freeze > requirements.txt
```
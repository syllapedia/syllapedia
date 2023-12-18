# Running the API

```sh
flask run
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
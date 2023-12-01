# Setting up the environment (no venv file present)

```sh
python -m venv venv & venv/Scripts/activate & pip install -r requirements.txt
```

# Setting up the environment (venv file present)

```sh
venv/Scripts/activate
```

# Running the API

```sh
flask run
```

# Update Dependencies

```sh
pip freeze > requirements.txt
```
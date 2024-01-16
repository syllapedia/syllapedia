FROM python:3.12-slim

WORKDIR /

COPY requirements.txt requirements.txt
COPY .env .env
RUN pip install -r requirements.txt

COPY . .
  
CMD [ "python", "-m" , "flask", "run", "--host=0.0.0.0"]
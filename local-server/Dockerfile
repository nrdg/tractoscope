FROM python:3.8-alpine

WORKDIR /app

COPY . /app

# install any dependencies, currently none exist
RUN if [ -f requirements.txt ]; then pip install -r requirements.txt; fi

EXPOSE 8000

# make a datasets directory
RUN mkdir -p /datasets

#run the python server on port 8000
CMD ["python", "host.py","--port","8000"]
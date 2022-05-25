from fastapi import FastAPI
import uvicorn
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import itertools
import random

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:3000'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

currencies = [
  {"key": "USD", "name": "United States Dollar"},
  {"key": "EUR", "name": "Euro"},
  {"key": "GBP", "name": "Pounds sterling"},
  {"key": "CHF", "name": "Swiss franc"},
  {"key": "CAD", "name": "Canadian Dollar"},
]

tickers = [c['key'] for c in currencies]

@app.get('/api/currency/rates')
def get_fake_currency_rates():
    rates = {}
    for (first,second) in itertools.product(tickers, tickers):
        if first == second:
            rates[f'{first}{second}'] = 1
        if f'{second}{first}' in rates:
            rates[f'{first}{second}'] = 1/rates[f'{second}{first}']
        else:
            rates[f'{first}{second}'] = random.uniform(.1, 10)

    return rates

@app.get('/api/currency/list')
def get_currency_list():
    return currencies

app.mount("/", StaticFiles(directory="build",html = True), name="build")

if __name__ == "__main__":
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)

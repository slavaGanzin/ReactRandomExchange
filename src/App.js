import "./index.css";
import {React, useEffect, useState} from "react";
import {CurrencyExchangeForm}
    from "./components/currency/CurrencyExchangeForm.js";
import {CurrencyTable} from "./components/currency/CurrencyTable.js";

const UPDATE_INTERVAL = 5000;

const api = (path) => fetch(
    `http://127.0.0.1:8000/api/${path}`,
    {"mode": "cors"}
).then((response) => response.json());

const App = () => {
    const [currencies, setCurrencies] = useState([]);
    const [rates, setRates] = useState({});

    useEffect(
        () => {
            const updateRates = () => api("currency/rates").then(setRates);

            setInterval(
                updateRates,
                UPDATE_INTERVAL
            );
            updateRates();
        },
        []
    );

    useEffect(
        () => {
            api("currency/list").then(setCurrencies);
        },
        []
    );

    let hidden = "";
    if (!Object.keys(rates).length || !currencies.length) {
        hidden = "hidden";
    }

    return (
        <div className={`App ${hidden}`}>
            <h1>Random Rates Currency Exchange</h1>
            <CurrencyExchangeForm currencies={currencies} rates={rates} />
            <CurrencyTable currencies={currencies} rates={rates} />
        </div>
    );
};

export {App};

import {React, useState} from "react";
import {CurrencySelect} from "./CurrencySelect.js";
import PropTypes from "prop-types";

import {SwapButton} from "./SwapButton.js";

const DEFAULT_AMOUNT = 100;
const ROUND_TO_DECIMALS = 2;

const changeAmount = (setAmount) => (event) => {
    if (isNaN(event.target.value)) {
        return;
    }

    setAmount(event.target.value);
};

const CurrencyExchangeForm = (props) => {
    const [fromCurrency, setFromCurrency] = useState("USD");
    const [toCurrency, setToCurrency] = useState("GBP");
    const [amount, setAmount] = useState(DEFAULT_AMOUNT);


    const swapCurrencies = () => {
        setFromCurrency(toCurrency);
        setToCurrency(fromCurrency);
    };

    const result = parseFloat(props.rates[`${fromCurrency}${toCurrency}`])
        .toFixed(ROUND_TO_DECIMALS);

    const updateCurrency = (event) => setToCurrency(event.target.value);

    return (
        <div className="CurrencyExchangeForm">
            <div className="FormInputs">
                <div>
                    <h3>Amount</h3>
                    <input onChange={changeAmount(setAmount)} value={amount} />
                </div>
                <div className="row">
                    <h3>From</h3>
                    <CurrencySelect selected={fromCurrency}
                        currencies={props.currencies}
                        onChange={updateCurrency} />
                </div>
                <div className="row">
                    <SwapButton onClick={swapCurrencies} />
                </div>
                <div className="row">
                    <h3>To</h3>
                    <CurrencySelect selected={toCurrency}
                        currencies={props.currencies}
                        onChange={updateCurrency} />
                </div>
            </div>
            <div>
                <h3>{amount} {fromCurrency} = </h3>
                <h1 className="result">{result} {toCurrency}</h1>
            </div>
        </div>
    );
};

CurrencyExchangeForm.propTypes = {
    "currencies": PropTypes.arrayOf(PropTypes.shape({
        "key": PropTypes.string,
        "name": PropTypes.string
    })),
    "rates": PropTypes.objectOf(PropTypes.number)
};

export {CurrencyExchangeForm};

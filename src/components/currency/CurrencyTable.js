import {React, useState} from "react";
import PropTypes from "prop-types";

const ROUND_TO_DECIMALS = 2;
const round = (value) => parseFloat(value).toFixed(ROUND_TO_DECIMALS);

const CurrencyTable = (props) => {
    const [selected, setSelected] = useState("USD");

    const rowClassName = (key) => {
        if (key === selected) {
            return "selected row";
        }
        return "row";
    };

    const rows = props.currencies.map(({name, key}) => <div
        key={key}
        className={rowClassName(key)}
        onClick={() => setSelected(key)}>
        <div>{name}</div>
        <div>{round(props.rates[key + selected])}</div>
    </div>);

    return <div className="CurrencyTable">
        <div className="header">
            <div>Currency</div>
            <div>Rate</div>
        </div>
        {rows}
    </div>;
};

CurrencyTable.propTypes = {
    "currencies": PropTypes.arrayOf(PropTypes.shape({
        "key": PropTypes.string,
        "name": PropTypes.string
    })),
    "rates": PropTypes.objectOf(PropTypes.number)
};

export {CurrencyTable};

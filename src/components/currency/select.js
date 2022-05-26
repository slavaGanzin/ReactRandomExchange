import PropTypes from "prop-types";
import {React} from "react";

const CurrencySelect = (props) => {
    const options = props.currencies
        .map(({name, key}) => <option key={key} value={key}>{name}</option>);

    return (
        <select
            name="CurrencySelect"
            value={props.selected}
            onChange={props.onChange}>
            {options}
        </select>
    );
};

CurrencySelect.propTypes = {
    "currencies": PropTypes.arrayOf(PropTypes.shape({
        "key": PropTypes.string,
        "name": PropTypes.string
    })),
    "onChange": PropTypes.function,
    "selected": PropTypes.number
};

export {CurrencySelect};

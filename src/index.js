import {React, useState, useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function CurrencySelect(props) {
  return (
    <select name="CurrencySelect" value={props.selected} onChange={props.onChange}>
      {props.currencies.map(({name, key}) => (<option key={key} value={key}>{name}</option>))}
    </select>
  )
}

function CurrencyExchangeForm(props) {
  const [fromCurrency, setFromCurrency] = useState('USD')
  const [toCurrency, setToCurrency] = useState('GBP')
  const [amount, setAmount] = useState(100)

  const changeAmount = event => {
    if (isNaN(event.target.value)) {
      return
    }

    setAmount(event.target.value)
  }

  const swapCurrencies = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }

  return (
    <div className='CurrencyExchangeForm'>
      <div className='FormInputs'>
        <div>
          <h3>Amount</h3>
          <input onChange={changeAmount} value={amount} />
        </div>
        <div className='row'>
          <h3>From</h3>
          <CurrencySelect selected={fromCurrency} currencies={props.currencies} onChange={event => setFromCurrency(event.target.value)} />
        </div>
        <div className='row'>
          <Swap onClick={swapCurrencies} />
        </div>
        <div className='row'>
          <h3>To</h3>
          <CurrencySelect selected={toCurrency} currencies={props.currencies} onChange={event => setToCurrency(event.target.value)} />
        </div>
      </div>
      <div>
        <h3>{amount} {fromCurrency} = </h3>
        <h1 className='result'>{parseFloat(props.rates[`${fromCurrency}${toCurrency}`]).toFixed(2)} {toCurrency}</h1>
      </div>
    </div>
  )
}


function CurrencyTable(props){
  const [selected, setSelected] = useState('USD')

  return (<div className="CurrencyTable">
      <div className='header'>
          <div>Currency</div>
          <div>Rate</div>
      </div>
      {props.currencies.map(({name, key}) => {
        return (
          <div key={key} className={(selected === key ? 'selected ': '')+'row'} onClick={() => setSelected(key)}>
            <div>{name}</div>
            <div>{parseFloat(props.rates[key+selected]).toFixed(2)}</div>
          </div>
        )
      })}
    </div>)
}

function App() {
  const [currencies, setCurrencies] = useState([]);
  const [rates, setRates] = useState({})

  useEffect(() => {
    const updateRates = () =>
      fetch('/api/currency/rates', {mode: 'cors'})
        .then(x => x.json()).then(setRates)
        .catch(console.error)

    setInterval(updateRates, 5000)
    updateRates()
  },[])

  useEffect(() => {
    fetch('/api/currency/list', {mode: 'cors'}).then(x => x.json()).then(setCurrencies).catch(console.error)
  }, [])

  return (
    <div className={"App "+ (!Object.keys(rates).length || !currencies.length ? 'hidden' : '')}>
      <h1>Random Rates Currency Exchange</h1>
      <CurrencyExchangeForm currencies={currencies} rates={rates} />
      <CurrencyTable currencies={currencies} rates={rates} />
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

function Swap(props) {
  return (<img className='Swap' onClick={props.onClick} src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANgAAADpCAMAAABx2AnXAAAAw1BMVEX///8AAAAICh/a2tvT09M5OTkAABkAABv7+/vx8fH19fXl5eXBwcEABBwAABSenp6kpKRTU1MAAAuOjo4AABB6enrHx8chISEqKiqtra23t7c/Pz8WFhZ0dHTr6+uioqJHR0dVVVWJiYlsbGzW1taAgIAxMTERERGMjIwcHBw8PDzh4eFeXl4+P0ojJTRubm5XV2AZGip9foeVlZxmZ253eIA6OkZaW2QwMD0fITATFCqGiZN7fYeWl55LTlg8Pk4AASL1YBluAAALLUlEQVR4nO1di1riOhA2pbZc5FYrCqsIqOu62gq0BbQH3Pd/qlNAkTLT0jShif34/dyjx904f5uZzC3JyckRRxxxxBFiUOiIluBAUEnzXrQMB4FKCLkoiZbiAFgSI6QuWgz+WBMjV2eiBeGNT2KEvDyLFoUvNsQIeSiLFoYntogR0hYtDUeEiJFfLdHycEOYWKBqXdESccIuMUL+5EPVIDFynQtVQ4gFqqaKFosdKDFC7iqiBWNFBDFCzouiRWNDJDFy+bMDmkIksUDVflxAU6wU1E598HDz+voSQywIaH7OqtY9u73rXcWyCeEnBDTFQiP+/aB4kjygqbRf6Umt0SyIFj4SlXovLasV5Axoyu1TJlYrNESzAFBv2Fkt8VuugKbDNgVDkCd3UGxc86O1hByqVmzwZRXgSobp2KZYhBNChjBN/c2d1oUE87CbwsHYAyksB3/l+i2DW1XhaOE/IcXqzP91SVGLKXHXLjmqZ/ePNDKf9l8f/sR7XI8yKNfJyW0yQlfNQUf9Co3jUgPkXCidDZK4u6c3nedQ+ik6mUNu5MgLlJt7WfVuKyCnFknsVJKkaeVpD6u/DdS6RRB7kiX3FqsqAR6iwnucmDTZ0hhNWQJ/WZH/Up78diuO1VWsVw6JyaJcJ/G8nvYEG7vEHmUITj4RNw/P9wUbO/94IEFw8oUYu9HcvxKFiPWlUa4A3Uhaj0lM9haxUzn8p08UI1MAL4m88m9iUgQn3+hH8Uoo5xcxGSL/bTxE0LpMmm9fE5MuPd+O4NVP/PyXxOTrEIsyiA/Jh1BlLIGVL3FetxRjqHfMkX+ryVs/IypeVI45s7f7/ELIK+sgYXRwXpkqTHFA/yz3oYTzyjS/vjFePDNZeEIqy/el/tr82hd+o+ITMUPfvHuXWrHjgE/E7Cx38XznV/OajBcYrwtOg+9HB6w0nH73M8arx2fs/Shg9QE+9Rhs5KfMkuxdLOPc4zHyGfbCMsxVoEE7D4P8Cxk303z0rulY4hf7sJipb7IPSwMs78xu8rGoOeN0RQUR4Yp1UEzDaDx6LsBKO6xa9hcOecpFWCogHVp/2UbE8qMC6o73iBhsHvgdHPCGk7BUQOpxdyzjYWorpESHZTRZTBiyhAgqqXKWBGlpE5QTLENJrtOPhpgOYTVw5JWlNx9IBkdYEhd5ZanzOshYFFlE3kAS0WmfMuJ1CGxMQ8LCtN4HXMQ45lHoATNKKZcyJPkrNPEOJ9BlurmIRHicRaUElCddvAsNrEDTsQQ0H+kWH5jrENy8AKdQL80wRdlmIjYX09Q5oNsheCZiCc40zkcdjCK8GAntYpp0NEyhCO8phMFLmrQSl0E4Az5s+jFgjClcxTCDTx9tQtshXMUwJaO3HrD7QYKdGdARpu/xAaaVIWDlBxDS01eU+rtDcEiXswMUEvrsQ0hgOxDrQf24SyBmkaIdFGynuaQt1EFrL4FRxMwirb2H9keOHTVALFpbDUeQYQcU0sBA+7zh+nwQQakBxKJdoWEh8yByUgOIRVvahI7HQeSkBhCL1lgDu/p0EDmpAfYL0fpUIMxkLvryASiJ04aaR2IZg5kYKNRfHkROagBPj7aFAVjFx4PISQ3QWUVrFXO7jkFv8yByUgOIReubw3SyFBtSYC2SNu0OvXsptqTA/Rq03j0kJmk8RkusC9ImUkTQwFhf06ani6AvS4rDAEDN7pS63gKyyfT5oAOgvysVfd4dVNalcD2A40FfX4dVJOHFFqzcQl9H4pEm5w4eBQW4YkiwWw9OoxSrKxhDaPfKGrCHJcUgwN5ntzsiCiWQGEjTnzwAT0d4yhQmOwcpRoGBi/AlGrbUpNlXAE2rgL70MGCXeqolCO6REHygAyyUpEvEwEq2YIMPjX26mh1cogVnquAUShdKIb3uQu0isl0ipZfXBwNltzETAeykShtwwMLEo8A1ugT3NKaNfZENIAKPTkFOc0xtpWErpkDzAU1HL/VYyNkkws5pQ7ZUps/CIE2mwl4ZsqWSIdOJbNsS9MqQF8aykQ3pUL8ScrgednIUU+s1smtdiGFETGKPaUDsaCMBSXxk+xBjAreIHH7J+dSaJED2ez0xqgT0qAXsK8COG2CNNBCLT35nbD+K2PnszDJgryzj1kXsbDb20BDxPTPOnWKbzHl449grY58IyYEpA5dYvogdjpbh5gLs0ItLLg8WPbwps/THH+y3c/LrkDNY6lmt0uhT5dVQDuoT7KfuJQV+yi23On84293LboFGT45KldfGEdpfm+XJaOihjin30qL4nhGDDA097P1fgeuE+Vz8Mz0SvIuf3svX7Vm5a9len1XBb/Dh7agWOCgXVd4WtxsH6HxqsZr40oCmoSLqlHYp+oNCaD/S1Nei7rphOgHoEFCXNbvkxKJudRReetxB5Y5KrOeoGxCfJOih2cLmpM6ExKLOxpaguh9CZxOpJiIWc+WSFB2TX9g6BjcRsejXJZVB7IZy5PuJqTEXmknQ8bTBTl/GPmJd5KS5Df5kInEinO2mgeKJdaMuCpCMVwHmKuKIPcfSEt8U9IUydo9XNLHWntvnMj+DMwJF/Nq1CGKV+r7L52S57uos4spQjNjz7f67zCRobV3iuR8l4C6x8tkgwfXRjxKcShGgjJ5IvkusWFYbFxG3VOygL8f1ZDGOQxD8FtTWWbv+cNPcd+XcN+Qwhy0OF5OHIYV7WOF+Y2hfeBdygDLsIWaFFFdDtZOrTUI0ZbigTOWuXFIsypU4rzwdZLhLHtzRwQ4p7vDucFeuDKs5MejzptWUxDMs8bXyd1K8rTUqfW60zmWw8Fvg40n1ZTDwu2C+Vr7ZkOxlfaEUn7KIx0tbrtR1GJX9kTCCp965JFYwBlEZgShO/Yv2vQzuewKgbVfwJd0N6m21JIHTlBxo1m0DxqtWxOI+RtVkK9tRAr3WKw/E8Hu1ckFsp3qUI2Lhel+uiKGNhvkghkTWOSEGE425IbabvcoRsSCguc4pse3cQb6IbeUO8kZskzvIH7HPonQOiQWqdpFTYsvGDymO7DoE5M9uHHHEEUecFHIK5LKyfOBEySmOxH4aPonpwWdV+f56DU1TqlvfBX9Fqyo/BGti2kRXqvZo9XV19vUzczg07cmG2UKrvk1nP4XZmljNdWumbxqmYhrEf9cMw9QM0m63G96cGIToGiEzlZCJ/6EJFjgp1sSqI98YjT1nTP5zvPF85jieNV8UFoS43alTUG2rUFi0rHv7I9M3VtUDXQg+9OWfmqKv/rtSh+X/Db5UdC34qCnLHwV6o+imrtS2iSmGo7iuZ3quS4ivnyvE84Zkoj6PXcdukWn7bELeuvc1Tc+Sl75YeP9GtdG7Zdo1fTi2JjXbHL2PA8K2aWvv7yPDHTqWM144Q98aj2dzqz36b2xuE6tNp/7QCbhZmuH/mxPT9RfB9NMKY2fRIZNOyzDsivqmx4jBH9U3z/fagcxt13PbC9+qjz3X/2gNyXjquZ5zG7Ahvmd5pj/2p3OHzO05scLEFL3hjXzNtuf6aDp1p4ozXWhz77w1KcwK3pnndDyrZRVIpsSCeeT67sKf1MfT8XziOr7jDnyr49rOwg9exHzoT3z3w3GGQ9e9dfyFN21Y84kWIlZzR5o98DTb9wyXuP5oNtOH52PTmFq6MzVIMCVd4k2yfmVKzdJntq1ZNVuxDFufkJn9Zs90y7C0kf1uKZPFbPY+q5mWMRsFf2MxWyzCxJRaoIlmbfUZfJjVQDO1wEoqNb1qBPpYMwMdrWXLa7W06opeXZuP9Wfw3ep7XVl/q+nLn69+EPwR2JJPs513zyN/OBL7afgf4kHRqzavczkAAAAASUVORK5CYII=' />)
}

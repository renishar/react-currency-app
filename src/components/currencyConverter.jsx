import React, { Component } from "react";
import fx from "money";
import CurrencyInput from "react-currency-input";

class CurrencyConverter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currencyList: [],
      currencyRates: [],
      baseCur: "USD",
      baseCurSymbol: "$",
      baseVal: "0.00",
      baseValMasked: "$0.00",
      targCur: "USD",
      targCurSymbol: "$",
      targVal: "0.00",
      targValMasked: "$0.00"
    };
  }

  handleConvertion = () => {
    let val = this.state.baseVal;
    let baseC = this.state.baseCur;
    let targC = this.state.targCur;
    let currencyRates = this.state.currencyRates;
    let converted = 0;
    if (val == 0) {
      // checking for input value
      alert("Enter Base Value to convert !");
    } else if (!(baseC in currencyRates)) {
      // checking for CurrencyRates availabilty
      alert("Exchange Rate for Selected Base Currency Not Available !");
    } else {
      fx.base = "EUR";
      fx.rates = currencyRates;
      converted = fx(val)
        .from(baseC)
        .to(targC);
      this.setState((prevState, props) => {
        return { targVal: converted, targValMasked: converted };
      });
      //console.log(val + " " + baseC + " to " + targC + " = " + converted);
    }
  };

  handleInputValue = (e, maskedvalue, floatvalue) => {
    this.setState({ baseVal: floatvalue, baseValMasked: maskedvalue });
  };

  handleTargetValue = (e, maskedvalue, floatvalue) => {
    this.setState({ targVal: floatvalue, targValMasked: maskedvalue });
  };

  handleBaseSelect = e => {
    let symbol = e.target[e.target.selectedIndex].getAttribute("data-symbol");
    let value = e.target[e.target.selectedIndex].value;
    this.setState({ baseCur: value, baseCurSymbol: symbol });
  };

  handleTargetSelect = e => {
    //let value = e.target[e.target.selectedIndex].value;
    //this.setState({ targCur: value });
    let symbol = e.target[e.target.selectedIndex].getAttribute("data-symbol");
    let value = e.target[e.target.selectedIndex].value;
    this.setState({
      targCur: value,
      targCurSymbol: symbol,
      targVal: 0, // set value to 0 when select changes after convertion
      targValMasked: 0
    });
  };

  componentDidMount() {
    let currencyDataUrl =
      "https://gist.githubusercontent.com/mddenton/062fa4caf150bdf845994fc7a3533f74/raw/27beff3509eff0d2690e593336179d4ccda530c2/Common-Currency.json";
    let currencyRatesUrl =
      "http://data.fixer.io/api/latest?access_key=d0f3b7da0757140a192df5c5ee3fd3cf";

    fetch(currencyDataUrl)
      .then(response => {
        return response.json();
      })
      .then(data => {
        // convert object to an array
        var arr = [];
        for (var key in data) {
          arr.push(data[key]);
        }
        this.setState({
          currencyList: arr
        });
      });

    fetch(currencyRatesUrl)
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.setState({
          currencyRates: data.rates
        });
      });
  }

  render() {
    let currencyOptions = this.state.currencyList.map(c => (
      <option key={c.code} value={c.code} data-symbol={c.symbol}>
        {c.name}
      </option>
    ));
    const { baseValMasked } = this.state;
    const { targValMasked } = this.state;
    return (
      <div className="col-sm-6">
        <h1>Currency Converter</h1>
        <form action="#">
          <div className="row">
            <div className="col-sm-6">
              <div className="form-group">
                <label htmlFor="baseCur">Base Currency:</label>
                <select
                  id="baseCur"
                  className="form-control"
                  onChange={evt => this.handleBaseSelect(evt)}
                >
                  {currencyOptions}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="baseVal">Base Value:</label>
                <CurrencyInput
                  className="form-control"
                  value={baseValMasked}
                  prefix={this.state.baseCurSymbol}
                  onChangeEvent={this.handleInputValue}
                />
              </div>
            </div>
            <div className="col-sm-6">
              <div className="form-group">
                <label htmlFor="targCur">Target Currency:</label>
                <select
                  id="targCur"
                  className="form-control"
                  onChange={evt => this.handleTargetSelect(evt)}
                >
                  {currencyOptions}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="targVal">Traget Value:</label>
                <CurrencyInput
                  className="form-control"
                  readOnly="readonly"
                  value={targValMasked}
                  prefix={this.state.targCurSymbol}
                  onChangeEvent={this.handleTargetValue}
                />
              </div>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={this.handleConvertion}
          >
            Convert
          </button>
        </form>
      </div>
    );
  }
}

export default CurrencyConverter;

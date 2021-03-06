import React, { Component } from "react";
import { connect } from "react-redux";

import { buyCurrencyRequest, sellCurrencyRequest} from "../../actions/currency";
import { fetchWalletRequest } from "../../actions/wallet";
import {
	getCurrentBtcPurchase,
	getCurrentBtcSell,
	getCurrentEthPurchase,
	getCurrentEthSell,
	getSelected
} from "../../ducks/currency";

import { getWalletBtc, getWalletEth, getWalletUsd, getWalletError } from "../../ducks/wallet";

import "./Trade.css"

class Trade extends Component {
	state = {
		btc: this.props.walletBtc,
		eth: this.props.walletEth,
		usd: this.props.walletUsd,
		inputFiat: 1,
		currentInput: "inputFiat",
		inputSell: this.props.sell,
		inputPurchase: this.props.purchase,

	};

	getDecimal = num => {
		let str = "" + num;
		let zero = str.indexOf(".");

		if (zero === -1) return 0;
		str = str.slice(zero + 1);
		return str;
	};

	componentDidMount() {
		this.props.fetchWalletRequest();
	}

	componentWillReceiveProps(nextProps) {
		const { walletUsd, walletBtc, walletEth, sell, purchase } = nextProps;
		const { currentInput } = this.state;
		this.changeInputs(currentInput, sell, purchase);
		this.setState({
			btc: walletBtc,
			eth: walletEth,
			usd: walletUsd,
		});
	}
	onInputChange = event => {
		const { name, value } = event.target;
		const { sell, purchase } = this.props;

		this.setState(state => ({ [name]: value }));
		if (isNaN(event.target.value) || event.target.value === "") {
			return;
		} else this.changeInputs(event.target.name, sell, purchase);
	};

	onInputFocus = (e) => {
		this.setState({ currentInput: e.target.name });
	};

	onInputBlur = () => {
		this.setState({ currentInput: "inputFiat" });
	};

	handleBuy = () => {
		const { currencyName } = this.props;
		const { inputFiat } = this.state;
		this.props.buyCurrencyRequest({ currencyName, value: inputFiat });
	};


	handleSell = () => {
		const { currencyName } = this.props;
		const { inputFiat } = this.state;
		this.props.sellCurrencyRequest({ currencyName, value: inputFiat });
	};

	changeInputs(name, sell, purchase) {
		switch (name) {
			case "inputFiat": {
				this.setState(({ inputFiat }) => {
					const parsed = isNaN(inputFiat) ? 0 : parseFloat(inputFiat);
					return {
						inputSell: parsed * sell,
						inputPurchase: parsed * purchase
					};
				});
				break;
			}
			case "inputSell":
				this.setState(({ inputSell }) => {
					const parsedSell = isNaN(inputSell) ? 0 : parseFloat(inputSell);
					const nextItem = parsedSell / sell;
					return {
						inputFiat: nextItem,
						inputPurchase: nextItem * purchase
					};
				});
				break;
			case "inputPurchase":
				this.setState(({ inputPurchase }) => {
					const parsedPurchase = isNaN(inputPurchase) ? 0 : parseFloat(inputPurchase);
					const nextFiat = parsedPurchase / purchase;
					return {
						inputFiat: nextFiat,
						inputSell: nextFiat * sell
					};
				});
				break;
			default:
				break;
		}
	}

	render() {

		const { walletError, currencyName } = this.props;
		const { inputFiat, inputSell, inputPurchase } = this.state;

		const currencies = ["btc", "eth", "usd"].map(item => (
            <div className="wallet-item"
                 key={ item }>
              <div className="wallet-sum" >
                <span className="integer-part">{ Math.floor(this.state[item]) + "." }</span>
                <span className="decimal-part">{ this.getDecimal(this.state[item]) }</span>
              </div>
				{ item.toUpperCase() }
            </div>
		));

		return(
            <section className="sec trade-sec">
              <div className="trade-item item-wallet">
                <h2 className="sec-ttl">Ваш счет</h2>
				  { currencies }
              </div>

              <div className="trade-item item-trade">
                <h2 className="sec-ttl">Покупка/продажа</h2>
                <form-group>
                  <input
                      className="input-field"
                      name="inputItem"
                      value={ inputFiat }
                      onChange={ this.onInputChange }
                      onFocus={ this.onInputFocus }
                      onBlur={ this.onInputBlur } />
                  <span className="currency">{currencyName.toUpperCase()}</span>
                </form-group>
                <div className="sell-item">
                  <form-group>
                    <input
                        className="input-field"
                        name="inputPurchase"
                        value={inputPurchase}
                        onChange={ this.onInputChange }
                        onFocus={ this.onInputFocus }
                        onBlur={ this.onInputBlur } />
                    <span className="currency">$</span>
                  </form-group>
                  <button
                      className="btn btn-red"
                      onClick={ this.handleSell }>Продать</button>
                </div>
                <div className="sell-item">
                  <form-group>
                    <input
                        className="input-field"
                        name="inputSell"
                        value={inputSell}
                        onChange={ this.handleChange }
                        onFocus={ this.handleFocus }
                        onBlur={ this.handleBlur } />
                    <span className="currency">$</span>
                  </form-group>
                  <button
                      className="btn"
                      onClick={ this.handleBuy }>Купить</button>
                </div>
                  { walletError && <p style={{ color: "red" }}>{ walletError }</p>}
              </div>
          </section>
		)
	};
};

const mapStateToProps = state => ({
	walletBtc: getWalletBtc(state),
	walletEth: getWalletEth(state),
	walletUsd: getWalletUsd(state),
	walletError: getWalletError(state),
	sell: getSelected(state) === 'btc' ? getCurrentBtcSell(state) : getCurrentEthSell(state),
	purchase: getSelected(state) === 'btc' ? getCurrentBtcPurchase(state) : getCurrentEthPurchase(state),
	currencyName: getSelected(state)
});

const mapDispatchToProps = {
	fetchWalletRequest,
	buyCurrencyRequest,
	sellCurrencyRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(Trade);

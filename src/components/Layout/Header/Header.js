import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import styled from "styled-components";

import { selectBtc, selectEth } from "../../../actions/currency";
import { logout } from "../../../actions/auth";
import { fetchUserInfoRequest } from "../../../actions/user";
import { getCurrentBtcSell, getCurrentEthSell } from "../../../ducks/currency";
import { getUserEmail } from "../../../ducks/user";

import './Header.css';

const CurrencyLink = styled(Link)`
	width: 140px;
	height: 80px;
	display: flex;
	flex-direction: column;
	flex-shrink: 0;
	justify-content: center;
	text-decoration: none;
	text-align: center;
	margin-right: 20px;
	background-color: #404243;
	color: ${props => (props.className === "active" ? "#fff" : "#c3c3c3")};
	transition: color .6s;
	&:hover {
	color: #fff;
}`;

class Header extends Component {
	state = {
		btc: 0,
		eth: 0
	};

	componentDidMount() {
		const link = this.props.match.params.currency;
		this.setCurrency(link);
		this.props.fetchUserInfoRequest();
	}

	componentWillReceiveProps(nextProps) {
		const link = this.props.match.params.currency;
		const nextLink = nextProps.match.params.currency;
		if (link && link !== nextLink) {
			this.setCurrency(nextLink);
		}
		this.getCurrencyValue(nextProps);
	}

	getCurrencyValue = (props) => {
		const { btc, eth } = props;
		this.setState({ btc: Math.round(btc) });
		this.setState({ eth: Math.round(eth) });
	};

	setCurrency = (link) => {
		const { selectBtc, selectEth } = this.props;
		if (link === "btc") {
			selectBtc();
		} else {
			selectEth();
		}
	};

	handleLogout = () => {
		this.props.logout();
	};

  render() {
    const currency = this.props.match.params.currency;
    const { userEmail } = this.props;

	  return (
          <div className="header">
            <div className="container">
              <div className="logo-wrap">
                <img src="/images/Logo-white.svg" className="logo" alt="J-Traiding logo"/>
              </div>
              <CurrencyLink
                  className={currency === "btc" ? "active" : null}
                  to="/trade/btc" >
                <span>{ this.state.btc }</span>
                <b>1 BTC </b>
              </CurrencyLink>

              <CurrencyLink
                  className={currency === "eth" ? "active" : null}
                  to="/trade/eth" >
                <span>{ this.state.eth }</span>
                <b>1 ETH </b>
              </CurrencyLink>

              <div className="user-mail"> { userEmail }</div>
              <button className="btn btn-small" onClick= { this.handleLogout }>
                Выйти
              </button>
            </div>
          </div>
	  );
  }
}

const mapStateToProps = state => ({
	btc: getCurrentBtcSell(state),
	eth: getCurrentEthSell(state),
	userEmail: getUserEmail(state)
});

const mapDispatchToProps = {
	selectBtc,
	selectEth,
	fetchUserInfoRequest,
	logout
};

export default withRouter(
	connect(mapStateToProps, mapDispatchToProps)(Header)
);
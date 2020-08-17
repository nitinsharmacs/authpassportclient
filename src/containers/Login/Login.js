import React, { Component } from 'react';
import classes from './login.css';
import AuthBox from '../../components/AuthBox/AuthBox';

class Login extends Component {
	state = {
		elements:{
				username:{top:true,type:'text', placeholder:'Username', name:'username',value:'', icon:'user',validation:{
					isRequired:{value:true, label:'', valid:false}
				}, valid:false},
				password:{bottom:true,type:'password', placeholder:'Password', name:'password',value:'', icon:'lock',validation:{
					isRequired:{value:true, label:'', valid:false}
				}, valid:false}
			}
	}
	componentDidMount(){
		document.title = 'Login';
	}
	render(){
		return (
			<div className={classes.Login}>
				<AuthBox loginHandler={this.props.loginHandler} elements={this.state.elements} for='login' />
			</div>
			);
	}
}

export default Login;
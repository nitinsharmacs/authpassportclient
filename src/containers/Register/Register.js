import React, { Component } from 'react';
import classes from './register.css';
import AuthBox from '../../components/AuthBox/AuthBox';

class Register extends Component {
	state = {
		elements:{
				username:{top:true,type:'text', placeholder:'Username', name:'username',value:'', icon:'user',validation:{
					minLength:{value:5, label:'minimum 5 characters',valid:false},
					maxLength:{value:15, label:'maximum 15 characters',valid:true},
					noSpace:{value:true, label:'No Whitespace allowed', valid:false}
				}, valid:false},
				email:{type:'email', placeholder:'Email', name:'email',value:'', validation:{isEmail:{
					value:true, label:'should be a valid Email', valid:false
				}}, valid:false},
				password:{bottom:true,type:'password', placeholder:'Password', name:'password',value:'', icon:'lock',validation:{
					minLength:{value:8, label:'minimum 8 characters',valid:false},
					maxLength:{value:15, label:'maximum 15 characters',valid:true},
					upperCase:{value:1, label:'atleast 1 uppercase letter',valid:false},
					lowerCase:{value:1, label:'atleast 1 lowercase letter',valid:false},
					specialChar:{value:1, label:'atleast 1 special character (!,@,#,$,%,&,?)',valid:false},
					numerical:{value:1, label:'atleast 1 numerical character',valid:false},
					noSpace:{value:true, label:'No Whitespace allowed', valid:false}
				}, valid:false}
			}
	}
	componentDidMount(){
		document.title = 'Register';
	}
	render(){
		return (
			<div className={classes.Login}>
				<AuthBox elements={this.state.elements} for='register' />
			</div>
			);
	}
}

export default Register;
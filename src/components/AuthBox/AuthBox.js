import React, { Component } from 'react';
import classes from './authbox.css';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import { validator } from '../../util/validation';
import { Link, withRouter } from 'react-router-dom';

class AuthBox extends Component {
	state = {
		elements:this.props.elements,
		formvalid:false,
		current:undefined,
		processing:false,
		error:undefined
	}
	onChange = (e) => {
		let element = {...this.state.elements[e.target.name]};
		element.value = e.target.value;
		let result = validator(element.value, element.validation);
		element.valid = result.valid;
		for(let rule in element.validation){
			element.validation[rule] = result[rule];
		}
		let formvalid = true;
		for(let ele in this.state.elements){
			if(ele===e.target.name)
				formvalid = formvalid && element.valid;
			else
				formvalid = formvalid && this.state.elements[ele].valid;
		}
		this.setState({elements:{...this.state.elements, [e.target.name]:element}, formvalid:formvalid, current:formvalid?undefined:element});
	}
	onFocusOut = (e) => {
		let element = {...this.state.elements[e.target.name]}
		element.touched = true;
		this.setState({current:undefined, elements:{...this.state.elements, [e.target.name]:element}});
	};
	submit = () => {
		this.setState({processing:true});
		let dataToSend = {};
		for(let key in this.state.elements){
			dataToSend[key] = this.state.elements[key].value
		}

		fetch(process.env.REACT_APP_SERVER+`/auth/${this.props.for==='login'?'login':'register'}`, {
			method:'POST',
			headers:{'Content-Type':'application/json'},
			body:JSON.stringify(dataToSend)
		}).then(res=>res.json()).then(result=>{
			console.log(result);
			if(result.status!==201&&result.status!==200)
				throw new Error(result.message);
			this.setState({processing:false});
			if(this.props.for==='login'){
				document.cookie = `token=${result.token};expires=${new Date(new Date().setHours(new Date().getHours()+5))}`
				this.props.loginHandler();
			} else {
				this.props.history.replace('/login');
			}

		}).catch(err=>{
			console.log(err);
			this.setState({processing:false, error:err.message});
		})
	};
	render(){
		return (
			<div className={classes.AuthBox}>
				<div className={classes.Header}>
					<h1>{this.props.for==='login'?"Login":"Register"}</h1>
				</div>
				<div className={classes.Inputs}>
					{
						Object.keys(this.state.elements).map(key=><TextField autoFill={false} name={this.state.elements[key].name} className={classes.Input} label={this.state.elements[key].placeholder} variant='standard' value={this.state.elements[key].value} onChange={this.onChange} error={this.state.elements[key].touched&&!this.state.elements[key].valid} onBlur={this.onFocusOut}  />
						)
					}
				</div>
				<div className={classes.Controls}>
					<Button variant='contained' color='primary' disabled={!this.state.formvalid || this.state.processing} onClick={this.submit}>
					{
						this.state.processing?<CircularProgress style={{height:'25px', width:'25px', color:'grey'}}  />:this.props.for==='login'?"Login":"Register"
					}
					</Button>
				</div>
				{
					this.props.for==='register'?<div className={classes.Rules}>
					{
						this.state.current?Object.keys(this.state.current.validation).map(rule=>{
							if(!this.state.current.validation[rule].valid){
								return <span>&bull; {this.state.current.validation[rule].label}</span>
							}
						}):null
					}
				</div>:null
				}
				{
					this.state.error?<div className={classes.ErrorBox}>
					<p>{this.state.error}</p>
				</div>:null
				}
				{
					this.props.for==='login'?<div className={classes.SocialLogins}>
					<p>Or Login With</p>
					<a href={process.env.REACT_APP_SERVER+'/auth/google'}>
					<IconButton >
						<svg fill="#000000" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30px" height="30px">    <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032 s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2 C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/></svg>
					</IconButton>
					</a>
					<a href={process.env.REACT_APP_SERVER+'/auth/facebook'}>
					<IconButton >
						<svg fill="#000000" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30px" height="30px">    <path d="M17.525,9H14V7c0-1.032,0.084-1.682,1.563-1.682h1.868v-3.18C16.522,2.044,15.608,1.998,14.693,2 C11.98,2,10,3.657,10,6.699V9H7v4l3-0.001V22h4v-9.003l3.066-0.001L17.525,9z"/></svg>
					</IconButton>
					</a>
				</div>:null
				}
				<div className={classes.ModeSwitcher}>
					<Button>
 						<Link to={this.props.for==='login'?'/register':'/'}>Switch to {this.props.for==='login'?"Register":"Login"}</Link>
					</Button>
				</div>
			</div>
			);
	}
}

export default withRouter(AuthBox);
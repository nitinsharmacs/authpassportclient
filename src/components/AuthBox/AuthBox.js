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
				document.cookie = `token=${result.token};expires=${ new Date(new Date().setHours(new Date().getHours()+5))}`;
				this.props.loadAuthData();
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
					<a href={process.env.REACT_APP_SERVER+'/auth/twitter'}>
					<IconButton >
						<svg fill="#000000" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30px" height="30px"><path d="M 24 4.300781 C 23.101563 4.699219 22.199219 5 21.199219 5.101563 C 22.199219 4.5 23 3.5 23.398438 2.398438 C 22.398438 3 21.398438 3.398438 20.300781 3.601563 C 19.300781 2.601563 18 2 16.601563 2 C 13.898438 2 11.699219 4.199219 11.699219 6.898438 C 11.699219 7.300781 11.699219 7.699219 11.800781 8 C 7.699219 7.800781 4.101563 5.898438 1.699219 2.898438 C 1.199219 3.601563 1 4.5 1 5.398438 C 1 7.101563 1.898438 8.601563 3.199219 9.5 C 2.398438 9.398438 1.601563 9.199219 1 8.898438 C 1 8.898438 1 8.898438 1 9 C 1 11.398438 2.699219 13.398438 4.898438 13.800781 C 4.5 13.898438 4.101563 14 3.601563 14 C 3.300781 14 3 14 2.699219 13.898438 C 3.300781 15.898438 5.101563 17.300781 7.300781 17.300781 C 5.601563 18.601563 3.5 19.398438 1.199219 19.398438 C 0.800781 19.398438 0.398438 19.398438 0 19.300781 C 2.199219 20.699219 4.800781 21.5 7.5 21.5 C 16.601563 21.5 21.5 14 21.5 7.5 C 21.5 7.300781 21.5 7.101563 21.5 6.898438 C 22.5 6.199219 23.300781 5.300781 24 4.300781"/></svg>
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
import React, { Component } from 'react';
import classes from './home.css';
import { Link } from 'react-router-dom'
import Loader from '../../components/Loader/Loader';

class Home extends Component {

	state = {
		loading:true,
		userInfo:undefined
	}
	componentDidMount(){
		document.title = 'Home';

		let token = document.cookie.split(';')[0].split('=')[1];
		fetch(process.env.REACT_APP_SERVER+'/user', {
			headers:{'Authorization':'Bearer '+token}
		}).then(res=>res.json()).then(result=>{
			console.log(result)
			if(result.status!==200)
				throw new Error(result.message);
			this.setState({loading:false, userInfo:result.data});
		}).catch(err=>{
			console.log(err);
		});
	}

	render(){
		return (
			<div className={classes.Home}>

				{
					this.state.userInfo?<React.Fragment>
						<nav className={classes.Navbar}>
							<ul>
								<li>{this.state.userInfo.name || this.state.userInfo.username}</li>
								<li onClick={this.props.logoutHandler}><Link to='/login' >Logout</Link></li>
							</ul>
						</nav>
						<div className={classes.Content}>
							<h1>Welcome {this.state.userInfo.name || this.state.userInfo.username} !</h1>
						</div>
					</React.Fragment>:<Loader />
				}
				
			</div>
			);
	}
}

export default Home;
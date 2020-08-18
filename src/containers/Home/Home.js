import React, { Component } from 'react';
import classes from './home.css';
import { Link } from 'react-router-dom'
import Loader from '../../components/Loader/Loader';

class Home extends Component {

	render(){
		return (
			<div className={classes.Home}>

				{
					this.props.userInfo?<React.Fragment>
						<nav className={classes.Navbar}>
							<ul>
								<li>{this.props.userInfo.name || this.props.userInfo.username}</li>
								<li onClick={this.props.logoutHandler}><Link to='/login' >Logout</Link></li>
							</ul>
						</nav>
						<div className={classes.Content}>
							<h1>Welcome {this.props.userInfo.name || this.props.userInfo.username} !</h1>
						</div>
					</React.Fragment>:<Loader />
				}
				
			</div>
			);
	}
}

export default Home;
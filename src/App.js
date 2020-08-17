import React, { Component } from 'react';
import classes from './App.css';
import Login from './containers/Login/Login';
import Register from './containers/Register/Register';
import Home from './containers/Home/Home';
import { Route, Switch } from 'react-router-dom';



class App extends Component {

  state = {
    isLogined:false
  }

  componentDidMount(){
      this.loadAuthStates();
  }
  loadAuthStates = () => {
    let tokenName = document.cookie.split(';')[0].split('=')[0];
    let token = document.cookie.split(';')[0].split('=')[1];

   
    if(tokenName==='token'&&token)
      this.setState({isLogined:true})
  };
  loginHandler = () => {
    this.loadAuthStates();
  };
  logoutHandler = () => {
    document.cookie = 'token=;expires='+new Date(1);
    this.setState({isLogined:false});
  };
  render(){
    let content = (<Switch>
                 <Route path='/register' component={Register} />
                <Route path='/' render={()=><Login loginHandler={this.loginHandler} />} />
               </Switch>);
    if(this.state.isLogined)
      content = <Home logoutHandler={this.logoutHandler} userName={this.state.username} />
    return (
        <div className={classes.App}>
        	 {content}
        </div>
      );
  }
}

export default App;
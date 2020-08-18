import React, { Component } from 'react';
import classes from './App.css';
import Login from './containers/Login/Login';
import Register from './containers/Register/Register';
import Home from './containers/Home/Home';
import { Route, Switch } from 'react-router-dom';



class App extends Component {

 state = {
  isLogined:true,
  userInfo:undefined,
  loading:true
 }
 
 componentDidMount(){
  this.loadAuthData();
 }

 loadAuthData = () => {

  let token = document.cookie.split(';')[0].split('=')[1];


  this.setState({loading:true});
  fetch(process.env.REACT_APP_SERVER+'/user', {
    credentials:"include",
    headers:{
      Accept:'appliation/json',
      "Content-Type":"application/json",
      "Access-Control-Allow-Credentials":true,
      "Authorization":"Bearer "+token
    }
  }).then(res=>res.json()).then(result=>{
    console.log(result);
    if(result.status!==201&&result.status!==200)
      throw new Error(result.message);

    this.setState({loading:false, isLogined:true, userInfo:result.data});
  }).catch(err=>{
    console.log(err);
    this.setState({loading:false, isLogined:false, userInfo:undefined})
  })
 };

 logoutHandler = () => {
  this.setState({isLogined:false, userInfo:undefined});
  document.cookie = `token= ;expires=${new Date(1)}`;
  window.open(process.env.REACT_APP_SERVER+'/auth/logout', "_self");
 }
  render(){
    let content = (<Switch>
                 <Route path='/register' component={Register} />
                <Route path='/' render={()=><Login loadAuthData={this.loadAuthData} />} />
               </Switch>);
    if(this.state.isLogined)
      content = <Home userInfo={this.state.userInfo} logoutHandler={this.logoutHandler} />
    return (
        <div className={classes.App}>
        	 {content}
        </div>
      );
  }
}

export default App;
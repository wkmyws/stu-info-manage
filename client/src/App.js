import React from 'react';
import RouterPage from './router'
import logo from './logo.svg';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cssHeight: {},
    };
    this.handleHeight=this.handleHeight.bind(this)
  }
  handleHeight(){
    const MAXWIDTH=500;
    let content_style={marginTop:64}
    if(document.body.clientWidth>=MAXWIDTH){
      let chaValue=(document.body.clientWidth-MAXWIDTH)/2;
      content_style['marginLeft']=content_style['marginRight']=chaValue;
    }
    this.setState({cssHeight:content_style})
  }

  componentDidMount(){
    //自适应窗口大小监听函数
    window.addEventListener('resize',this.handleHeight)
    this.handleHeight(); 
  }
  componentWillUnmount(){
    window.removeEventListener('resize',this.handleHeight)
  }
  
  render(){
    return (<div className="App">
      <RouterPage />
    </div>);
  }
}

export default App;

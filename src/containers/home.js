import React from 'react';
import { Input,Icon,Button,message } from 'antd';
import './home.css';
const Search = Input.Search;

const venueUrl="https://api.foursquare.com/v2/venues/explore";
const venueDetailsUrl="https://api.foursquare.com/v2/venues/";
const clientId="SSPAT22O2IV2TZZWULSQKY5PADKJ3SEHSR1GOY4JIHSOJPSP";
const clientSecret="SYCMW1UHNBMFFBA21PRQO1UZJBZE1CXFFSXKLDEWBYPTP22D";
const userDetails={name:'',venueSelected:''}
const venuesList={rating:'',name:'',shortUrl:''}

export default class Home extends React.Component{
    state={
        venue1:{...venuesList},venue2:{...venuesList},venue3:{...venuesList},
        users:[Object.assign({},userDetails)]
         }
      

        componentDidMount(){
            debugger
        }

    search=val=>{
        if(val.length<3){
            return  message.warning('Please enter a proper area code');
        }
        this.setState({val},()=>{
            this.setState({users:[Object.assign({},userDetails)],venues:[], venue1:venuesList,venue2:venuesList,venue3:venuesList,showBox:false,selectedObj:null,selected:null});

            fetch(`${venueUrl}?client_id=${clientId}&client_secret=${clientSecret}&query=lunch&near=${this.state.val}&v=20170801&limit=3`)
            .then((response)=>{
                return response.json();
            })
            .then((jsonRes)=>{
                debugger
                if(!jsonRes.response.groups){
                    return message.success('Sorry , no restuarnt found!');
                }
                this.setState({venues:jsonRes.response.groups[0].items,showBox:true},()=>{
                   return this.getVenueInfo();
                })
            })
        })
    }
    
    getVenueInfo=()=>{
        this.state.venues.map((item,i)=>{
            fetch(`${venueDetailsUrl}${item.venue.id}?client_id=${clientId}&client_secret=${clientSecret}&v=20170801`)
            .then((response)=>{
                return response.json();
            })
            .then((jsonRes)=>{
                this.setState({[`venue${i+1}`]:jsonRes.response.venue},()=>{
                })
            })
        })
    }


    addUser=()=>{
        this.setState({users:[...this.state.users,{name:'',venueSelected:''}]})
    }
     
    changeStatus=(userInd,venueInd)=>{
        
        let userArr=[...this.state.users];
        if(!userArr[userInd].name){
            return   message.error('Please enter users name');
        }
        userArr[userInd].venueSelected=venueInd;
        this.setState({users:userArr},()=>{
            this.getTotal();
        });
    }
     
    getTotal=()=>{
        let venueOneCount=this.state.users.filter((item)=>item.venueSelected==1).length;
        let venueTwoCount=this.state.users.filter((item)=>item.venueSelected==2).length;
        let venueThreeCount=this.state.users.filter((item)=>item.venueSelected==3).length;
        if(venueOneCount>venueTwoCount && venueOneCount>venueThreeCount)
		{
			return this.setState({selected:1,selectedObj:this.state.venue1})
		}
		else if(venueTwoCount>venueOneCount && venueTwoCount>venueThreeCount)
		{
			return this.setState({selected:2,selectedObj:this.state.venue2})
		}
		else if(venueThreeCount>venueOneCount && venueThreeCount>venueOneCount)
		{
			return this.setState({selected:3,selectedObj:this.state.venue3})
		}
    }

    onChange=(e,ind)=>{
        let userArr=[...this.state.users];
        userArr[ind].name=e.target.value;
        this.setState({users:userArr});
    }

    render(){
        return(
            <div className="main">
                Lunch Place
               <div className="input-div">
                  <Search
                    placeholder="Enter Area or area code"
                    enterButton="Search"
                    size="large"
                    onSearch={this.search}
                    />
                </div>
                

              {this.state.showBox && <div>
                 {this.state.selectedObj && <div style={{marginTop:'2%'}}>
                     Place selected with highest votes is " {this.state.selectedObj.name} "
                     </div>}
                <div className="grid-container" style={{marginTop:'3%'}}>
                  <div className="gridItem" >
                    Users
                  </div>
                  <div  className={this.state.selected===1?"gridItem selected":"gridItem"}>
                    <a href={this.state.venue1.shortUrl}>{this.state.venue1.name}</a>
                    <p>{this.state.venue1.rating}</p>
                  </div>
                  <div  className={this.state.selected===2?"gridItem selected":"gridItem"} >
                    <a href={this.state.venue2.shortUrl}>{this.state.venue2.name}</a>
                    <p>{this.state.venue2.rating}</p>
                  </div>
                  <div  className={this.state.selected===3?"gridItem selected":"gridItem"}>
                    <a href={this.state.venue3.shortUrl}>{this.state.venue3.name}</a>
                    <p>{this.state.venue3.rating}</p>
                  </div>
                </div>

               {this.state.users.map((item,ind)=>(<div className="grid-container">
               <div className="gridItem">
                    <input placeholder="Enter Name"  className="inputs" onChange={(e)=>this.onChange(e,ind)}/>
                  </div>
                  <div className={item.venueSelected==1?"gridItem selected-block":"gridItem"} onClick={()=>this.changeStatus(ind,1)}>
                   {item.venueSelected==1?<Icon type="check-circle" style={{color:'white'}}/>:null}
                  </div>
                  <div className={item.venueSelected==2?"gridItem selected-block":"gridItem"}onClick={()=>this.changeStatus(ind,2)}>
                  {item.venueSelected===2?<Icon type="check-circle" style={{color:'white'}} />:null}
                  </div>
                  <div className={item.venueSelected==3?"gridItem selected-block":"gridItem"} onClick={()=>this.changeStatus(ind,3)}>
                  {item.venueSelected===3?<Icon type="check-circle" style={{color:'white'}}/>:null}
                  </div>
                </div>
                ))}
                <div>
                   <Button type="primary" style={{marginTop:'2%',width:150,marginLeft:'4%'}} onClick={this.addUser}>Add User</Button>
                </div>
                </div>}
            </div>
        )
    }
}

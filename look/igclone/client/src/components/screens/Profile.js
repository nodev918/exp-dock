import React, {useEffect,useState, useContext} from 'react'
import {UserContext} from '../../App'

const Profile = ()=>{
    const [mypics,setPics] = useState([])
    const {state,dispatch} = useContext(UserContext)
    //console.log()
    useEffect(()=>{
        
        fetch('/mypost',{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            //console.log(result)
            setPics(result.mypost)
        })
    },[])
    return (
        <div style={{maxWidth:"550px",margin:"0px auto"}}>
            <div style={{
                display:"flex",
                justifyContent:"space-around",
                margin:"18px 0px",
                borderBottom:"1px solid grey"
            }}>
                <div>
                    <img style={{width:"160px",height:"160px",borderRadius:"80px"}}
                    src="https://images.unsplash.com/photo-1612124615207-f682e163a6ad?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTM5fHxwZXJzb258ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
                    />
                </div>
                <div>
                    <h4>{state?state.name:"loading"}</h4>
                    <div style={{display:"flex",justifyContent:"space-between",width: "108%"}}>
                        <h6>40 posts</h6>
                        <h6>40 posts</h6>
                        <h6>40 posts</h6>
                    </div>

                </div>
            </div>
        
            <div className="gallery">
                {
                    mypics.map(item=>{
                        return (
                            <img key={item._id} className="item" src={item.photo} alt={item.title}></img>
                
                        )
                    })
                }
                
                
            </div>
        </div>
    )
}

export default Profile
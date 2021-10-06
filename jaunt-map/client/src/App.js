import React from 'react'
import { Card,Navbar } from 'qlib918'

export default function App() {

    function send(){
        console.log("in send")
        fetch("http://localhost:5000/test")
        .then(res=>res.json())
        .then(result=>{
            console.log(result)
        })
        .catch(err=>{
            console.log("error: ",err)
        })
    }

    return (
        <div>
            <Navbar />
            <Card />
            {send()}
        </div>
    )
}

    
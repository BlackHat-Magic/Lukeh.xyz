//import React from "react"
//import ReactDOM from "react-dom"
import NavBar from "./navbar"
import Footer from "./footer"

// function Canvas() {
//     return(
//         <div className="flex horizontal">

//         </div>
//     )
// }

// function Card() {
//     return(
//         <div className = "flex vertical">

//         </div>
//     )
// }

function ReactImage(){
    return(
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/2300px-React-icon.svg.png" width="64px"></img>
    )
}

function Title() {
    return(
        <h1>Hello, World!</h1>
    )
}

function Page() {
    return(
        <>
            <ReactImage />
            <Title />
        </>
    )
}

ReactDOM.render(
    <NavBar />, document.querySelector("#navbar")
)

ReactDOM.render(
    <Page />, document.querySelector("#page")
)

ReactDOM.render(
    <Footer />, document.querySelector("#footer")
)
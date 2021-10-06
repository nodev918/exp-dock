import './navbar.css'

export function Navbar(target){
    const ele = document.createElement('div')
    ele.innerText = 'navbar'
    target.appendChild(ele)
}
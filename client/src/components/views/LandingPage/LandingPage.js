import React, { useEffect } from 'react'
import axios from 'axios';

function LandingPage(props) {

    useEffect(()=>{
        axios.get('/api/hello')
        .then(response => console.log(response.data))
    }, [])

    const onClickHandler = ()=>{
        axios.get('api/users/logout')
        .then(response => {
            console.log(response.data)
            if(response.data.success){
                alert('로그아웃되었습니다.')
                props.history.push("/login")
            } else{
                alert('로그아웃 실패')
            }
        })
    }
    const onClickLoginHandler=()=>{
        props.history.push("/login")
    }

    return (
        <div style={{
            display: 'flex', justifyContent:'center',
            alignItems:'center', width: '100%', height:'100vh', flexDirection:'column'
        }}>
            <h2>시작 페이지</h2>

            <button onClick={onClickLoginHandler}>
                Login Page
            </button>

            <br />

            <button onClick={onClickHandler}>
                Logout
            </button>
        </div>
    )
}

export default LandingPage

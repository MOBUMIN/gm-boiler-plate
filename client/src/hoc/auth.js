import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux'
import { auth } from '../_actions/user_action'

export default function(SpecificComponent, option, adminRoute = null){

    // null 아무나
    // true 로그인한 유저만
    // false 로그인하면 못오는

    function AuthenticationCheck(props){

        const dispatch = useDispatch();

        useEffect(() => {

            dispatch(auth()).then(response => {
                // 로그인 x
                if(!response.payload.isAuth){
                    if(option){
                        alert('로그인해주세요')
                        props.history('/login')
                    }
                }else{
                    //로그인 O
                    if(adminRoute && !response.payload.isAdmin){
                        alert('관리자가 아닙니다.')
                        props.history.push('/')
                    }else{
                        if(option===false){
                            alert('로그인중입니다.')
                            props.history.push('/')
                        }
                    }
                }
            })

            //Axios.get('/api/users/auth')
        }, [])

        return( <SpecificComponent /> )
    }
    return AuthenticationCheck
}
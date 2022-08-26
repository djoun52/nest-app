import {Routes, Route} from 'react-router-dom';
import {Flex} from "@chakra-ui/react";
import './framwork.css';
import './App.css'
import {SideBar} from './Containers/SideBar/SideBar'
import Error404 from "./Components/Error404/Error404"
import Home from "./Pages/Home/Home";
import TopBar from "./Containers/TopBar/TopBar";
import Login from "./Pages/Login/Login";
import Register from './Pages/register/Register'
import VerifEmail from './Pages/VerifEmail/VerifEmail'
import {useEffect, useState} from "react";
import axios from "axios";
import {addUser} from "./redux/user/userSlice";
import {useAppDispatch} from "./redux/hooks";

function App() {
    const [tokens, setTokens] = useState({
        access_token: '',
        refresh_token: ''
    })


    const dispatch = useAppDispatch();




    useEffect(() => {
            let tokens: string | null = localStorage.getItem("JWToken")

            if (tokens !== null) {
                const initialValue = JSON.parse(tokens);
                console.log(initialValue.refresh_token)
                axios.get('http://localhost:3333/auth/refresh', {
                    headers: {
                        Authorization: 'Bearer ' + initialValue.refresh_token//the token is a variable which holds the token
                    }
                }).then(response => {
                    console.log(response.data)
                    localStorage.setItem('JWToken', JSON.stringify(response.data));
                    if (tokens !== null) {
                        const newTokenJSON = JSON.parse(tokens);
                    axios.get('http://localhost:3333/users/me', {
                        headers: {
                            Authorization: 'Bearer ' + newTokenJSON.access_token//the token is a variable which holds the token
                        }
                    }).then(response => {
                        const user: { id: number; email: string; pseudo: string } = {
                            id: response.data.id,
                            email: response.data.email,
                            pseudo: response.data.pseudo,
                        }
                        console.log(user)
                        dispatch(addUser(user))

                    }).catch(err => {
                        console.log(err)
                    })
                }

                }).catch(error => {
                    console.log(error)

                })
            }
        }

        ,
        []
    )


    return (
        <div className="App  ">
            <Flex w='100%'>
                <SideBar/>
                <Flex w='100%' flexDir='column'>
                    <TopBar/>
                    <Routes>
                        <Route path="/" element={<Home/>}/>
                        <Route path="/list" element={<Home/>}/>
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/register" element={<Register/>}/>
                        <Route path="/verif-email" element={<VerifEmail/>}/>
                        <Route path="/-1" element={<Home/>}/>
                        <Route path="*" element={<Error404/>}/>
                    </Routes>
                </Flex>
            </Flex>
        </div>
    )
}

export default App

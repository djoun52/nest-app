import React, {useEffect} from 'react';
import './Home.css';
import { Text} from "@chakra-ui/react";
import {useAppSelector} from "../../redux/hooks";
import {selectUser} from "../../redux/user/userSlice";



export default function Home() {
    const user = useAppSelector(selectUser);
    useEffect(() => {
        console.log(user)

    }, [])



    return (
        <>
            <Text fontSize='5xl'>HOME</Text>
        </>
    )
}

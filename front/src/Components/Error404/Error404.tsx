import React from 'react'
import { useNavigate } from 'react-router-dom'
import './Error404.css'
import { Button} from '@chakra-ui/react'
export default function Error404() {

    const navigate = useNavigate()
    const goHome = () => {
        navigate("/")
    }
    return (
        <div className='center error404 '>

                <h1>error 404 Page not found</h1>
                <div className="">
                <Button colorScheme='gray' onClick={goHome} size='sm'>
                    Retourner à l'accueil
                </Button>

                    {/* <button className="btn404" onClick={goHome}> Retourner à l'accueil</button> */}
                </div>

        </div>
    )
}

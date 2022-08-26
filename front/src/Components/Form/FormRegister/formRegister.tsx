import React from 'react';
import {Box, Button, FormControl, Input, Text} from "@chakra-ui/react";
import {SubmitHandler, useForm} from "react-hook-form";
import axios from "axios";
import {addUser, selectUser} from "../../../redux/user/userSlice";
import {useAppDispatch, useAppSelector} from "../../../redux/hooks";


interface IFormInput {
    pseudo: String;
    email: String;
    password: String;
    checkPass: String;

}

export default function FormRegister() {

    const dispatch = useAppDispatch();
    const userRedux = useAppSelector(selectUser)
    const {register, handleSubmit, formState: {errors}, reset} = useForm<IFormInput>();
    const onSubmit: SubmitHandler<IFormInput> = data => {

        if (data.password !== data.checkPass) {
            alert('password non corespondant');
        } else if (data.password.length < 8 || data.password.length > 20) {
            alert('le mots de passe doit contenire entre 8 et 20 caractere ');
        } else {
            axios.post("http://localhost:3333/auth/signup", data)
                .then(response => {
                    console.log(response.data)
                    localStorage.setItem('JWToken', JSON.stringify(response.data));

                    axios.get('http://localhost:3333/users/me', {
                        headers: {
                            Authorization: 'Bearer ' + response.data.access_token//the token is a variable which holds the token
                        }
                    }).then(response => {
                        console.log(response.data)
                        const user = {
                            id : response.data.id,
                            email : response.data.email,
                            pseudo: response.data.pseudo,
                        }
                        dispatch(addUser(user))
                        console.log(userRedux)
                    }).catch(error => {
                        console.log(error)
                    })
                }).catch(err =>{

                alert(err.response.data.message);
            })
        }
        reset()

    }


    return (
        <>
            <Box mx="auto">

                <form onSubmit={handleSubmit(onSubmit)}>
                    <FormControl display='block' m={3}>
                        <label htmlFor="email">votre pseudo</label>
                        <Input
                            mb={3}
                            type="text"
                            id="pseudo"
                            placeholder="Entrer votre pseudo"
                            {...register("pseudo", {required: 'le champ est vide '})}
                        />
                        <Text>{errors.pseudo?.message}</Text>
                        < label htmlFor="email"> votre email</label>
                        <Input
                            mb={3}
                            type="email"
                            id="email"
                            placeholder="Entrer votre mail"
                            {...register("email")}
                        />

                        <label htmlFor="password">mot de passe</label>
                        <Input
                            type="text"
                            id="password"
                            placeholder="Entrer votre mot de passe"
                            {...register("password", {required: 'le champ est vide '})}
                        />
                        <Input
                            mt={3}
                            type="text"
                            id="checkPass"
                            placeholder="vérifier mot de passe"
                            {...register("checkPass", {required: 'le champ est vide '})}
                        />

                        <Button
                            colorScheme='blue' mt={5} ml={3} mr={3}
                            type="submit">connexion
                        </Button>
                    </FormControl>
                </form>

            </Box>

        </>
    )
}

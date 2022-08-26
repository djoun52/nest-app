import React  from 'react'
import "../Form.css";
import {Box, Button, PinInput, PinInputField, FormControl, FormLabel} from "@chakra-ui/react";
import {SubmitHandler, useForm} from "react-hook-form";


interface IFormInput {
    pin1: number;
    pin2: number;
    pin3: number;
    pin4: number;
    pin5: number;
    pin6: number;


}


export default function FormVerifAccount() {

    const {register, handleSubmit, formState: {errors}, reset} = useForm<IFormInput>();

    const onSubmit: SubmitHandler<IFormInput> = data => {
        console.log(data);
        reset()

    }


    return (
        <>
            <Box mx="auto">

                <form onSubmit={handleSubmit(onSubmit)}>
                    <FormControl display='block' m={3}>

                        <FormLabel textAlign='center' mx="auto" fontSize="3xl" htmlFor="otp">Votre code</FormLabel>
                        <PinInput otp size='lg'>
                            <PinInputField mr={3} {...register("pin1")}/>
                            <PinInputField mr={3} {...register("pin2")}/>
                            <PinInputField mr={3} {...register("pin3")}/>
                            <PinInputField mr={3} {...register("pin4")}/>
                            <PinInputField mr={3} {...register("pin5")}/>
                            <PinInputField mr={3} {...register("pin6")}/>
                        </PinInput>
                    </FormControl>


                    <Button type="submit">Valider</Button>
                </form>

            </Box>


        </>
    )

}

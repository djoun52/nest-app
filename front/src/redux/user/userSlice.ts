import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface User {
    id: number | null
    email: string | null | String
    pseudo: string | null | String
    status: boolean
}
interface CounterState {
    value: number
}



// Define the initial state using that type
const initialState: User  = {
    id: null,
    email: null,
    pseudo: null,
    status: false
}

export const UserSlice = createSlice({
    name: 'user',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        addUser: (state, action: PayloadAction<UserState>) => {
            return  {
                ...state,
                id: action.payload.id,
                email: action.payload.email,
                pseudo: action.payload.pseudo,
                status: true
            }
        },
        removeUser: (state) => {
            return {
                ...state,
                id: null,
                email: null,
                pseudo: null,
                status: false
            }
        },
    },
})

export const {addUser, removeUser} = UserSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectUser = (state: RootState) => state.user

export default UserSlice.reducer
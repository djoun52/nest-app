interface  UserState {
    id: number
    email: string  | String
    pseudo: string  | String
}



type UserAction = {
    type: string
    user: UserState
}

type DispatchType = (args: UserAction) => UserAction
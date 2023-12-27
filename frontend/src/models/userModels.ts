export interface UserInfo {
    _id: string,

    name: string,
    email: string,
    
    courses?: string[]
}

export interface JWTUserInfo {
    sub: string,
    name?: string,
    email?: string,
    hd?: string
}
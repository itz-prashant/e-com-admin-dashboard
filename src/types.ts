export type Credentials = {
    email: string;
    password: string
}

export type User = {
    id: number
    email: string
    firstName: string
    lastName: string
    createdAt:string
}

export type CreateUserData = {
    id: number
    email: string
    firstName: string
    lastName: string,
    role: string,
    tenantId: number,
    password:string
}

export type Tenant ={
    id: number,
    name: string
    address: string
}

export type createTenantData = {
    name: string;
    address: string
}
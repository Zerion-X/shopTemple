export default interface User {
    user_id:number;
    full_name:string;
    email:string;
    password:string;
    role:string;
    created_at:Date;
    address?:string;
}

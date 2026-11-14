export interface ServiceItem{id:string;name:string;description:string;duration:number;price:number;icon:string}
export interface Barber{id:string;name:string;specialty:string;rating:number;experience:number}
export interface Appointment{id?:string;userId:string;serviceId:string;serviceName:string;barberId:string;barberName:string;date:string;time:string;duration:number;price:number;createdAt?:any}
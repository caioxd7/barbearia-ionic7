import {Injectable,inject} from '@angular/core';
import {collection,addDoc,query,where,getDocs,getCountFromServer,serverTimestamp} from 'firebase/firestore';
import {FirebaseService} from './firebase.service';
import {Appointment,Barber,ServiceItem} from '../models/models';
@Injectable({providedIn:'root'}) export class DataService{
 private fb=inject(FirebaseService);
 services:ServiceItem[]=[
 {id:'corte',name:'Corte Social',description:'Corte tradicional com acabamento impecável.',duration:45,price:60,icon:'✂'},
 {id:'barba',name:'Barbaterapia',description:'Barba alinhada com toalha quente e produtos premium.',duration:30,price:40,icon:'🧔'},
 {id:'combo',name:'Combo Premium',description:'Corte + Barba com hidratação e finalização especial.',duration:75,price:90,icon:'✂+🧔'},
 {id:'sobrancelha',name:'Sobrancelha',description:'Design de sobrancelha masculina.',duration:20,price:25,icon:'〰'},
 {id:'pigmentacao',name:'Pigmentação',description:'Cobertura natural dos fios brancos.',duration:40,price:80,icon:'◐'}];
 barbers:Barber[]=[
 {id:'lucas',name:'Lucas Alves',specialty:'Especialista em cortes modernos e barba',rating:5.0,experience:5},
 {id:'felipe',name:'Felipe Soares',specialty:'Cortes clássicos e degradê',rating:4.9,experience:4},
 {id:'bruno',name:'Bruno Costa',specialty:'Barba e acabamento',rating:4.8,experience:3}];
 async saveAppointment(a:Appointment){return addDoc(collection(this.fb.db,'appointments'),{...a,createdAt:serverTimestamp()})}
 async myAppointments(uid:string){const q=query(collection(this.fb.db,'appointments'),where('userId','==',uid));const s=await getDocs(q);return s.docs.map(d=>({id:d.id,...d.data()} as Appointment))}
 async dashboardData(){const [appointments,users]=await Promise.all([getDocs(collection(this.fb.db,'appointments')),getCountFromServer(collection(this.fb.db,'users'))]);return{appointments:appointments.docs.map(d=>({id:d.id,...d.data()})),users:users.data().count}}
}
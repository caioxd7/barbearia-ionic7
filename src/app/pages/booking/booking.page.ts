import {Component,inject} from '@angular/core';import {FormsModule} from '@angular/forms';import {CommonModule} from '@angular/common';import {Router,RouterLink} from '@angular/router';import {IonContent,IonIcon} from '@ionic/angular/standalone';import {addIcons} from 'ionicons';import {chevronBack,cutOutline,starSharp} from 'ionicons/icons';import {DataService} from '../../services/data.service';import {AuthService} from '../../services/auth.service';import {Barber} from '../../models/models';import {TabBarComponent} from '../../shared/tab-bar.component';
addIcons({chevronBack,cutOutline,starSharp});
@Component({standalone:true,imports:[CommonModule,FormsModule,RouterLink,IonContent,IonIcon,TabBarComponent],templateUrl:'booking.page.html'})export class BookingPage{
data=inject(DataService);auth=inject(AuthService);private router=inject(Router);service=this.data.services.find(s=>s.id===sessionStorage.getItem('serviceId'))||this.data.services[0];barber=this.data.barbers.find(b=>b.id===sessionStorage.getItem('barberId'))||this.data.barbers[0];
date=this.iso(new Date());time='';
error='';saving=false;
/** agendamentos do próprio cliente (consulta que já existe no app) */
mine:any[]=[];
iso(d:Date){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
days=Array.from({length:14},(_,i)=>{const d=new Date();d.setDate(d.getDate()+i);return{iso:this.iso(d),num:d.getDate(),label:['dom','seg','ter','qua','qui','sex','sáb'][d.getDay()],month:['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'][d.getMonth()]}});
get monthLabel(){return this.days.find(d=>d.iso===this.date)?.month||''}
initials(n:string){return n.split(' ').map(p=>p[0]).slice(0,2).join('').toUpperCase()}
times=['09:00','10:00','11:00','14:00','15:00','16:00'];
/** horários que você já marcou com este barbeiro neste dia: saem da lista como se estivessem ocupados */
get taken(){return this.mine.filter(a=>a.barberId===this.barber.id&&a.date===this.date).map(a=>a.time as string)}
/** lista final: tira os ocupados e, se for hoje, os que já passaram */
get available(){
 const now=new Date();const hhmm=String(now.getHours()).padStart(2,'0')+':'+String(now.getMinutes()).padStart(2,'0');
 return this.times.filter(t=>!this.taken.includes(t)&&!(this.date===this.iso(now)&&t<=hhmm));
}
private ensureTime(){if(!this.available.includes(this.time))this.time=this.available[0]||''}
async ionViewWillEnter(){
 this.error='';
 this.service=this.data.services.find(s=>s.id===sessionStorage.getItem('serviceId'))||this.data.services[0];
 this.barber=this.data.barbers.find(b=>b.id===sessionStorage.getItem('barberId'))||this.data.barbers[0];
 if(this.auth.user){try{this.mine=await this.data.myAppointments(this.auth.user.uid)}catch(e){this.mine=[]}}
 this.ensureTime();
}
selectBarber(b:Barber){this.barber=b;sessionStorage.setItem('barberId',b.id);this.ensureTime()}
selectDate(i:string){this.date=i;this.ensureTime()}
selectTime(t:string){this.time=t}
async confirm(){this.error='';if(!this.auth.user){this.error='Sua sessão expirou. Entre novamente para concluir o agendamento.';return}if(!this.time){this.error='Escolha um horário.';return}this.saving=true;const appointment={serviceId:this.service.id,serviceName:this.service.name,barberId:this.barber.id,barberName:this.barber.name,date:this.date,time:this.time,duration:this.service.duration,price:this.service.price,userId:this.auth.user.uid};try{await this.data.saveAppointment(appointment);sessionStorage.setItem('appointment',JSON.stringify(appointment));await this.router.navigateByUrl('/confirmed')}catch(error){const code=typeof error==='object'&&error!==null&&'code'in error?String(error.code):'';this.error=code==='permission-denied'?'O banco recusou a gravação. Verifique as regras do Firestore.':'Não foi possível salvar o agendamento. Verifique sua conexão e tente novamente.'}finally{this.saving=false}}
}

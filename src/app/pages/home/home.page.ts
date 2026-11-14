import {Component,inject} from '@angular/core';import {CommonModule} from '@angular/common';import {Router,RouterLink} from '@angular/router';import {IonContent,IonIcon} from '@ionic/angular/standalone';import {addIcons} from 'ionicons';import {notificationsOutline,chevronBack,chevronForward,cutOutline,starSharp,calendarOutline,timeOutline} from 'ionicons/icons';import {DataService} from '../../services/data.service';import {AuthService} from '../../services/auth.service';import {Appointment} from '../../models/models';import {TabBarComponent} from '../../shared/tab-bar.component';
addIcons({notificationsOutline,chevronBack,chevronForward,cutOutline,starSharp,calendarOutline,timeOutline});
@Component({standalone:true,imports:[CommonModule,RouterLink,IonContent,IonIcon,TabBarComponent],templateUrl:'home.page.html'})
export class HomePage{
 data=inject(DataService);auth=inject(AuthService);private router=inject(Router);
 items:Appointment[]=[];todayIso=this.iso(new Date());selected=this.todayIso;weekOffset=0;
 get name(){return this.auth.user?.displayName||this.auth.user?.email?.split('@')[0]||'Cliente'}
 openServices(){return this.router.navigateByUrl('/services')}
 chooseService(id:string){sessionStorage.setItem('serviceId',id);return this.router.navigateByUrl('/booking')}
 iso(d:Date){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
 get week(){
  const labels=['seg','ter','qua','qui','sex','sáb','dom'];const s=new Date();s.setDate(s.getDate()-((s.getDay()+6)%7)+this.weekOffset*7);
  return labels.map((l,i)=>{const d=new Date(s);d.setDate(s.getDate()+i);return{label:l,num:d.getDate(),iso:this.iso(d)}});
 }
 get weekRange(){const w=this.week;const f=(i:string)=>{const p=i.split('-');return p[2]+'/'+p[1]};return f(w[0].iso)+' a '+f(w[6].iso)}
 moveWeek(n:number){this.weekOffset+=n}
 hasItems(i:string){return this.items.some(a=>a.date===i)}
 get dayItems(){return this.items.filter(a=>a.date===this.selected).sort((a,b)=>a.time.localeCompare(b.time))}
 get selectedNum(){return Number(this.selected.split('-')[2])}
 get isToday(){return this.selected===this.todayIso}
 get dayTotal(){return this.dayItems.reduce((t,a)=>t+a.price,0)}
 initials(n:string){return n.split(' ').map(p=>p[0]).slice(0,2).join('').toUpperCase()}
 async ionViewDidEnter(){if(this.auth.user){try{this.items=await this.data.myAppointments(this.auth.user.uid)}catch(e){}}}
}

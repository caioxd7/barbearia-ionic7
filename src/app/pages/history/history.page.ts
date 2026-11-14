import {Component,inject} from '@angular/core';import {CommonModule} from '@angular/common';import {RouterLink} from '@angular/router';import {IonContent,IonIcon} from '@ionic/angular/standalone';import {addIcons} from 'ionicons';import {calendarOutline} from 'ionicons/icons';import {DataService} from '../../services/data.service';import {AuthService} from '../../services/auth.service';import {TabBarComponent} from '../../shared/tab-bar.component';
addIcons({calendarOutline});
@Component({standalone:true,imports:[CommonModule,RouterLink,IonContent,IonIcon,TabBarComponent],templateUrl:'history.page.html'})export class HistoryPage{items:any[]=[];error='';loading=false;data=inject(DataService);auth=inject(AuthService);
months=['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
day(a:any){return (a.date||'').split('-')[2]}
month(a:any){return this.months[Number((a.date||'').split('-')[1])-1]||''}
isPast(a:any){return new Date(a.date+'T'+a.time)<new Date()}
async ionViewDidEnter(){this.error='';this.items=[];if(!this.auth.user){this.error='Entre novamente para consultar seus agendamentos.';return}this.loading=true;try{this.items=(await this.data.myAppointments(this.auth.user.uid)).sort((x:any,y:any)=>(y.date+y.time).localeCompare(x.date+x.time))}catch(error){const code=typeof error==='object'&&error!==null&&'code'in error?String(error.code):'';this.error=code==='permission-denied'?'O banco recusou a consulta. Verifique as regras do Firestore.':'Não foi possível carregar seus agendamentos. Verifique sua conexão.'}finally{this.loading=false}}}

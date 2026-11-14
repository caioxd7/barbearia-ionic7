import {Component} from '@angular/core';import {CommonModule} from '@angular/common';import {RouterLink} from '@angular/router';import {IonContent,IonIcon} from '@ionic/angular/standalone';import {addIcons} from 'ionicons';import {checkmark} from 'ionicons/icons';import {TabBarComponent} from '../../shared/tab-bar.component';
addIcons({checkmark});
@Component({standalone:true,imports:[CommonModule,RouterLink,IonContent,IonIcon,TabBarComponent],templateUrl:'confirmed.page.html'})export class ConfirmedPage{a:any={};ionViewWillEnter(){try{this.a=JSON.parse(sessionStorage.getItem('appointment')||'{}')}catch{this.a={}}}
get dateBr(){const p=(this.a?.date||'').split('-');return p.length===3?p[2]+'/'+p[1]+'/'+p[0]:''}}

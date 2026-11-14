import {Injectable} from '@angular/core';
import {initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';
import {environment} from '../../environments/environment';
const app=initializeApp(environment.firebase);
@Injectable({providedIn:'root'}) export class FirebaseService{
 auth=getAuth(app); db=getFirestore(app);
}
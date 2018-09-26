import { Component, OnInit } from '@angular/core';
import { AccountService } from '../providers/account.service';
import { Account } from '../providers/account';
import { LoginService } from '../providers/login/login.service';
import { SharedDataService } from '../shared/shared-data.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AuthService } from '../providers/auth.service'
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';
import { Observable } from 'rxjs';
import { PhoneNumber } from '../providers/phone/phone-number';
import { WindowService } from '../providers/phone/window.service';
import { environment } from '../../environments/environment';
import { AccountEmailFirebaseService } from '../providers/firebase/account-email-firebase.service';
import { AccountPhoneFirebaseService } from '../providers/firebase/account-phone-firebase.service';
import { ActivatedRoute, UrlSegment, ParamMap,Params } from '@angular/router';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [SharedDataService,AccountService, DatePipe, LoginService, AngularFireDatabase, AngularFireAuth, WindowService]
})
export class LoginComponent implements OnInit {

  email=false;
  user = {
    email: '',
    password: ''
  };
  verificationCode: string;
  windowRef: any;
  public currentUser: firebase.User;
  model: any = {}; currentAccount: Account;
  message: string;
  errorMessage: string;
 
  authState: any = null; name: string;
  private userDetails: firebase.User = null; authenticated: boolean = false;
  phoneNumber = new PhoneNumber()
  private activeUser: Observable<firebase.User>; 

  constructor(private activatedRoute: ActivatedRoute,private accser: AccountService, private router: Router, private shared: SharedDataService,
    private logSer: LoginService, private datePipe: DatePipe, private authService: AuthService,
    public afAuth: AngularFireAuth, private db: AngularFireDatabase, private win: WindowService,
    private accountEmailFirebaseService: AccountEmailFirebaseService,
    private accountPhoneFirebaseService: AccountPhoneFirebaseService) {
    this.afAuth.authState.subscribe((auth) => {
      this.authState = auth
      this.currentUser = this.afAuth.auth.currentUser
    });
    this.activeUser = afAuth.authState;
    this.activeUser.subscribe(
      (activeUser) => {
        if (activeUser) {
          this.currentUser = activeUser;         
        }
        else {
          this.currentUser = null;
        }
      }
    );
  }

  ngOnInit() {

    this.activatedRoute.queryParams.subscribe((params: Params) => {
      if(params['email']!=null)
      this.email =true ;               
     });

    this.currentUser = null;
    this.windowRef = this.win.windowRef;
    try {
      firebase.initializeApp(environment.firebase)
    } catch (error) {
    }

    this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container')
    this.windowRef.recaptchaVerifier
      .render()
      .then(widgetId => {

        this.windowRef.recaptchaWidgetId = widgetId
      });

     // this.signInWithEmail();
  }
  
  sendLoginCode() {
    const appVerifier = this.windowRef.recaptchaVerifier;
    const num = this.phoneNumber.e164;
    firebase.auth().signInWithPhoneNumber(num, appVerifier)
      .then(result => {
        this.windowRef.confirmationResult = result;
      })
      .catch(error => console.log(error));
  }

  verifyLoginCode() {
    this.windowRef.confirmationResult
      .confirm(this.verificationCode)
      .then(result => {
        this.currentUser = result.user;          
        
        this.accountPhoneFirebaseService.getPhoneParentId(result.user.uid).then((parentId: string) => {
          this.shared.saveAuth(result.user.uid, result.user.phoneNumber, result.user.providerData[0].providerId, parentId)
          this.accser.saveAccountDataPhoneServlet(result.user.uid,'',result.user.phoneNumber,'',  result.user.providerData[0].providerId)
            .subscribe((data: any) => {      
              localStorage.setItem("uid",result.user.uid);           
              localStorage.setItem("account_id",data.id);             
              localStorage.setItem("email", result.user.phoneNumber);    
              localStorage.setItem("display_name", result.user.phoneNumber);                       
              this.router.navigate(['Account']);                         
            }, error => () => { }, () => { });
        });
      })
      .catch(
          //error => console.log(error, "Incorrect code entered?"),
          error => this.errorMessage = "Incorrect code Entered");
   
      
  }

  loginWithGoogle() {
    document.getElementById('gmailLogin').innerText ="Login progress.."
    this.authService.signInWithGoogle()
      .then((res) => {
        this.signIntoDB();
      })
      .catch((error) => {       
      });
  }

  signUpWithGoogle() {
    window.open("https://accounts.google.com/signup/v2/webcreateaccount?service=mail&continue=https%3A%2F%2Fmail.google.com%2Fmail%2F&ltmpl=default&flowName=GlifWebSignIn&flowEntry=SignUp",
      "_blank", "toolbar=no,scrollbars=yes,resizable=no,top=10,left=200,width=1000,height=650")
  }

  signInWithEmail() {
    if(this.user.email.endsWith('@gmail.com')){
      this.message = "Please login with google";
    }
    else{

      this.authService.createUser(this.user.email, this.user.password)
      .then((res) => {     
        this.logSer.getIpCliente().subscribe((ip: string) => {
          this.accser.saveAccountDataEmailServlet( this.afAuth.auth.currentUser.uid, this.afAuth.auth.currentUser.email,'',ip,'Firebase')
            .subscribe((data:any) => {
              localStorage.setItem("account_id",data.id);             
              localStorage.setItem("email",this.afAuth.auth.currentUser.email);    
              localStorage.setItem("display_name",this.afAuth.auth.currentUser.email);       
              localStorage.setItem("uid",this.afAuth.auth.currentUser.uid);         
              this.router.navigate(['Account']);
            }, error => () => { }, () => { })
          }); 
      })
      .catch((err) => {       
        if (err.code == 'auth/email-already-in-use') {    
          this.authService.signIn(this.user.email, this.user.password)
          .then((res) => {
            this.logSer.getIpCliente().subscribe((ip: string) => {
              this.accser.saveAccountDataEmailServlet( this.afAuth.auth.currentUser.uid, this.afAuth.auth.currentUser.email,'',ip,'Firebase')
                .subscribe((data:any) => {
                  localStorage.setItem("account_id",data.id);             
                  localStorage.setItem("email",this.afAuth.auth.currentUser.email);    
                  localStorage.setItem("display_name",this.afAuth.auth.currentUser.email);       
                  localStorage.setItem("uid",this.afAuth.auth.currentUser.uid);         
                  this.router.navigate(['Account']);
                }, error => () => { }, () => { })
              });    
          })
          .catch((error) => {
            this.message = error.message;
            //console.log(error);
          });          
        }
        else {         
        }
      });     
    }
  }

  signIntoDB() {    
    this.logSer.getIpCliente().subscribe((ip: string) => {
    this.accser.saveAccountDataEmailServlet( this.afAuth.auth.currentUser.uid, this.afAuth.auth.currentUser.email,'',ip,'firebase')
      .subscribe((data:any) => {
        localStorage.setItem("account_id",data.id);             
        localStorage.setItem("email",this.afAuth.auth.currentUser.email);    
        localStorage.setItem("display_name",this.afAuth.auth.currentUser.displayName);       
        localStorage.setItem("uid",this.afAuth.auth.currentUser.uid);         
        this.router.navigate(['Account']);
      }, error => () => { }, () => { })
    });    
  }


  getLoginDetails(): string {
    let today = Date.now();
    let date = this.datePipe.transform(today, 'yMMMMd');
    let time = this.datePipe.transform(today, 'hh:mm a, Z');
    return date + time;
  }

  showMail() {
    var x = document.getElementById('hidden-email-form')
    if (x.style.display === 'none')
      x.style.display = 'block';
    else
      x.style.display = 'none';
    document.getElementById('hidden-phone-form').style.display = 'none';    
  }

  showPhone() {
    var x = document.getElementById('hidden-phone-form')
    if (x.style.display === 'none')
      x.style.display = 'block';
    else
      x.style.display = 'none';
    document.getElementById('hidden-email-form').style.display = 'none';
  }

  addLoginInfo(account_id,login_id) {
    /* get the ip address */
    this.logSer.getIpCliente().subscribe((ip: string) => {
      this.logSer.addLoginDetails(account_id, ip, 'active', login_id, 'firebase')
        .subscribe((res1: Boolean) => {
          this.router.navigate(['Account']);
           
        }, error => () => { }, () => { });
    }, error => () => { }, () => { });
  }
}


 
 

  
  



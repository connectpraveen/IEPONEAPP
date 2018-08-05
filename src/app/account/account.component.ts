import { Component, OnInit } from '@angular/core';
import { AccountService } from '../providers/account.service';
import { Account } from '../providers/account';
import { LoginService } from '../providers/login/login.service';
import { Login } from '../providers/login/login';
import { SharedDataService } from '../shared/shared-data.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthService } from '../providers/auth.service';
import { SlicePipe, Location } from '@angular/common';
import { environment } from '../../environments/environment';
import { User } from 'firebase';
import { PhoneNumber } from '../providers/phone/phone-number';
import { WindowService } from '../providers/phone/window.service';
import { DatePipe } from '@angular/common';
import { AccountEmailFirebaseService } from '../providers/firebase/account-email-firebase.service';
import { AccountGmailFirebaseService } from '../providers/firebase/account-gmail-firebase.service';
import { AccountPhoneFirebaseService } from '../providers/firebase/account-phone-firebase.service';
import { UserAssociateEmail, UserAssociatePhone } from './user-associate-email';
import * as firebase from 'firebase';
import { ActivatedRoute, Router, UrlSegment, ParamMap } from '@angular/router';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
  providers:[AccountService,SharedDataService,LoginService,AuthService,WindowService,DatePipe]
})
export class AccountComponent implements OnInit {
  showVerificationCode=false;
  private currentUser: firebase.User;
  showSignout= false;
  currentUsername: string; authState: any = null;  
  phoneNumber = new PhoneNumber();
  user: any;
  model: any = {};
  eMail = '';
  phone = '';
  phoneSaved = false;
  showPwdMessage = false;
  pwdMessage: string;
  verifyEMail: string;
  hideRepeat = true;
  showLoginDetails = false;
  loginDetails: Login[];
  enableSave = false;
  hideEmail = true;
  message: string;
  saveMessage: string;
  deleteMessage: string;
  savePhone: string;
  emailSaved = false;
  uid: string;
  windowRef: any;
  emlMsg: string; socialLogin = false; userId: string;
  loginCount = 0; reverse = true; order = 'last_login'; 
  userAssociateEmailModel = {
    email: '',
    password: ''
  };
  auth: any
  public associatedEmailAddresses: UserAssociateEmail[];
  public associatedPhones: UserAssociatePhone[];
  account_id:string;
  constructor(private router: Router,private accser: AccountService, private shared: SharedDataService, 
    private logSer: LoginService,  public afAuth: AngularFireAuth, 
    private authService: AuthService,
    private win: WindowService,private datePipe: DatePipe,
    private accountEmailFirebaseService: AccountEmailFirebaseService,
    private accountGmailFirebaseService: AccountGmailFirebaseService,
    private accountPhoneFirebaseService: AccountPhoneFirebaseService) {
    this.afAuth.authState.subscribe((auth) => {
      this.authState = auth
      this.currentUser = this.afAuth.auth.currentUser
    });
  }
  ngOnInit() {       
    this.account_id=localStorage.getItem("account_id"); 
    if (this.afAuth.auth.currentUser) {    
      if (this.afAuth.auth.currentUser.displayName)      
      this.showSignout= true;  
    }
    this.auth = this.shared.getAuth();
    if (this.afAuth.auth.currentUser === null) {
      if (this.auth.provider === 'phone') {
        this.phone = this.auth.value;
        // document.getElementById('tr-hide').style.display = 'none';
        // document.getElementById('verifyButton').style.display = 'none';
        // document.getElementById('phoneTR').style.display = 'block';
        // document.getElementById('hide-email').style.display = 'block';
        // document.getElementById('email-label').style.display = 'none';
      }

      if (this.auth.provider === 'password')
        this.eMail = this.auth.value;
      this.uid = this.auth.uid;
    }
    if (this.afAuth.auth.currentUser) {
      // document.getElementById('phone-label').style.display = 'none';
      // document.getElementById('phone-label-hide').style.display = 'inline';
      // document.getElementById('email-label').style.display = 'block';
      if (this.afAuth.auth.currentUser.email) {
        this.eMail = this.afAuth.auth.currentUser.email;
        // document.getElementById('profile-completion').style.display = 'none';
      }
      if (this.afAuth.auth.currentUser.displayName)
        this.currentUsername = this.afAuth.auth.currentUser.displayName;
      this.uid = this.afAuth.auth.currentUser.uid;
    }

    /* fetch user login details */
    this.logSer.getLoginDetails(this.account_id)
      .subscribe((data: Login[]) => {
        this.loginDetails = data;
        this.loginCount = data.length;
      }, error => () => { }, () => { });


    if (this.auth.parentId.length == 0) {
      this.auth.parentId = this.uid;
      /* document.getElementById('thEmail').style.display = 'none';
       document.getElementById('thAction').style.display = 'none';
       document.getElementById('associatedEmails').style.display = 'none';*/
      // document.getElementById('thPhone').style.display = 'none';
      // document.getElementById('thPhoneAction').style.display = 'none';
    }



    this.accountEmailFirebaseService.getEmailParentId(this.auth.parentId).then((parentId: string) => {
      var x = this.accountEmailFirebaseService.getEmails(parentId);
      x.snapshotChanges().subscribe(item => {
        this.associatedEmailAddresses = [];
        item.forEach(element => {
          var y = element.payload.toJSON();
          y["$key"] = element.key;
          var data = y as UserAssociateEmail;
          if (data.childId != this.uid) {
            this.associatedEmailAddresses.push(data);
          }
        });
      });
    });

//For Associated Gmail ids
    this.accountGmailFirebaseService.getEmailParentId(this.auth.parentId).then((parentId: string) => {
      var x = this.accountGmailFirebaseService.getEmails(parentId);
      x.snapshotChanges().subscribe(item => {
        this.associatedEmailAddresses = [];
        item.forEach(element => {
          var y = element.payload.toJSON();
          y["$key"] = element.key;
          var data = y as UserAssociateEmail;
          if (data.childId != this.uid) {
            this.associatedEmailAddresses.push(data);
          }
        });
      });
    });



    this.accountPhoneFirebaseService.getPhoneParentId(this.auth.parentId).then((parentId: string) => {
      var x = this.accountPhoneFirebaseService.getPhones(parentId);
      x.snapshotChanges().subscribe(item => {
        this.associatedPhones = [];
        item.forEach(element => {
          var y = element.payload.toJSON();
          y["$key"] = element.key;
          var data = y as UserAssociatePhone;

          if (data.childId != this.uid) {
            var z = this.associatedPhones.push(data);
            var tableRow = (z + 1) - 1;
            console.log("Table Row=" + tableRow);
            if (tableRow > 0) {
              // document.getElementById('associatedPhone').style.display = 'block';
              // document.getElementById('thPhone').style.display = 'table-cell';
              // document.getElementById('thPhoneAction').style.display = 'table-cell';
            }
          }
        });
      });
    });

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

  }
  
  onSubscribe() {
    this.router.navigate(['subscribe']);
  }

  onVerifyEmail() {
    this.currentUser = this.afAuth.auth.currentUser;
    this.verifyEMail = "Link hasbeen sent to your mail, please verify it";
    this.currentUser.sendEmailVerification().then(function () {
      // Email sent.
    }).catch(function (error) {
      console.log(error);
    });
  }
  onSave() {
    this.accser.updatePhone(this.model.phone, this.afAuth.auth.currentUser.uid)
      .subscribe((data: number) => {
        if (data > 0) {
          this.phoneSaved = true;
          this.enableSave = false;
        }
      }, error => () => { }, () => { });
  }
  onSaveChangedPwd() {
    if (this.afAuth.auth.currentUser) {
      this.currentUser = this.afAuth.auth.currentUser;
      this.afAuth.auth.sendPasswordResetEmail(this.currentUser.email).then(function () {
        // Email sent.
      }).catch((error) => {
        console.log(error)
      });
    }
  }
  onSaveChangeEmail() {
    document.getElementById("input").setAttribute(
      "style", "border-color: rgba(66, 110, 244, 1); box - shadow: 2px 4px 4px rgba(229, 103, 23, 0.075) inset, 2px 2px 10px rgba(229, 103, 23, 0.6);  outline: 0 none;");
    setTimeout(function () {
      document.getElementById("input").focus()
    }, 1000);
    //document.getElementById("input").setAttribute("placeholder", "Enter new Email and save");
    document.getElementById("emailSave").style.display = "inline";
    this.currentUser = this.afAuth.auth.currentUser;
    this.currentUser.updateEmail(this.model.email).then(result => {
      this.updateEmail();

    }).catch(function (error) {
      console.log(error)
    });
  }

  onSaveEmail() {
    document.getElementById('input').style.border = 'blue';
    var input = (<HTMLInputElement>document.getElementById("input")).value;
    var pattern = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (pattern.test(input)) {

      this.saveMessage = "Your Email has been changed";
      setTimeout(function () {
        document.getElementById('labelMessage').style.display = 'none';
      }, 5000);
      document.getElementById("emailSave").style.display = "none";
      document.getElementById('labelMessage').style.display = 'inline';
    }

  }
  onChangePhone() {
    document.getElementById("phoneSave").style.display = "inline";
    document.getElementById("phoneInput").setAttribute(
      "style", "border-color: rgba(66, 110, 244, 1); box - shadow: 2px 4px 4px rgba(229, 103, 23, 0.075) inset, 2px 2px 10px rgba(229, 103, 23, 0.6);  outline: 0 none;");
    (<HTMLInputElement>document.getElementById("phoneInput")).value = '';
    document.getElementById("phoneInput").setAttribute("placeholder", "Enter new Number and save");
  }
  onSavePhone() {
    document.getElementById('phoneInput').style.border = 'blue';
    var input = (<HTMLInputElement>document.getElementById("phoneInput")).value;
    var pattern = input.replace(/[^\d]/g, '');
    if (pattern.length > 9 && pattern.length < 14) {
      this.savePhone = "Your Phone number has been changed";
      setTimeout(function () {
        document.getElementById('labelMessagePhone').style.display = 'none';
      }, 5000);
      document.getElementById("phoneSave").style.display = "none";
      document.getElementById('labelMessage').style.display = 'inline';
    }
  }
  onSaveChangedEmail() {
    this.currentUser = this.afAuth.auth.currentUser;
    this.currentUser.updateEmail(this.model.email).then(result => {
      this.updateEmail()
    }).catch(function (error) {
      console.log(error)
    });
  }
  updateEmail() {
    this.accser.updateEmail(this.currentUser.uid, this.model.email)
      .subscribe((data: number) => {
      }, error => () => { }, () => { });
  }
  onShowPlatformLogin() {       
   if(document.getElementById("loginhistory").hidden ==true) 
   document.getElementById("loginhistory").hidden=false;
   else
   document.getElementById("loginhistory").hidden=true;
  }

  onDeleteAssociateEmail(key: string, id: string) {
    this.accountEmailFirebaseService.getByKey(key).then((response) => {
      var record: UserAssociateEmail = response as UserAssociateEmail;
      // Delete record from associate table
      this.accountEmailFirebaseService.remove(key).then((isDeleted) => {
        if (isDeleted) {
          var dbContext = this.GetDBContext();
          this.authService.SignIn(record.email, record.password, dbContext)
            .then((user) => {
              // user.delete().then(function () {
              // }).catch(function (error) {

              //   console.error("Error!! while deleting the user" + error);
              // });
            }).catch((err) => {
              //alert("SignIn1:->" + err.code);
            });
        }
      });
    });

  }

  loginWithGoogle() {
    var dbContext = this.GetDBContext();
    this.authService.signInWithGoogleAssociated()
      .then((res) => {
        this.signIntoDB();
        this.accountGmailFirebaseService.add({
            childId: res.user.uid,
            //password: 'abcd',
            parentId: this.auth.parentId, // parent-Id of current login user
            email: res.user.email
        });       // this.signIntoDB();
      })
      .catch((error) => {
        /*let result = this.linkAccount(error);
        if (result)
          this.signIntoDB();*/
      });
  }


  onSaveAssociateEmailAddress() {
    var dbContext = this.GetDBContext();
    //check email and password 
    var input = (<HTMLInputElement>document.getElementById("input_addemail")).value;
    var pattern = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    var password = (<HTMLInputElement>document.getElementById("input_addpassword")).value;
    var passwordPattern = /^([a-zA-Z0-9_\.\-]{6,})+$/;
    console.log(password);
    console.log(passwordPattern.test(password));
    if (pattern.test(input) && passwordPattern.test(password)) {
      this.authService.createUserWithoutSignIn(this.userAssociateEmailModel.email, this.userAssociateEmailModel.password, dbContext)
        .then((res) => {
          this.accountEmailFirebaseService.add({
            childId: res.user.uid,
            password: this.userAssociateEmailModel.password,
            parentId: this.auth.parentId, // parent-Id of current login user
            email: this.userAssociateEmailModel.email
          });
          document.getElementById('addEmailModal').click();
          (<HTMLInputElement>document.getElementById("input_addemail")).value = '';
          (<HTMLInputElement>document.getElementById("input_addpassword")).value = '';
        }).catch((err) => {
          document.getElementById('addMessage').innerText="This Email is already in use";
          this.message = "This Email is already in use";
        });
    }
    else {
      document.getElementById('addMessage').innerText="Email or Password Invalid!";
      this.message = "Email or Password Invalid!";
    }
    this.message = '';
  }

  onSaveAssociateEmailPwdAddress() {
    var dbContext = this.GetDBContext();
    //check email and password 
    var input = (<HTMLInputElement>document.getElementById("input_addemailpwd")).value;
    var pattern = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    debugger;
    var pwd = this.randomPwdGenerator();
    //var pwd = 'abcdef';
    console.log(pwd);
    /*var password = (<HTMLInputElement>document.getElementById("input_addpassword")).value;
    var passwordPattern = /^([a-zA-Z0-9_\.\-]{6,})+$/;
    console.log(password);
    console.log(passwordPattern.test(password));*/
    if (pattern.test(input)){// && passwordPattern.test(password)) {
      this.authService.createUserWithoutSignIn(this.userAssociateEmailModel.email, pwd, dbContext)
        .then((res) => {
          this.signIntoDB();
          this.accountEmailFirebaseService.add({
            childId: res.user.uid,
            password: pwd,
            parentId: this.auth.parentId, // parent-Id of current login user
            email: this.userAssociateEmailModel.email
          });
          document.getElementById('change_emailpwd_dialog').click();
          (<HTMLInputElement>document.getElementById("input_addemailpwd")).value = '';
          //(<HTMLInputElement>document.getElementById("input_addpassword")).value = '';

          //send email to reset password
          this.afAuth.auth.sendPasswordResetEmail(this.userAssociateEmailModel.email).then(function () {
            this.message ="An email has been sent to reset your password";
          }).catch((error) => {
            console.log(error)
          });
        }).catch((err) => {
          this.message = "This Email is already in use";
        });
    }
    else {
      this.message = "Email Invalid!";
    }
    this.message = '';
  }

   randomPwdGenerator()  {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (var i = 0; i < 6; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
  }
  

  sendLoginCode() {   
    const appVerifier = this.windowRef.recaptchaVerifier;
    const num = this.phoneNumber.e164;
    firebase.auth().signInWithPhoneNumber(num, appVerifier)
      .then(result => {        
        this.windowRef.confirmationResult = result;
        document.getElementById('showVerificationCode').hidden=false;
      })
      .catch(error => console.log(error));
  }

  verificationCode: string;
  verifyLoginCode() {
    this.windowRef.confirmationResult
      .confirm(this.verificationCode)
      .then(result => {

        this.accountPhoneFirebaseService.addPhone({
          childId: result.user.uid,
          parentId: this.auth.parentId, // parent-Id of current login user
          phone: result.user.phoneNumber
        });

        document.getElementById('btnframeModalPhone').click();                
      })
      .catch(error => console.log(error, "Incorrect code entered?"));
  }


  onDeleteAssociatePhone(key: string) {
    // if (confirm('Are you sure to delete this record ?') == true) {
    this.accountPhoneFirebaseService.removePhone(key).then((isDeleted) => {
      if (isDeleted) {
        console.log("DeletedPhone")
      }
    });
    //}
  }

  private GetDBContext(): any {

    let dbContext_name: string = "iepone";
    var secondayFirebase: any = null;

    for (var i = 0; i <= firebase.apps.length - 1; i++) {
      if (firebase.apps[i].name == dbContext_name) {
        secondayFirebase = firebase.apps[i];
        break;
      }
    }

    if (secondayFirebase == null)
      secondayFirebase = firebase.initializeApp(environment.firebase, dbContext_name);

    return secondayFirebase;
  }

  signIntoDB() {
    this.accser.saveAccountWithEmail(this.afAuth.auth.currentUser.uid,this.afAuth.auth.currentUser.email,'','','firebase')
      .subscribe((data: string) => {
        this.addLoginInfo(data)
      }, error => () => { }, () => { });
  }

  addLoginInfo(account_id) {
    /*get logged in date and time*/
    let login = this.getLoginDetails();

    /* get the ip address */
    this.logSer.getIpCliente().subscribe((ip: string) => {
      this.logSer.addLoginDetails(account_id, ip, 'active', 'allowed', login)
        .subscribe((res1: Boolean) => {
          this.router.navigate(['subscription']);
           
        }, error => () => { }, () => { });
    }, error => () => { }, () => { });
  }
  getLoginDetails(): string {
    let today = Date.now();
    let date = this.datePipe.transform(today, 'yMMMMd');
    let time = this.datePipe.transform(today, 'hh:mm a, Z');
    return date + time;
  }

}

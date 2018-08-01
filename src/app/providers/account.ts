/* Class to store Account data which can be imported by other components */
export class Account {
  account_id: string;
  email: string;
  pwd; string;
  email_verified: boolean;
  device_id: string;
  phone_number: string;
  phone_verified: boolean;
  
  constructor(account_id: string, email: string,pwd: string,email_verified: boolean, device_id: string, phone_number: string, phone_verified: boolean) {
    this.account_id = account_id;
    this.email = email;
    this.pwd = pwd;
    this.email_verified = email_verified;
    this.device_id = device_id;
    this.phone_number = phone_number;
    this.phone_verified = phone_verified;
    }
  }

/* Class to store Account data which can be imported by other components */
export class AccountDetails {
 accountHolders: AccountHolders[];
 logins : Login[];
 profiles: Profile[];
 subscription: Subscription[];
 constructor( accountHolders: AccountHolders[],
  logins : Login[],
  profiles: Profile[],
  subscription: Subscription[]){
    this.accountHolders = accountHolders;
    this.logins = logins;
    this.profiles = profiles;
    this.subscription = subscription;
 }
  }

  export class Profile{
    id:string;
    account_id: string;
    device_id: string;
    status:string;
    created_date:Date;
    updated_date:Date;
    user_updated:string;
    
    constructor( id:string,
      account_id: string,
      device_id: string,
      status:string,
      created_date:Date,
      updated_date:Date,
      user_updated:string) {
     this.id = id;
     this.account_id = account_id;
     this.device_id = device_id;
     this.status = status;
     this.created_date = created_date;
     this.updated_date = updated_date;
     this.user_updated = user_updated;
      }  }

      export class Login{
        id:string;
        login_user: string;
        login_service_provider: string;
        account_id: string;
        ip_address:string;
       session_val:string;
        created_date:Date;
        updated_date:Date;
        user_updated:string;
        
        constructor( id:string,
          account_id: string,
          login_user: string,
          login_service_provider:string,
          session_val:string,
          ip_address:string,
          created_date:Date,
          updated_date:Date,
          user_updated:string) {
         this.id = id;
         this.account_id = account_id;
         this.login_user = login_user;
         this.login_service_provider = login_service_provider;
         this.session_val = session_val;
         this.ip_address = ip_address;
         this.created_date = created_date;
         this.updated_date = updated_date;
         this.user_updated = user_updated;
          }
      }

      export class AccountHolders{
        id:string;
        account_id: string;
        email:string;
       phone_number:string;
       verified:boolean;
       access_granted:boolean;
       account_type:string;
        created_date:Date;
        updated_date:Date;
        user_updated:string;
        
        constructor( id:string,
          account_id: string,
          email: string,
          phone_number:string,
          verified:boolean,
          access_granted:boolean,
          account_type:string,
          created_date:Date,
          updated_date:Date,
          user_updated:string) {
         this.id = id;
         this.account_id = account_id;
         this.email = email;
         this.phone_number = phone_number;
         this.verified = verified;
         this.access_granted = access_granted;
         this.account_type = account_type;
         this.created_date = created_date;
         this.updated_date = updated_date;
         this.user_updated = user_updated;
          }
      }

      export class Subscription{
        id:string;
        account_id: string;
        subscription_code:string;
       subscription_date:Date;
       discount_code:string;
       price_id:string;
       quantity:number;
       price:number;
       status:string;
       auto_payment:boolean;
       message:string;
        created_date:Date;
        updated_date:Date;
        user_updated:string;
        
        constructor( id:string,
          account_id: string,
          subscription_code:string,
         subscription_date:Date,
         discount_code:string,
         price_id:string,
         quantity:number,
         price:number,
         status:string,
         auto_payment:boolean,
         message:string,
          created_date:Date,
          updated_date:Date,
          user_updated:string) {
         this.id = id;
         this.account_id = account_id;
        this.subscription_code = subscription_code;
        this.subscription_date = subscription_date;
        this.discount_code = discount_code;
        this.price_id = price_id;
        this.status = status;
        this.auto_payment = auto_payment;
        this.message=message;
         this.created_date = created_date;
         this.updated_date = updated_date;
         this.user_updated = user_updated;
          }
      }
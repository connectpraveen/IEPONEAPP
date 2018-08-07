export class Subscription {
  subscription_id: string;
  subscription_code: string;
  subscription_datetime: string;
  expiry_datetime: string;
  account_id: string;
  active: boolean;
}

export class Profile {
  id: string;
  avatar_name: string;
  age: string;
  gender: string;
  updated_date: string;
  status: string;

  constructor(private _id: string, private _name: string, private _age: string, private _gender: string, private _updated_date: string, private _status: string) {
    this.id = _id;
    this.avatar_name = _name;
    this.updated_date = _updated_date;
    this.status = _status;
    this.age = _age;
    this.gender = _gender;
  }
}

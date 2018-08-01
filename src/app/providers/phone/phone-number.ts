export class PhoneNumber {
  country: string;
  area: string;
  

  // format phone numbers as E.164
  get e164() {
    const num = this.country + this.area;
    return `+${num}`
  }

}


import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';


interface userAssociatePhoneModel {
  phone: string;
  childId: string;
  parentId: string;
};


@Injectable()
export class AccountPhoneFirebaseService {

  private associatePhones: AngularFireList<any>;
  private tableName: string = "/UserAssociationPhone";

  constructor(private dbContext: AngularFireDatabase) {
    this.associatePhones = this.dbContext.list(this.tableName);
  }

  addPhone(model: userAssociatePhoneModel) {
    this.associatePhones.push(model);
  }

  getPhones(parentId: string): AngularFireList<any> {
    return this.dbContext.list(this.tableName, ref => ref.orderByChild('parentId').equalTo(parentId));
  }

  getPhoneParentId(uid: string) {
    let promise = new Promise((resolve, reject) => {
      var parentId: string = uid;
      var record = this.dbContext.list(this.tableName, ref => ref.orderByChild('childId').equalTo(uid));

      record.snapshotChanges().subscribe(item => {
        item.forEach(element => {
          parentId = (element.payload.toJSON() as userAssociatePhoneModel).parentId;
        });
        resolve(parentId);
      });

    });

    return promise;
  }

  removePhone(key: string) {
    let promise = new Promise((resolve, reject) => {
      this.associatePhones.remove(key);
      resolve(true);
    });

    return promise;
  }



}

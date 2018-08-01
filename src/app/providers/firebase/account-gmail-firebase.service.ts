import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

interface userAssociateGmailModel {
  email: string;
  childId: string;
  //password: string;
  parentId: string;
};


@Injectable()
export class AccountGmailFirebaseService {

  private associateEmails: AngularFireList<any>;
  private tableName: string = "/UserAssociations";

  constructor(private dbContext: AngularFireDatabase) {
    this.associateEmails = this.dbContext.list(this.tableName);
  }


  getByKey(key: string) {
    let promise = new Promise((resolve, reject) => {
      var record = this.dbContext.list(this.tableName, ref => ref.orderByKey().equalTo(key));

      record.snapshotChanges().subscribe(item => {
        item.forEach(element => {
          resolve((element.payload.toJSON() as userAssociateGmailModel));

        });
      });

    });

    return promise;
  }




  add(model: userAssociateGmailModel) {
    this.associateEmails.push(model);debugger;
  }

  getEmails(parentId: string): AngularFireList<any> {
    return this.dbContext.list(this.tableName, ref => ref.orderByChild('parentId').equalTo(parentId));
  }

  getEmailParentId(uid: string) {
    let promise = new Promise((resolve, reject) => {
      var parentId: string = uid;
      var record = this.dbContext.list(this.tableName, ref => ref.orderByChild('childId').equalTo(uid));
      record.snapshotChanges().subscribe(item => {
        item.forEach(element => {
          parentId = (element.payload.toJSON() as userAssociateGmailModel).parentId;
        });
        resolve(parentId);
      });

    });

    return promise;
  }


  remove(key: string) {
    let promise = new Promise((resolve, reject) => {
      this.associateEmails.remove(key);
      resolve(true);
    });

    return promise;
  }


}


import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { app } from 'firebase/app';
import { Observable } from 'rxjs';

@Injectable()
export class AuthService {

  private user: Observable<firebase.User>;
  private userDetails: firebase.User = null;
  //private associated;
  constructor(private _firebaseAuth: AngularFireAuth, private router: Router) {
    //this.associated = false;
    this.user = _firebaseAuth.authState;
    this.user.subscribe(
      (user) => {
        if (user){// && this.associated === false) {
          this.userDetails = user;
          console.log(this.userDetails);
        } else {
          this.userDetails = null;
        }
      }
    );
  }
  signInWithTwitter() {
    return this._firebaseAuth.auth.signInWithPopup(
      new firebase.auth.TwitterAuthProvider()
    )
  }

  signInWithGoogle() {
    return this._firebaseAuth.auth.signInWithPopup(
      new firebase.auth.GoogleAuthProvider().setCustomParameters({
        prompt: 'select_account'
      }));
  }

  signInWithGoogleAssociated() {
    //this.associated = true;
    return this._firebaseAuth.auth.signInWithPopup(
      new firebase.auth.GoogleAuthProvider().setCustomParameters({
        prompt: 'select_account'
      }));
  }

  signInWithFacebook() {
    return this._firebaseAuth.auth.signInWithPopup(
      new firebase.auth.FacebookAuthProvider()
    )
  }

  signInWithGithub() {
    return this._firebaseAuth.auth.signInWithPopup(
      new firebase.auth.GithubAuthProvider()
    )
  }

  createUser(email, password) {
    const credential = firebase.auth.EmailAuthProvider.credential(email, password);
    return this._firebaseAuth.auth.createUserWithEmailAndPassword(email, password)
  }


  createUserWithoutSignIn(email, password, secondaryApp: app.App) {
    const credential = firebase.auth.EmailAuthProvider.credential(email, password);
    return secondaryApp.auth().createUserWithEmailAndPassword(email, password);
  }


  SignIn(email, password, secondaryApp: app.App) {
    return secondaryApp.auth().signInWithEmailAndPassword(email, password);
  }


  signIn(email, password) {
    return firebase.auth().signInWithEmailAndPassword(email, password)
  }

  signInPhone(credential) {
    return firebase.auth().signInWithCredential(credential);
  }

  removeUser(uid: string) {
    debugger;
    var usersRef = firebase.database().ref(`users/${uid}`);

    if (usersRef != null) {
      usersRef.remove();
    }
  }

  isLoggedIn() {
    if (this.userDetails == null) {
      return false;
    } else {
      return true;
    }
  }


  logout() {
    this._firebaseAuth.auth.signOut()
      .then((res) => this.router.navigate(['/']));
  }

  signout() {
    this._firebaseAuth.auth.signOut()
      .then((res) =>console.log("Signed out")) ;
  }
}

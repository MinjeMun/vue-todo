import firebase from 'firebase/app'; // 파이어베이스 기능 불러오기
import 'firebase/firestore'; // 파이어베이스의 파이어스토어 기능 불러오기

const firebaseConfig = {
    apiKey: "AIzaSyCO9HDfYUvn6jcjrapbVVGSmzvlgFKtnK0",
    authDomain: "my-todo1-d139a.firebaseapp.com",
    projectId: "my-todo1-d139a",
    storageBucket: "my-todo1-d139a.appspot.com",
    messagingSenderId: "74144059337",
    appId: "1:74144059337:web:8cede4eb1ea7fcbe96a218"
};

export const db = firebase.initializeApp(firebaseConfig).firestore();
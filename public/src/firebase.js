import { GroupOutlined } from '@material-ui/icons';
import firebase from 'firebase/app';
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBQSTxxiNvIoGqAxlyTlFroGlgipPj7d3E",
  authDomain: "barbera-feaf4.firebaseapp.com",
  projectId: "barbera-feaf4",
  storageBucket: "barbera-feaf4.appspot.com",
  messagingSenderId: "840773866058",
  appId: "1:840773866058:web:249f5a98193224c5e88cb3",
  measurementId: "G-N288Q3BWPE"

};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export default firebase;


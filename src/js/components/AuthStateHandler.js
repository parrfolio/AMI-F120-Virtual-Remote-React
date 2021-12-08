import React, { useState, useEffect } from "react";
import { db, firebaseAuth, storageKey } from "../firestore/database";
export const useAuth = () => {
  let intialState = {
    authed: false,
    loading: false,
    user: {
      firstName: "",
      lastName: "",
      email: "",
      admin: false,
      uid: "",
      avatar: "",
    },
  };
  const [state, setState] = useState(() => {
    const user = firebaseAuth().currentUser;
    return {
      authed: false,
      loading: true,
      user: {
        firstName: "",
        lastName: "",
        email: "",
        admin: false,
        uid: "",
        avatar: "",
      },
    };
  });
  const onChange = (user) => {
    if (user) {
      const userRef = db.collection("users");
      const getUser: OnsnapshotUserType = userRef.doc(user.uid);
      const unsubscribe = getUser.onSnapshot(
        (doc) => {
          let userDBExists = doc.exists;
          if (userDBExists) {
            let userDBDocData = doc.data();
            setState({
              authed: true,
              loading: false,
              user: {
                firstName: userDBDocData.first,
                lastName: userDBDocData.last,
                email: userDBDocData.email,
                admin: userDBDocData.admin || false,
                uid: userDBDocData.uid,
                avatar: userDBDocData.avatar || "",
              },
            });
          } else {
            setState(intialState);
          }
        },
        (err) => {
          console.log(err)
          setError(err);
        }
      );
    } else {
      setState(intialState);
    }
  };

  useEffect(() => {
    // listen for auth state changes
    const unsubscribe = firebaseAuth().onAuthStateChanged(onChange);
    // unsubscribe to the listener when unmounting
    return () => unsubscribe();
  }, []);

  return state;
};

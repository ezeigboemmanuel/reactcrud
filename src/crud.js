import "./App.css";
import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import {
  doc,
  addDoc,
  collection,
  updateDoc,
  deleteDoc,
  getDocs,
} from "firebase/firestore";

const Crud = () => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [phone, setPhone] = useState();
  const [fetchData, setFetchData] = useState([]);
  const [id, setId] = useState();

  // Creating database ref
  const dbRef = collection(db, "CRUD");

  // Storing data to database
  const add = async () => {
    const addData = await addDoc(dbRef, {
      Name: name,
      Email: email,
      Phone: phone,
    });
    if (addData) {
      alert("Data added successfully");
      window.location.reload();
    } else {
      alert("An error occurred");
    }
  };

  // Fetching the data from database
  const fetch = async () => {
    const snapshot = await getDocs(dbRef);
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setFetchData(data);
  };
  useEffect(() => {
    fetch();
  });

  // Pass update data to form
  const passData = async (id) => {
    const matchId = fetchData.find((data) => {
      return data.id === id;
    });

    setName(matchId.Name);
    setEmail(matchId.Email);
    setPhone(matchId.Phone);
    setId(matchId.id);
  };

  // Update the data
  const update = async () => {
    try {
      const updateRef = doc(dbRef, id);
      await updateDoc(updateRef, {
        Name: name,
        Email: email,
        Phone: phone,
      });
      alert("Data updated successfully");
      window.location.reload();
    } catch (error) {
      alert("An error occurred");
    }
  };

  // Delete data from database
  const del = async (id) => {
    const delRef = doc(dbRef, id);
    try {
        await deleteDoc(delRef)
        alert("Deleted successfully")
        window.location.reload()
    } catch (error) {
        alert(error)
    }
  }
  return (
    <div>
      <div className="form_container">
        <h2>Add / Update Form</h2>
        <div className="box">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="box">
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="box">
          <input
            type="text"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <button onClick={add}>Add</button>
        <button onClick={update}>Update</button>
      </div>

      {/* display data */}

      <div className="database">
        <h2>CRUD Database</h2>
        <div className="container">
          {fetchData.map((data) => {
            return (
              <>
                <div className="box" key={data.id}>
                  <h3>Name: {data.Name}</h3>
                  <h3>Email: {data.Email}</h3>
                  <h3>Phone Number: {data.Phone}</h3>
                  <button onClick={() => passData(data.id)}>Update</button>
                  <button onClick={() => del(data.id)}>Delete</button>
                </div>
              </>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Crud;

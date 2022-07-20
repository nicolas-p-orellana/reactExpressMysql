import "./App.css";
import { useState, useEffect } from "react";
import Axios from "axios";

function App() {
  // The data structure for the members.
  const [data, setData] = useState({
    first_name: "",
    last_name: "",
    age: 0,
    membership: "Bronce",
    address: "",
    car: "",
  });

  //The data of the member to be updated.
  const [memberToUpdate, setMemberToUpdate] = useState({
    ...data,
    id: 0,
  });

  //The list of all the members.
  const [memberList, setMemberList] = useState([]);

  //This useEffect call the getMember function to display all the members as soon as the user loads the page.
  useEffect(() => {
    getMembers();
  }, []);

  // The function to get all the members from the database.
  const getMembers = () => {
    Axios.get("http://localhost:3001/members").then((response) => {
      setMemberList(response.data);
    });
  };

  //This structure for the add form and the update modal.
  const inputList = [
    { label: "First Name", name: "first_name" },
    { label: "Last Name", name: "last_name" },
    { label: "Age", name: "age" },
    {
      label: "Membership",
      name: "membership",
      options: ["Bronce", "Silver", "Gold", "Platinum"],
    },
    { label: "Address", name: "address" },
    { label: "Car", name: "car" },
  ];

  // The update modal.
  var updateModal = document.getElementById("updateModal");

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target === updateModal) {
      updateModal.style.display = "none";
    }
  };

  // The function to add the member to the database.
  const addMember = () => {
    if (
      data.first_name.length !== 0 &&
      data.last_name.length !== 0 &&
      data.age.length !== 0 &&
      data.address.length !== 0 &&
      data.car.length !== 0
    ) {
      Axios.post("http://localhost:3001/create", data).then(() => {
        getMembers();
      });
      alert("you have successfully added a member to our Club!");
    } else {
      alert("You have to fill all the empty fields.");
    }
  };

  // The function to update the member to the database.
  const updateMember = () => {
    if (
      memberToUpdate.first_name.length !== 0 &&
      memberToUpdate.last_name.length !== 0 &&
      memberToUpdate.age.length !== 0 &&
      memberToUpdate.address.length !== 0 &&
      memberToUpdate.car.length !== 0
    ) {
      Axios.put("http://localhost:3001/update", memberToUpdate).then(() => {
        getMembers();
      });
      alert("you have successfully updated this member.");
      updateModal.style.display = "none";
    } else {
      alert("You have to fill all the empty fields.");
    }
  };

  // The function to delete the member to the database.
  const deleteMember = (id) => {
    Axios.delete(`http://localhost:3001/delete/${id}`).then(() => {
      getMembers();
    });
  };

  return (
    <div className="App">
      <div className="information">
        {inputList.map((item, idx) => {
          return item.label !== "Membership" ? (
            <div className="inputdiv" key={idx}>
              <label>{item.label}:</label>
              <input
                type={item.name === "age" ? "number" : "text"}
                onChange={(e) => {
                  setData({ ...data, [item.name]: e.target.value });
                }}
              />
            </div>
          ) : (
            <div className="inputdiv" key={idx}>
              <label>{item.label}:</label>
              <select
                onChange={(e) => {
                  setData({ ...data, [item.name]: e.target.value });
                }}
              >
                {item.options.map((option, subidx) => {
                  return (
                    <option key={subidx} value={option}>
                      {option}
                    </option>
                  );
                })}
              </select>
            </div>
          );
        })}
        <button className="addBtn" onClick={addMember}>
          Add Member
        </button>
      </div>
      <div id="table-wrapper">
        <div id="table-scroll">
          <table>
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Age</th>
                <th>Membership</th>
                <th>Address</th>
                <th>Car</th>
                <th className="btnHeadTh">Edit</th>
              </tr>
            </thead>
            <tbody>
              {memberList.map((val, key) => {
                return (
                  <tr key={key}>
                    <th>{val.first_name}</th>
                    <th>{val.last_name}</th>
                    <th>{val.age}</th>
                    <th>{val.membership}</th>
                    <th>{val.address}</th>
                    <th>{val.car}</th>
                    <th className="btnTh">
                      <button
                        className="updateBtn"
                        onClick={() => {
                          updateModal.style.display = "block";
                          setMemberToUpdate({
                            id: val.id,
                            first_name: val.first_name,
                            last_name: val.last_name,
                            age: val.age,
                            membership: val.membership,
                            address: val.address,
                            car: val.car,
                          });
                        }}
                      >
                        Update
                      </button>
                      <button
                        className="deleteBtn"
                        onClick={() => {
                          deleteMember(val.id);
                        }}
                      >
                        Delete
                      </button>
                    </th>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div id="updateModal" className="modal">
        <div className="modal-content">
          <span
            className="close"
            onClick={() => {
              updateModal.style.display = "none";
            }}
          >
            &times;
          </span>
          <div className="updateModal">
            {inputList.map((item, idx) => {
              return item.label !== "Membership" ? (
                <div className="inputdiv" key={idx}>
                  <label>{item.label}:</label>
                  <input
                    type={item.name === "age" ? "number" : "text"}
                    value={memberToUpdate[item.name]}
                    onChange={(e) => {
                      setMemberToUpdate({
                        ...memberToUpdate,
                        [item.name]: e.target.value,
                      });
                    }}
                  />
                </div>
              ) : (
                <div className="inputdiv" key={idx}>
                  <label>{item.label}:</label>
                  <select
                    value={memberToUpdate[item.name]}
                    onChange={(e) => {
                      setMemberToUpdate({
                        ...memberToUpdate,
                        [item.name]: e.target.value,
                      });
                    }}
                  >
                    {item.options.map((option, subidx) => {
                      return (
                        <option key={subidx} value={option}>
                          {option}
                        </option>
                      );
                    })}
                  </select>
                </div>
              );
            })}
            <div className="modalUpdateBtn">
              <button className="updateBtn" onClick={updateMember}>
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

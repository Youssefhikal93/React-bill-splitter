import { use, useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Ahmed.H",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Nader",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function App() {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handelSelection(friend) {
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  }

  function handleShowAddFriend() {
    console.log("show clicked");
    setShowAddFriend((show) => !show);
  }

  function handelAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    setShowAddFriend(false);
  }

  function handelSplitBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectedFriend(null);
  }

  function handleFriendDeletion(friendtoBeDeleted) {
    window.confirm(
      `Are you sure you want to delete ${friendtoBeDeleted.name}?`
    ) &&
      setFriends((friends) =>
        friends.filter((friend) => friend.id !== friendtoBeDeleted.id)
      );
  }

  return (
    <>
      <div className="app-container ">
        <header className="app-header">
          <h1>💰 Bill Splitter</h1>
          <p>Split expenses with friends made easy</p>
        </header>
        <div className="app">
          <div className="sidebar">
            <FriendsList
              friends={friends}
              onSelect={handelSelection}
              selectedFriend={selectedFriend}
              onDelete={handleFriendDeletion}
            />
            <AddFriendform
              showAddFriend={showAddFriend}
              onAddFriends={handelAddFriend}
            />
            <Button onClick={handleShowAddFriend}>
              {showAddFriend ? "Close" : "Add friend"}
            </Button>
          </div>
          {selectedFriend && (
            <SplitBillForm
              onSplit={handelSplitBill}
              selectedFriend={selectedFriend}
            />
          )}
        </div>
        <footer className="app-footer">
          <div className="footer-content">
            <p>© {new Date().getFullYear()} Bill Splitter App</p>
            <div className="footer-links">
              <a href="#">Terms</a>
              <a href="#">Privacy</a>
              <a href="#">Contact</a>
            </div>
            <p>Made with love By Youssef Hikal 😎</p>
          </div>
        </footer>
      </div>
    </>
  );
}

function FriendsList({ friends, onSelect, selectedFriend, onDelete }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onSelect={onSelect}
          selectedFriend={selectedFriend}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelect, selectedFriend, onDelete }) {
  const isSelected = selectedFriend?.id === friend.id;

  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name}></img>
      <h3>{friend.name}</h3>
      <p
        className={
          friend.balance < 0 ? "red" : friend.balance > 0 ? "green" : ""
        }
      >
        {friend.balance < 0
          ? `You owe ${friend.name} ${Math.abs(friend.balance)}💲`
          : `${friend.name} owe you ${Math.abs(friend.balance)}💲`}
      </p>
      <Button onClick={() => onSelect(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
      <Button onClick={() => onDelete(friend)}>❌ Delete</Button>
    </li>
  );
}

function AddFriendform({ showAddFriend, onAddFriends }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handelSubmit(e) {
    e.preventDefault();
    const id = crypto.randomUUID();
    if (!name || !image) return;

    const newFriend = {
      name,
      image: `https://i.pravatar.cc/48?=${id}`,
      balance: 0,
      id,
    };

    setImage("https://i.pravatar.cc/48");
    setName("");
    onAddFriends(newFriend);
  }
  return (
    showAddFriend && (
      <form className="form-add-friend" onSubmit={handelSubmit}>
        <label>🧑‍🤝‍🧑 Friend name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        ></input>

        <label>🖼️ Image URL </label>
        <input
          type="text"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        ></input>

        <Button>Add</Button>
      </form>
    )
  );
}

function SplitBillForm({ selectedFriend, onSplit }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState(0);
  const [whoIsPaying, setWhoIsPaying] = useState("user");

  function handelSubmit(e) {
    e.preventDefault();
    if (!bill || !paidByUser) return;

    onSplit(whoIsPaying === "user" ? bill - paidByUser : -paidByUser);
  }

  return (
    <form className="form-split-bill" onSubmit={handelSubmit}>
      <h2>Split a bill with {selectedFriend.name} </h2>
      <label> 💰 bill value </label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(+e.target.value)}
      ></input>

      <label> 🕴️ Your expense </label>
      <input
        type="text"
        max={bill}
        value={paidByUser}
        onChange={(e) =>
          setPaidByUser(+e.target.value > bill ? paidByUser : +e.target.value)
        }
      ></input>

      <label>🧑‍🤝‍🧑{selectedFriend.name}'s expense </label>
      <input type="text" value={bill - paidByUser} disabled></input>

      <label>💵Who is paying the bill ?</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>

      <Button>Split</Button>
    </form>
  );
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

export default App;

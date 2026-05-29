const UserList = ({ users }) => {
  return (
    <div>
      {users.map((user) => (
        <div key={user._id} className="bg-gray-100 p-4 mb-4 rounded shadow">
          <h2 className="font-bold">{user.name}</h2>
          <p>{user.email}</p>
          <p>{user.role}</p>
        </div>
      ))}
    </div>
  );
};

export default UserList;

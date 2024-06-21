import React from 'react';

const UserList = ({ inRoomUsers }) => {
    return (
        <div className="user-list">
            {inRoomUsers.map((user) => (
                <div className="user-item" key={user.id}>
                    <img src={user.avatar} alt="" className="user-avatar" />
                    <div className="user-name">{user.firstName}</div>
                </div>
            ))}
        </div>
    );
};

export default UserList;
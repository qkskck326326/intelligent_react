import React, { useEffect, useState } from 'react';
import 'font-awesome/css/font-awesome.min.css';

export default function ChatList(props){

    const users = props['users'][0]

    console.log(users)

    return(<>
        {
            users.map(user => 
            
            <div key={user.id}>
                <div>
                    {user.id}
                </div>
                <div>
                    {user.name}
                </div>
            </div>
            )
        }
        </>
    );

}
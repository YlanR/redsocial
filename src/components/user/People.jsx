import React, { useEffect, useState } from 'react';
import { Global } from '../../helpers/Global';
import { UserList } from './UserList';

export const People = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(true);
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    getUsers(1);
  }, [])

  const getUsers = async(nextPage = 1) => {
    // efecto de carga
    setLoading(true);

    // Peticion para sacar usuarios
    const request = await fetch(Global.url + "user/list/"+nextPage, {
      method: "GET",
      headers: {
        "Content-Type" : "application/json",
        "Authorization" : localStorage.getItem("token")
      }
    });

    const data = await request.json();


    // Crear una estado para poder listarlos
    if(data.users && data.status == "success"){

      let newUser = data.users;

      if(users.length >= 1){
        newUser = [...users, ...data.users];
      }

      setUsers(newUser);
      setLoading(false);
      setFollowing(data.following)

      // Paginacion
      if(users.length >= (data.total - data.users.length)){
        setMore(false);
        
      }
    }
  }


  return (
    <>
        <header className="content__header">
            <h1 className="content__title">Gente</h1>
        </header>

        <UserList users={users} 
                  getUsers={getUsers}  
                  following={following}
                  setFollowing={setFollowing}
                  page={page}
                  setPage={setPage}
                  more={more}
                  loading={loading}
        />
          <br />
    </>
  )
}

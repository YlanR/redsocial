import React, { useEffect, useState } from 'react';
import { Global } from '../../helpers/Global';
import { UserList } from '../user/UserList';
import { useParams } from 'react-router-dom';
import { GetProfile } from '../../helpers/GetProfile';

export const Followers = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(true);
  const [following, setFollowing] = useState([]);
  const [userProfile, setUserProfile] = useState({});

  const params = useParams();

  const token = localStorage.getItem("token");

  useEffect(() => {
    getUsers(1);
    GetProfile(params.userId, setUserProfile);
  }, [])

  const getUsers = async(nextPage = 1) => {
    // efecto de carga
    setLoading(true);

    // Sacar userId de la url
    const userId = params.userId;

    // Peticion para sacar usuarios
    const request = await fetch(Global.url + "follow/followers/"+userId+"/"+nextPage, {
      method: "GET",
      headers: {
        "Content-Type" : "application/json",
        "Authorization" : token
      }
    });

    const data = await request.json();

    let cleanUsers = [];
    // Recorrer y limpiar follows para quedarme con followed
    data.follows.forEach(follow => {
        cleanUsers = [...cleanUsers, follow.user]
    })
    data.users = cleanUsers;

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
            <h1 className="content__title">Seguidores de {userProfile.name} {userProfile.surname}</h1>
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

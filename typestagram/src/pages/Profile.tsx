import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Profile() {
    let { id } = useParams();
    let [username, setUsername] = useState("");


    useEffect(() => {
        if (!id) return;

        const fetchUser = async () => {
        try {
            const res = await axios.get(`http://localhost:8080/user/${id}`);
            setUsername(res.data.username);
        } catch (err) {
            console.error(err);
        }
        };

        fetchUser();
    }, [id]);

    return(
        <>
            <h1>Profile</h1>
            <p>{ username }</p>
        </>
    )
}

export default Profile;
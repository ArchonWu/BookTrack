import React, { useEffect, useState } from "react";
import axios from "axios";

const endpoint = "https://api.spotify.com/v1/users/{user_id}/playlists";

const SpotifyPlaylist = () => {
    const [token, setToken] = useState("");
    const [data, setData] = useState({});

    useEffect(() => {
        if (localStorage.getItem('accessToken')){
            setToken(localStorage.getItem("accessToken"));
        }
    }, []);

    const handlePlaylist = () => {
        axios.get(endpoint, {
            headers: {
                Authorization: "Bearer " + token,
            },
        }).then((response) => {
            setData(response.data);
        })
    };

    return <button>Playlist Button</button>;
};

export default SpotifyPlaylist;

import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Pen } from "lucide-react";
import { Button } from "../components/ui/button";
import { BarProfile } from "../components/organisms/BarProfile";

function Profile() {
  const [userData, setUserData] = useState(null);
  const [newUserData, setNewUserData] = useState({
    username: "",
    email: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("session");
    const parsedTokenObject = JSON.parse(token);
    const tokenValue = parsedTokenObject.token;

    axios
      .get("https://localhost:8000/profile", {
        headers: { Authorization: "Bearer " + tokenValue },
      })
      .then((response) => {
        setUserData(response.data);
        setNewUserData(response.data); // Assigner les données utilisateur existantes à newUserData lorsqu'elles sont disponibles
      })
      .catch((error) => {
        console.error("Error fetching profile:", error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("session");
    const parsedTokenObject = JSON.parse(token);
    const tokenValue = parsedTokenObject.token;

    try {
      await axios.put("https://localhost:8000/updateProfile", newUserData, {
        headers: { Authorization: "Bearer " + tokenValue },
      });
      alert("Profile updated successfully!");
      setUserData(newUserData);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred while updating profile. Please try again.");
    }
  };

  const handleDisconnect = async (e) => {
    e.preventDefault();

    localStorage.removeItem("session");
    // ici pour rediriger vers page acc
    window.location.href = "/";
    // Rediriger l'utilisateur vers une page de confirmation ou de déconnexion
  };

  return (
    <div className="cover-container">
      <BarProfile userData={userData} />

      <div className="flex justify-center">
        <div className="border p-12 rounded-3xl m-30 mt-12 mb-12  drop-shadow">
          <div className="text-center  cover-container">
            <p className="text-center text-white text-6xl">Mon Profil</p>
          </div>

          {userData && (
            <form
              className="profile-form text-center bg-[#F2F7F3] rounded-lg"
              onSubmit={handleSubmit}
            >
              <div className=" my-20 text-xl">
                <label>Nom d&apos;utilisateur:</label>
                <input
                  type="text"
                  name="username"
                  value={newUserData.username}
                  onChange={handleChange}
                />
              </div>
              <div className="text-center my-4 text-xl">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={newUserData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col place-content-center">
                <div className="justify-center m-4">
                  <Button
                    type="submit"
                    className="flex bg-[#064e3b] mx-40 text-white py-2 px-20 rounded-full size-10"
                  >
                    <Pen className="" /> Modifier
                  </Button>
                </div>
                <div className="m-4">
                  <Button
                    className="flex bg-[#064e3b] mx-40 text-white py-2 px-20 rounded-full size-10"
                    onClick={handleDisconnect}
                  >
                    {" "}
                    Se déconnecter{" "}
                  </Button>
                </div>
                <div className="justify-center m-4">
                  <Button className="flex bg-[#064e3b] mx-40 text-white py-2 px-20 rounded-full size-10">
                    <Link to="/deleteProfile">Supprimer mon compte</Link>
                  </Button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;

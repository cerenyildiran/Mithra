import React, {useState, useEffect} from "react"
import axios from "axios";
import Cookies from 'js-cookie'

const UpdateProfile = ({user}) => {
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [userDetails, setUserDetails] = useState({
        email: "",
        first_name: "",
        last_name: "",
        username: "",
      });
      useEffect(() => {
        setUserDetails({
          email: user?.email || "",
          first_name: user?.first_name || "",
          last_name: user?.last_name || "",
          username: user?.username || "",
        });
      }, [user]);

      const handleSubmit = async (event) => {
        event.preventDefault();
        const token = Cookies.get("accessToken");
        try {
          const response = await axios.post(
            "http://localhost:8000/api/edit-profile/",
            {
              email: userDetails.email,
              first_name: userDetails.first_name,
              last_name: userDetails.last_name,
              token,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          setSuccess(response.data.success)
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } catch (error) {
          setError(error.response.data.error)
        }
      };
      const handleChange = (e) => {
        setUserDetails({ ...userDetails, [e.target.id]: e.target.value });
      };
    

    return (
        <div>
        {success && <p className="success-msg">User succesfull updated</p>}
              {error && <p className="error-msg">{error}</p>}
              {user && (
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      defaultValue={userDetails.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="first_name" className="form-label">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="first_name"
                      defaultValue={userDetails.first_name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="last_name" className="form-label">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="last_name"
                      defaultValue={userDetails.last_name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="username" className="form-label">
                      Username
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="username"
                      defaultValue={user.username}
                      readOnly
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Update Profile
                  </button>
                </form>
              )}
              </div>
    )
}

export default UpdateProfile
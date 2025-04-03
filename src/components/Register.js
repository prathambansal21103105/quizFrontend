import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Register.module.css"; // Import CSS module
import imageSrc from '../register.gif';

const Register = () => {
    const initialFormData={
        name: "",
        id: "",
        email: "",
        password: "",
        branch: "",
    };
    const [isAuthor, setIsAuthor] = useState(false);
    const [formData, setFormData] = useState(initialFormData);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        checkNonEmpty(isAuthor,formData,setError);
        try {
            if (isAuthor) {
                // Author registration
                const authorData = {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                };
                const res = await fetch("http://localhost:8080/auth/register/author", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(authorData),
                });
                if (!res.ok) {
                    setError("Failed to register as author.");
                    setFormData(initialFormData);
                    return;
                }
                const resBody = await res.text();
                console.log(resBody);
                // alert("Author registered successfully!");
            } else {
                // Player registration
                const playerData = {
                    name: formData.name,
                    id: Number(formData.id),
                    email: formData.email,
                    password: formData.password,
                    branch: formData.branch,
                };
                const res = await fetch("http://localhost:8080/auth/register/player", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(playerData),
                });
                if (!res.ok) {
                    setError("Failed to register as student.");
                    setFormData(initialFormData);
                    return;
                }
                const resBody = await res.text();
                console.log(resBody);
            }
            // navigate("/login");
        } catch (error) {
            setError("Error registering. Email or ID might be taken.");
            setFormData(initialFormData);
        }
    };

    const checkNonEmpty = (isAuthor, formData,setError) => {
        if (isAuthor) {
            const { name, email, password } = formData;
            if (!name.trim() || !email.trim() || !password.trim()) {
                setError("All author fields are required!");
                return false;
            }
        } else {
            const { name, id, email, password, branch } = formData;
            if (!name.trim() || !id || !email.trim() || !password.trim() || !branch.trim()) {
                setError("All student fields are required!");
                return false;
            }
        }
        return true;
    }

    return (
        <div className={styles.container}>
            <div className={styles.formWrapper}>
                <h2 className={styles.title}>
                    {isAuthor ? "Register as Author" : "Student Register"}
                </h2>
                {error && <p className={styles.error}>{error}</p>}
                <form onSubmit={handleSubmit} className={styles.form}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        onChange={handleChange}
                        value={formData.name}
                        required
                        className={styles.input}
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        onChange={handleChange}
                        value={formData.email}
                        required
                        className={styles.input}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={handleChange}
                        value={formData.password}
                        required
                        className={styles.input}
                    />

                    {/* Show ID and Branch fields only for Players */}
                    {!isAuthor && (
                        <>
                            <input
                                type="number"
                                name="id"
                                placeholder="ID"
                                onChange={handleChange}
                                value={formData.id}
                                required
                                className={styles.input}
                            />
                            <input
                                type="text"
                                name="branch"
                                placeholder="Branch"
                                onChange={handleChange}
                                value={formData.branch}
                                required
                                className={styles.input}
                            />
                        </>
                    )}

                    <button
                        type="submit"
                        // disabled={checkNonEmpty(isAuthor,formData)}
                        className={styles.button}
                    >
                        Register
                    </button>
                </form>
            </div>
            <div className={styles.toggleContainer}>
                <img src={imageSrc} className={styles.gif} alt="register"/>
                <div className={styles.flex}>
                <span className={styles.toggleText}>Register as:</span>
                <button
                    className={`${styles.toggleButton} ${isAuthor ? styles.active : ""}`}
                    onClick={() => setIsAuthor(true)}
                >
                    Author
                </button>
                <button
                    className={`${styles.toggleButton} ${!isAuthor ? styles.active : ""}`}
                    onClick={() => setIsAuthor(false)}
                >
                    Player
                </button>
                </div>
            </div>
        </div>
    );
};

export default Register;

import { useEffect, useState } from "react"
import axios from "axios"
import Appbar from "../components/Appbar"
import Balance from "../components/Balance"
import Users from "../components/Users"

const Dashboard = () => {
    const [balance, setBalance] = useState(0);

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/v1/account/balance", {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token")
                    }
                });
                setBalance(parseInt(response.data.balance));
            } catch (error) {
                console.error("Error fetching balance:", error);
            }
        };

        fetchBalance();
    }, []);

    return <div>
        <Appbar />
        <div className="m-8">
            <Balance value={balance} />
            <Users />
        </div>
    </div>
}

export default Dashboard
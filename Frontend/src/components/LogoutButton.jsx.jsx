import { Button  } from "@chakra-ui/button";
import { useSetRecoilState } from "recoil";
import { Link as RouterLink } from "react-router-dom";
import { MdOutlineExplore } from "react-icons/md";
import userAtom from "../../Atoms/CurrentUser";	
import useShowToast from "../../Hooks/useShowToast";
import { FiLogOut } from "react-icons/fi";
import { useEffect } from "react";
import BASE_URL from "../config";
import axios from 'axios';
const LogoutButton = () => {
	const setUser = useSetRecoilState(userAtom);
	const showToast = useShowToast();

	

	const handleLogout = async () => {
		try {
			const res = await axios.post(`${BASE_URL}/logout`, {}, {
				withCredentials: true,
				headers: {
					"Content-Type": "application/json",
				},
			});
	
			if (res.data.error) {
				showToast("Error", res.data.error, "error");
				return;
			}
	
			localStorage.removeItem("CurrentUser");
			setUser(null);
		} catch (error) {
			showToast("Error", error.message, "error");
		}
	};
	return (
		<>
		<Button onClick={handleLogout} position={"fixed"}
        bottom={15}
        right={5}
		size={{ base: "sm", sm: "md" }}
		>
<FiLogOut size={20} />
		</Button>
		
		<Button    position={"fixed"}  bottom={40}
        right={5} size={{ base: "sm", sm: "md" }}>
            <RouterLink to="/Explore">
			<MdOutlineExplore size={20} />
            </RouterLink>
          </Button>
		</>
	);
};



export default LogoutButton;
    
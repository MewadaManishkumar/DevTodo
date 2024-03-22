import { message } from "antd";
import axios from "axios";
class AuthService {
    logout() {
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        // eslint-disable-next-line no-restricted-globals
        location.reload();
    }
    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'))
    }

    async refreshToken() {
        const refreshToken = localStorage.getItem('refreshToken');

        try {
            const response = await axios.post("http://localhost:8000/token", {
                refreshToken: refreshToken,
            });

            return response.data;
        } catch (error) {
            message.error(`Refresh token not found: ${error.message}`);
            setTimeout(() => {
                this.logout();
            }, 3000);
        }
    }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new AuthService()

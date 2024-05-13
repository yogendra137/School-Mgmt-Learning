import { userService } from "../services";

const addUser = async (req, res) => {
    try {
        const data = await userService.addUser();
        res.status(200).json()
    } catch (error) {
        console.log("Error--", error);
        res.status(401).json({ error: error.message })
    }
}
export default { addUser }
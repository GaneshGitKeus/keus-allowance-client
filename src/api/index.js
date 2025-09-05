import { Preferences } from "@capacitor/preferences";
import { baseurl } from "../constants";
export const userLogout = async () => {
    await fetch(`${baseurl}/api/logout`, {
        method: "POST",
        credentials: "include", // To ensure cookies are sent
    });
}

export const userData = async(fetchUser = false) => {
    const userData = await Preferences.get({key: "user"});
    if(localStorage.getItem("user") && !fetchUser) {
        
        return JSON.parse(localStorage.getItem("user"));
    }
    else if(userData.value && !fetchUser){
        return JSON.parse(userData.value);
    }
    else{
        const response = await fetch(`${baseurl}/api/user`, {
            method: "GET",
            credentials: "include", 
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
    
        return data;
    }
}

export const updateUserData = async(userData) => {
    const response = await fetch(`${baseurl}/api/user/update`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include", // Ensures cookies are sent
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        throw new Error("Failed to update user data");
    }

    const data = await response.json();
    return data;
}

export const changePassword = async ({ oldPassword, newPassword }) => {
    const response = await fetch(`${baseurl}/api/user/change-password`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ oldPassword, newPassword }),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || "Password update failed");
    }

    return data;
};

/* GET: Full User Data */


export async function getFullUserData(token: string) {
    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    }
    const res = await fetch(`${process.env.NEXT_PUBLIC_AUTH_API_URL}/userrole/me`, {
        method: "GET",
        headers: headers
    });

    if (!res.ok) {
        throw new Error("Failed to fetch user");
    }

    const data = await res.json();
    return data;
}
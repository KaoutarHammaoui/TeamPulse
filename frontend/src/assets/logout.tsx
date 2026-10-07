import { useState } from "react"

export function Logout() {
    const [error,setError]=useState('')
    const LogoutFunc = async () => {
        const res = await fetch(`http://localhost:8080/logout`, {
            method: "POST",
            
        })
        if (!res.ok) {
            setError('cannotlog out')
            return
        }
    }
    return (
        <div>
            logout page
        </div>
    )
}
import { useEffect } from "react";
import { useParams } from "react-router-dom"

export function UpdateRole() {
    const { id } = useParams();
    useEffect(() => {
        const UpdateRole = async () => {
            const res = await fetch(``, {
                method:"PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization":`Bearer ${localStorage.getItem('token')}`
                }
            })
        }
    },[id])
    return (
        <div>
            update a role
        </div>
    )
}
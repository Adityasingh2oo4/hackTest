import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
    const navigate = useNavigate();
    useEffect(() => {
        navigate("/", { replace: true });
    }, []);
    return null;
}

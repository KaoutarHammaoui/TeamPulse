import { useNavigate, useParams } from "react-router-dom";

export function Editroject() {
    const { id } = useParams();
    const navigate = useNavigate();
    return (
      <div>
        <button
          onClick={() => {
            navigate("/projects");
          }}
        >
          Cancel
        </button>

        <p>{id} </p>
      </div>
    );
}
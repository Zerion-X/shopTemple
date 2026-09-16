import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import NavBar from "../components/NavBar";

const ErrorPage = () => {
  const error = useRouteError();

  return (
    <>
      <NavBar />

      <div className="p-5">
        <h1 className="text-4xl font-bold">Oops</h1>

        <p className="my-5">
          {isRouteErrorResponse(error)
            ? "This page does not exist"
            : "An unexpected error occurred"}
        </p>
      </div>
    </>
  );
};

export default ErrorPage;

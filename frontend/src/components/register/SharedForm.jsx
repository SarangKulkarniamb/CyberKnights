import { useState } from "react";
import { Form } from "./Form";

const SharedForm = () => {
    const url = `${import.meta.env.VITE_API_URL}/register`;

    return (
      <div className="min-h-screen flex flex-col items-center bg-gray-50 py-10 px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-800 mb-4">
            Register
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Fill in the details to create your account.
          </p>
        </div>
  
        {/* Registration Form */}
        <Form url={url} />
      </div>
    );
};
  
export default SharedForm;

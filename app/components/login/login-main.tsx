import LoginForm from "./login-form";
import { Suspense } from "react";

export default function LoginMain() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
        <div>
            <div className="text-center text-white text-xl font-meduim p-5 bg-theme_topic rounded-t-md"> Tenant Portal </div>
            <LoginForm />
        </div>
        </Suspense>
    )
}
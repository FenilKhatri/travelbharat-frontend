import { FiMail, FiPhone, FiUser, FiLock } from "react-icons/fi";

export const basicFields = [
    {
        name: "name",
        id: "name",
        label: "name",
        labelName: "Name",
        icon: FiUser,
        placeholder: "Enter your name...",
        type: "text",
    },
    {
        name: "email",
        id: "email",
        label: "email",
        labelName: "Email",
        icon: FiMail,
        placeholder: "Enter your email...",
        type: "email",
    },
    {
        name: "phone",
        id: "phone",
        label: "phone",
        labelName: "Phone",
        icon: FiPhone,
        placeholder: "Enter your phone...",
        type: "tel",
    },
];

export const passwordFields = [
    {
        name: "password",
        id: "password",
        label: "password",
        labelName: "Password",
        icon: FiLock,
        placeholder: "Enter your password...",
        type: "password",
        isPassword: true,
    },
    {
        name: "confirmPassword",
        id: "confirmPassword",
        label: "confirmPassword",
        labelName: "Confirm Password",
        icon: FiLock,
        placeholder: "Enter your confirm password...",
        type: "password",
        isPassword: true,
    },
];

export const loginFields = [
    {
        name: "email",
        id: "email",
        label: "email",
        labelName: "Email",
        icon: FiMail,
        placeholder: "Enter your email...",
        type: "email",
    },
    {
        ...passwordFields[0],
    },
];

// Register
export const registerFields = [...basicFields, ...passwordFields];


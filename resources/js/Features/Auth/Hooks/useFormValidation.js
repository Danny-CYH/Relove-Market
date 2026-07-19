import { useState, useEffect } from "react";
import { validatePass } from "../Utils/passwordValidation";

export const useFormValidation = (name, password) => {
    const [nameValid, setNameValid] = useState({ status: true, msg: "" });
    const [passValid, setPassValid] = useState({
        status: false,
        checks: {
            length: false,
            uppercase: false,
            lowercase: false,
            number: false,
            special: false,
        },
        strength: 0,
    });

    useEffect(() => {
        if (!name) {
            setNameValid({ status: true, msg: "" });
            return;
        }
        const status = /^[a-zA-Z\s]*$/.test(name);
        setNameValid({
            status,
            msg: status ? "" : "Name should only contain letters and spaces",
        });
    }, [name]);

    useEffect(() => {
        if (!password) {
            setPassValid({
                status: false,
                checks: {
                    length: false,
                    uppercase: false,
                    lowercase: false,
                    number: false,
                    special: false,
                },
                strength: 0,
            });
            return;
        }

        const result = validatePass(password);
        const checks = result.validations;
        const status = result.isValid;
        const strength = result.strength;

        setPassValid({ status, checks, strength });
    }, [password]);

    return { nameValid, passValid };
};

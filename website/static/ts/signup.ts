document.addEventListener("alpine:init", () => {
    Alpine.data("form", () => ({
        username: "",
        email: "",
        password1: "",
        password2: "",

        passwdmatch(this: FormState): [string, string, boolean] {
            if (this.password1.length === 0 || this.password2.length === 0) {
                return ["null", "hidden", false];
            } else if (this.password1 !== this.password2) {
                return ["passwdmismatch", "red text", true];
            } else {
                return ["null", "hidden", true];
            }
        },

        emailempty(this: FormState): string {
            if (this.passwdmatch()[2] && this.email.length < 1) {
                return "orange text";
            } else {
                return "hidden";
            }
        },
    }));
});

interface FormState {
    username: string;
    email: string;
    password1: string;
    password2: string;
    passwdmatch(): [string, string, boolean];
    emailempty(): string;
}

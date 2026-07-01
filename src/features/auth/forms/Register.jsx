import Button from "../../../components/ui/Button";
import FormFields from "../../../components/ui/FormFields";
import GoogleAuthButton from "../../../components/ui/GoogleAuthButton";
import { ROLES } from "../../../utils/constants";
import { register } from "../../auth/api/auth.api";
import { registerFields } from "./data/inputFields";
import { stagger, fadeUp } from "../../../animations/motionVariants";
import { useAuthSubmit } from "../../../utils/auth/useAuthSubmit";

const Register = () => {
  const { form, loading, handleChange, handleSubmit } = useAuthSubmit({
    apiCall: register,
    initialForm: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: ""},
    successMessage: "Registered successfully!",
    fetchUserOnSuccess: true,
    navigateOnSuccess: true,
    validate: (currentForm) => {
      if (currentForm.password !== currentForm.confirmPassword) {
        return "Passwords do not match";
      }
      return null;
    }});

  return (
    <motion.form
      onSubmit={handleSubmit}
      variants={stagger}
      initial="hidden"
      animate="show"
      className="space-y-5"
    >
      <FormFields
        fields={registerFields}
        form={form}
        onChange={handleChange}
      />

      <motion.div variants={fadeUp}>
        <Button
          type="submit"
          disabled={loading}
          className={`w-full ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
        >
          {loading ? "Signing up..." : "Sign Up →"}
        </Button>
      </motion.div>

      <motion.div variants={fadeUp} className="flex items-center gap-3">
        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
        <span className="text-sm text-slate-500">OR</span>
        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
      </motion.div>

      <motion.div variants={fadeUp}>
        <GoogleAuthButton role={ROLES.USER} />
      </motion.div>
    </motion.form>
  );
};

export default Register;

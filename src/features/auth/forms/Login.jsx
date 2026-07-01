import { Link } from "react-router-dom";
import Button from "../../../components/ui/Button";
import FormFields from "../../../components/ui/FormFields";
import GoogleAuthButton from "../../../components/ui/GoogleAuthButton";
import { ROLES } from "../../../utils/constants";
import { login } from "../../auth/api/auth.api";
import { loginFields } from "./data/inputFields";
import { stagger, fadeUp } from "../../../animations/motionVariants";
import { useAuthSubmit } from "../../../utils/auth/useAuthSubmit";

const Login = () => {
  const { form, loading, handleChange, handleSubmit } = useAuthSubmit({
    apiCall: login,
    initialForm: { email: "", password: "" },
    successMessage: "Login Successful",
    fetchUserOnSuccess: true,
    navigateOnSuccess: true});

  return (
    <motion.form
      onSubmit={handleSubmit}
      variants={stagger}
      initial="hidden"
      animate="show"
      className="space-y-5"
    >
      <FormFields
        fields={loginFields}
        form={form}
        onChange={handleChange}
      />
      
      <motion.div variants={fadeUp} className="flex justify-end -mt-3">
        <Link to="/forgot-password" className="text-sm font-medium text-[#E85D04] hover:text-[#DC2F02] transition-colors">
          Forgot Password?
        </Link>
      </motion.div>

      <motion.div variants={fadeUp}>
        <Button
          type="submit"
          disabled={loading}
          className={`w-full ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
        >
          {loading ? "Logging in..." : "Login →"}
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

export default Login;

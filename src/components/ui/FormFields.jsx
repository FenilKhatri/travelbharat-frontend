import { motion } from "framer-motion";
import Input from "./Input";
import { fadeUp } from "../../animations/motionVariants";

const FormFields = ({ fields, form, onChange }) => {
  return (
    <>
      {fields.map((field) => {
        const Icon = field.icon;

        return (
          <motion.div key={field.name} variants={fadeUp}>
            <Input
              label={field.label}
              labelName={field.labelName}
              icon={Icon}
              type={field.isPassword ? "password" : field.type}
              placeholder={field.placeholder}
              id={field.id}
              name={field.name}
              value={form[field.name] ?? ""}
              onChange={onChange}
            />
          </motion.div>
        );
      })}
    </>
  );
};

export default FormFields;
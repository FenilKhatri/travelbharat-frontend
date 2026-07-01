// Hooks
import { useContactForm } from "./hooks/useContactForm";

// Components
import ContactHero from "./components/ContactHero";
import ContactInfo from "./components/ContactInfo";
import ContactForm from "./components/ContactForm";

const ContactUs = () => {
  const { form, errors, mutation, handleSubmit, handleChange } = useContactForm();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A1628]">
      <ContactHero />
      <ContactInfo />
      <ContactForm
        form={form}
        errors={errors}
        mutation={mutation}
        handleSubmit={handleSubmit}
        handleChange={handleChange}
      />
    </div>
  );
};

export default ContactUs;

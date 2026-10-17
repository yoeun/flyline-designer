import { Toaster as Sonner } from "sonner";

// Theme comes from the app's own useTheme hook (passed as a prop), not next-themes.
// Sonner's own icons are used, so no icon library is needed.
const Toaster = ({ theme = "system", ...props }) => {
  return (
    <Sonner
      theme={theme}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--ink)",
          "--normal-text": "var(--panel)",
          "--normal-border": "var(--ink)",
          "--border-radius": "var(--radius)"
        }
      }
      toastOptions={{
        classNames: {
          toast: "text-center",
          title: "text-center",
          description: "text-center",
        },
      }}
      {...props}
    />
  );
}

export { Toaster }

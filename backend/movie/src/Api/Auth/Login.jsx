import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";

import collage from "../../assets/collage-7.jpg";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

const inputClass = `
  w-full bg-white/[0.03] backdrop-blur-md
  border border-white/[0.08]
  rounded-xl px-4 py-3
  text-sm text-white placeholder-white/20
  focus:outline-none focus:border-red-500
  focus:ring-2 focus:ring-red-500/10
  transition duration-150
`;

function Field({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-semibold uppercase tracking-widest text-white/35">
        {label}
      </label>

      {children}

      {error && (
        <p className="text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

export function Login() {
  const { login } = useAuth();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      await login(data);

      // Save logged-in user email
      localStorage.setItem(
        "userEmail",
        data.email
      );

      toast.success("Welcome back!");

      navigate("/home");
    } catch (err) {
      toast.error(
        err.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#080808] flex items-center justify-center px-4 py-12 overflow-hidden">

      <div
        className="absolute inset-0 bg-cover bg-center scale-105"
        style={{
          backgroundImage: `url(${collage})`,
          filter: "blur(8px)",
        }}
      />

      <div className="absolute inset-0 bg-black/70" />

      <div className="relative z-10 w-full max-w-sm">

        <div className="text-center mb-8">

          <span className="inline-block bg-red-950/60 border border-red-800/40 text-red-400 text-[10px] font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
            Continue Watching
          </span>

          <Link to="/">
            <span className="block font-['Bebas_Neue'] text-3xl tracking-widest text-red-500">
              Cinemasangama
            </span>
          </Link>

          <h1
            className="
              text-3xl
              font-extrabold
              mt-3
              mb-2
              text-white
              tracking-wide
              drop-shadow-[0_2px_10px_rgba(255,255,255,0.25)]
            "
          >
            Welcome back
          </h1>

          <p className="text-sm text-white/40">
            Sign in to continue watching
          </p>
        </div>

        <div
          className="
            bg-[#111]/80 backdrop-blur-xl
            border border-white/[0.07]
            hover:border-red-500/20
            rounded-2xl p-7
            shadow-2xl shadow-black/40
            transition duration-300
          "
        >
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
            noValidate
          >

            <Field
              label="Email"
              error={errors.email?.message}
            >
              <input
                {...register("email")}
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                className={inputClass}
              />
            </Field>

            <Field
              label="Password"
              error={errors.password?.message}
            >
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={inputClass + " pr-16"}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="
                    absolute right-3 top-1/2 -translate-y-1/2
                    text-[11px] text-white/30
                    hover:text-white/60
                    transition
                  "
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </Field>

            <button
              type="submit"
              disabled={loading}
              className="
                mt-1 w-full
                bg-red-600 hover:bg-red-700
                shadow-lg shadow-red-900/30
                disabled:opacity-50
                disabled:cursor-not-allowed
                text-white font-semibold text-sm
                py-3 rounded-xl
                transition duration-150
                active:scale-[.98]
              "
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

          </form>

          <p className="text-center text-sm text-white/30 mt-5">
            No account?{" "}
            <Link
              to="/register"
              className="text-red-400 hover:text-red-300 hover:underline transition"
            >
              Create one
            </Link>
          </p>

        </div>

      </div>

    </div>
  );
}
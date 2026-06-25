
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import toast from "react-hot-toast"

import { useAuth } from "../../context/AuthContext"

// Background image
import collage from "../../assets/collage-7.jpg"

const schema = z.object({
  first_name: z.string().min(1, "First name is required"),

  last_name: z.string().min(1, "Last name is required"),

  username: z.string().min(
    3,
    "Username must be at least 3 characters"
  ),

  email: z.string().email(
    "Enter a valid email address"
  ),

  password: z.string().min(
    8,
    "Password must be at least 8 characters"
  ),

  password2: z.string().min(
    1,
    "Please confirm your password"
  ),

}).refine((d) => d.password === d.password2, {
  message: "Passwords don't match",
  path: ["password2"],
})

const inputClass = `
  w-full bg-white/[0.03] backdrop-blur-md
  border border-white/[0.08]
  rounded-xl px-4 py-3
  text-sm text-white placeholder-white/20
  focus:outline-none focus:border-red-500
  focus:ring-2 focus:ring-red-500/10
  transition duration-150
`

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
  )
}

export function Register() {

  const {
    register: registerUser,
    login,
  } = useAuth()

  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data) => {

    setLoading(true)

    try {

     
      await registerUser(data)

      toast.success("Account created!")

      // Auto login
      await login({
        email: data.email,
        password: data.password,
      })

      navigate("/home")

    } catch (err) {

      const errData = err?.response?.data

      const msg =
        errData && typeof errData === "object"
          ? Object.values(errData)
              .flat()
              .join(", ")
          : err?.message ||
            "Registration failed. Please try again."

      toast.error(msg)

    } finally {

      setLoading(false)
    }
  }

  return (

    <div className="relative min-h-screen bg-[#080808] flex items-center justify-center px-4 py-12 overflow-hidden">

      {/* Background */}
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
            Join Cinemasangama
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
    opacity-100
    tracking-wide
    drop-shadow-[0_2px_10px_rgba(255,255,255,0.25)]
    relative
    z-20
  "
  style={{ color: "#ffffff" }}
>
  Create account
</h1>



          <p className="text-sm text-white/40">
            Start watching today
          </p>

        </div>

        {/* Card */}
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

            {/* First + Last Name */}
            <div className="grid grid-cols-2 gap-3">

              <Field
                label="First name"
                error={errors.first_name?.message}
              >

                <input
                  {...register("first_name")}
                  placeholder="First name"
                  autoComplete="given-name"
                  className={inputClass}
                />

              </Field>

              <Field
                label="Last name"
                error={errors.last_name?.message}
              >

                <input
                  {...register("last_name")}
                  placeholder="Last name"
                  autoComplete="family-name"
                  className={inputClass}
                />

              </Field>

            </div>

            {/* Username */}
            <Field
              label="Username"
              error={errors.username?.message}
            >

              <input
                {...register("username")}
                placeholder="Username"
                autoComplete="username"
                className={inputClass}
              />

            </Field>

            {/* Email */}
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

            {/* Password */}
            <Field
              label="Password"
              error={errors.password?.message}
            >

              <input
                {...register("password")}
                type="password"
                placeholder="Min 8 characters"
                autoComplete="new-password"
                className={inputClass}
              />

            </Field>

            {/* Confirm Password */}
            <Field
              label="Confirm password"
              error={errors.password2?.message}
            >

              <input
                {...register("password2")}
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                className={inputClass}
              />

            </Field>

            {/* Submit */}
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

              {loading
                ? "Creating account…"
                : "Create account"}

            </button>

          </form>

          {/* Footer */}
          <div className="mt-5">

            <p className="text-center text-sm text-white/30">

              Already have an account?{" "}

              <Link
                to="/login"
                className="text-red-400 hover:text-red-300 hover:underline transition"
              >
                Sign in
              </Link>

            </p>

          </div>

        </div>

      </div>

    </div>
  )
}


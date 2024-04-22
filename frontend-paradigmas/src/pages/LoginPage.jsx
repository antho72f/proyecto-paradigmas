import { useAuth } from "../context/authContext";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, Message, Button, Input, Label } from "../components/ui";
import { loginSchema } from "../schemas/auth";

export function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });
  const { signin, errors: loginErrors, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const onSubmit = (data) => signin(data);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/chat");
    }
  }, [isAuthenticated]);

  return (
    <div className="h-[calc(100vh-100px)] flex items-center justify-center">
      <Card>
        {loginErrors.map((error, i) => (
          <Message message={error} key={i} />
        ))}
        <h1 className="text-2xl font-bold">Login</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Label htmlFor="Correo">Email:</Label>
          <Input
            label="Write your email"
            type="email"
            name="Correo"
            placeholder="usuario@gmail.com"
            {...register("Correo", { required: true })}
          />
          <p>{errors.email?.message}</p>

          <Label htmlFor="Contrasena">Contraseña:</Label>
          <Input
            type="password"
            name="Contrasena"
            placeholder="Escriba su contraseña"
            {...register("Contrasena", { required: true, minLength: 6 })}
          />
          <p>{errors.password?.message}</p>

          <Button>Login</Button>
        </form>
        <p className="flex gap-x-2 justify-between">
        ¿No tienes una cuenta? <Link to="/register" className="text-sky-500">Registrar</Link>
        </p>
      </Card>
    </div>
  );
}

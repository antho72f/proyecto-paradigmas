import React, { useState } from "react";
import { Card, Button, Input, Label } from "../components/ui";
import { useAuth } from "../context/authContext";
import { updateUserRequest, updatePasswordRequest } from "../api/user";

export function ProfilePage() {
    const { user, logout } = useAuth();
    const [userNombre, setUserNombre] = useState(user.Nombre);
    const [userCorreo, setUserCorreo] = useState(user.Correo);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [userUpdateMessage, setUserUpdateMessage] = useState(null);
    const [passwordChangeMessage, setPasswordChangeMessage] = useState(null);
    const [userUpdateError, setUserUpdateError] = useState(null);
    const [passwordChangeError, setPasswordChangeError] = useState(null);

    const handleUserUpdate = async (e) => {
        e.preventDefault();
        if (!userNombre || !userCorreo) {
            setUserUpdateError("Por favor, complete todos los campos.");
            return;
        }
        try {
            const response = await updateUserRequest({ _id: user.ID, Nombre: userNombre, Correo: userCorreo });
            //console.log(response);
            setUserUpdateMessage("Usuario actualizado correctamente.");
            setUserUpdateError(null);
            setTimeout(() => {
                setUserUpdateMessage(null);
            }, 5000);
        } catch (error) {
            //console.error(error);
            setUserUpdateError("Error al actualizar usuario.");
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (!oldPassword || !newPassword || !confirmPassword) {
            setPasswordChangeError("Por favor, complete todos los campos.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setPasswordChangeError("Las contraseñas no coinciden.");
            return;
        }
        try {
            const response = await updatePasswordRequest({ _id: user.ID, oldPassword, newPassword });
            //console.log(response);
            setPasswordChangeMessage("Contraseña cambiada correctamente.");
            setPasswordChangeError(null);
            setTimeout(() => {
                setPasswordChangeMessage(null);
            }, 5000);
        } catch (error) {
            //console.error(error);
            setPasswordChangeError("Error al cambiar la contraseña.");
        }
    };

    return (
        <div className="h-[calc(100vh-100px)] flex items-center justify-center space-x-4">
            <Card>
                <h1 className="text-2xl font-bold">Editar Usuario</h1>

                <form onSubmit={handleUserUpdate}>
                    <Label htmlFor="Nombre">Nombre:</Label>
                    <Input
                        type="text"
                        name="Nombre"
                        placeholder="Nombre"
                        value={userNombre}
                        onChange={(e) => setUserNombre(e.target.value)}
                    />
                    <Label htmlFor="Correo">Email:</Label>
                    <Input
                        type="email"
                        name="Correo"
                        value={userCorreo}
                        placeholder="usuario@gmail.com"
                        onChange={(e) => setUserCorreo(e.target.value)}
                    />
                    <Button type="submit">Editar</Button>
                    {userUpdateError && (
                        <div className="error">
                            {userUpdateError}
                        </div>
                    )}
                    {userUpdateMessage && (
                        <div className="message">
                            {userUpdateMessage}
                        </div>
                    )}
                </form>
            </Card>
            <Card>
                <h1 className="text-2xl font-bold">Cambiar Contraseña</h1>

                <form onSubmit={handlePasswordChange}>
                    <Label htmlFor="oldPassword">Contraseña Antigua:</Label>
                    <Input
                        type="password"
                        name="oldPassword"
                        placeholder="********"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                    />
                    <Label htmlFor="newPassword">Contraseña Nueva:</Label>
                    <Input
                        type="password"
                        name="newPassword"
                        placeholder="********"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <Label htmlFor="confirmPassword">Confirmar Contraseña Nueva:</Label>
                    <Input
                        type="password"
                        name="confirmPassword"
                        placeholder="********"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <Button type="submit">Cambiar Contraseña</Button>
                    {passwordChangeError && (
                        <div className="error">
                            {passwordChangeError}
                        </div>
                    )}
                    {passwordChangeMessage && (
                        <div className="message">
                            {passwordChangeMessage}
                        </div>
                    )}
                </form>
            </Card>
        </div>
    );
}

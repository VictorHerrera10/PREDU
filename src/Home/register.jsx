import React, { useState, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Password } from "primereact/password";
import { FloatLabel } from "primereact/floatlabel";
import styled from "styled-components";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase"; 

const RegisterPage = () => {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const toast = useRef(null);

    const handleRegister = async () => {
        if (!fullName || !email || !password || !confirmPassword) {
            toast.current.show({
                severity: "warn",
                summary: "Campos incompletos",
                detail: "Por favor, completa todos los campos",
            });
            return;
        }

        if (password !== confirmPassword) {
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Las contraseñas no coinciden",
            });
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await setDoc(doc(db, "usuarios", user.uid), {
                uid: user.uid,
                nombre: fullName,
                email: user.email,
                creadoEn: new Date(),
                role: "user"
            });

            toast.current.show({
                severity: "success",
                summary: "Registro exitoso",
                detail: "Ya puedes iniciar sesión",
            });

            setFullName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
        } catch (error) {
            console.error("Error al registrar:", error);
            toast.current.show({
                severity: "error",
                summary: "Registro fallido",
                detail: error.message,
            });
        }
    };

    return (
        <AuthPageContainer>
            <LeftSide>
                <QuoteBox>
                    <Logo src="https://via.placeholder.com/150" alt="PREDU Logo" />
                    <QuoteText>¡Forma parte de PREDU hoy!</QuoteText>
                    <DescriptionText>
                        Únete a nuestra comunidad y descubre tu carrera ideal.
                    </DescriptionText>
                </QuoteBox>
            </LeftSide>

            <RightSide>
                <FormContainer>
                    <Toast ref={toast} />
                    <h2>Crea tu cuenta</h2>
                    <p style={{ marginBottom: '2.5rem' }}>
                        Regístrate para empezar tu camino vocacional con PREDU.
                    </p>

                    <div className="p-fluid">
                        <div className="p-field" style={{ marginBottom: '2rem' }}>
                            <FloatLabel>
                                <InputText
                                    id="fullName"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="p-inputtext-sm p-fluid"
                                />
                                <label htmlFor="fullName">Nombre completo</label>
                            </FloatLabel>
                        </div>

                        <div className="p-field" style={{ marginBottom: '2rem' }}>
                            <FloatLabel>
                                <InputText
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="p-inputtext-sm p-fluid"
                                />
                                <label htmlFor="email">Correo Electrónico</label>
                            </FloatLabel>
                        </div>

                        <div className="p-field" style={{ marginBottom: '2rem' }}>
                            <FloatLabel>
                                <Password
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    feedback={false}
                                    toggleMask
                                    className="p-inputtext-sm p-fluid"
                                />
                                <label htmlFor="password">Contraseña</label>
                            </FloatLabel>
                        </div>

                        <div className="p-field" style={{ marginBottom: '2rem' }}>
                            <FloatLabel>
                                <Password
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    feedback={false}
                                    toggleMask
                                    className="p-inputtext-sm p-fluid"
                                />
                                <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                            </FloatLabel>
                        </div>

                        <Button
                            label="Registrarse"
                            onClick={handleRegister}
                            className="p-button-success p-mt-4"
                        />
                    </div>
                </FormContainer>
            </RightSide>
        </AuthPageContainer>
    );
};

// Estilos
const AuthPageContainer = styled.div`
  display: flex;
  height: 96vh;
`;

const LeftSide = styled.div`
  flex: 1;
  background-image: url("https://tse4.mm.bing.net/th/id/OIP.-sg7zujtn-lFzoKKfYqvcgHaE8?rs=1&pid=ImgDetMain");
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  text-align: center;
  user-select: none;
`;

const QuoteBox = styled.div`
  background-color: rgba(0, 0, 0, 0.6);
  padding: 2rem;
  border-radius: 8px;
  max-width: 70%;
`;

const QuoteText = styled.h1`
  font-size: 2rem;
  font-weight: bold;
`;

const DescriptionText = styled.p`
  font-size: 1.2rem;
`;

const Logo = styled.img`
  max-width: 150px;
  margin-bottom: 1rem;
`;

const RightSide = styled.div`
  flex: 0.5;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FormContainer = styled.div`
  width: 100%;
  max-width: 30rem;
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

export default RegisterPage;

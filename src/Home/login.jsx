import React, { useState, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Password } from "primereact/password";
import { FloatLabel } from "primereact/floatlabel";
import styled from "styled-components";

const AuthPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const toast = useRef(null);

    const handleLogin = () => {
        toast.current.show({
            severity: "success",
            summary: "Login exitoso",
            detail: "Bienvenido a la plataforma",
        });
    };

    const handleRegister = () => {
        toast.current.show({
            severity: "info",
            summary: "Registro exitoso",
            detail: "Ahora puedes iniciar sesión",
        });
    };

    return (
        <AuthPageContainer>
            <LeftSide>
                <QuoteBox>
                    <Logo src="https://via.placeholder.com/150" alt="PREDU Logo" />
                    <QuoteText>¡Descubre tu vocación y da el primer paso hacia tu futuro!</QuoteText>
                    <DescriptionText>
                        VocaciónPredict te guía a encontrar la carrera que mejor se adapta a
                        tus habilidades y pasiones.
                    </DescriptionText>
                </QuoteBox>
            </LeftSide>

            <RightSide>
                <FormContainer>
                    <Toast ref={toast} />
                    <h2>Bienvenido a PREDU</h2>
                    <p style={{ marginBottom: '2.5rem' }}>
                        La plataforma de predicción vocacional para estudiantes de secundaria.
                    </p>

                    <div className="p-fluid">
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
                                    type="password"
                                    className="p-inputtext-sm p-fluid"
                                    toggleMask
                                />
                                <label htmlFor="password">Contraseña</label>
                            </FloatLabel>
                        </div>

                        <Button
                            label="Iniciar Sesión"
                            onClick={handleLogin}
                            className="p-button-primary p-mt-4"
                            style={{ marginBottom: '1rem' }} // Ajusta el valor según lo necesites
                        />
                        <div className="p-mt-3">
                            <Button
                                label="Registrarse"
                                onClick={handleRegister}
                                className="p-button-success p-mt-4"
                            />
                        </div>
                    </div>
                </FormContainer>
            </RightSide>
        </AuthPageContainer>
    );
};

// Styled-components
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

export default AuthPage;

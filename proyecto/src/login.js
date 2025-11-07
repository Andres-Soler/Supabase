// src/login.js
import { supabase } from './supabase.js';
import { mostrarRegistro } from './register.js';
import { mostrarUser } from './user.js'; // si quieres redirigir después

export function mostrarLogin() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <section>
      <h2>Iniciar Sesión</h2>
      <form id="login-form">
        <input type="email" name="correo" placeholder="Correo" required />
        <input type="password" name="password" placeholder="Contraseña" required />
        <button type="submit">Ingresar</button>
      </form>
      <p id="error" style="color:red;"></p>
      <button id="ir-registro">Crear cuenta</button>
    </section>
  `;

  const form = document.getElementById('login-form');
  const errorMsg = document.getElementById('error');
  const irRegistro = document.getElementById('ir-registro');

  irRegistro.addEventListener('click', () => mostrarRegistro());

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorMsg.textContent = '';

    const correo = form.correo.value.trim();
    const password = form.password.value.trim();

    if (!correo || !password) {
      errorMsg.textContent = 'Por favor completa todos los campos.';
      return;
    }

    console.log("Intentando login con:", correo, password);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: correo,
      password: password,
    });

    console.log("Respuesta Supabase:", data, error);

    if (error) {
      errorMsg.textContent = 'Error al iniciar sesión: ' + error.message;
      return;
    }

    const usuario = data.user;
    if (usuario) {
      app.innerHTML = `<p>✅ Bienvenido, ${usuario.email}</p>`;
      // mostrarUser(); // o la vista que corresponda
    }

    location.reload()
  });
}
import { mostrarRegistro } from './register.js';
import { mostrarLogin } from './login.js';
import { mostrarMVP } from './mvp.js';
import { mostrarUser } from './user.js';
import { mostrarAdmin } from './admin.js';
import { supabase } from './supabase.js';


// Funciones de navegación disponibles para ser llamadas
const routes = {
  'registro': mostrarRegistro,
  'login': mostrarLogin,
  'actividades': mostrarMVP,
  'usuarios': mostrarUser,
  'admin': mostrarAdmin // Asume que tienes una forma de verificar y mostrar el admin
};

async function CerrarSesion() {
  await supabase.auth.signOut();
  // Después de cerrar sesión, recargar el menú y mostrar el registro
  await cargarMenu();
  mostrarRegistro();
}

// 🧩 Control de navegación según el estado del usuario
export async function cargarMenu() {

  let menu = document.getElementById("menu");
  if (!menu) {
    menu = document.createElement("div");
    menu.id = "menu";
    document.body.appendChild(menu);
  }

  const { data, error } = await supabase.auth.getUser();
  if (error) console.error("Error al obtener usuario:", error);
  const user = data?.user;

  if (!user) {
    menu.innerHTML = `
      <div>
        <button data-action="registro">Registrarse</button>
        <button data-action="login">Iniciar sesión</button>
      </div>
    `;
  } else {
    menu.innerHTML = `
      <div>
        <button data-action="actividades">Actividades</button>
        <button data-action="usuarios">Usuarios</button>
        <button data-action="logout">Cerrar sesión</button>
        ${user?.email === 'admin@mail.com' ? '<button data-action="admin">Admin</button>' : ''}
      </div>
    `;
  }

  // 🌟 ASIGNAR EVENTOS A TODOS LOS BOTONES
  menu.querySelectorAll('button').forEach(button => {
    const action = button.getAttribute('data-action');
    if (action === 'logout') {
      button.addEventListener('click', () => CerrarSesion());
    } else if (routes[action]) {
      button.addEventListener('click', () => routes[action]());
    }
  });
}

// 🌀 Llamamos la función apenas cargue la página
document.addEventListener("DOMContentLoaded", cargarMenu);

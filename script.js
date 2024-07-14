document.addEventListener("DOMContentLoaded", () => {
  const entradaBusqueda = document.getElementById("entrada-busqueda");
  const contenedorResultados = document.getElementById("resultados");

  async function buscarUsuarios(terminoBusqueda) {
    try {
      const respuesta = await axios.get(
        `https://api.github.com/search/users?q=${terminoBusqueda}&per_page=3`
      );
      const usuarios = respuesta.data.items;
      mostrarResultados(usuarios);
    } catch (error) {
      console.error("Error al buscar usuarios:", error);
    }
  }

  async function obtenerDetallesUsuario(url) {
    try {
      const respuesta = await axios.get(url);
      return respuesta.data;
    } catch (error) {
      console.error("Error al obtener detalles del usuario:", error);
      return null;
    }
  }

  async function mostrarResultados(usuarios) {
    contenedorResultados.innerHTML = "";
    for (const usuario of usuarios) {
      const detallesUsuario = await obtenerDetallesUsuario(usuario.url);
      if (detallesUsuario) {
        const tarjetaUsuario = document.createElement("div");
        tarjetaUsuario.classList.add("tarjeta-usuario");
        tarjetaUsuario.innerHTML = `
                      <img src="${
                        detallesUsuario.avatar_url
                      }" alt="Foto de perfil de ${detallesUsuario.login}">
                      <h2>${detallesUsuario.name || "Nombre no disponible"}</h2>
                      <p>@${detallesUsuario.login}</p>
                      <p>${detallesUsuario.company || "Sin empresa"}</p>
                      <p>Repositorios: ${detallesUsuario.public_repos}</p>
                  `;
        tarjetaUsuario.addEventListener("click", () => {
          window.open(detallesUsuario.html_url, "_blank");
        });
        contenedorResultados.appendChild(tarjetaUsuario);
      }
    }
  }

  entradaBusqueda.addEventListener(
    "input",
    debounce(() => {
      const terminoBusqueda = entradaBusqueda.value.trim();
      if (terminoBusqueda) {
        buscarUsuarios(terminoBusqueda);
      } else {
        contenedorResultados.innerHTML = "";
      }
    }, 500)
  );

  function debounce(func, delay) {
    let idTimeout;
    return function (...args) {
      clearTimeout(idTimeout);
      idTimeout = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  }
});

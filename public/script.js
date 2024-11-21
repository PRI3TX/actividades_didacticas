// Función para inicializar elementos arrastrables
function makeDraggable(id) {
    const draggable = document.getElementById(id);
    draggable.setAttribute("draggable", true);
    draggable.addEventListener("dragstart", function (event) {
        event.dataTransfer.setData("text", id);
    });
}

// Función para permitir que un elemento sea zona de arrastre
function allowDrop(id) {
    const dropzone = document.getElementById(id);
    dropzone.addEventListener("dragover", function (event) {
        event.preventDefault();
    });
}

// Función para manejar el evento de soltar
function handleDrop(id) {
    const dropzone = document.getElementById(id);
    dropzone.addEventListener("drop", function (event) {
        event.preventDefault();
        const draggedId = event.dataTransfer.getData("text");
        const draggedElement = document.getElementById(draggedId);
        dropzone.innerHTML = ""; // Limpia el contenido previo
        dropzone.appendChild(draggedElement); // Añade el elemento arrastrado
    });
}

// Función para obtener las respuestas del usuario
function obtenerRespuestas() {
    return {
        pregunta1: document.getElementById("response1").value.trim(),
        pregunta2: document.getElementById("response2").value.trim(),
    };
}

// Función para obtener las imágenes arrastradas
function obtenerImagenes() {
    return {
        dropzone1: document.querySelector("#dropzone1 img")?.getAttribute("src") || null,
        dropzone2: document.querySelector("#dropzone2 img")?.getAttribute("src") || null,
    };
}

// Función para calcular la calificación
function calcularCalificacion(respuestas, imagenes) {
    let calificacion = 0;

    // Respuestas correctas
    if (respuestas.pregunta1 === "4,002602 u") calificacion += 25;
    if (respuestas.pregunta2 === "6,941 u") calificacion += 25;

    // Imágenes correctas
    if (imagenes.dropzone1 && imagenes.dropzone1.includes("mouse.jpg")) calificacion += 25;
    if (imagenes.dropzone2 && imagenes.dropzone2.includes("pc.jpg")) calificacion += 25;

    return calificacion;
}

// Función para enviar los datos al servidor
function enviarDatos(nombreUsuario, respuestas, imagenes, calificacion) {
    if (!respuestas.pregunta1 || !respuestas.pregunta2 || !imagenes.dropzone1 || !imagenes.dropzone2) {
        alert("Por favor, responde todas las preguntas y completa las zonas de arrastre.");
        return;
    }

    fetch("/guardar-respuestas", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nombre: nombreUsuario,
            respuestas,
            imagenes,
            calificacion,
        }),
    })
    .then(response => {
        if (!response.ok) throw new Error("Error al guardar datos en el servidor.");
        return response.json();
    })
    .then(data => alert(data.mensaje || "Datos guardados correctamente."))
    .catch(err => alert("No se pudo guardar: " + err.message));
}

// Función principal para inicializar y verificar respuestas
document.getElementById("enviarBtn").addEventListener("click", function () {
    const nombreUsuario = new URLSearchParams(window.location.search).get("nombre") || "Usuario Anónimo";
    const respuestas = obtenerRespuestas();
    const imagenes = obtenerImagenes();
    const calificacion = calcularCalificacion(respuestas, imagenes);

    // Mostrar la calificación en la interfaz
    document.getElementById("calificacion").textContent = `Tu calificación es ${calificacion}`;
    
    // Enviar los datos al servidor
    enviarDatos(nombreUsuario, respuestas, imagenes, calificacion);
});

// Inicializar el arrastre y suelta
makeDraggable("draggable1");
makeDraggable("draggable2");
allowDrop("dropzone1");
allowDrop("dropzone2");
handleDrop("dropzone1");
handleDrop("dropzone2");





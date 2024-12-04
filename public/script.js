document.addEventListener("DOMContentLoaded", function () {
    function makeDraggable(id) {
        const draggable = document.getElementById(id);
        draggable.setAttribute("draggable", true);
        draggable.addEventListener("dragstart", function (event) {
            event.dataTransfer.setData("text", id);
        });
    }

    function allowDrop(id) {
        const dropzone = document.getElementById(id);
        dropzone.addEventListener("dragover", function (event) {
            event.preventDefault();
        });
    }

    function handleDrop(id) {
        const dropzone = document.getElementById(id);
        dropzone.addEventListener("drop", function (event) {
            event.preventDefault();
            const draggedId = event.dataTransfer.getData("text");
            const draggedElement = document.getElementById(draggedId);
            dropzone.innerHTML = ""; 
            dropzone.appendChild(draggedElement); 
        });
    }

    function obtenerRespuestas() {
        return {
            pregunta1: document.getElementById("response1").value.trim(),
            pregunta2: document.getElementById("response2").value.trim(),
        };
    }

    function obtenerImagenes() {
        return {
            dropzone1: document.querySelector("#dropzone1 img")?.getAttribute("src") || null,
            dropzone2: document.querySelector("#dropzone2 img")?.getAttribute("src") || null,
        };
    }

    function calcularCalificacion(respuestas, imagenes) {
        let calificacion = 0;

        if (respuestas.pregunta1 === "4,002602 u") calificacion += 25;
        if (respuestas.pregunta2 === "6,941 u") calificacion += 25;

        if (imagenes.dropzone1 && imagenes.dropzone1.includes("mouse.jpg")) calificacion += 25;
        if (imagenes.dropzone2 && imagenes.dropzone2.includes("pc.jpg")) calificacion += 25;

        return calificacion;
    }

    function enviarDatos(nombreUsuario, respuestas, imagenes, calificacion) {
        fetch("/guardar-respuestas", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                nombre: nombreUsuario,
                respuestas,
                imagenes,
                calificacion,
            }),
        })
            .then(response => response.json())
            .then(data => alert(data.mensaje || "Datos guardados correctamente."))
            .catch(err => alert("No se pudo guardar: " + err.message));
    }

    const enviarBtn = document.getElementById("enviarBtn");
    enviarBtn.addEventListener("click", function () {
        const nombreUsuario = new URLSearchParams(window.location.search).get("nombre") || "Usuario Anónimo";
        const respuestas = obtenerRespuestas();
        const imagenes = obtenerImagenes();
        const calificacion = calcularCalificacion(respuestas, imagenes);

        document.getElementById("calificacion").textContent = `Tu calificación es ${calificacion}`;
        enviarDatos(nombreUsuario, respuestas, imagenes, calificacion);
    });

    makeDraggable("draggable1");
    makeDraggable("draggable2");
    allowDrop("dropzone1");
    allowDrop("dropzone2");
    handleDrop("dropzone1");
    handleDrop("dropzone2");
});




